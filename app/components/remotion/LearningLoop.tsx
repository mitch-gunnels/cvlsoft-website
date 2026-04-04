"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

/* ── Shared constants ── */
const COLORS = {
  bg: "#0a1020",
  node: "#0d1322",
  stroke: "#22d3ee",
  strokeDim: "#475569",
  text: "#94a3b8",
  textDim: "#64748b",
  cyan: "#22d3ee",
  cyanLight: "#67e8f9",
  amber: "#f59e0b",
  green: "#22c55e",
};

/* ── Cubic bezier math ── */
function evalBezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

type Pt = { x: number; y: number };

/* ── Reusable animated node ── */
function Node({
  cx, cy, r, label, color = COLORS.stroke, appearFrame, fontSize = 6, bold = false,
}: {
  cx: number; cy: number; r: number; label: string; color?: string; appearFrame: number; fontSize?: number; bold?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 15, stiffness: 120 } });
  const scale = interpolate(progress, [0, 1], [0, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`} opacity={opacity}>
      <circle r={r} fill={COLORS.node} stroke={color} strokeOpacity={0.4} strokeWidth={1.5} />
      <text textAnchor="middle" dominantBaseline="central" fill={color} fontSize={fontSize} fontWeight={bold ? 700 : 600} letterSpacing="0.04em">
        {label}
      </text>
    </g>
  );
}

/* ── Animated box node ── */
function BoxNode({
  x, y, w, h, label, color = COLORS.stroke, appearFrame, fontSize = 6.5, glow = false,
}: {
  x: number; y: number; w: number; h: number; label: string; color?: string; appearFrame: number; fontSize?: number; glow?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 18, stiffness: 100 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [8, 0]);

  return (
    <g opacity={opacity} transform={`translate(0, ${translateY})`}>
      {glow && (
        <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={8} fill={color} opacity={0.08} filter="url(#boxGlow)" />
      )}
      <rect x={x} y={y} width={w} height={h} rx={5} fill="#0a1628" stroke={color} strokeOpacity={glow ? 0.5 : 0.2} strokeWidth={glow ? 1.5 : 1} />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" fill={glow ? color : COLORS.text} fontSize={fontSize} fontWeight={glow ? 700 : 600} letterSpacing="0.04em">
        {label}
      </text>
    </g>
  );
}

/* ── Animated line ── */
function Line({
  x1, y1, x2, y2, color = COLORS.stroke, appearFrame, dashed = false, dim = false,
}: {
  x1: number; y1: number; x2: number; y2: number; color?: string; appearFrame: number; dashed?: boolean; dim?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 20, stiffness: 80 } });
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const dashOffset = interpolate(progress, [0, 1], [length, 0]);

  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeOpacity={dim ? 0.12 : 0.25} strokeWidth={dim ? 1 : 1.5}
      strokeDasharray={dashed ? "4 3" : `${length}`}
      strokeDashoffset={dashed ? 0 : dashOffset}
      opacity={interpolate(progress, [0, 0.1], [0, 1], { extrapolateRight: "clamp" })}
    />
  );
}

/* ── Animated curved path ── */
function CurvedPath({ d, color, appearFrame }: { d: string; color: string; appearFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 20, stiffness: 60 } });
  const opacity = interpolate(progress, [0, 1], [0, 0.2]);

  return <path d={d} stroke={color} strokeOpacity={opacity} strokeWidth={1} strokeDasharray="3 3" fill="none" />;
}

/* ── Dot that follows a straight-line path (array of waypoints) ── */
function LinearDot({
  path, color, startFrame, duration, r = 3,
}: {
  path: Pt[]; color: string; startFrame: number; duration: number; r?: number;
}) {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > startFrame + duration) return null;

  const t = (frame - startFrame) / duration;

  // Compute total path length and find position along it
  const lengths: number[] = [];
  let totalLen = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const dx = path[i + 1].x - path[i].x;
    const dy = path[i + 1].y - path[i].y;
    const segLen = Math.sqrt(dx * dx + dy * dy);
    lengths.push(segLen);
    totalLen += segLen;
  }

  const targetDist = t * totalLen;
  let accumulated = 0;
  let cx = path[0].x;
  let cy = path[0].y;
  for (let i = 0; i < lengths.length; i++) {
    if (accumulated + lengths[i] >= targetDist) {
      const segT = (targetDist - accumulated) / lengths[i];
      cx = path[i].x + (path[i + 1].x - path[i].x) * segT;
      cy = path[i].y + (path[i + 1].y - path[i].y) * segT;
      break;
    }
    accumulated += lengths[i];
  }

  const opacity = interpolate(t, [0, 0.08, 0.92, 1], [0, 0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <circle cx={cx} cy={cy} r={r + 4} fill={color} opacity={opacity * 0.15} />
      <circle cx={cx} cy={cy} r={r} fill={color} opacity={opacity} />
    </>
  );
}

/* ── Dot that follows a cubic bezier curve ── */
function BezierDot({
  p0, cp1, cp2, p3, color, startFrame, duration, r = 2.5,
}: {
  p0: Pt; cp1: Pt; cp2: Pt; p3: Pt; color: string; startFrame: number; duration: number; r?: number;
}) {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > startFrame + duration) return null;

  const t = (frame - startFrame) / duration;
  const cx = evalBezier(t, p0.x, cp1.x, cp2.x, p3.x);
  const cy = evalBezier(t, p0.y, cp1.y, cp2.y, p3.y);
  const opacity = interpolate(t, [0, 0.08, 0.92, 1], [0, 0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <circle cx={cx} cy={cy} r={r + 4} fill={color} opacity={opacity * 0.15} />
      <circle cx={cx} cy={cy} r={r} fill={color} opacity={opacity} />
    </>
  );
}

/* ── Floating label ── */
function Label({ x, y, text, color, appearFrame, fontSize = 6 }: { x: number; y: number; text: string; color: string; appearFrame: number; fontSize?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 20, stiffness: 80 } });
  const opacity = interpolate(progress, [0, 1], [0, 0.6]);
  const translateY = interpolate(progress, [0, 1], [6, 0]);

  return (
    <text x={x} y={y} textAnchor="middle" fill={color} fontSize={fontSize} fontWeight={600} letterSpacing="0.05em" opacity={opacity} transform={`translate(0, ${translateY})`}>
      {text}
    </text>
  );
}

/* ── Pulse ring ── */
function PulseRing({ cx, cy, color, startFrame }: { cx: number; cy: number; color: string; startFrame: number }) {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;
  const t = ((frame - startFrame) % 60) / 60;
  const r = 14 + t * 18;
  const opacity = interpolate(t, [0, 1], [0.25, 0]);
  return <circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={1} fill="none" opacity={opacity} />;
}

/* ══════════════════════════════════════════
   MAIN COMPOSITION
   ══════════════════════════════════════════ */

export default function LearningLoop() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Positions ── */
  const START = { x: 40, y: 150 };
  const EXEC = { x: 112, y: 150, w: 55, h: 20 };
  const DECIDE = { x: 185, y: 150, r: 14 };
  const OUTCOME = { x: 268, y: 210, w: 72, h: 20 };
  const OPTIMIZED = { x: 268, y: 72, w: 80, h: 22 };
  const MEMORY = { x: 273, y: 138, w: 62, h: 22 };

  /* ── Exact line endpoints ── */
  const decideExitDown = { x: DECIDE.x + 10, y: DECIDE.y + 10 };
  const decideExitUp = { x: DECIDE.x + 10, y: DECIDE.y - 10 };
  const outcomeLeft = { x: OUTCOME.x, y: OUTCOME.y + OUTCOME.h / 2 };
  const optimizedLeft = { x: OPTIMIZED.x, y: OPTIMIZED.y + OPTIMIZED.h / 2 };
  const outcomeTopCenter = { x: OUTCOME.x + OUTCOME.w / 2, y: OUTCOME.y };
  const memoryBottom = { x: MEMORY.x + MEMORY.w / 2, y: MEMORY.y + MEMORY.h };
  const memoryLeft = { x: MEMORY.x, y: MEMORY.y + MEMORY.h / 2 };
  const decideRight = { x: DECIDE.x + DECIDE.r, y: DECIDE.y };

  /* ── Straight learn path (OUTCOME → MEMORY) ── */
  const learnStart = outcomeTopCenter;
  const learnEnd = memoryBottom;

  /* ── Straight recall path (MEMORY → DECIDE) ── */
  const recallStart = memoryLeft;
  const recallEnd = { x: decideRight.x, y: decideRight.y };

  /* ── Optimized learn path (OPTIMIZED → MEMORY) ── */
  const optimizedTopCenter = { x: OPTIMIZED.x + OPTIMIZED.w / 2, y: OPTIMIZED.y };
  const memoryTop = { x: MEMORY.x + MEMORY.w / 2, y: MEMORY.y };

  /* ── Phase timing (in frames at 30fps) ── */
  const P1 = 0;
  const P2 = 2 * fps;
  const P3 = 4 * fps;
  const P4 = 6.5 * fps;
  const P5 = 8.5 * fps;
  const P6 = 10 * fps;   // learnings from optimized → memory

  /* ── Dot paths matching exact line endpoints ── */
  const startExit = { x: START.x + 9, y: START.y };
  const execEnter = { x: EXEC.x - EXEC.w / 2, y: EXEC.y };
  const execExit = { x: EXEC.x + EXEC.w / 2, y: EXEC.y };
  const decideEnter = { x: DECIDE.x - DECIDE.r, y: DECIDE.y };

  const run1Path: Pt[] = [startExit, execEnter, execExit, decideEnter, decideExitDown, outcomeLeft];
  const run2Path: Pt[] = [startExit, execEnter, execExit, decideEnter];
  const improvedPath: Pt[] = [decideExitUp, optimizedLeft];

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <svg viewBox="0 0 400 300" style={{ width: "100%", height: "100%" }}>
        <defs>
          <filter id="boxGlow">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* ── PHASE 1: Workflow structure appears ── */}
        <Node cx={START.x} cy={START.y} r={9} label="RUN" color={COLORS.cyan} appearFrame={P1} fontSize={5.5} />
        <Line x1={startExit.x} y1={startExit.y} x2={execEnter.x} y2={execEnter.y} appearFrame={P1 + 8} />
        <BoxNode x={EXEC.x - EXEC.w / 2} y={EXEC.y - EXEC.h / 2} w={EXEC.w} h={EXEC.h} label="EXECUTE" appearFrame={P1 + 12} />
        <Line x1={execExit.x} y1={execExit.y} x2={decideEnter.x} y2={decideEnter.y} appearFrame={P1 + 20} />
        <Node cx={DECIDE.x} cy={DECIDE.y} r={DECIDE.r} label="?" color={COLORS.cyan} appearFrame={P1 + 25} fontSize={10} bold />

        {/* ── PHASE 2: Run 1 — old path (dim) ── */}
        <Sequence from={P2} layout="none">
          <Line x1={decideExitDown.x} y1={decideExitDown.y} x2={outcomeLeft.x} y2={outcomeLeft.y} color={COLORS.strokeDim} appearFrame={0} dashed dim />
          <BoxNode x={OUTCOME.x} y={OUTCOME.y} w={OUTCOME.w} h={OUTCOME.h} label="OUTCOME" color={COLORS.strokeDim} appearFrame={15} />
          <LinearDot path={run1Path} color={COLORS.strokeDim} startFrame={0} duration={Math.round(1.5 * fps)} r={2.5} />
        </Sequence>

        {/* ── PHASE 3: Learning extracted → Memory ── */}
        <Sequence from={P3} layout="none">
          <Line x1={learnStart.x} y1={learnStart.y} x2={learnEnd.x} y2={learnEnd.y} color={COLORS.amber} appearFrame={0} dashed />
          <BoxNode x={MEMORY.x} y={MEMORY.y} w={MEMORY.w} h={MEMORY.h} label="MEMORY" color={COLORS.amber} appearFrame={10} fontSize={7} glow />
          <LinearDot path={[learnStart, learnEnd]} color={COLORS.amber} startFrame={8} duration={Math.round(1.5 * fps)} r={2.5} />
          <LinearDot path={[learnStart, learnEnd]} color={COLORS.amber} startFrame={25} duration={Math.round(1.5 * fps)} r={2} />
          <Label x={learnStart.x + 18} y={(learnStart.y + learnEnd.y) / 2} text="LEARN" color={COLORS.amber} appearFrame={20} />
          <PulseRing cx={MEMORY.x + MEMORY.w / 2} cy={MEMORY.y + MEMORY.h / 2} color={COLORS.amber} startFrame={Math.round(1.5 * fps)} />
        </Sequence>

        {/* ── PHASE 4: Run 2 — recall from memory ── */}
        <Sequence from={P4} layout="none">
          <Line x1={recallStart.x} y1={recallStart.y} x2={recallEnd.x} y2={recallEnd.y} color={COLORS.cyanLight} appearFrame={0} dashed />
          <LinearDot path={[recallStart, recallEnd]} color={COLORS.cyanLight} startFrame={5} duration={Math.round(1.2 * fps)} r={2.5} />
          <LinearDot path={[recallStart, recallEnd]} color={COLORS.cyanLight} startFrame={20} duration={Math.round(1.2 * fps)} r={2} />
          <LinearDot path={run2Path} color={COLORS.cyan} startFrame={0} duration={Math.round(1.2 * fps)} r={3} />
          <Label x={(recallStart.x + recallEnd.x) / 2} y={recallStart.y - 12} text="RECALL" color={COLORS.cyanLight} appearFrame={10} />
          <PulseRing cx={DECIDE.x} cy={DECIDE.y} color={COLORS.cyanLight} startFrame={Math.round(1 * fps)} />
        </Sequence>

        {/* ── PHASE 5: Improved path ── */}
        <Sequence from={P5} layout="none">
          <Line x1={decideExitUp.x} y1={decideExitUp.y} x2={optimizedLeft.x} y2={optimizedLeft.y} color={COLORS.cyan} appearFrame={0} />
          <BoxNode x={OPTIMIZED.x} y={OPTIMIZED.y} w={OPTIMIZED.w} h={OPTIMIZED.h} label="OPTIMIZED" color={COLORS.cyan} appearFrame={8} glow />
          <LinearDot path={improvedPath} color={COLORS.cyan} startFrame={5} duration={Math.round(1 * fps)} r={3} />
          <PulseRing cx={OPTIMIZED.x + OPTIMIZED.w / 2} cy={OPTIMIZED.y + OPTIMIZED.h / 2} color={COLORS.green} startFrame={Math.round(1.2 * fps)} />
        </Sequence>

        {/* ── PHASE 6: Learnings from optimized → memory (completes the loop) ── */}
        <Sequence from={P6} layout="none">
          <Line x1={optimizedTopCenter.x} y1={optimizedTopCenter.y} x2={memoryTop.x} y2={memoryTop.y} color={COLORS.green} appearFrame={0} dashed />
          <LinearDot path={[optimizedTopCenter, memoryTop]} color={COLORS.green} startFrame={5} duration={Math.round(1 * fps)} r={2.5} />
          <LinearDot path={[optimizedTopCenter, memoryTop]} color={COLORS.green} startFrame={18} duration={Math.round(1 * fps)} r={2} />
          <Label x={optimizedTopCenter.x + 18} y={(optimizedTopCenter.y + memoryTop.y) / 2} text="LEARN" color={COLORS.green} appearFrame={8} />
          <PulseRing cx={MEMORY.x + MEMORY.w / 2} cy={MEMORY.y + MEMORY.h / 2} color={COLORS.green} startFrame={Math.round(1 * fps)} />
        </Sequence>

        {/* ── Continuous subtle glow on decision node ── */}
        {frame > P1 + 30 && (
          <circle
            cx={DECIDE.x}
            cy={DECIDE.y}
            r={20 + Math.sin(frame * 0.05) * 5}
            fill={COLORS.cyan}
            opacity={0.03 + Math.sin(frame * 0.03) * 0.01}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
}
