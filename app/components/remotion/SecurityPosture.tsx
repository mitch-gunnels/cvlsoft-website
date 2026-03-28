"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const C = {
  node: "#0d1322",
  cyan: "#22d3ee",
  green: "#22c55e",
  red: "#f43f5e",
  amber: "#f59e0b",
  text: "#94a3b8",
  textDim: "#64748b",
  border: "#1e293b",
  bg: "#0a1628",
};

/* ── Shield path (centered at origin) ── */
const SHIELD_PATH = "M0,-65 L50,-40 L50,20 C50,65 0,90 0,90 C0,90 -50,65 -50,20 L-50,-40 Z";

/* ── Animated shield ── */
function Shield({ cx, cy, appearFrame }: { cx: number; cy: number; appearFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 12, stiffness: 80, mass: 1.5 } });
  const scale = interpolate(progress, [0, 1], [0.3, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // Pulse glow after appeared
  const glowPhase = Math.max(0, frame - appearFrame - 30);
  const glowOp = glowPhase > 0 ? 0.04 + Math.sin(glowPhase * 0.03) * 0.02 : 0;
  const pulseOp = glowPhase > 0 ? interpolate((glowPhase % 80) / 80, [0, 1], [0.15, 0]) : 0;
  const pulseR = glowPhase > 0 ? 70 + ((glowPhase % 80) / 80) * 30 : 70;

  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`} opacity={opacity}>
      {/* Glow */}
      <circle r={65} fill={C.cyan} opacity={Math.max(0, glowOp)} />
      {/* Pulse ring */}
      {glowPhase > 0 && (
        <circle r={pulseR} stroke={C.cyan} strokeWidth={1} fill="none" opacity={pulseOp} />
      )}
      {/* Shield fill */}
      <path d={SHIELD_PATH} fill={C.node} stroke={C.cyan} strokeOpacity={0.4} strokeWidth={2} />
      {/* Inner pulse */}
      <path d={SHIELD_PATH} fill="none" stroke={C.cyan} strokeOpacity={glowPhase > 0 ? 0.06 + Math.sin(glowPhase * 0.04) * 0.04 : 0} strokeWidth={1} />
    </g>
  );
}

/* ── Animated checkmark inside shield ── */
function Checkmark({ cx, cy, appearFrame }: { cx: number; cy: number; appearFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 15, stiffness: 120 } });
  const pathLength = 60;
  const dashOffset = interpolate(progress, [0, 1], [pathLength, 0]);

  return (
    <path
      d={`M${cx - 18},${cy} L${cx - 5},${cy + 13} L${cx + 20},${cy - 12}`}
      stroke={C.cyan} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"
      fill="none" strokeDasharray={pathLength} strokeDashoffset={dashOffset}
      opacity={interpolate(progress, [0, 0.1], [0, 0.7], { extrapolateRight: "clamp" })}
    />
  );
}

/* ── Feature card (matches the image style) ── */
function FeatureCard({
  x, y, w, h, title, desc, accentColor, appearFrame,
}: {
  x: number; y: number; w: number; h: number;
  title: string; desc: string; accentColor: string; appearFrame: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 15, stiffness: 100 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [12, 0]);

  return (
    <g opacity={opacity} transform={`translate(0, ${translateY})`}>
      {/* Card background */}
      <rect x={x} y={y} width={w} height={h} rx={6} fill={C.bg} stroke={C.border} strokeWidth={1} />
      {/* Left accent bar */}
      <rect x={x} y={y + 6} width={3} height={h - 12} rx={1.5} fill={accentColor} opacity={0.7} />
      {/* Title */}
      <text x={x + 14} y={y + 18} fill={accentColor} fontSize={9} fontWeight={700} letterSpacing="0.03em">
        {title}
      </text>
      {/* Description */}
      <text x={x + 14} y={y + 34} fill={C.textDim} fontSize={6.5}>
        {desc}
      </text>
    </g>
  );
}

/* ── Connection line from shield to card ── */
function ConnectLine({ x1, y1, x2, y2, appearFrame }: {
  x1: number; y1: number; x2: number; y2: number; appearFrame: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 20, stiffness: 80 } });
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={C.cyan} strokeOpacity={0.15} strokeWidth={1}
      strokeDasharray={len} strokeDashoffset={interpolate(progress, [0, 1], [len, 0])}
      opacity={interpolate(progress, [0, 0.1], [0, 1], { extrapolateRight: "clamp" })}
    />
  );
}

/* ── Scan bar on a card ── */
function ScanBar({ x, y, w, h, color, startFrame }: {
  x: number; y: number; w: number; h: number; color: string; startFrame: number;
}) {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;
  const t = ((frame - startFrame) % 90) / 90;
  const barX = x + t * w;
  return (
    <rect x={barX} y={y + 4} width={3} height={h - 8} rx={1.5} fill={color} opacity={interpolate(t, [0, 0.5, 1], [0, 0.2, 0])} />
  );
}

/* ── Spring-in label ── */
function FadeLabel({ x, y, text, color, appearFrame, fontSize = 6 }: {
  x: number; y: number; text: string; color: string; appearFrame: number; fontSize?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, delay: appearFrame, config: { damping: 18, stiffness: 80 } });
  return (
    <text x={x} y={y} textAnchor="middle" fill={color} fontSize={fontSize} fontWeight={700}
      letterSpacing="0.06em" opacity={interpolate(p, [0, 1], [0, 0.7])}
      transform={`translate(0, ${interpolate(p, [0, 1], [4, 0])})`}
    >{text}</text>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPOSITION — 10s at 30fps = 300 frames
   ══════════════════════════════════════════ */

export default function SecurityPosture() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Timing ── */
  const TITLE_IN = 0;
  const SHIELD_IN = Math.round(0.5 * fps);
  const CHECK_IN = Math.round(2 * fps);
  const CARDS_IN = Math.round(3 * fps);

  /* ── Layout ── */
  const shieldCx = 105;
  const shieldCy = 155;

  const cardW = 195;
  const cardH = 48;
  const cardX = 195;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <svg viewBox="0 0 400 300" style={{ width: "100%", height: "100%" }}>

        {/* ══ TITLE ══ */}
        <FadeLabel x={200} y={22} text="Security First Posture." color={C.text} appearFrame={TITLE_IN} fontSize={14} />
        <FadeLabel x={200} y={42} text="No action fires without explicit approval." color={C.textDim} appearFrame={TITLE_IN + 8} fontSize={9} />

        {/* ══ SHIELD ══ */}
        <Shield cx={shieldCx} cy={shieldCy} appearFrame={SHIELD_IN} />
        <Checkmark cx={shieldCx} cy={shieldCy + 5} appearFrame={CHECK_IN} />

        {/* ══ FEATURE CARDS ══ */}
        <Sequence from={CARDS_IN} layout="none">
          {/* Connection lines */}
          <ConnectLine x1={shieldCx + 50} y1={shieldCy - 30} x2={cardX} y2={88} appearFrame={0} />
          <ConnectLine x1={shieldCx + 50} y1={shieldCy} x2={cardX} y2={148} appearFrame={8} />
          <ConnectLine x1={shieldCx + 50} y1={shieldCy + 30} x2={cardX} y2={210} appearFrame={16} />

          {/* Card 1: Policy Engine (green) */}
          <FeatureCard
            x={cardX} y={68} w={cardW} h={cardH}
            title="Policy Engine"
            desc="Deterministic allow/deny — no probabilistic guardrails"
            accentColor={C.green}
            appearFrame={5}
          />
          <ScanBar x={cardX} y={68} w={cardW} h={cardH} color={C.green} startFrame={30} />

          {/* Card 2: Kill Switches (red) */}
          <FeatureCard
            x={cardX} y={128} w={cardW} h={cardH}
            title="Kill Switches"
            desc="Global, tenant, and per-execution halt — instantly"
            accentColor={C.red}
            appearFrame={14}
          />
          <ScanBar x={cardX} y={128} w={cardW} h={cardH} color={C.red} startFrame={45} />

          {/* Card 3: Approval Gates + Audit Trail (amber) */}
          <FeatureCard
            x={cardX} y={188} w={cardW} h={cardH}
            title="Approval Gates + Audit Trail"
            desc="Human-in-the-loop with compliance-grade logging"
            accentColor={C.amber}
            appearFrame={23}
          />
          <ScanBar x={cardX} y={188} w={cardW} h={cardH} color={C.amber} startFrame={60} />
        </Sequence>

      </svg>
    </AbsoluteFill>
  );
}
