import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { Subtitles } from "./components/Subtitles";
import { Ticker } from "./components/Ticker";
import { HookScene } from "./scenes/HookScene";
import { C, clamp, FONT_CN } from "./lib/theme";
import { cues, FPS, getScene, sceneFrames } from "./lib/timeline";

type Track = "bull" | "tense" | "sad";
type MusicSeg = { track: Track; from: number; to: number };

const Placeholder: React.FC<{ id: string }> = ({ id }) => (
  <AbsoluteFill style={{ background: C.bg, color: C.dim, fontFamily: FONT_CN, fontSize: 60, alignItems: "center", justifyContent: "center" }}>
    {id}（制作中）
  </AbsoluteFill>
);

const SCENES: Record<string, { component: React.FC; music: () => MusicSeg[] }> = {
  hook: {
    component: HookScene,
    music: () => {
      const c = cues("hook");
      return [
        { track: "bull", from: 0, to: c.at("h2") },
        { track: "tense", from: c.at("h2") + 30, to: c.total },
      ];
    },
  },
};

const defaultMusic: Record<string, Track> = {
  night924: "tense",
  rally: "bull",
  holiday: "bull",
  top: "tense",
  mistakes: "tense",
  compare: "sad",
  lessons: "sad",
  outro: "sad",
};

const MUSIC_VOL: Record<Track, number> = { bull: 0.2, tense: 0.22, sad: 0.26 };

const MusicSegment: React.FC<{ seg: MusicSeg }> = ({ seg }) => {
  const len = seg.to - seg.from;
  const fade = Math.min(8, Math.floor(len / 3));
  return (
    <Sequence from={seg.from} durationInFrames={len} layout="none" name={`music ${seg.track}`}>
      <Audio
        src={staticFile(`audio/bgm_${seg.track}.wav`)}
        loop
        volume={(f) =>
          MUSIC_VOL[seg.track] *
          interpolate(f, [0, fade, len - fade, len], [0, 1, 1, 0], clamp)
        }
      />
    </Sequence>
  );
};

export const MainVideo: React.FC<{ sceneIds: string[] }> = ({ sceneIds }) => {
  let offset = 0;
  const layout = sceneIds.map((id) => {
    const from = offset;
    const dur = sceneFrames(id);
    offset += dur;
    return { id, from, dur };
  });

  // merge adjacent music segments with the same track so loops don't restart
  const music: MusicSeg[] = [];
  for (const { id, from, dur } of layout) {
    const segs = SCENES[id]?.music() ?? [{ track: defaultMusic[id] ?? "tense", from: 0, to: dur }];
    for (const s of segs) {
      const abs = { ...s, from: s.from + from, to: s.to + from };
      const last = music[music.length - 1];
      if (last && last.track === abs.track && Math.abs(last.to - abs.from) <= 2) last.to = abs.to;
      else music.push(abs);
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {layout.map(({ id, from, dur }) => {
        const Comp = SCENES[id]?.component;
        return (
          <Sequence key={id} from={from} durationInFrames={dur} name={`scene ${id}`}>
            {Comp ? <Comp /> : <Placeholder id={id} />}
            {getScene(id).lines.map((l) => (
              <Sequence key={l.id} from={Math.round(l.start * FPS)} layout="none" name={`vo ${l.id}`}>
                <Audio src={staticFile(`vo/${l.id}.mp3`)} volume={1} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {music.map((m, i) => (
        <MusicSegment key={i} seg={m} />
      ))}
      <Ticker />
      <Subtitles sceneIds={sceneIds} />
    </AbsoluteFill>
  );
};

export const totalFrames = (ids: string[]) => ids.reduce((a, id) => a + sceneFrames(id), 0);
