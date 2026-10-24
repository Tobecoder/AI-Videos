import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

/** Dark trading-terminal backdrop: drifting grid, colored glow, vignette, grain. */
export const Backdrop: React.FC<{ glow?: string; glowY?: number }> = ({
  glow = "rgba(255,59,59,0.16)",
  glowY = 35,
}) => {
  const f = useCurrentFrame();
  const drift = (f * 0.6) % 90;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 45% at 50% ${glowY}%, ${glow}, rgba(0,0,0,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `${-drift}px ${drift * 0.3}px`,
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 45%, black, transparent 85%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
