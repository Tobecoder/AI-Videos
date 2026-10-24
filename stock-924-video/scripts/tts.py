"""Generate voice-over clips with edge-tts and write src/data/timeline.json.

Usage:  python scripts/tts.py          (only regenerates changed lines)
        python scripts/tts.py --force  (regenerate everything)
"""
import asyncio
import hashlib
import json
import sys
from pathlib import Path

import edge_tts
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parent.parent
NARRATION = ROOT / "src" / "data" / "narration.json"
TIMELINE = ROOT / "src" / "data" / "timeline.json"
VO_DIR = ROOT / "public" / "vo"

FORCE = "--force" in sys.argv


def key_for(cfg, text):
    raw = f"{cfg['voice']}|{cfg['rate']}|{cfg['pitch']}|{text}"
    return hashlib.md5(raw.encode("utf-8")).hexdigest()[:10]


async def synth(sem, cfg, line, old):
    say = line.get("say", line["text"])
    k = key_for(cfg, say)
    out = VO_DIR / f"{line['id']}.mp3"
    if not FORCE and out.exists() and old.get(line["id"]) == k:
        return line["id"], k, False
    async with sem:
        for attempt in range(4):
            try:
                comm = edge_tts.Communicate(say, cfg["voice"], rate=cfg["rate"], pitch=cfg["pitch"])
                await comm.save(str(out))
                break
            except Exception as e:  # network hiccups
                print(f"  retry {line['id']} ({e})")
                await asyncio.sleep(1.5 * (attempt + 1))
        else:
            raise RuntimeError(f"TTS failed for {line['id']}")
    print(f"  synthesized {line['id']}: {say}")
    return line["id"], k, True


async def main():
    cfg = json.loads(NARRATION.read_text(encoding="utf-8"))
    VO_DIR.mkdir(parents=True, exist_ok=True)
    old = {}
    if TIMELINE.exists():
        prev = json.loads(TIMELINE.read_text(encoding="utf-8"))
        old = {l["id"]: l.get("hash") for s in prev["scenes"] for l in s["lines"]}

    sem = asyncio.Semaphore(6)
    lines = [l for s in cfg["scenes"] for l in s["lines"]]
    results = await asyncio.gather(*(synth(sem, cfg, l, old) for l in lines))
    hashes = {i: k for i, k, _ in results}

    gap = cfg.get("gapSeconds", 0.15)
    out_scenes = []
    for s in cfg["scenes"]:
        t = 0.0
        out_lines = []
        for l in s["lines"]:
            dur = MP3(str(VO_DIR / f"{l['id']}.mp3")).info.length
            out_lines.append({
                "id": l["id"],
                "text": l["text"],
                "start": round(t, 3),
                "duration": round(dur, 3),
                "hash": hashes[l["id"]],
            })
            t += dur + gap
        out_scenes.append({"id": s["id"], "duration": round(t, 3), "lines": out_lines})

    TIMELINE.write_text(json.dumps({"scenes": out_scenes}, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum(s["duration"] for s in out_scenes)
    print(f"timeline written: {len(lines)} lines, {total:.1f}s of narration")


if __name__ == "__main__":
    asyncio.run(main())
