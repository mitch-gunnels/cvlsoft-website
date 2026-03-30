"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const COLORS = {
  node: "#0d1322",
  cyan: "#22d3ee",
  cyanLight: "#67e8f9",
  dim: "#475569",
  dimBorder: "#1e293b",
  text: "#94a3b8",
  textDim: "#64748b",
  red: "#f43f5e",
};

/* ── Agent sprawl data ── */
const AGENTS = [
  "JIRA AGENT", "SLACK AGENT", "BILLING AGENT", "ONBOARDING AGENT",
  "EMAIL AGENT", "CRM AGENT", "DEPLOY AGENT", "SUPPORT AGENT",
  "INVOICE AGENT", "HR AGENT", "COMPLIANCE AGENT", "SALES AGENT",
  "ANALYTICS AGENT", "SECURITY AGENT", "SCHEDULING AGENT", "REPORTING AGENT",
  "DATA AGENT", "ROUTING AGENT", "APPROVAL AGENT", "MONITORING AGENT",
];

/* ── Pseudo-random but deterministic scattered positions for agents ── */
const AGENT_POSITIONS: { x: number; y: number; rot: number }[] = [
  { x: 5, y: 52, rot: -3 }, { x: 88, y: 38, rot: 2 }, { x: 175, y: 55, rot: -1 },
  { x: 270, y: 42, rot: 3 }, { x: 340, y: 58, rot: -2 }, { x: 42, y: 108, rot: 2 },
  { x: 130, y: 95, rot: -4 }, { x: 220, y: 112, rot: 1 }, { x: 310, y: 98, rot: -3 },
  { x: 15, y: 162, rot: 3 }, { x: 100, y: 148, rot: -2 }, { x: 195, y: 168, rot: 4 },
  { x: 285, y: 155, rot: -1 }, { x: 345, y: 170, rot: 2 }, { x: 55, y: 218, rot: -3 },
  { x: 155, y: 205, rot: 1 }, { x: 248, y: 222, rot: -2 }, { x: 335, y: 212, rot: 3 },
  { x: 78, y: 258, rot: -1 }, { x: 210, y: 262, rot: 2 },
];

/* ── Connection lines between random agent pairs (chaos) ── */
const CONNECTIONS: [number, number][] = [
  [0, 3], [1, 5], [2, 7], [3, 8], [4, 9], [5, 10], [6, 11], [7, 12],
  [8, 13], [9, 14], [10, 15], [11, 16], [12, 17], [13, 18], [14, 19],
  [0, 7], [1, 12], [2, 9], [3, 15], [4, 18], [5, 16], [6, 19], [8, 1],
  [0, 14], [2, 17], [6, 13], [9, 16], [11, 19], [4, 15], [3, 10],
];

/* ── Animated agent box ── */
function AgentBox({ x, y, rot, label, index, collapseFrame }: {
  x: number; y: number; rot: number; label: string; index: number; collapseFrame: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearDelay = 5 + index * 2;
  const appear = spring({ frame, fps, delay: appearDelay, config: { damping: 15, stiffness: 150 } });

  const collapseDelay = collapseFrame + index * 0.5;
  const collapse = spring({ frame, fps, delay: collapseDelay, config: { damping: 8, stiffness: 200 } });

  // Shake instability — grows as more agents appear, peaks right before explosion
  const shakeStart = 40; // start shaking after first agents settle
  const shakeIntensity = frame < shakeStart ? 0 : interpolate(
    frame, [shakeStart, collapseFrame - 10, collapseFrame],
    [0, 1, 1.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Each agent gets a unique phase so they don't shake in sync
  const phase = index * 1.7;
  const shakeX = shakeIntensity * Math.sin(frame * 0.8 + phase) * 2.5;
  const shakeY = shakeIntensity * Math.cos(frame * 1.1 + phase * 0.7) * 1.5;
  const shakeRot = shakeIntensity * Math.sin(frame * 0.6 + phase * 1.3) * 2;

  // Explode outward from center — each agent flies away from (200, 150)
  const cx = x + 34; // center of box
  const cy = y + 8;
  const dx = cx - 200;
  const dy = cy - 150;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const explodeX = x + shakeX + (dx / dist) * 400 * collapse;
  const explodeY = y + shakeY + (dy / dist) * 400 * collapse;
  const explodeRot = rot + shakeRot + collapse * (index % 2 === 0 ? 120 : -120);
  const scale = interpolate(collapse, [0, 0.3], [1, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(appear, [0, 1], [0, 1]) * interpolate(collapse, [0, 0.25], [1, 0], { extrapolateRight: "clamp" });

  // Border flickers red more intensely as instability grows
  const borderOpacity = 0.2 + shakeIntensity * 0.5;

  const w = 68;
  const h = 16;

  return (
    <g opacity={opacity} transform={`translate(${explodeX}, ${explodeY}) rotate(${explodeRot}, ${w / 2}, ${h / 2}) scale(${scale})`}>
      <rect width={w} height={h} rx={3} fill="#0a1628" stroke={COLORS.red} strokeOpacity={borderOpacity} strokeWidth={0.8 + shakeIntensity * 0.4} />
      <text x={w / 2} y={h / 2} textAnchor="middle" dominantBaseline="central" fill={COLORS.textDim} fontSize={5} fontWeight={600} letterSpacing="0.03em">
        {label}
      </text>
    </g>
  );
}

/* ── Chaos connection line ── */
function ChaosLine({ from, to, index, collapseFrame }: {
  from: { x: number; y: number }; to: { x: number; y: number }; index: number; collapseFrame: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearDelay = 20 + index * 1.5;
  const appear = spring({ frame, fps, delay: appearDelay, config: { damping: 20, stiffness: 80 } });
  const collapse = spring({ frame, fps, delay: collapseFrame + index * 0.3, config: { damping: 8, stiffness: 200 } });

  // Lines also jitter as instability grows
  const shakeStart = 40;
  const shakeIntensity = frame < shakeStart ? 0 : interpolate(
    frame, [shakeStart, collapseFrame - 10, collapseFrame],
    [0, 0.6, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fadeOut = interpolate(collapse, [0, 0.2], [1, 0], { extrapolateRight: "clamp" });
  const baseOpacity = interpolate(appear, [0, 1], [0, 0.25]);
  // Lines flicker more red as instability grows, but always respect fade-out
  const lineOpacity = (baseOpacity + shakeIntensity * 0.15) * fadeOut;

  return (
    <line
      x1={from.x + 34} y1={from.y + 8}
      x2={to.x + 34} y2={to.y + 8}
      stroke={COLORS.red} strokeOpacity={lineOpacity} strokeWidth={1 + shakeIntensity * 0.5}
    />
  );
}

/* ── The cognitive core that appears after collapse ── */
function CoreNode({ appearFrame }: { appearFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 12, stiffness: 40, mass: 2 } });
  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // Glow pulse after fully appeared
  const glowPhase = Math.max(0, frame - appearFrame - 20);
  const glowR = 55 + Math.sin(glowPhase * 0.04) * 8;
  const glowOpacity = interpolate(progress, [0, 1], [0, 0.06]) + Math.sin(glowPhase * 0.03) * 0.02;

  return (
    <g opacity={opacity} transform={`translate(200, 150) scale(${scale})`}>
      {/* Outer glow */}
      <circle r={glowR} fill={COLORS.cyan} opacity={Math.max(0, glowOpacity)} />
      {/* Core box */}
      <rect x={-55} y={-48} width={110} height={96} rx={14} fill={COLORS.node} stroke={COLORS.cyan} strokeOpacity={0.5} strokeWidth={2} />
      {/* Labels */}
      <text y={-26} textAnchor="middle" fill={COLORS.cyanLight} fontSize={8} fontWeight={600} letterSpacing="0.14em" opacity={0.7}>AIOS</text>
      <text y={-6} textAnchor="middle" fill={COLORS.cyan} fontSize={11} fontWeight={700} letterSpacing="0.1em">COGNITIVE</text>
      <text y={12} textAnchor="middle" fill={COLORS.cyan} fontSize={11} fontWeight={700} letterSpacing="0.1em">CORE</text>
      {/* Subtitle */}
      <text y={34} textAnchor="middle" fill={COLORS.textDim} fontSize={6} letterSpacing="0.06em">ONE CORE. ANY TASK.</text>
      {/* Pulse ring */}
      {glowPhase > 0 && (() => {
        const t = (glowPhase % 70) / 70;
        return <circle r={45 + t * 30} stroke={COLORS.cyan} strokeWidth={1} fill="none" opacity={interpolate(t, [0, 1], [0.2, 0])} />;
      })()}
    </g>
  );
}

/* ── Output capability that appears after core ── */
function Capability({ x, y, label, appearFrame }: { x: number; y: number; label: string; appearFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 15, stiffness: 100 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-10, 0]);

  return (
    <g opacity={opacity} transform={`translate(${translateX}, 0)`}>
      <rect x={x} y={y} width={90} height={18} rx={4} fill="#0a1628" stroke={COLORS.cyan} strokeOpacity={0.25} strokeWidth={1} />
      <text x={x + 45} y={y + 9} textAnchor="middle" dominantBaseline="central" fill={COLORS.cyan} fontSize={6} fontWeight={600} letterSpacing="0.05em">
        {label}
      </text>
    </g>
  );
}

/* ── Connector line from core to capability ── */
function CoreLine({ x1, y1, x2, y2, appearFrame }: { x1: number; y1: number; x2: number; y2: number; appearFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 20, stiffness: 80 } });
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const dashOffset = interpolate(progress, [0, 1], [length, 0]);

  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={COLORS.cyan} strokeOpacity={0.35} strokeWidth={1.5}
      strokeDasharray={length} strokeDashoffset={dashOffset}
    />
  );
}

/* ── Traveling dot along a straight line ── */
function FlowDot({ x1, y1, x2, y2, color, startFrame, dur, r = 2 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; startFrame: number; dur: number; r?: number;
}) {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;
  const t = ((frame - startFrame) % dur) / dur;
  const cx = x1 + (x2 - x1) * t;
  const cy = y1 + (y2 - y1) * t;
  const opacity = interpolate(t, [0, 0.05, 0.95, 1], [0, 0.7, 0.7, 0]);

  return (
    <>
      <circle cx={cx} cy={cy} r={r + 3} fill={color} opacity={opacity * 0.15} />
      <circle cx={cx} cy={cy} r={r} fill={color} opacity={opacity} />
    </>
  );
}

/* ── "X agents" counter ── */
function AgentCounter({ collapseFrame }: { collapseFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Count up during sprawl phase
  const countUpEnd = collapseFrame - 10;
  const count = frame < 10 ? 0 : Math.min(
    Math.floor(interpolate(frame, [10, countUpEnd], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
    200
  );

  // Fade out during collapse
  const collapse = spring({ frame, fps, delay: collapseFrame - 5, config: { damping: 15, stiffness: 80 } });
  const opacity = interpolate(collapse, [0, 1], [0.5, 0]);

  // Instability warning flicker near collapse
  const warningStart = collapseFrame - 40;
  const showWarning = frame >= warningStart && frame < collapseFrame;
  const warningFlicker = showWarning ? Math.sin(frame * 1.2) > 0.1 : false;

  if (frame < 10 || opacity <= 0) return null;

  return (
    <>
      <text x={200} y={24} textAnchor="middle" fill={COLORS.red} fontSize={12} fontWeight={700} letterSpacing="0.06em" opacity={opacity}>
        {count}+ AGENTS AND GROWING...
      </text>
      {warningFlicker && (
        <g>
          <rect x={180} y={140} width={80} height={20} rx={4} fill="#0a1628" stroke={COLORS.red} strokeOpacity={0.6} strokeWidth={1} />
          <text x={220} y={152} textAnchor="middle" fill={COLORS.red} fontSize={7} fontWeight={700} letterSpacing="0.1em" opacity={0.9}>
            ⚠ UNSTABLE
          </text>
        </g>
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPOSITION — 14s at 30fps = 420 frames
   ══════════════════════════════════════════ */

export default function CognitiveCore() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const COLLAPSE_START = Math.round(5 * fps);   // 150 — agents explode
  const CORE_APPEAR = COLLAPSE_START + 5;         // core fades in as explosion grows
  const CAPS_APPEAR = Math.round(8 * fps);        // 240 — capabilities appear

  const positions = AGENT_POSITIONS;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <svg viewBox="0 0 440 300" style={{ width: "100%", height: "100%" }}>

        {/* ── PHASE 1: Agent sprawl — chaos ── */}

        {/* Chaos connection lines (behind boxes) */}
        {CONNECTIONS.map(([a, b], i) => (
          <ChaosLine key={`c${i}`} from={positions[a]} to={positions[b]} index={i} collapseFrame={COLLAPSE_START} />
        ))}

        {/* Agent boxes sprawling in */}
        {AGENTS.map((label, i) => (
          <AgentBox key={label} x={positions[i].x} y={positions[i].y} rot={positions[i].rot} label={label} index={i} collapseFrame={COLLAPSE_START} />
        ))}

        {/* Counter */}
        <AgentCounter collapseFrame={COLLAPSE_START} />

        {/* ── Explosion flash — overlaps with core fade-in ── */}
        {frame >= COLLAPSE_START && frame < COLLAPSE_START + 40 && (() => {
          const t = (frame - COLLAPSE_START) / 40;
          return (
            <>
              <circle cx={200} cy={150} r={interpolate(t, [0, 1], [5, 160])} fill="#fff" opacity={interpolate(t, [0, 0.1, 1], [0, 0.25, 0])} />
              <circle cx={200} cy={150} r={interpolate(t, [0, 1], [5, 100])} fill={COLORS.red} opacity={interpolate(t, [0, 0.08, 0.5, 1], [0, 0.18, 0.06, 0])} />
            </>
          );
        })()}

        {/* ── PHASE 2: Core appears ── */}
        <CoreNode appearFrame={CORE_APPEAR} />

        {/* ── PHASE 3: Capabilities fan out ── */}
        <Sequence from={CAPS_APPEAR} layout="none">
          {/* Left side — inputs */}
          <CoreLine x1={145} y1={130} x2={95} y2={108} appearFrame={0} />
          <Capability x={18} y={99} label="ANY INTENT" appearFrame={5} />
          <CoreLine x1={145} y1={150} x2={95} y2={150} appearFrame={4} />
          <Capability x={18} y={141} label="ANY CONTEXT" appearFrame={9} />
          <CoreLine x1={145} y1={170} x2={95} y2={192} appearFrame={8} />
          <Capability x={18} y={183} label="ANY TOOL" appearFrame={13} />

          {/* Right side — outputs */}
          <CoreLine x1={255} y1={125} x2={315} y2={108} appearFrame={12} />
          <Capability x={318} y={99} label="TASK COMPLETE" appearFrame={16} />
          <CoreLine x1={255} y1={150} x2={315} y2={150} appearFrame={16} />
          <Capability x={318} y={141} label="AUDIT FIXED" appearFrame={20} />
          <CoreLine x1={255} y1={175} x2={315} y2={192} appearFrame={20} />
          <Capability x={318} y={183} label="CUSTOMER SATISFIED" appearFrame={24} />

          {/* Flowing dots — inputs into core */}
          <FlowDot x1={92} y1={108} x2={145} y2={130} color={COLORS.cyan} startFrame={15} dur={50} />
          <FlowDot x1={92} y1={150} x2={145} y2={150} color={COLORS.cyan} startFrame={20} dur={45} />
          <FlowDot x1={92} y1={192} x2={145} y2={170} color={COLORS.cyan} startFrame={25} dur={55} />
          {/* Flowing dots — outputs from core */}
          <FlowDot x1={255} y1={125} x2={315} y2={108} color={COLORS.cyanLight} startFrame={25} dur={50} />
          <FlowDot x1={255} y1={150} x2={315} y2={150} color={COLORS.cyanLight} startFrame={30} dur={45} />
          <FlowDot x1={255} y1={175} x2={315} y2={192} color={COLORS.cyanLight} startFrame={35} dur={55} />
        </Sequence>

      </svg>
    </AbsoluteFill>
  );
}
