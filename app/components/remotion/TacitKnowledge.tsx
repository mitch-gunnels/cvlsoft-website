"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";

const C = {
  node: "#0d1322",
  cyan: "#22d3ee",
  cyanLight: "#67e8f9",
  amber: "#f59e0b",
  green: "#22c55e",
  red: "#f43f5e",
  text: "#94a3b8",
  textDim: "#64748b",
  border: "#1e293b",
  bg: "#0a1628",
};

/* ── Voice wave bars (below screen) ── */
function VoiceBar({ cx, cy, active }: { cx: number; cy: number; active: boolean }) {
  const frame = useCurrentFrame();
  if (!active) return null;
  const bars = [-10, -6, -2, 2, 6, 10];
  return (
    <g>
      {bars.map((dx, i) => {
        const h = 3 + 5 * Math.abs(Math.sin(frame * 0.14 + i * 1.3));
        return (
          <rect key={i} x={cx + dx - 1} y={cy - h / 2} width={2} height={h} rx={1}
            fill={C.cyan} opacity={0.4 + 0.3 * Math.abs(Math.sin(frame * 0.14 + i * 1.3))} />
        );
      })}
    </g>
  );
}

/* ── Highlight box that appears on screen content, then flies out ── */
function Highlight({
  sx, sy, sw, sh, label,
  tx, ty,
  highlightFrame, flyFrame, flyDuration,
}: {
  sx: number; sy: number; sw: number; sh: number; label: string;
  tx: number; ty: number;
  highlightFrame: number; flyFrame: number; flyDuration: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: highlight appears on screen
  const hlProg = spring({ frame, fps, delay: highlightFrame, config: { damping: 12, stiffness: 150 } });
  // Phase 2: flies to workflow
  const flying = frame >= flyFrame;
  const flyT = flying ? Math.min((frame - flyFrame) / flyDuration, 1) : 0;
  const flyEased = flyT < 1 ? 1 - Math.pow(1 - flyT, 3) : 1; // ease-out cubic

  const cx = flying ? sx + sw / 2 + (tx - (sx + sw / 2)) * flyEased : sx + sw / 2;
  const cy = flying ? sy + sh / 2 + (ty - (sy + sh / 2)) * flyEased : sy + sh / 2;
  const scale = flying ? interpolate(flyEased, [0, 0.5, 1], [1, 0.6, 1]) : 1;
  const w = flying ? interpolate(flyEased, [0, 1], [sw, 66]) : sw;
  const h = flying ? interpolate(flyEased, [0, 1], [sh, 22]) : sh;

  // On screen: amber highlight box
  const onScreen = !flying || flyT < 1;
  const arrived = flyT >= 1;

  const opacity = interpolate(hlProg, [0, 1], [0, 1]);
  if (opacity < 0.01) return null;

  const color = arrived ? C.cyan : C.amber;
  const strokeOp = arrived ? 0.35 : flying ? 0.5 : 0.4;

  return (
    <g opacity={opacity}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={arrived ? 4 : 3}
        fill={arrived ? C.bg : "transparent"} stroke={color} strokeOpacity={strokeOp}
        strokeWidth={arrived ? 1 : 1.5} transform={`scale(${scale})`}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* Label shows during flight and after arrival */}
      {(flying || arrived) && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          fill={arrived ? C.cyan : C.amber} fontSize={arrived ? 7 : 6}
          fontWeight={600} letterSpacing="0.04em"
          opacity={interpolate(flyT, [0, 0.3], [0, 1], { extrapolateRight: "clamp" })}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* ── Workflow connection line ── */
function WfLine({ x1, y1, x2, y2, appearFrame }: {
  x1: number; y1: number; x2: number; y2: number; appearFrame: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, delay: appearFrame, config: { damping: 20, stiffness: 80 } });
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.cyan} strokeOpacity={0.3} strokeWidth={1}
      strokeDasharray={len} strokeDashoffset={interpolate(progress, [0, 1], [len, 0])}
      opacity={interpolate(progress, [0, 0.1], [0, 1], { extrapolateRight: "clamp" })}
    />
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

export default function TacitKnowledge() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Timing ── */
  const TITLE_IN = 0;
  const SCREEN_IN = Math.round(0.8 * fps);
  const VOICE_START = Math.round(1.5 * fps);
  const HL_START = Math.round(2.5 * fps);
  const FLY_START = Math.round(5 * fps);
  const FLY_DUR = Math.round(1.2 * fps);

  /* ── Screen position ── */
  const SCR = { x: 15, y: 72, w: 215, h: 150 };

  /* ── Workflow target positions (far right) ── */
  const WF_X = 365;
  const wfY = [52, 84, 116, 148, 180, 212];

  /* ── AIOS mini app position (bottom-right of screen) ── */
  const APP = { x: SCR.x + SCR.w - 55, y: SCR.y + SCR.h - 32, w: 48, h: 26 };

  /* ── Highlights ── */
  const highlights = [
    { sx: SCR.x + 10, sy: SCR.y + 24, sw: 55, sh: 16, label: "TRIGGER", hlDelay: 0, flyDelay: 0 },
    { sx: SCR.x + 75, sy: SCR.y + 24, sw: 70, sh: 16, label: "STEP 1", hlDelay: 12, flyDelay: 6 },
    { sx: SCR.x + 10, sy: SCR.y + 52, sw: 50, sh: 24, label: "DECISION", hlDelay: 24, flyDelay: 12 },
    { sx: SCR.x + 70, sy: SCR.y + 52, sw: 55, sh: 24, label: "ACTION A", hlDelay: 36, flyDelay: 18 },
    { sx: SCR.x + 10, sy: SCR.y + 82, sw: 65, sh: 16, label: "ACTION B", hlDelay: 48, flyDelay: 24 },
    { sx: SCR.x + 85, sy: SCR.y + 82, sw: 55, sh: 16, label: "EDGE CASE", hlDelay: 60, flyDelay: 30 },
  ];

  /* ── Screen appear ── */
  const scrProg = spring({ frame, fps, delay: SCREEN_IN, config: { damping: 15, stiffness: 100 } });
  const scrOpacity = interpolate(scrProg, [0, 1], [0, 1]);
  const scrScale = interpolate(scrProg, [0, 1], [0.9, 1]);

  /* ── AIOS app appear ── */
  const appProg = spring({ frame, fps, delay: VOICE_START, config: { damping: 14, stiffness: 120 } });
  const appOpacity = interpolate(appProg, [0, 1], [0, 1]);
  const appScale = interpolate(appProg, [0, 1], [0.7, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <svg viewBox="0 0 400 300" style={{ width: "100%", height: "100%" }}>

        {/* ══ CENTERED TITLE ══ */}
        <FadeLabel x={200} y={22} text="AIOS Interviewer" color={C.cyan} appearFrame={TITLE_IN} fontSize={14} />
        <FadeLabel x={200} y={42} text="Screen Capture + Signal Detection" color={C.textDim} appearFrame={TITLE_IN + 5} fontSize={8} />

        {/* ══ THE SCREEN ══ */}
        <g opacity={scrOpacity} transform={`scale(${scrScale})`} style={{ transformOrigin: `${SCR.x + SCR.w / 2}px ${SCR.y + SCR.h / 2}px` }}>
          {/* Browser chrome */}
          <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={6} fill={C.node} stroke={C.border} strokeWidth={1.5} />
          <rect x={SCR.x} y={SCR.y} width={SCR.w} height={16} rx={6} fill="#131d30" />
          <circle cx={SCR.x + 10} cy={SCR.y + 8} r={2.5} fill={C.red} opacity={0.5} />
          <circle cx={SCR.x + 19} cy={SCR.y + 8} r={2.5} fill={C.amber} opacity={0.5} />
          <circle cx={SCR.x + 28} cy={SCR.y + 8} r={2.5} fill={C.green} opacity={0.5} />

          {/* Screen content — simplified UI blocks */}
          <rect x={SCR.x + 10} y={SCR.y + 22} width={SCR.w - 20} height={2} rx={1} fill={C.border} opacity={0.4} />
          <rect x={SCR.x + 10} y={SCR.y + 46} width={SCR.w - 20} height={1} rx={0.5} fill={C.border} opacity={0.2} />
          <rect x={SCR.x + 10} y={SCR.y + 82} width={SCR.w - 20} height={1} rx={0.5} fill={C.border} opacity={0.2} />
          <rect x={SCR.x + 10} y={SCR.y + 105} width={60} height={3} rx={1.5} fill={C.border} opacity={0.2} />
          <rect x={SCR.x + 10} y={SCR.y + 113} width={100} height={3} rx={1.5} fill={C.border} opacity={0.15} />
          <rect x={SCR.x + 10} y={SCR.y + 121} width={80} height={3} rx={1.5} fill={C.border} opacity={0.1} />
        </g>

        {/* ══ AIOS MINI APP (bottom-right corner of screen) ══ */}
        <g opacity={appOpacity} transform={`scale(${appScale})`} style={{ transformOrigin: `${APP.x + APP.w / 2}px ${APP.y + APP.h / 2}px` }}>
          {/* App background */}
          <rect x={APP.x} y={APP.y} width={APP.w} height={APP.h} rx={5} fill="#0a1020" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={1} />
          {/* AIOS label */}
          <text x={APP.x + 6} y={APP.y + 9} fill={C.cyan} fontSize={5} fontWeight={700} letterSpacing="0.06em">AIOS</text>
          {/* REC badge */}
          <rect x={APP.x + APP.w - 20} y={APP.y + 3} width={17} height={8} rx={2.5} fill={C.red} fillOpacity={0.15} stroke={C.red} strokeOpacity={0.3} strokeWidth={0.5} />
          <circle cx={APP.x + APP.w - 15} cy={APP.y + 7} r={1.5} fill={C.red} opacity={frame > VOICE_START ? 0.3 + 0.5 * Math.abs(Math.sin(frame * 0.12)) : 0.2} />
          <text x={APP.x + APP.w - 7} y={APP.y + 9.5} textAnchor="middle" fill={C.red} fontSize={3.5} fontWeight={700} opacity={0.6}>REC</text>
          {/* Voice waves inside app */}
          <VoiceBar cx={APP.x + APP.w / 2} cy={APP.y + APP.h - 6} active={frame > VOICE_START} />
        </g>

        {/* ══ HIGHLIGHTS on screen → fly to workflow ══ */}
        {highlights.map((h, i) => (
          <Highlight
            key={i}
            sx={h.sx} sy={h.sy} sw={h.sw} sh={h.sh} label={h.label}
            tx={WF_X} ty={wfY[i]}
            highlightFrame={HL_START + h.hlDelay}
            flyFrame={FLY_START + h.flyDelay}
            flyDuration={FLY_DUR}
          />
        ))}

        {/* ══ WORKFLOW CONNECTIONS (appear after nodes arrive) ══ */}
        <Sequence from={FLY_START + FLY_DUR} layout="none">
          <WfLine x1={WF_X} y1={63} x2={WF_X} y2={73} appearFrame={5} />
          <WfLine x1={WF_X} y1={95} x2={WF_X} y2={105} appearFrame={12} />
          <WfLine x1={WF_X - 8} y1={127} x2={WF_X - 20} y2={137} appearFrame={19} />
          <WfLine x1={WF_X + 8} y1={127} x2={WF_X + 20} y2={137} appearFrame={19} />
          <WfLine x1={WF_X - 20} y1={159} x2={WF_X} y2={169} appearFrame={26} />
          <WfLine x1={WF_X + 20} y1={159} x2={WF_X} y2={169} appearFrame={26} />

          {/* Arrow from screen to workflow */}
          {(() => {
            const p = spring({ frame, fps, delay: FLY_START + FLY_DUR, config: { damping: 18, stiffness: 80 } });
            return (
              <g opacity={interpolate(p, [0, 1], [0, 0.4])}>
                <line x1={240} y1={130} x2={320} y2={130} stroke={C.amber} strokeWidth={1.5} strokeDasharray="4 3" />
                <polygon points="318,126 328,130 318,134" fill={C.amber} opacity={0.6} />
              </g>
            );
          })()}

        </Sequence>

      </svg>
    </AbsoluteFill>
  );
}
