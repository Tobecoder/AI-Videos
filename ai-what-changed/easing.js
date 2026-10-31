/**
 * Motion Design Math, Custom Easing & 3D Projection Utilities
 * Anti-Slideshow Physics & Precision Curves
 */
(function () {
  // Polyfill roundRect for all browsers/webviews
  if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      let radius = typeof r === 'number' ? r : (Array.isArray(r) ? r[0] : 0);
      radius = Math.max(0, Math.min(radius, Math.min(w, h) / 2));
      this.moveTo(x + radius, y);
      this.arcTo(x + w, y, x + w, y + h, radius);
      this.arcTo(x + w, y + h, x, y + h, radius);
      this.arcTo(x, y + h, x, y, radius);
      this.arcTo(x, y, x + w, y, radius);
      this.closePath();
      return this;
    };
  }

  const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const invLerp = (a, b, v) => (a === b ? 0 : clamp((v - a) / (b - a), 0, 1));
  const remap = (v, inMin, inMax, outMin, outMax, easeFn) => {
    let t = invLerp(inMin, inMax, v);
    if (easeFn) t = easeFn(t);
    return lerp(outMin, outMax, t);
  };

  // Newton-Raphson Cubic Bezier solver (CSS cubic-bezier equivalent)
  function cubicBezier(p1x, p1y, p2x, p2y) {
    const cx = 3.0 * p1x;
    const bx = 3.0 * (p2x - p1x) - cx;
    const ax = 1.0 - cx - bx;

    const cy = 3.0 * p1y;
    const by = 3.0 * (p2y - p1y) - cy;
    const ay = 1.0 - cy - by;

    function sampleCurveX(t) { return ((ax * t + bx) * t + cx) * t; }
    function sampleCurveY(t) { return ((ay * t + by) * t + cy) * t; }
    function sampleCurveDerivativeX(t) { return (3.0 * ax * t + 2.0 * bx) * t + cx; }

    function solveCurveX(x) {
      let t2 = x;
      for (let i = 0; i < 8; i++) {
        const x2 = sampleCurveX(t2) - x;
        if (Math.abs(x2) < 1e-6) return t2;
        const d2 = sampleCurveDerivativeX(t2);
        if (Math.abs(d2) < 1e-6) break;
        t2 = t2 - x2 / d2;
      }
      let t0 = 0.0, t1 = 1.0;
      t2 = x;
      while (t0 < t1) {
        const x2 = sampleCurveX(t2);
        if (Math.abs(x2 - x) < 1e-6) return t2;
        if (x > x2) t0 = t2; else t1 = t2;
        t2 = (t1 - t0) * 0.5 + t0;
      }
      return t2;
    }

    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      return sampleCurveY(solveCurveX(x));
    };
  }

  // Signature Motion-Design Curves
  const Easing = {
    clamp,
    lerp,
    invLerp,
    remap,
    cubicBezier,

    // Apple / Buck signature snappy deceleration
    snappyOut: cubicBezier(0.16, 1, 0.3, 1),
    // Dramatic anticipation & slam
    cinematicInOut: cubicBezier(0.76, 0, 0.24, 1),
    whipInOut: cubicBezier(0.85, 0, 0.15, 1),
    // Exponential rush into singularity
    rushIn: cubicBezier(0.7, 0, 0.84, 0),

    expoOut: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    expoIn: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * (t - 1))),
    quintOut: (t) => 1 - Math.pow(1 - t, 5),
    cubicOut: (t) => 1 - Math.pow(1 - t, 3),
    cubicIn: (t) => t * t * t,
    smoothstep: (t) => {
      const x = clamp(t, 0, 1);
      return x * x * (3 - 2 * x);
    },

    // Damped analytical spring (0 -> 1 with realistic overshoot)
    spring: (t, stiffness = 14, damping = 0.62) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      const decay = Math.exp(-stiffness * damping * t);
      const omega = stiffness * Math.sqrt(Math.max(0.01, 1 - damping * damping));
      return 1 - decay * (Math.cos(omega * t) + (damping * stiffness / omega) * Math.sin(omega * t));
    },

    // Evaluate point & tangent on a 2D/3D cubic Bezier curve
    evalCubic2D: (p0, p1, p2, p3, t) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;
      return {
        x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
      };
    },

    // Draw partial cubic Bezier from t=0 to t=progress using De Casteljau subdivision
    splitCubicBezier: (p0, p1, p2, p3, t) => {
      const q0 = { x: lerp(p0.x, p1.x, t), y: lerp(p0.y, p1.y, t) };
      const q1 = { x: lerp(p1.x, p2.x, t), y: lerp(p1.y, p2.y, t) };
      const q2 = { x: lerp(p2.x, p3.x, t), y: lerp(p2.y, p3.y, t) };
      const r0 = { x: lerp(q0.x, q1.x, t), y: lerp(q0.y, q1.y, t) };
      const r1 = { x: lerp(q1.x, q2.x, t), y: lerp(q1.y, q2.y, t) };
      const s0 = { x: lerp(r0.x, r1.x, t), y: lerp(r0.y, r1.y, t) };
      return [p0, q0, r0, s0];
    }
  };

  window.MGEasing = Easing;
})();
