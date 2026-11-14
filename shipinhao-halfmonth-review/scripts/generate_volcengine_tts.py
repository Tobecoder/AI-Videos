"""
火山引擎 / 豆包语音合成接入脚本

支持两种凭证模式（均通过本地 .env 或系统环境变量读取，切勿将 Key 写入代码或版本库）：
1) 新版 V3 语音控制台 API Key（推荐，与 story-studio 同协议）：
   DOUBAO_TTS_API_KEY=...
   DOUBAO_SPEAKER_ID=...
   DOUBAO_RESOURCE_ID=seed-tts-2.0   # 普通 2.0 音色用 seed-tts-2.0；复刻 2.0 用 seed-icl-2.0
2) 旧版语音技术控制台 AppID + Access Token（V1 HTTP 接口）：
   VOLC_APPID=...
   VOLC_ACCESS_TOKEN=...
   VOLC_CLUSTER=volcano_tts
   VOLC_VOICE_TYPE=...

用法：
  python scripts/generate_volcengine_tts.py --dry-run
  python scripts/generate_volcengine_tts.py --confirm
"""

import argparse
import asyncio
import base64
import contextlib
import gzip
import json
import os
import struct
import subprocess
import tempfile
import urllib.request
import uuid
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT_PATH = ROOT / "src" / "data" / "scriptLines.json"
AUDIO_OUT = ROOT / "public" / "audio" / "narration.mp3"
TIMELINE_OUT = ROOT / "src" / "data" / "timeline.json"

FPS = 30
SAMPLE_RATE = 24000
SENTENCE_GAP_SEC = 0.22
SCENE_GAP_SEC = 0.45

V3_URL = "wss://openspeech.bytedance.com/api/v3/tts/bidirection"
CONNECTION_EVENTS = {1, 2, 50, 51, 52}


def load_local_env() -> None:
    env_file = ROOT / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def get_wav_duration(wav_path: Path) -> float:
    with wave.open(str(wav_path), "rb") as wf:
        return wf.getnframes() / float(wf.getframerate())


def make_silence_wav(duration: float, out_path: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            f"anullsrc=r={SAMPLE_RATE}:cl=mono",
            "-t",
            f"{duration:.3f}",
            "-c:a",
            "pcm_s16le",
            str(out_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def mp3_to_wav(mp3_path: Path, wav_path: Path) -> float:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(mp3_path),
            "-ar",
            str(SAMPLE_RATE),
            "-ac",
            "1",
            "-c:a",
            "pcm_s16le",
            "-af",
            "silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_silence=0.06:start_threshold=-45dB,areverse",
            str(wav_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return get_wav_duration(wav_path)


def synth_v1_http(text: str, out_mp3: Path, appid: str, token: str, cluster: str, voice_type: str, speed_ratio: float) -> None:
    payload = {
        "app": {"appid": appid, "token": token, "cluster": cluster},
        "user": {"uid": "shipinhao-remotion"},
        "audio": {
            "voice_type": voice_type,
            "encoding": "mp3",
            "speed_ratio": speed_ratio,
            "rate": SAMPLE_RATE,
        },
        "request": {
            "reqid": str(uuid.uuid4()),
            "text": text,
            "operation": "query",
        },
    }
    req = urllib.request.Request(
        "https://openspeech.bytedance.com/api/v1/tts",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer;{token}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    if data.get("code") != 3000 or not data.get("data"):
        raise RuntimeError(f"Volcengine V1 TTS error: code={data.get('code')}, message={data.get('message')}")
    out_mp3.write_bytes(base64.b64decode(data["data"]))


def _pack_v3(event: int, body: dict, session_id: str = "") -> bytes:
    payload = json.dumps(body, ensure_ascii=False).encode("utf-8")
    frame = b"\x11\x14\x10\x00" + struct.pack(">I", event)
    if event not in CONNECTION_EVENTS:
        sid = session_id.encode("utf-8")
        frame += struct.pack(">I", len(sid)) + sid
    return frame + struct.pack(">I", len(payload)) + payload


def _unpack_v3(frame: bytes) -> tuple[int, int, str, bytes]:
    offset = (frame[0] & 15) * 4
    kind, flags, comp = frame[1] >> 4, frame[1] & 15, frame[2] & 15

    def take(n: int) -> bytes:
        nonlocal offset
        val = frame[offset : offset + n]
        offset += n
        return val

    def u32() -> int:
        return struct.unpack(">I", take(4))[0]

    def blob() -> bytes:
        return take(u32())

    error = u32() if kind == 15 else None
    if kind != 15 and (flags & 3) in {1, 3}:
        take(4)
    event, sid = 0, ""
    if flags & 4:
        event = u32()
        if event in {50, 51, 52}:
            blob()
        elif event not in CONNECTION_EVENTS:
            sid = blob().decode("utf-8")
    payload = blob()
    if comp == 1:
        payload = gzip.decompress(payload)
    if error is not None:
        raise RuntimeError(f"TTS V3 error code {error}")
    if event in {51, 151, 153}:
        raise RuntimeError(f"TTS V3 rejected (event={event})")
    return kind, event, sid, payload


async def synth_v3_ws(text: str, out_mp3: Path, api_key: str, speaker: str, resource_id: str, speech_rate: int = 0) -> None:
    from websockets.asyncio.client import connect

    headers = {
        "X-Api-Key": api_key,
        "X-Api-Resource-Id": resource_id,
        "X-Api-Connect-Id": str(uuid.uuid4()),
    }

    def body(event: int, txt: str | None = None) -> dict:
        req_params: dict = {
            "speaker": speaker,
            "audio_params": {
                "format": "mp3",
                "sample_rate": SAMPLE_RATE,
                "speech_rate": speech_rate,
                "loudness_rate": 0,
                "enable_subtitle": False,
            },
        }
        if txt is not None:
            req_params["text"] = txt
        return {
            "user": {"uid": "shipinhao-remotion"},
            "namespace": "BidirectionalTTS",
            "event": event,
            "req_params": req_params,
        }

    async with connect(V3_URL, additional_headers=headers, open_timeout=30, close_timeout=5, max_size=10 * 1024 * 1024) as ws:
        session_id = str(uuid.uuid4())
        await ws.send(_pack_v3(1, {}))
        _unpack_v3(await asyncio.wait_for(ws.recv(), timeout=30))
        await ws.send(_pack_v3(100, body(100), session_id))
        _unpack_v3(await asyncio.wait_for(ws.recv(), timeout=30))
        await ws.send(_pack_v3(200, body(200, text), session_id))
        await ws.send(_pack_v3(102, {}, session_id))

        chunks = bytearray()
        while True:
            kind, event, _, payload = _unpack_v3(await asyncio.wait_for(ws.recv(), timeout=120))
            if kind == 11 and event in {0, 352}:
                chunks.extend(payload)
            elif kind == 9 and event == 152:
                break
        with contextlib.suppress(Exception):
            await ws.send(_pack_v3(2, {}))
        if not chunks:
            raise RuntimeError("Empty audio returned from V3 TTS")
        out_mp3.write_bytes(bytes(chunks))


def build_audio_and_timeline(mode: str, synth_fn) -> None:
    lines = json.loads(SCRIPT_PATH.read_text(encoding="utf-8"))
    AUDIO_OUT.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)
        concat_files: list[Path] = []
        gap_sentence = tmp_dir / "gap_sentence.wav"
        gap_scene = tmp_dir / "gap_scene.wav"
        lead_in = tmp_dir / "lead_in.wav"
        tail = tmp_dir / "tail.wav"

        make_silence_wav(SENTENCE_GAP_SEC, gap_sentence)
        make_silence_wav(SCENE_GAP_SEC, gap_scene)
        make_silence_wav(0.30, lead_in)
        make_silence_wav(1.20, tail)

        dur_gap_sentence = get_wav_duration(gap_sentence)
        dur_gap_scene = get_wav_duration(gap_scene)
        current_sec = get_wav_duration(lead_in)
        concat_files.append(lead_in)

        segments = []
        all_sub_cues: dict[str, int] = {}
        for idx, item in enumerate(lines):
            raw_mp3 = tmp_dir / f"{item['id']}.mp3"
            norm_wav = tmp_dir / f"{item['id']}.wav"
            synth_fn(item["ttsText"], raw_mp3)
            dur = mp3_to_wav(raw_mp3, norm_wav)

            start_sec = current_sec
            end_sec = start_sec + dur
            txt = item["ttsText"]
            for sc in item.get("subCues", []):
                pos = txt.find(sc["match"])
                ratio = (pos / max(1, len(txt))) if pos != -1 else 0.35
                all_sub_cues[sc["cue"]] = round((start_sec + ratio * dur) * FPS)

            segments.append(
                {
                    "id": item["id"],
                    "sceneId": item["sceneId"],
                    "stepIndex": item["stepIndex"],
                    "stepLabel": item["stepLabel"],
                    "displayText": item["displayText"],
                    "cue": item["cue"],
                    "startSec": round(start_sec, 3),
                    "endSec": round(end_sec, 3),
                    "startFrame": round(start_sec * FPS),
                    "endFrame": round(end_sec * FPS),
                }
            )
            concat_files.append(norm_wav)
            current_sec = end_sec
            print(f"[{idx+1}/{len(lines)}] {item['id']} ({dur:.2f}s)")

            if idx < len(lines) - 1:
                if lines[idx + 1]["sceneId"] != item["sceneId"]:
                    concat_files.append(gap_scene)
                    current_sec += dur_gap_scene
                else:
                    concat_files.append(gap_sentence)
                    current_sec += dur_gap_sentence

        concat_files.append(tail)
        current_sec += get_wav_duration(tail)

        concat_list = tmp_dir / "concat.txt"
        concat_list.write_text("\n".join(f"file '{p.as_posix()}'" for p in concat_files), encoding="utf-8")
        subprocess.run(
            ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list), "-c:a", "libmp3lame", "-b:a", "192k", str(AUDIO_OUT)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        scene_order = []
        by_scene: dict[str, list[dict]] = {}
        for seg in segments:
            sid = seg["sceneId"]
            if sid not in by_scene:
                by_scene[sid] = []
                scene_order.append(sid)
            by_scene[sid].append(seg)

        total_frames = round(current_sec * FPS)
        scenes = []
        for i, sid in enumerate(scene_order):
            segs = by_scene[sid]
            s_start = 0 if i == 0 else max(0, segs[0]["startFrame"] - 6)
            if i < len(scene_order) - 1:
                next_segs = by_scene[scene_order[i + 1]]
                s_end = max(segs[-1]["endFrame"] + 4, next_segs[0]["startFrame"] - 6)
            else:
                s_end = total_frames
            scenes.append(
                {
                    "sceneId": sid,
                    "stepIndex": segs[0]["stepIndex"],
                    "stepLabel": segs[0]["stepLabel"],
                    "startFrame": s_start,
                    "endFrame": s_end,
                    "durationInFrames": s_end - s_start,
                }
            )

        TIMELINE_OUT.write_text(
            json.dumps(
                {
                    "fps": FPS,
                    "width": 1920,
                    "height": 1080,
                    "totalDurationSec": round(current_sec, 3),
                    "totalFrames": total_frames,
                    "audioMode": mode,
                    "scenes": scenes,
                    "segments": segments,
                    "subCues": all_sub_cues,
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
        print(f"完成: {AUDIO_OUT} ({current_sec:.2f}s / {total_frames} frames)")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--confirm", action="store_true")
    args = parser.parse_args()

    load_local_env()
    v3_key = os.environ.get("DOUBAO_TTS_API_KEY", "").strip()
    v3_speaker = os.environ.get("DOUBAO_SPEAKER_ID", "").strip()
    v3_res = os.environ.get("DOUBAO_RESOURCE_ID", "seed-tts-2.0").strip()

    v1_appid = os.environ.get("VOLC_APPID", "").strip()
    v1_token = os.environ.get("VOLC_ACCESS_TOKEN", "").strip()
    v1_cluster = os.environ.get("VOLC_CLUSTER", "volcano_tts").strip()
    v1_voice = os.environ.get("VOLC_VOICE_TYPE", "").strip()

    if v3_key and v3_speaker:
        mode = f"volcengine-v3:{v3_speaker}"
        if args.dry_run or not args.confirm:
            print(f"[就绪-V3] speaker={v3_speaker}, resource_id={v3_res}。加 --confirm 开始合成。")
            return
        build_audio_and_timeline(mode, lambda txt, out: asyncio.run(synth_v3_ws(txt, out, v3_key, v3_speaker, v3_res)))
    elif v1_appid and v1_token and v1_voice:
        mode = f"volcengine-v1:{v1_voice}"
        if args.dry_run or not args.confirm:
            print(f"[就绪-V1] appid=已配置, voice_type={v1_voice}。加 --confirm 开始合成。")
            return
        build_audio_and_timeline(mode, lambda txt, out: synth_v1_http(txt, out, v1_appid, v1_token, v1_cluster, v1_voice, 1.05))
    else:
        print(
            "[未配置火山凭证] 请在项目根目录 .env 中填写以下任一组：\n"
            "  方式A (新版 V3 语音控制台): DOUBAO_TTS_API_KEY, DOUBAO_SPEAKER_ID, DOUBAO_RESOURCE_ID=seed-tts-2.0\n"
            "  方式B (旧版 V1 AppID): VOLC_APPID, VOLC_ACCESS_TOKEN, VOLC_VOICE_TYPE"
        )


if __name__ == "__main__":
    main()
