import timeline from "../data/timeline.json";

export const FPS = 30;
export const SCENE_TAIL = 0.35; // seconds of breathing room after each scene's last line

export type Line = { id: string; text: string; start: number; duration: number };
export type Scene = { id: string; duration: number; lines: Line[] };

export const scenes = timeline.scenes as Scene[];

export const getScene = (id: string): Scene => {
  const s = scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
};

export const sceneFrames = (id: string) =>
  Math.ceil((getScene(id).duration + SCENE_TAIL) * FPS);

/** Scene-relative frame cues for each line: cue('h2') -> start frame, end(...) -> end frame */
export const cues = (sceneId: string) => {
  const s = getScene(sceneId);
  const find = (lineId: string) => {
    const l = s.lines.find((x) => x.id === lineId);
    if (!l) throw new Error(`Unknown line ${lineId}`);
    return l;
  };
  return {
    at: (lineId: string, offsetSec = 0) =>
      Math.round((find(lineId).start + offsetSec) * FPS),
    end: (lineId: string) => {
      const l = find(lineId);
      return Math.round((l.start + l.duration) * FPS);
    },
    total: sceneFrames(sceneId),
  };
};
