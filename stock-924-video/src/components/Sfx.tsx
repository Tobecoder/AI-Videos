import { Audio, Sequence, staticFile } from "remotion";

/** One-shot sound effect at a scene-relative frame. */
export const Sfx: React.FC<{ src: string; at: number; volume?: number }> = ({
  src,
  at,
  volume = 0.7,
}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none" name={`sfx ${src}`}>
    <Audio src={staticFile(`audio/sfx_${src}.wav`)} volume={volume} />
  </Sequence>
);
