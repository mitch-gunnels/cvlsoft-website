"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const C = {
  node: "#0d1322",
  cyan: "#22d3ee",
  cyanLight: "#67e8f9",
  text: "#94a3b8",
  textDim: "#64748b",
  border: "#1e293b",
  bg: "#0a1628",
};

/* ── Connector names in marketplace order ── */
const CONNECTORS = [
  "REST", "SLACK", "JIRA", "GMAIL", "MONGODB", "POSTGRES",
  "MYSQL", "MSSQL", "EMAIL", "TERMINAL", "WEBHOOK", "CALENDAR",
  "DRIVE", "SALESFORCE", "ZENDESK", "GITHUB", "STRIPE", "TWILIO",
  "SNOWFLAKE", "REDIS", "SAP", "ORACLE", "HUBSPOT", "ASANA",
  "CONFLUENCE", "DATADOG", "PAGERDUTY", "OKTA", "AUTH0", "AWS",
];

/* ── Grid position for connector tile ── */
function tilePos(i: number) {
  const cols = 6;
  const tileW = 58;
  const tileH = 24;
  const gapX = 6;
  const gapY = 5;
  const gridW = cols * tileW + (cols - 1) * gapX;
  const offsetX = (400 - gridW) / 2;
  const col = i % cols;
  const row = Math.floor(i / cols);
  return {
    x: offsetX + col * (tileW + gapX),
    y: 70 + row * (tileH + gapY),
    w: tileW,
    h: tileH,
  };
}

/* ── Single connector tile ── */
function ConnectorTile({ index, label }: { index: number; label: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearDelay = 15 + index * 3;
  const progress = spring({ frame, fps, delay: appearDelay, config: { damping: 14, stiffness: 140 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.6, 1]);

  const { x, y, w, h } = tilePos(index);
  const cx = x + w / 2;
  const cy = y + h / 2;

  // Pulse to core on appear
  const pulseFrame = appearDelay + 8;
  const showPulse = frame >= pulseFrame && frame < pulseFrame + 15;
  const pulseT = showPulse ? (frame - pulseFrame) / 15 : 0;

  return (
    <>
      <g opacity={opacity} transform={`translate(${cx}, ${cy}) scale(${scale})`} style={{ transformOrigin: "0 0" }}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={4} fill={C.bg} stroke={C.cyan} strokeOpacity={0.2} strokeWidth={1} />
        <text textAnchor="middle" dominantBaseline="central" fill={C.text} fontSize={5.5} fontWeight={600} letterSpacing="0.04em">
          {label}
        </text>
      </g>
      {/* Pulse line to center hub */}
      {showPulse && (
        <circle
          cx={200} cy={240}
          r={4 + pulseT * 8}
          fill={C.cyan}
          opacity={interpolate(pulseT, [0, 1], [0.3, 0])}
        />
      )}
    </>
  );
}

/* ── Central hub ── */
function Hub({ appearFrame }: { appearFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 12, stiffness: 80, mass: 1.5 } });
  const scale = interpolate(progress, [0, 1], [0.4, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const glowPhase = Math.max(0, frame - appearFrame - 20);
  const glowOp = glowPhase > 0 ? 0.04 + Math.sin(glowPhase * 0.03) * 0.02 : 0;

  return (
    <g transform={`translate(200, 240) scale(${scale})`} opacity={opacity}>
      <circle r={28} fill={C.cyan} opacity={Math.max(0, glowOp)} />
      <circle r={22} fill={C.node} stroke={C.cyan} strokeOpacity={0.5} strokeWidth={2} />
      <text y={-3} textAnchor="middle" fill={C.cyan} fontSize={6} fontWeight={700} letterSpacing="0.08em">UNIFIED</text>
      <text y={8} textAnchor="middle" fill={C.cyan} fontSize={6} fontWeight={700} letterSpacing="0.08em">CONTRACT</text>
      {/* Pulse ring */}
      {glowPhase > 0 && (() => {
        const t = (glowPhase % 70) / 70;
        return <circle r={25 + t * 20} stroke={C.cyan} strokeWidth={1} fill="none" opacity={interpolate(t, [0, 1], [0.15, 0])} />;
      })()}
    </g>
  );
}

/* ── Counter ── */
function Counter({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;

  const elapsed = frame - startFrame;
  const countEnd = Math.round(4 * fps);
  const count = Math.min(
    Math.floor(interpolate(elapsed, [0, countEnd], [0, 200], { extrapolateRight: "clamp" })),
    200
  );

  const opacity = interpolate(
    spring({ frame, fps, delay: startFrame, config: { damping: 18, stiffness: 80 } }),
    [0, 1], [0, 1]
  );

  return (
    <g opacity={opacity}>
      <text x={200} y={280} textAnchor="middle" fill={C.cyan} fontSize={11} fontWeight={700} letterSpacing="0.05em">
        {count}+ connectors
      </text>
      <text x={200} y={294} textAnchor="middle" fill={C.textDim} fontSize={8} letterSpacing="0.04em">
        One execution contract. Every integration.
      </text>
    </g>
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
   MAIN COMPOSITION — 12s at 30fps = 360 frames
   ══════════════════════════════════════════ */

export default function ConnectorFabric() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TITLE_IN = 0;
  const HUB_IN = Math.round(0.3 * fps);
  const TILES_IN = Math.round(0.5 * fps);
  const COUNTER_IN = Math.round(4 * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <svg viewBox="0 0 400 300" style={{ width: "100%", height: "100%" }}>

        {/* ══ TITLE ══ */}
        <FadeLabel x={200} y={22} text="Connector Marketplace" color={C.text} appearFrame={TITLE_IN} fontSize={14} />
        <FadeLabel x={200} y={42} text="Add a connector. Every workflow uses it immediately." color={C.textDim} appearFrame={TITLE_IN + 8} fontSize={9} />

        {/* ══ CONNECTOR GRID ══ */}
        {CONNECTORS.map((label, i) => (
          <ConnectorTile key={label} index={i} label={label} />
        ))}

        {/* ══ CENTRAL HUB ══ */}
        <Hub appearFrame={HUB_IN} />

        {/* ══ COUNTER ══ */}
        <Counter startFrame={COUNTER_IN} />

      </svg>
    </AbsoluteFill>
  );
}
