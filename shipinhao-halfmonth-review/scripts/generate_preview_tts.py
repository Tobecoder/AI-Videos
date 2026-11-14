import asyncio
import json
import subprocess
import tempfile
import wave
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
SCRIPT_PATH = ROOT / "src" / "data" / "scriptLines.json"
AUDIO_OUT = ROOT / "public" / "audio" / "narration.mp3"
TIMELINE_OUT = ROOT / "src" / "data" / "timeline.json"

FPS = 30
VOICE = "zh-CN-YunxiNeural"
RATE = "+6%"
SENTENCE_GAP_SEC = 0.22
SCENE_GAP_SEC = 0.45
SAMPLE_RATE = 24000


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


async def synthesize_one_with_words(
    text: str, mp3_path: Path, wav_path: Path
) -> tuple[float, list[dict]]:
    comm = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    words: list[dict] = []
    with mp3_path.open("wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append(
                    {
                        "text": chunk["text"],
                        "offsetSec": chunk["offset"] / 10_000_000.0,
                        "durationSec": chunk["duration"] / 10_000_000.0,
                    }
                )

    # Keep start untouched so WordBoundary offsets match audio 1:1; only trim long trailing silence.
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
            "areverse,silenceremove=start_periods=1:start_silence=0.06:start_threshold=-45dB,areverse",
            str(wav_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return get_wav_duration(wav_path), words


def resolve_sub_cues(
    tts_text: str,
    words: list[dict],
    sub_cues: list[dict],
    seg_start_sec: float,
    seg_dur_sec: float,
) -> dict[str, int]:
    resolved: dict[str, int] = {}
    if not sub_cues:
        return resolved

    # Build cumulative text buffer from WordBoundary events for exact matching
    for sc in sub_cues:
        needle = sc["match"]
        cue_name = sc["cue"]
        matched_offset = None

        # 1. Direct match inside any single WordBoundary token
        for w in words:
            if needle in w["text"]:
                matched_offset = w["offsetSec"]
                break

        # 2. Sliding window across adjacent WordBoundary tokens (e.g. "15.8万", "5块04", "完播率")
        if matched_offset is None and words:
            joined = ""
            char_to_offset: list[float] = []
            for w in words:
                for _ in w["text"]:
                    char_to_offset.append(w["offsetSec"])
                joined += w["text"]
            pos = joined.find(needle)
            if pos != -1 and pos < len(char_to_offset):
                matched_offset = char_to_offset[pos]

        # 3. Clean character-ratio fallback
        if matched_offset is None:
            pos = tts_text.find(needle)
            ratio = (pos / max(1, len(tts_text))) if pos != -1 else 0.35
            matched_offset = ratio * seg_dur_sec

        resolved[cue_name] = round((seg_start_sec + matched_offset) * FPS)
    return resolved


async def synthesize_all() -> None:
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

        timeline_segments = []
        all_sub_cues: dict[str, int] = {}

        for idx, item in enumerate(lines):
            raw_mp3 = tmp_dir / f"{item['id']}_raw.mp3"
            norm_wav = tmp_dir / f"{item['id']}.wav"

            dur, words = await synthesize_one_with_words(item["ttsText"], raw_mp3, norm_wav)
            start_sec = current_sec
            end_sec = start_sec + dur

            seg_cues = resolve_sub_cues(
                item["ttsText"],
                words,
                item.get("subCues", []),
                start_sec,
                dur,
            )
            all_sub_cues.update(seg_cues)

            timeline_segments.append(
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
            print(f"[{idx+1}/{len(lines)}] {item['id']} ({dur:.2f}s) cues={seg_cues}")

            if idx < len(lines) - 1:
                next_scene = lines[idx + 1]["sceneId"]
                if next_scene != item["sceneId"]:
                    concat_files.append(gap_scene)
                    current_sec += dur_gap_scene
                else:
                    concat_files.append(gap_sentence)
                    current_sec += dur_gap_sentence

        concat_files.append(tail)
        current_sec += get_wav_duration(tail)

        concat_list = tmp_dir / "concat.txt"
        concat_list.write_text(
            "\n".join(f"file '{p.as_posix()}'" for p in concat_files),
            encoding="utf-8",
        )
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(concat_list),
                "-c:a",
                "libmp3lame",
                "-b:a",
                "192k",
                str(AUDIO_OUT),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        scene_order = []
        by_scene: dict[str, list[dict]] = {}
        for seg in timeline_segments:
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

        timeline = {
            "fps": FPS,
            "width": 1920,
            "height": 1080,
            "totalDurationSec": round(current_sec, 3),
            "totalFrames": total_frames,
            "audioMode": "edge-tts-wordboundary",
            "scenes": scenes,
            "segments": timeline_segments,
            "subCues": all_sub_cues,
        }
        TIMELINE_OUT.write_text(
            json.dumps(timeline, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"Generated {AUDIO_OUT} ({current_sec:.2f}s / {total_frames} frames)")
        print(f"Resolved {len(all_sub_cues)} subCues accurately.")


if __name__ == "__main__":
    asyncio.run(synthesize_all())
