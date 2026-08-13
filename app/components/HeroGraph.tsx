"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import PillarIcon from "@/app/components/PillarIcon";

/* ────────────────────────────────────────────────────────────
   Hero graph — one expert session, turned into a workflow, then run.

   Nine phases, on a loop:

     OBSERVE    the Observer sits on the floor of the frame with its
                indicator blinking; captured session detail rises out of
                it one line at a time. Top-level ACTIONS are what it saw;
                the sub-lines beneath one of them are AIOS asking why,
                the expert answering, and that answer being captured as
                rationale. That nesting is the whole claim — anyone can
                log clicks; the reason behind the click is what makes a
                workflow reusable.
     CTA        a "Create Blueprint" button lands; a cursor flies in and
                clicks it.
     EXIT       the captured lines slide off to the left, in series.
     CREATING   empty frame; the Blueprint is being compiled.
     BLUEPRINT  the workflow draws itself in — steps, an AI reasoning
                node carrying the rationale captured in OBSERVE, a
                decision, two branches, a merge.
     LAUNCH     the graph pans up, a "Launch Workflow" button lands, and
                the cursor clicks it.
     BPEXIT     the graph slides off to the left, node by node.
     DEPLOYING  empty frame; the workflow is going live.
     RUN        the agents execute it: each step goes pending → running →
                done, the decision resolves to a branch, and the run
                leaves a receipt.

   Layout is arithmetic, not flow. The session and run streams are
   bottom-anchored at a computed offset so the newest row always lands on
   the same spot; the blueprint is an absolutely positioned graph on a
   fixed coordinate grid with hairline connectors. Everything glides on
   transforms.
   ──────────────────────────────────────────────────────────── */

/* ══ Phase 1 · the session ═════════════════════════════════ */

type Line =
  /** The session's own header — the Observer announcing itself before
      the first action lands, so the frame is never a blank stream. */
  | { kind: "start"; text: string }
  | { kind: "action"; at: string; app: string; text: string }
  | { kind: "ask"; text: string }
  | { kind: "answer"; text: string }
  | { kind: "rationale"; text: string };

/* The session, in reveal order. One line lands per beat. */
const SCRIPT: Line[] = [
  { kind: "start", text: "Activated · capturing" },
  { kind: "action", at: "01:24", app: "SAP", text: "Opened vendor master — Meridian Supply" },
  { kind: "action", at: "02:36", app: "Excel", text: "Compared last three invoices" },
  { kind: "ask", text: "Why did you choose those invoices?" },
  {
    kind: "answer",
    text: "I only compare against the same PO line — anything older is a different rate card.",
  },
  { kind: "rationale", text: "Decision rationale captured" },
  { kind: "action", at: "03:41", app: "Outlook", text: "Read approval thread — Controller" },
  { kind: "action", at: "04:12", app: "SAP", text: "Released the exception hold" },
];

/* Per-kind geometry: row height, and the air above it. Sub-lines sit
   tighter than actions, which is what makes them read as belonging to
   the action above rather than as peers of it. Copy is written to fit
   these heights — the answer is sized for two lines at 360px. */
/** `tick` is where the rail's crossbar comes off, when that is not the
    row's own middle. A two-line row hangs its speaker mark on the first
    line, so the crossbar has to meet the mark rather than the block. */
const GEO: Record<
  Line["kind"] | "cta",
  { h: number; gap: number; sub: boolean; tick?: number }
> = {
  start: { h: 44, gap: 22, sub: false },
  action: { h: 44, gap: 22, sub: false },
  ask: { h: 28, gap: 10, sub: true },
  // gap 18, not 8: the expert's reply gets a beat of air under the
  // question, which the avatar needs more than a text label did.
  // tick 10: the centre of the avatar, which sits on the first line —
  // h/2 put the crossbar between the two lines of the reply, well below
  // the face it was supposed to point at.
  answer: { h: 50, gap: 18, sub: true, tick: 10 },
  rationale: { h: 30, gap: 8, sub: true },
  cta: { h: 44, gap: 26, sub: false },
};

/** Left inset of a sub-line, and where its rail hangs. */
const INDENT = 26;
const RAIL_X = 11;

/* ══ Phase 5 · the blueprint ═══════════════════════════════
   A fixed coordinate grid laid out by hand. Percent x values so it
   holds at both 360px and 400px column widths. */

type BpNode = {
  id: string;
  kind: "trigger" | "step" | "reason" | "decision" | "branch" | "merge";
  y: number;
  h: number;
  /** Defaults to the full column. */
  x?: string;
  w?: string;
  lead?: string;
  label: string;
  sub?: string;
  meta?: string;
};

const BP_NODES: BpNode[] = [
  { id: "t", kind: "trigger", y: 0, h: 30, label: "Invoice exception raised", meta: "TRIGGER" },
  { id: "s1", kind: "step", y: 46, h: 44, lead: "01", label: "Pull vendor history", meta: "SAP" },
  {
    id: "r",
    kind: "reason",
    y: 106,
    h: 70,
    label: "AI REASONING",
    sub: "Compare the same PO line only — anything older is a different rate card.",
    meta: "FROM RATIONALE",
  },
  { id: "d", kind: "decision", y: 192, h: 44, label: "Variance over 10%?" },
  {
    id: "b1",
    kind: "branch",
    y: 264,
    h: 52,
    x: "0%",
    w: "47%",
    lead: "YES",
    label: "Approval gate",
    meta: "Controller",
  },
  {
    id: "b2",
    kind: "branch",
    y: 264,
    h: 52,
    x: "53%",
    w: "47%",
    lead: "NO",
    label: "Auto-release",
    meta: "Payment run",
  },
  // Numbered 2, not 3: the branches are the gate, not a step of their
  // own, which is what the footer's "2 actions · 1 decision · 1 gate"
  // is counting.
  { id: "m", kind: "merge", y: 344, h: 44, lead: "02", label: "Post decision · notify requester", meta: "SAP" },
];

/** Overall height of the routed graph, and where the Launch button sits
    once it pans up to make room. */
const BP_H = 388;
const BP_CTA_Y = BP_H + 22;
/** Resting offset. The viewport feathers its top edge, so the graph sits
    below that feather rather than starting in it. */
const BP_REST = 14;
/** How far the graph pans up to clear room for the Launch button. */
const BP_PAN = 52;

/** Orthogonal hairlines between the nodes above. `len` is a vertical
    run from `y`; `w` is a horizontal run from `x`. Branch centres are
    23.5% and 76.5% — the midpoints of the two 47%-wide boxes. */
const BP_LINKS: { x: string; y: number; len?: number; w?: string }[] = [
  { x: "50%", y: 30, len: 16 },
  { x: "50%", y: 90, len: 16 },
  { x: "50%", y: 176, len: 16 },
  { x: "50%", y: 236, len: 20 }, // stem below the decision
  { x: "23.5%", y: 256, w: "53%" }, // fork rail
  { x: "23.5%", y: 256, len: 8 },
  { x: "76.5%", y: 256, len: 8 },
  { x: "23.5%", y: 316, len: 8 },
  { x: "76.5%", y: 316, len: 8 },
  { x: "23.5%", y: 324, w: "53%" }, // merge rail
  { x: "50%", y: 324, len: 20 },
];

/** Junction dots where the spine meets the fork and merge rails —
    without them the two rails plus their drops read as a stray
    rectangle around the branch pair rather than as routing. */
const BP_JOINTS: { y: number }[] = [{ y: 256 }, { y: 324 }];

/* ══ Phase 9 · the run ═════════════════════════════════════ */

/* One box, not five rows. The steps are AIOS's business, not the
   viewer's — what the viewer needs is that something is working, what
   it is working on right now, and how far through it is. */
const RUN_STEPS: { detail: string; took: string }[] = [
  { detail: "Pulling vendor history from SAP", took: "0.6s" },
  { detail: "Applying your rule — same PO line only", took: "0.9s" },
  { detail: "Variance 14.2% — over the 10% threshold", took: "0.2s" },
  { detail: "Routing to the Controller for approval", took: "0.4s" },
  { detail: "Posting the decision · notifying the requester", took: "0.3s" },
];

const RUN_GAP = 12;
const WORK_H = 136;
const RECEIPT_H = 30;

/* ══ Phase 11 · exposing it to customers ═══════════════════
   A workflow that runs internally is automation. The same workflow put
   on the channels customers already use is the product — so this step
   is a deliberate, visible choice rather than something that happens
   off screen. */

const EXPOSE_CHANNELS = [
  { key: "voice", label: "Voice", meta: "Inbound calls" },
  { key: "chat", label: "Chat", meta: "Website & in-app" },
  { key: "sms", label: "SMS", meta: "Text messages" },
  { key: "assistants", label: "ChatGPT & Claude", meta: "Where they already ask" },
];

/* Geometry, so the cursor can be told exactly where each checkbox is.
   Card: py-4 (16) + title 14 + mt-1.5 (6) + subtitle 16 + mt-4 (16),
   then three 40px rows on a 48px pitch. */
const EX_ROW_H = 40;
const EX_ROW_PITCH = 48;
const EX_ROWS_Y = 68;
const EX_CARD_H =
  EX_ROWS_Y + EX_ROW_H * EXPOSE_CHANNELS.length + 8 * (EXPOSE_CHANNELS.length - 1) + 16;
const EX_CTA_Y = EX_CARD_H + 22;
const EX_TOTAL = EX_CTA_Y + 44;
/** Where the cursor sits to tick a box: over the checkbox, which is
    card padding (16) + row padding (12) + half the 18px box. */
const EX_CURSOR_X = 40;

/* ══ Phase 12 · the same case, by phone ════════════════════
   A customer rings about the invoice the workflow already knows how to
   handle. AIOS answers, recognises the case, triggers that workflow,
   and closes the call — no transfer, no callback, no ticket.

   Heights are declared per line because the transcript wraps: the copy
   below is written to fit these at a 360px column, the narrowest the
   frame ever gets. */

type CallKind = "head" | "caller" | "aios" | "system" | "resolved";

const CALL: { kind: CallKind; text?: string; h: number; gap: number }[] = [
  { kind: "head", h: 56, gap: 0 },
  {
    kind: "aios",
    text: "Thanks for calling accounts payable — this is AIOS. How can I help?",
    h: 52,
    gap: 18,
  },
  {
    kind: "caller",
    text: "Hi — invoice 8812 is still showing as held. Can someone look at it?",
    h: 52,
    gap: 14,
  },
  // It says it is going to look, then it looks. The workflow running
  // under this line is what it means by "one second".
  {
    kind: "aios",
    text: "Of course — let me check on that for you. One second while I pull it up.",
    h: 52,
    gap: 14,
  },
  { kind: "system", text: "Invoice Exception Review", h: 44, gap: 14 },
  {
    kind: "aios",
    text: "Found it. It was held for a 14.2% variance against the PO line.",
    h: 52,
    gap: 14,
  },
  {
    kind: "aios",
    text: "I compared the last three invoices on that account and released it — payment goes out tonight.",
    h: 52,
    gap: 14,
  },
  { kind: "caller", text: "Oh, that's great — thank you.", h: 34, gap: 14 },
  { kind: "resolved", text: "Call resolved · 1:12 · no transfer, no callback", h: 30, gap: 18 },
];

/* ══ Phase 9 · the trigger ═════════════════════════════════
   Nobody presses run. The Executor sits armed, watching the systems the
   blueprint was drawn from, and an inbound event is what wakes it — the
   same bookend as the Observer at the top of the loop. */

const TRIGGER = {
  at: "09:42:07",
  app: "SAP",
  text: "Exception PO-8812 · $14,200",
};

const DOCK_H = 78;
const EVENT_H = 44;

/* ══ Frame ═════════════════════════════════════════════════ */

/** Visible height of the whole frame. */
const VIEWPORT = 520;

/** The step timeline on the floor: the rail, the stems hanging off it,
    and the row of markers. Must match what that block renders. */
const FOOTER_H = 90;

/** How far the markers hang below the rail. */
const TL_STEM = 18;
/** Diameter of an inactive step's marker. Three of these plus the gaps
    are what the open box has to share the floor with, so it is sized
    down until the longest `does` line fits on one row. */
const TL_DOT = 28;
/** Between markers. */
const TL_GAP = 8;
/** The open box's left padding — and so how far its mark sits from the
    slot's left edge, which is the distance the mark travels when the
    box collapses onto it. */
const TL_PAD = 14;
/* One leg of the morph — collapse, reposition, expand — runs 520ms.
   That number lives in the Tailwind duration classes on the timeline;
   the handoff beat below must stay longer than it. */
/** How far the rail overruns the animation column, each side. */
const TL_BLEED = 44;

/** Breathing room between the newest row and the status block. */
const FLOOR = 14;

/** Height of the area above the status block. */
const STREAM_H = VIEWPORT - FOOTER_H;

/* ══ The timeline ══════════════════════════════════════════ */

type Phase =
  /** Nothing on screen. Buys the page a beat before the story starts. */
  | "boot"
  /** The whole cast at once: all four parts stacked, before any of them
      plays. A visitor who watches nothing else still learns the shape. */
  | "overview"
  | "ovexit"
  /** An act's title card: pillar icon, name, and what it does. */
  | "intro"
  | "observe"
  | "cta"
  | "exit"
  | "blueprint"
  | "launch"
  | "bpexit"
  | "armed"
  | "run"
  | "runexit"
  | "expose"
  /** The channel panel riding out, so the call does not simply replace
      it mid-frame the way it used to. */
  | "exexit"
  | "call"
  | "callexit"
  /** The act's own marker leaving the timeline, once the canvas above
      it is already empty. `step` is the index of the act going out. */
  | "handoff";

type Beat = { phase: Phase; step: number; hold: number };

const SEQUENCE: Beat[] = [
  // Held blank on first load only — see the wrap in the timer below.
  { phase: "boot", step: 0, hold: 2000 },

  // The contents page. Title then four rows, in series over ~2.2s,
  // then the set holds for a full five seconds — long enough to read
  // all four and see that they are one chain, not four products.
  { phase: "overview", step: 0, hold: 8200 },
  // 4 × the exit stagger + the 520ms travel, so the title — which
  // trails the stack out — has cleared.
  { phase: "ovexit", step: 0, hold: 1200 },

  { phase: "intro", step: 0, hold: 4000 }, // OBSERVER
  { phase: "observe", step: 0, hold: 2500 }, // listening, nothing captured yet
  { phase: "observe", step: 1, hold: 2300 },
  { phase: "observe", step: 2, hold: 2300 },
  { phase: "observe", step: 3, hold: 2500 }, // AIOS asks
  { phase: "observe", step: 4, hold: 3400 }, // the expert answers — read time
  { phase: "observe", step: 5, hold: 2600 }, // rationale captured
  { phase: "observe", step: 6, hold: 2300 },
  { phase: "observe", step: 7, hold: 2300 },
  { phase: "observe", step: 8, hold: 3400 }, // session complete

  { phase: "cta", step: 0, hold: 2700 }, // button lands, cursor flies in
  { phase: "cta", step: 1, hold: 700 }, // click
  { phase: "exit", step: 0, hold: 1400 }, // session slides off in series
  { phase: "handoff", step: 0, hold: 620 }, // …then, on an empty canvas, its marker

  { phase: "intro", step: 1, hold: 4000 }, // BLUEPRINT
  { phase: "blueprint", step: 0, hold: 3800 }, // the workflow draws in
  { phase: "blueprint", step: 1, hold: 3600 }, // read it

  { phase: "launch", step: 0, hold: 2700 }, // graph pans up, button lands
  { phase: "launch", step: 1, hold: 700 }, // click
  { phase: "bpexit", step: 0, hold: 1500 }, // the workflow slides off
  { phase: "handoff", step: 1, hold: 620 },

  { phase: "intro", step: 2, hold: 4000 }, // EXECUTOR
  { phase: "armed", step: 0, hold: 5900 }, // listening — nobody presses run
  { phase: "armed", step: 1, hold: 2500 }, // an inbound event wakes it

  { phase: "run", step: 0, hold: 2400 }, // the flow, queued
  // The detail line swaps in over ~420ms, so anything under a second
  // leaves it settled for less time than it took to arrive.
  { phase: "run", step: 1, hold: 2600 },
  { phase: "run", step: 2, hold: 2600 },
  { phase: "run", step: 3, hold: 2600 },
  { phase: "run", step: 4, hold: 2600 },
  { phase: "run", step: 5, hold: 2600 },
  { phase: "run", step: 6, hold: 2600 }, // receipt lands
  { phase: "run", step: 7, hold: 4500 }, // finished
  { phase: "runexit", step: 0, hold: 1100 }, // the run slides off
  { phase: "handoff", step: 2, hold: 620 },

  { phase: "intro", step: 3, hold: 4000 }, // COMMUNICATOR
  // Running it internally is automation; putting it on the channels
  // customers already use is the product. The cursor makes that choice
  // on screen rather than it happening off camera.
  { phase: "expose", step: 0, hold: 2500 }, // the panel, nothing ticked
  { phase: "expose", step: 1, hold: 1750 }, // Voice
  { phase: "expose", step: 2, hold: 550 }, // move
  { phase: "expose", step: 3, hold: 1750 }, // Chat
  { phase: "expose", step: 4, hold: 550 }, // move
  { phase: "expose", step: 5, hold: 1750 }, // SMS
  { phase: "expose", step: 6, hold: 550 }, // move
  { phase: "expose", step: 7, hold: 1750 }, // ChatGPT & Claude
  { phase: "expose", step: 8, hold: 800 }, // move to the button
  { phase: "expose", step: 9, hold: 900 }, // click
  { phase: "expose", step: 10, hold: 2600 }, // publishing
  { phase: "exexit", step: 0, hold: 900 }, // the panel rides out left

  // Paced like speech, not like a feed: every line needs the time it
  // would take to say out loud, plus the beat before the reply.
  { phase: "call", step: 0, hold: 2800 }, // ringing
  { phase: "call", step: 1, hold: 2400 }, // AIOS answers
  { phase: "call", step: 2, hold: 3400 }, // greeting
  { phase: "call", step: 3, hold: 3400 }, // the customer's problem
  { phase: "call", step: 4, hold: 3600 }, // "let me check on that for you"
  { phase: "call", step: 5, hold: 3600 }, // …and the workflow is the checking
  { phase: "call", step: 6, hold: 3400 }, // "found it" — the check completes
  { phase: "call", step: 7, hold: 4000 }, // what it did about it
  { phase: "call", step: 8, hold: 3000 }, // the customer is happy
  { phase: "call", step: 9, hold: 2800 }, // resolved
  { phase: "call", step: 10, hold: 7000 }, // held — it's the payoff
  { phase: "callexit", step: 0, hold: 1100 }, // the call slides off
  { phase: "handoff", step: 3, hold: 620 }, // …and round again
];

/* ══ Act title cards ═══════════════════════════════════════
   Each act announces itself before it plays: the same pillar mark used
   further down the page, the part's name, and four words on what it
   does. Four words because the card is on screen for a second and a
   half — anything longer is read after it has gone. */

const ACTS: { icon: number; name: string; does: string }[] = [
  { icon: 0, name: "OBSERVER", does: "Watches, learns, & interviews experts" },
  { icon: 1, name: "BLUEPRINT", does: "Converts it into an agentic workflow" },
  { icon: 2, name: "EXECUTOR", does: "Listens, detects, classifies, & executes" },
  { icon: 3, name: "COMMUNICATOR", does: "Talks with customers & resolves issues" },
];

/* The overview stack, up front: the same four cards the acts announce
   themselves with, shown together so the loop opens on the whole shape
   before it starts spending a minute on the parts. */
const OV_ROW_H = 62;
const OV_GAP = 14;
/** The title above the stack, and the room it takes. */
const OV_HEAD_H = 38;
/** Each row lands after the one above it — a stagger, not a block. */
const OV_STAGGER = 320;
/** The rows travel slower than an act does; this is the one place the
    animation is asking to be read rather than watched. */
const OV_TRAVEL = 900;
/** Leaving is not reading, so the exit keeps the house pace. */
const OV_OUT_STAGGER = 150;

/* Subscribed rather than read in an effect, so the server snapshot is
   simply `false` and hydration never disagrees with itself. */
const REDUCED = "(prefers-reduced-motion: reduce)";

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(REDUCED);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/** Where the timeline parks for anyone who has asked for reduced
    motion — the resolved call, which reads on its own. The last beat
    in the array is a handoff, i.e. a frame mid-transition, so this is
    the last `call` rather than the end. */
const FROZEN = SEQUENCE.map((b) => b.phase).lastIndexOf("call");

/* ══ Session rows ══════════════════════════════════════════ */

/** A white mark beside the application a captured action happened in.
    Category glyphs, not brand marks: a system of record, a sheet, a
    mailbox. Vendor logos would be trademark use on a marketing page,
    and they would also pull the eye — these read as "which kind of
    tool" at 12px and stay out of the way. */
function AppGlyph({ app }: { app: string }) {
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const glyph =
    app === "Excel" ? (
      // A sheet: the grid
      <g>
        <rect x="3.2" y="4" width="17.6" height="16" rx="1.6" {...s} />
        <path d="M3.2 9.2h17.6M9.6 9.2V20" {...s} />
      </g>
    ) : app === "Outlook" ? (
      // A mailbox
      <g>
        <rect x="2.6" y="5" width="18.8" height="14" rx="2" {...s} />
        <path d="m3.4 6.6 8.6 6.2 8.6-6.2" {...s} />
      </g>
    ) : (
      // A system of record: stacked stores
      <g>
        <ellipse cx="12" cy="6.2" rx="7.4" ry="2.8" {...s} />
        <path d="M4.6 6.2v11.6c0 1.55 3.31 2.8 7.4 2.8s7.4-1.25 7.4-2.8V6.2" {...s} />
        <path d="M4.6 12c0 1.55 3.31 2.8 7.4 2.8s7.4-1.25 7.4-2.8" {...s} />
      </g>
    );

  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] shrink-0 text-white" aria-hidden="true">
      {glyph}
    </svg>
  );
}

function LineRow({ line }: { line: Line }) {
  if (line.kind === "start") {
    return (
      <div className="flex h-[44px] items-center gap-3 rounded-md border border-cyan-400/50 bg-cyan-400/[0.16] px-3.5 backdrop-blur-md">
        <WorkingMark working small />
        <span className="shrink-0 text-[11px] font-medium tracking-[0.14em] text-white">
          AIOS OBSERVER
        </span>
        <span className="hg-pulse-text truncate text-[11px] tracking-[0.14em] text-cyan-300">
          {line.text.toUpperCase()}
        </span>
      </div>
    );
  }

  if (line.kind === "action") {
    return (
      <div className="flex h-[44px] items-center gap-3 rounded-md border border-white/[0.07] bg-[#0d1013]/55 px-3.5 backdrop-blur-sm">
        <span className="font-mono text-[11px] text-white/35">{line.at}</span>
        <span className="flex shrink-0 items-center gap-1.5 rounded border border-white/15 py-0.5 pl-1.5 pr-2 text-[10px] tracking-[0.08em] text-white/55">
          <AppGlyph app={line.app ?? ""} />
          {line.app}
        </span>
        <span className="truncate text-[13px] text-white/75">{line.text}</span>
      </div>
    );
  }

  if (line.kind === "ask") {
    return (
      <div className="flex h-[28px] items-center gap-2.5">
        {/* Fixed width on the speaker label, so the two bodies start on
            the same x — "YOU" is a character shorter than "AIOS" and
            the reply used to sit left of the question. */}
        <span className="w-[32px] shrink-0 text-[10px] font-medium tracking-[0.12em] text-cyan-400">
          AIOS
        </span>
        <span className="truncate text-[13px] text-white/70">{line.text}</span>
      </div>
    );
  }

  if (line.kind === "answer") {
    return (
      <div className="flex h-[50px] items-start gap-2.5">
        {/* Same 19px line box as the body's first line, so the caps
            centre on that line instead of hanging off the top of the
            block. `items-start` + a padding nudge got it close and was
            wrong at every other size. */}
        {/* The expert, as a face. Same 32px column the AIOS label
            occupies, so both speakers' text still starts on one x, and
            nudged up so the circle centres on the first line rather
            than hanging below it. */}
        <span className="flex w-[32px] shrink-0 justify-start">
          <span
            className="-mt-[3px] h-[26px] w-[26px] rounded-full border border-white/20"
            style={{
              backgroundImage: "url(/videos/expert.jpg)",
              backgroundSize: "132%",
              backgroundPosition: "50% 20%",
            }}
          />
        </span>
        <span className="text-[13px] leading-[19px] text-white/85">{line.text}</span>
      </div>
    );
  }

  // rationale — the beat the whole session exists to land
  return (
    <div className="flex h-[30px] w-fit items-center gap-2 rounded-md border border-cyan-400/50 bg-cyan-400/[0.16] px-3 backdrop-blur-sm">
      <Check />
      <span className="whitespace-nowrap text-[11px] tracking-[0.10em] text-cyan-200">
        {line.text.toUpperCase()}
      </span>
    </div>
  );
}

function Check({ className = "h-3 w-3 text-cyan-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={`shrink-0 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

function Sparkle({ className = "h-3.5 w-3.5 text-cyan-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`shrink-0 ${className}`}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15l-1.9-4.1L5.5 9l4.6-1.4L12 3zM18 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z"
      />
    </svg>
  );
}

/** The buttons that move the story on. Not real controls — they sit
    inside a pointer-events-none frame — so they are divs, not buttons. */
function FakeButton({ label, pressed }: { label: string; pressed: boolean }) {
  return (
    <div
      className={`mx-auto flex h-[44px] w-fit items-center gap-2.5 rounded-[6px] border px-4 text-[14px] font-medium backdrop-blur-md transition-all duration-150 ${
        pressed
          ? "scale-[0.97] border-cyan-400/70 bg-cyan-400/20 text-white"
          : "border-white/30 bg-[#0d1013]/70 text-white"
      }`}
    >
      <span className="h-[7px] w-[7px] rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
      {label}
    </div>
  );
}

/** Cursor that flies in from off-frame and clicks. Mounted once per CTA
    phase, so the fly-in runs exactly once; `clickKey` changing replays
    the click ring, which is how one cursor ticks three boxes in a row. */
function Cursor({ clickKey }: { clickKey?: string | number }) {
  return (
    <span className="hg-cursor absolute z-10 -ml-1 -mt-1">
      <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
        <path d="M5 2.5l13 8.2-5.9 1.1 3.2 6.4-2.6 1.3-3.2-6.4-4.5 4z" fill="#fff" stroke="#0d1013" strokeWidth="1.1" />
      </svg>
      {clickKey !== undefined ? (
        <span key={clickKey} className="hg-click absolute left-[3px] top-[3px] h-3 w-3 rounded-full" />
      ) : null}
    </span>
  );
}

/* ══ Exposing it to customers ══════════════════════════════ */

function ExposeCard({ checked }: { checked: number }) {
  return (
    <div
      className="rounded-lg border border-white/[0.14] bg-[#0d1013]/85 px-4 py-4 backdrop-blur-md"
      style={{ height: EX_CARD_H }}
    >
      <p className="h-[14px] text-[11px] font-medium leading-[14px] tracking-[0.14em] text-white">
        EXPOSE TO CUSTOMERS
      </p>
      <p className="mt-1.5 h-[16px] text-[12px] leading-[16px] text-white/50">
        Which channels should this skill be exposed on?
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {EXPOSE_CHANNELS.map((c, idx) => {
          const on = idx < checked;
          return (
            <div
              key={c.key}
              className={`flex items-center gap-3 rounded-md border px-3 transition-colors duration-300 ${
                on ? "border-cyan-400/50 bg-cyan-400/[0.14]" : "border-white/[0.10] bg-[#0d1013]/50"
              }`}
              style={{ height: EX_ROW_H }}
            >
              <span
                className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[4px] border transition-colors duration-200 ${
                  on ? "border-cyan-400 bg-cyan-400/25" : "border-white/30"
                }`}
              >
                {on ? <Check className="h-3 w-3 text-cyan-200" /> : null}
              </span>
              <span className={`text-[13px] ${on ? "text-white" : "text-white/70"}`}>{c.label}</span>
              <span className="ml-auto shrink-0 text-[11px] text-white/40">{c.meta}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══ Blueprint nodes ═══════════════════════════════════════ */

const BP_CARD = "rounded-md border backdrop-blur-md";

function BpBox({ node }: { node: BpNode }) {
  if (node.kind === "trigger") {
    return (
      <div className={`${BP_CARD} flex h-full items-center gap-2.5 border-white/15 bg-[#0d1013]/70 px-3`}>
        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-white/45" />
        <span className="truncate text-[12px] text-white/75">{node.label}</span>
        <span className="ml-auto shrink-0 text-[9px] tracking-[0.14em] text-white/35">{node.meta}</span>
      </div>
    );
  }

  if (node.kind === "reason") {
    // The rationale captured up in OBSERVE, now doing work. The one
    // block on the page that is not standard procedure — so it is the
    // one block that keeps the accent.
    return (
      <div className={`${BP_CARD} h-full border-cyan-400/55 bg-cyan-400/[0.16] px-3.5 py-2`}>
        <div className="flex items-center gap-2">
          <Sparkle />
          <span className="text-[10px] font-medium tracking-[0.14em] text-cyan-300">{node.label}</span>
          <span className="ml-auto shrink-0 text-[9px] tracking-[0.12em] text-cyan-300/90">{node.meta}</span>
        </div>
        <p className="mt-1.5 text-[12px] leading-[1.4] text-white/80">{node.sub}</p>
      </div>
    );
  }

  if (node.kind === "decision") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className={`${BP_CARD} flex h-[40px] items-center gap-2.5 border-white/25 bg-[#0d1013]/80 px-4`}>
          <span className="h-2.5 w-2.5 rotate-45 border border-cyan-400" />
          <span className="whitespace-nowrap text-[13px] text-white">{node.label}</span>
        </div>
      </div>
    );
  }

  if (node.kind === "branch") {
    const yes = node.lead === "YES";
    // Line heights are explicit: three stacked lines have to total the
    // box height exactly, or the last one hangs out of the bottom.
    return (
      <div className={`${BP_CARD} h-full border-white/[0.12] bg-[#0d1013]/72 px-3 py-1.5`}>
        <p
          className={`h-[12px] text-[9px] font-medium leading-[12px] tracking-[0.16em] ${
            yes ? "text-cyan-400" : "text-white/35"
          }`}
        >
          {node.lead}
        </p>
        <p className="h-[16px] truncate text-[12px] leading-[16px] text-white/85">{node.label}</p>
        <p className="h-[12px] truncate text-[9.5px] leading-[12px] text-white/40">{node.meta}</p>
      </div>
    );
  }

  // step / merge — the plain executable rows
  return (
    <div className={`${BP_CARD} flex h-full items-center gap-3 border-white/[0.12] bg-[#0d1013]/72 px-3.5`}>
      <span className="font-mono text-[11px] text-white/30">{node.lead}</span>
      <span className="truncate text-[13px] text-white/90">{node.label}</span>
      <span className="ml-auto shrink-0 text-[10px] text-white/40">{node.meta}</span>
    </div>
  );
}

/** The connectors clear before the steps do, so the routing is not
    left hanging in mid-air while the boxes leave. */
const BP_EXIT_LEAD = 300;

/* ══ Trigger ═══════════════════════════════════════════════ */

/** The Executor, armed and watching. It is the only element in its
    phase that does not move — the event that lands above it is what it
    produced, exactly as with the Observer at the top of the loop. */
function ExecDock({ triggered }: { triggered: boolean }) {
  return (
    <div
      className={`flex items-center gap-3.5 rounded-lg border px-4 backdrop-blur-md transition-colors duration-500 ${
        triggered ? "border-cyan-400/55 bg-cyan-400/[0.16]" : "border-white/[0.16] bg-[#0d1013]/85"
      }`}
      style={{ height: DOCK_H }}
    >
      {/* The agent itself, idling. A slowly turning ring rather than a
          bare status light: something is on duty here. */}
      <WorkingMark working={!triggered} watching />

      <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] font-medium tracking-[0.14em] text-white">EXECUTOR</span>
        <span
          className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] tracking-[0.12em] transition-colors duration-300 ${
            triggered ? "border-cyan-400/45 text-cyan-300" : "border-white/20 text-white/50"
          }`}
        >
          {triggered ? "MATCHED" : "ON WATCH"}
        </span>
        <span className="ml-auto shrink-0 font-mono text-[11px] text-white/45">
          {triggered ? TRIGGER.at : "09:41:58"}
        </span>
      </div>
      <div className="mt-2">
        {/* The turning ring already carries "on duty" — a scanner as
            well was two elements saying one thing. */}
        <span className="truncate text-[12px] text-white/55">
          {triggered ? "Matched · starting run #1284" : "Watching SAP for exceptions"}
        </span>
      </div>
      </div>
    </div>
  );
}

/** The inbound event. Also rides at the top of the run, so the run
    always shows what caused it. */
function EventRow() {
  return (
    <div className="flex h-[44px] items-center gap-3 rounded-md border border-cyan-400/50 bg-cyan-400/[0.16] px-3.5 backdrop-blur-md">
      <span className="font-mono text-[11px] text-white/45">{TRIGGER.at}</span>
      <span className="shrink-0 rounded border border-white/20 px-1.5 py-0.5 text-[10px] tracking-[0.08em] text-white/65">
        {TRIGGER.app}
      </span>
      <span className="truncate text-[13px] text-white/85">{TRIGGER.text}</span>
      <span className="ml-auto shrink-0 text-[9px] tracking-[0.14em] text-cyan-300">TRIGGER</span>
    </div>
  );
}

/* ══ The working box ═══════════════════════════════════════ */

/** The AIOS mark, working: a dashed ring orbiting it while the run is
    live, still and dimmed once it is done. */
function WorkingMark({
  working,
  small = false,
  /** Idling rather than executing: the ring turns slowly and the mark
      does not glow. An agent waiting should not look like one running. */
  watching = false,
}: {
  working: boolean;
  small?: boolean;
  watching?: boolean;
}) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center ${small ? "h-[26px] w-[26px]" : "h-[34px] w-[34px]"}`}
    >
      <span
        className={`absolute inset-0 rounded-full border border-dashed ${
          working
            ? watching
              ? "hg-orbit-slow border-cyan-400/35"
              : "hg-orbit border-cyan-400/55"
            : "border-cyan-400/25"
        }`}
      />
      <img
        src="/logo-mark-256.svg"
        alt=""
        aria-hidden="true"
        className={`${small ? "h-[15px] w-[15px]" : "h-[21px] w-[21px]"} ${
          working && !watching ? "hg-glow" : ""
        }`}
      />
    </span>
  );
}

/** A line that changes in place. Holds the outgoing text for one
    animation so the two can cross — remounting on a key alone deleted
    the old line the instant the new one started, which is what made
    the run read as a blink followed by a rise rather than as one line
    turning over.

    The state adjustment happens during render, which is React's own
    pattern for deriving state from a changed prop: no effect, so no
    extra frame where both lines sit at their start values. */
function SwapLine({ text, className = "" }: { text: string; className?: string }) {
  const [shown, setShown] = useState(text);
  const [leaving, setLeaving] = useState<string | null>(null);

  if (shown !== text) {
    setLeaving(shown);
    setShown(text);
  }

  return (
    <span className={`relative block ${className}`}>
      {leaving === null ? null : (
        <span key={`out:${leaving}`} className="hg-swap-out absolute inset-0">
          {leaving}
        </span>
      )}
      <span key={`in:${text}`} className="hg-swap absolute inset-0">
        {text}
      </span>
    </span>
  );
}

/** One box for the whole run. `cursor` is the zero-based index of the
    step in flight; -1 means the run has been matched but not started. */
function WorkCard({ cursor, done }: { cursor: number; done: boolean }) {
  const complete = Math.min(RUN_STEPS.length, Math.max(0, done ? RUN_STEPS.length : cursor));
  const detail = done
    ? "Exception cleared — $14,200 released, requester notified"
    : cursor < 0
      ? "Blueprint matched — starting run #1284"
      : RUN_STEPS[cursor].detail;

  return (
    <div
      className="rounded-lg border border-cyan-400/30 bg-[#0d1013]/82 px-4 py-4 backdrop-blur-md"
      style={{ height: WORK_H }}
    >
      <div className="flex items-center gap-3">
        <WorkingMark working={!done} />
        <span className="text-[11px] font-medium tracking-[0.14em] text-white">AIOS</span>
        <span className={`text-[11px] tracking-[0.14em] text-cyan-400 ${done ? "" : "hg-pulse-text"}`}>
          {done ? "DONE" : "WORKING"}
        </span>
        <span className="ml-auto font-mono text-[11px] text-white/45">
          {complete} / {RUN_STEPS.length}
        </span>
      </div>

      {/* The step detail — the only part of the box that moves. */}
      <SwapLine
        text={detail}
        className="mt-3.5 h-[36px] text-[14px] leading-[1.3] text-white/85"
      />

      {/* One pip per step: done, in flight, still to come. */}
      <div className="mt-3.5 flex items-center gap-1.5">
        {RUN_STEPS.map((_, idx) => (
          <span
            key={idx}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
              done || idx < cursor
                ? "bg-cyan-400"
                : idx === cursor
                  ? "hg-pulse-text bg-cyan-400/60"
                  : "bg-white/12"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ══ The call ══════════════════════════════════════════════ */

function CallHead({ answered }: { answered: boolean }) {
  return (
    <div
      className={`flex h-[56px] items-center gap-3 rounded-lg border px-4 backdrop-blur-md transition-colors duration-500 ${
        answered ? "border-cyan-400/50 bg-cyan-400/[0.16]" : "border-white/20 bg-[#0d1013]/85"
      }`}
    >
      <span className="relative grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border border-cyan-400/40">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3.5 w-3.5 text-cyan-400">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 014.5 5.7 2 2 0 016.5 3.5z"
          />
        </svg>
        {answered ? null : <span className="hg-ring absolute inset-0 rounded-full border border-cyan-400/70" />}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-white">
          {answered ? "AIOS answered" : "Inbound call"}
        </p>
        <p className="truncate text-[11px] text-white/45">Meridian Supply · accounts payable</p>
      </div>
      <span className={`ml-auto shrink-0 text-[10px] tracking-[0.14em] ${answered ? "text-cyan-300" : "hg-pulse-text text-white/55"}`}>
        {answered ? "LIVE · 0:04" : "RINGING"}
      </span>
    </div>
  );
}

function CallLine({ line, done }: { line: (typeof CALL)[number]; done: boolean }) {
  if (line.kind === "system") {
    // The workflow the earlier acts built, triggered again — this time
    // by a voice on the phone rather than by an event in SAP. It stops
    // spinning the moment AIOS says it has found the invoice: a lookup
    // still turning while the agent talks about the result would read
    // as theatre.
    return (
      <div
        className={`flex h-[44px] items-center gap-3 rounded-md border px-3.5 backdrop-blur-md transition-colors duration-500 ${
          done ? "border-cyan-400/35 bg-cyan-400/[0.09]" : "border-cyan-400/50 bg-cyan-400/[0.14]"
        }`}
      >
        <WorkingMark working={!done} small />
        <span className="truncate text-[12px] text-white/85">{line.text}</span>
        {done ? (
          <span className="ml-auto flex shrink-0 items-center gap-1.5">
            <span className="font-mono text-[10px] text-white/40">2.4s</span>
            <Check className="h-3 w-3 text-cyan-400" />
          </span>
        ) : (
          <span className="hg-pulse-text ml-auto shrink-0 text-[9px] tracking-[0.14em] text-cyan-300">
            RUNNING
          </span>
        )}
      </div>
    );
  }

  if (line.kind === "resolved") {
    return (
      <div className="flex h-[30px] w-fit items-center gap-2 rounded-md border border-cyan-400/50 bg-cyan-400/[0.16] px-3 backdrop-blur-md">
        <Check />
        <span className="whitespace-nowrap text-[11px] tracking-[0.08em] text-cyan-200">{line.text}</span>
      </div>
    );
  }

  // The caller is indented and boxed, the way the other party sits in a
  // chat thread — so a glance tells you who is speaking before you read
  // a word of it. AIOS stays flush left: it is the one running the room.
  const aios = line.kind === "aios";
  if (aios) {
    return (
      <div className="flex items-start gap-2.5" style={{ height: line.h }}>
        <span className="w-[32px] shrink-0 text-[10px] font-medium leading-[19px] tracking-[0.12em] text-cyan-400">
          AIOS
        </span>
        <span className="text-[13px] leading-[19px] text-white/90">{line.text}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2.5 pl-10" style={{ height: line.h }}>
      {/* The caller, as a face, ahead of what he says. Painted as a
          background so it can be zoomed past the frame's white margin
          onto the head — the source is a full headshot and
          `object-cover` on a 28px circle would show mostly backdrop. */}
      <span
        className="h-[28px] w-[28px] shrink-0 rounded-full border border-white/20"
        style={{
          backgroundImage: "url(/videos/customer.jpg)",
          backgroundSize: "165%",
          backgroundPosition: "50% 20%",
        }}
      />
      <div className="flex h-full items-center rounded-[10px] rounded-br-[3px] border border-white/[0.12] bg-white/[0.06] px-3 backdrop-blur-sm">
        <span className="text-[13px] leading-[19px] text-white/75">{line.text}</span>
      </div>
    </div>
  );
}

/* ══ The component ═════════════════════════════════════════ */

/** Which half of the story is on screen. The hero background swaps with
    it — the build acts play over the expert at her desk, the call act
    over the customer on the phone. See `onAct` below. */
export type HeroAct = "build" | "call";

export default function HeroGraph({
  className = "",
  onAct,
}: {
  className?: string;
  /** Fired when the story crosses between the build acts and the call.
      The hero uses it to crossfade its background video. */
  onAct?: (act: HeroAct) => void;
}) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(
      // Wraps to 1, not 0: beat 0 is the blank breath before the story
      // starts, and it is only earned once, on load.
      () => setI((v) => (v + 1 >= SEQUENCE.length ? 1 : v + 1)),
      SEQUENCE[i].hold,
    );
    return () => clearTimeout(t);
  }, [i, reduced]);

  const act: HeroAct = (reduced ? SEQUENCE[FROZEN] : SEQUENCE[i]).phase === "call" ? "call" : "build";
  useEffect(() => {
    onAct?.(act);
  }, [act, onAct]);

  const beat = reduced ? SEQUENCE[FROZEN] : SEQUENCE[i];
  const { phase, step } = beat;

  /* ── Session stream ──
     On screen for observe, cta and exit. During cta and exit the CTA
     button rides along at the end of the column, which pans the oldest
     line off the top — deliberately. */
  const showStream = phase === "observe" || phase === "cta" || phase === "exit";
  // step+1: the header is on screen from the first beat, so the stream
  // is never an empty frame waiting for something to happen.
  const lines =
    phase === "observe" ? SCRIPT.slice(0, Math.min(SCRIPT.length, step + 1)) : SCRIPT;
  const showSessionCta = phase === "cta" || phase === "exit";
  const exitingSession = phase === "exit";

  const kinds: (Line["kind"] | "cta")[] = [
    ...lines.map((l) => l.kind),
    ...(showSessionCta ? (["cta"] as const) : []),
  ];
  const tops: number[] = [];
  let y = 0;
  kinds.forEach((k, idx) => {
    const g = GEO[k];
    y += idx === 0 ? 0 : g.gap;
    tops.push(y);
    y += g.h;
  });
  const streamOffset = STREAM_H - FLOOR - y;

  /* ── Blueprint ──
     Pans up during launch/bpexit so the Launch button has somewhere to
     sit; the trigger node slides off under the mask as it goes. */
  const showBlueprint = phase === "blueprint" || phase === "launch" || phase === "bpexit";
  const bpPan = phase === "blueprint" ? BP_REST : -BP_PAN;
  const exitingBp = phase === "bpexit";

  /* ── Trigger ──
     The dock sits on the floor; the event lands above it. Both are
     bottom-anchored, same as the Observer. */
  const triggered = phase === "armed" && step >= 1;

  /* ── Run ──
     Rows are all present from the first run beat; step N runs row N-1,
     so everything before it is done and everything after is pending. */
  const exitingRun = phase === "runexit";
  const exitingCall = phase === "callexit";
  const runCursor = step - 1;
  const showReceipt = exitingRun || (phase === "run" && step >= RUN_STEPS.length + 1);

  /* The Executor stack, bottom-anchored like every other stream: each
     new box lands on the floor and everything above it rises. The dock
     is not replaced by the work card — it is pushed up by it, so the
     part that dispatched the run stays visible while the run happens.
     Fading it out under the card, which is what this did before, read
     as the card arriving out of a hole. */
  const running = phase === "run" || exitingRun;
  const showExec = phase === "armed" || running;
  const stacked = triggered || running;

  const execEventTop = 0;
  const execDockTop = stacked ? EVENT_H + RUN_GAP : 0;
  const execWorkTop = execDockTop + DOCK_H + RUN_GAP;
  const execReceiptTop = execWorkTop + WORK_H + RUN_GAP;
  const execTotal = running
    ? (showReceipt ? execReceiptTop + RECEIPT_H : execWorkTop + WORK_H)
    : execDockTop + DOCK_H;
  const execOffset = STREAM_H - FLOOR - execTotal;

  /* ── Expose ──
     Odd steps tick a box, even steps move the cursor to the next one, so
     nothing is ever ticked while the cursor is still travelling. */
  const exitingExpose = phase === "exexit";
  /* Every channel is ticked and the button is pressed for the whole of
     the exit — `step` resets to 0 on the new phase, which would
     otherwise un-tick the panel on its way off. */
  const exStep = exitingExpose ? EXPOSE_CHANNELS.length * 2 + 2 : step;
  const exChecked = Math.min(EXPOSE_CHANNELS.length, Math.floor((exStep + 1) / 2));
  const exOnButton = exStep >= EXPOSE_CHANNELS.length * 2;
  const exRow = Math.min(EXPOSE_CHANNELS.length - 1, Math.floor(exStep / 2));
  const exClicked = exStep % 2 === 1 && exStep <= EXPOSE_CHANNELS.length * 2 + 1;
  const exPublishing = exitingExpose || (phase === "expose" && step >= EXPOSE_CHANNELS.length * 2 + 2);
  const exOffset = STREAM_H - FLOOR - EX_TOTAL;

  /* ── Call ──
     Step 0 is the phone ringing; every step after that adds one line of
     transcript. Bottom-anchored like everything else, so the newest line
     lands on the same spot and the header pans off once the transcript
     outgrows the frame. */
  const answered = (phase === "call" && step >= 1) || exitingCall;
  const callLines = exitingCall ? CALL : CALL.slice(0, Math.max(1, Math.min(CALL.length, step)));
  const callTops: number[] = [];
  let cy = 0;
  callLines.forEach((line, idx) => {
    cy += idx === 0 ? 0 : line.gap;
    callTops.push(cy);
    cy += line.h;
  });
  const callOffset = STREAM_H - FLOOR - cy;
  const callResolved = exitingCall || (phase === "call" && step >= CALL.length);

  /* ── Status block ── */
  const observeDone = step >= SEQUENCE.filter((b) => b.phase === "observe").length - 1;
  const runDone = phase === "run" && step >= SEQUENCE.filter((b) => b.phase === "run").length - 2;

  /* Which pillar owns the frame right now. The exit phases belong to the
     act that is leaving, which is what lets the whole label block ride
     out with its own act rather than flipping to the next one early. */
  const actIndex =
    // Before the first act the timeline has no owner, so every step is
    // closed — which is also the state the first act opens out of.
    phase === "boot" || phase === "overview" || phase === "ovexit"
      ? -1
      : phase === "intro" || phase === "handoff"
      ? step
      : phase === "observe" || phase === "cta" || phase === "exit"
        ? 0
        : phase === "blueprint" || phase === "launch" || phase === "bpexit"
          ? 1
          : phase === "expose" || phase === "exexit" || phase === "call" || phase === "callexit"
            ? 3
            : 2;
  /* The four act boundaries: whatever is on screen rides out to the left
     before the next act rides in. */
  const exiting =
    phase === "exit" || phase === "bpexit" || phase === "runexit" || phase === "callexit";


  /* Whether the part is mid-task. Drives the pulse on its mark — the
     one thing in the label block that moves. */
  const working =
    exiting ||
    exPublishing ||
    (phase === "observe" && !observeDone) ||
    (phase === "armed" && !triggered) ||
    (phase === "run" && !runDone) ||
    (phase === "call" && !callResolved);


  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <div className="relative w-full" style={{ height: VIEWPORT }}>

        {/* ── The overview ──
            Every part, once, before any of them runs. Rows arrive in
            series from the right on the same travel line the acts use,
            and leave the same way — so the overview reads as the first
            beat of the story rather than as a legend bolted on front. */}
        {phase === "overview" || phase === "ovexit" ? (
          <div
            className="absolute inset-x-0"
            // Sits on the same floor every other stream does, rather
            // than centred: the overview is where the animation starts,
            // so it should start from the line the rest of it works up
            // from, not float in the middle of the frame.
            style={{
              top:
                STREAM_H -
                FLOOR -
                (OV_HEAD_H + ACTS.length * OV_ROW_H + (ACTS.length - 1) * OV_GAP),
            }}
          >
            {/* Names the stack before it builds, so the four rows read
                as one product's parts rather than as four features. It
                leads the stagger in and trails it out. */}
            <div
              className={`flex items-center gap-3 ${phase === "ovexit" ? "hg-exit" : "hg-slide-in"}`}
              style={{
                height: OV_HEAD_H,
                ...(phase === "ovexit"
                  ? { animationDelay: `${ACTS.length * OV_OUT_STAGGER}ms` }
                  : { animationDuration: `${OV_TRAVEL}ms` }),
              }}
            >
              <span className="h-[7px] w-[7px] rounded-full bg-cyan-400" />
              <span className="text-[11px] font-medium tracking-[0.14em] text-white">
                PLATFORM COMPONENTS
              </span>
            </div>

            {ACTS.map((a, idx) => (
              <div
                key={a.name}
                // Right to left, like everything else in the loop — the
                // overview is the first leg of the same line of travel,
                // not a separate opening title.
                className={`absolute inset-x-0 flex items-center gap-3.5 rounded-lg border border-white/[0.07] bg-[#0d1013]/55 px-4 backdrop-blur-sm ${
                  phase === "ovexit" ? "hg-exit" : "hg-slide-in"
                }`}
                style={{
                  top: OV_HEAD_H + idx * (OV_ROW_H + OV_GAP),
                  height: OV_ROW_H,
                  // On the way out the order reverses, so the stack
                  // unzips from the bottom instead of rewinding.
                  ...(phase === "ovexit"
                    ? { animationDelay: `${(ACTS.length - 1 - idx) * OV_OUT_STAGGER}ms` }
                    : {
                        animationDuration: `${OV_TRAVEL}ms`,
                        animationDelay: `${(idx + 1) * OV_STAGGER}ms`,
                      }),
                }}
              >
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md border border-cyan-400/45 bg-cyan-400/[0.13] text-cyan-400">
                  <PillarIcon index={a.icon} className="h-[17px] w-[17px]" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-medium tracking-[0.14em] text-white">{a.name}</div>
                  <div className="mt-1.5 text-[12px] text-white/55">{a.does}</div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* ── The session ── */}
        {showStream ? (
          // No hg-slide-in on the container: the session's first box now
          // lands on the first beat, so a container slide carried it in
          // from the right. Each row's own hg-enter takes it up instead.
          <div className="hg-viewport absolute inset-x-0 top-0 overflow-hidden" style={{ height: STREAM_H }}>
            <div
              className="absolute inset-x-0 top-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateY(${streamOffset}px)` }}
            >
              {lines.map((line, idx) => {
                const g = GEO[line.kind];
                // The branch runs through every sub-line and stops halfway
                // down the last one, where its tick comes off.
                const lastSub = g.sub && !(lines[idx + 1] && GEO[lines[idx + 1].kind].sub);
                const tickY = g.tick ?? g.h / 2;
                return (
                  <div
                    key={`${line.kind}-${idx}`}
                    className={`absolute inset-x-0 ${exitingSession ? "hg-exit" : "hg-enter"}`}
                    style={{
                      top: tops[idx],
                      paddingLeft: g.sub ? INDENT : 0,
                      // Exit runs top-to-bottom, one line after the next.
                      animationDelay: exitingSession ? `${idx * 85}ms` : undefined,
                    }}
                  >
                    {g.sub ? (
                      <>
                        <span
                          className="hg-line absolute w-px bg-white/15"
                          style={{ left: RAIL_X, top: -g.gap, height: g.gap + (lastSub ? tickY : g.h) }}
                        />
                        <span
                          className="absolute h-px bg-white/15"
                          style={{ left: RAIL_X, top: tickY, width: INDENT - RAIL_X - 6 }}
                        />
                      </>
                    ) : null}
                    <LineRow line={line} />
                  </div>
                );
              })}

              {showSessionCta ? (
                <div
                  className={`absolute inset-x-0 ${exitingSession ? "hg-exit" : "hg-enter"}`}
                  style={{
                    top: tops[tops.length - 1],
                    animationDelay: exitingSession ? `${lines.length * 85}ms` : undefined,
                  }}
                >
                  <FakeButton label="Create Blueprint" pressed={phase === "cta" && step >= 1} />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* ── The blueprint ── */}
        {showBlueprint ? (
          <div className="hg-slide-in hg-viewport absolute inset-x-0 top-0 overflow-hidden" style={{ height: STREAM_H }}>
            <div
              className="absolute inset-x-0 top-0 transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateY(${bpPan}px)` }}
            >
              <div className="relative" style={{ height: BP_H }}>
                <div className="absolute inset-0">
                  {BP_LINKS.map((link, idx) => (
                    <span
                      key={idx}
                      className={`${link.w ? "hg-line-h h-px" : "hg-line w-px"} absolute bg-white/25 ${
                        exitingBp ? "hg-exit" : ""
                      }`}
                      style={{
                        left: link.x,
                        top: link.y,
                        height: link.len,
                        width: link.w,
                        // Links draw just behind the node they lead into.
                        animationDelay: exitingBp
                          ? `${BP_EXIT_LEAD + idx * 45}ms`
                          : `${300 + idx * 90}ms`,
                      }}
                    />
                  ))}
                  {BP_JOINTS.map((joint) => (
                    <span
                      key={joint.y}
                      className={`absolute h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 ${
                        exitingBp ? "hg-exit" : "hg-enter"
                      }`}
                      style={{
                        left: "50%",
                        top: joint.y,
                        animationDelay: exitingBp ? `${BP_EXIT_LEAD}ms` : "900ms",
                      }}
                    />
                  ))}
                  {BP_NODES.map((node, idx) => (
                    <div
                      key={node.id}
                      className={`absolute ${exitingBp ? "hg-exit" : "hg-enter"}`}
                      style={{
                        top: node.y,
                        height: node.h,
                        left: node.x ?? 0,
                        width: node.w ?? "100%",
                        animationDelay: exitingBp
                          ? `${BP_EXIT_LEAD + idx * 85}ms`
                          : `${idx * 150}ms`,
                      }}
                    >
                      <BpBox node={node} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch — lands once the sheet has panned up for it. */}
              {phase === "launch" || exitingBp ? (
                <div
                  className={`absolute inset-x-0 ${exitingBp ? "hg-exit" : "hg-enter"}`}
                  style={{
                    top: BP_CTA_Y,
                    animationDelay: exitingBp ? `${BP_EXIT_LEAD + BP_NODES.length * 85}ms` : undefined,
                  }}
                >
                  <FakeButton label="Launch Workflow" pressed={phase === "launch" && step >= 1} />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* ── The Executor: armed, triggered, then running ──
            One container across all three, not two that swap. Boxes
            land on the floor and push what is above them up, the same
            way the Observer session and the call transcript build. */}
        {showExec ? (
          <div className="hg-viewport absolute inset-x-0 top-0 overflow-hidden" style={{ height: STREAM_H }}>
            <div
              className="absolute inset-x-0 top-0 transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateY(${execOffset}px)` }}
            >
              {/* The event that caused the run. Enters once, on the
                  trigger, and holds its place from there. */}
              {stacked ? (
                <div
                  className={`absolute inset-x-0 ${exitingRun ? "hg-exit" : "hg-enter"}`}
                  style={{ top: execEventTop }}
                >
                  <EventRow />
                </div>
              ) : null}

              {/* Glides to its slot rather than snapping: the container
                  offset above is already transitioning, so a hard `top`
                  change fought it and the dock lurched. */}
              <div
                className={`absolute inset-x-0 transition-[top] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  exitingRun ? "hg-exit" : "hg-enter"
                }`}
                style={{ top: execDockTop, animationDelay: exitingRun ? "60ms" : undefined }}
              >
                <ExecDock triggered={stacked} />
              </div>

              {running ? (
                <div
                  className={`absolute inset-x-0 ${exitingRun ? "hg-exit" : "hg-enter"}`}
                  style={{ top: execWorkTop, animationDelay: exitingRun ? "120ms" : undefined }}
                >
                  <WorkCard cursor={Math.min(runCursor, RUN_STEPS.length - 1)} done={showReceipt} />
                </div>
              ) : null}

              {running && showReceipt ? (
                <div
                  className={`absolute inset-x-0 ${exitingRun ? "hg-exit" : "hg-enter"}`}
                  style={{ top: execReceiptTop, animationDelay: exitingRun ? "180ms" : undefined }}
                >
                  <span className="mx-auto flex h-[30px] w-fit items-center gap-2 rounded-md border border-cyan-400/50 bg-cyan-400/[0.16] px-3.5 text-[11px] text-cyan-200 backdrop-blur-md">
                    <span className="h-[5px] w-[5px] rounded-full bg-cyan-400" />
                    2.4s · $0.31 · 5/5 steps · gates passed
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* ── Expose to customers ── */}
        {phase === "expose" || exitingExpose ? (
          <div className="hg-viewport absolute inset-x-0 top-0 overflow-hidden" style={{ height: STREAM_H }}>
            <div className="absolute inset-x-0" style={{ top: exOffset }}>
              {/* Rides out to the left once published, the way every
                  other section hands the frame over — it used to just
                  vanish when the call mounted. */}
              <div
                className={`absolute inset-x-0 ${exitingExpose ? "hg-exit" : "hg-enter"}`}
                style={{ top: 0 }}
              >
                <ExposeCard checked={exChecked} />
              </div>
              <div
                className={`absolute inset-x-0 ${exitingExpose ? "hg-exit" : "hg-enter"}`}
                style={{ top: EX_CTA_Y, animationDelay: exitingExpose ? "90ms" : "180ms" }}
              >
                <FakeButton label="Go live" pressed={exStep >= EXPOSE_CHANNELS.length * 2 + 1} />
              </div>
            </div>
          </div>
        ) : null}

        {/* ── The call ── */}
        {phase === "call" || exitingCall ? (
          <div className="hg-viewport absolute inset-x-0 top-0 overflow-hidden" style={{ height: STREAM_H }}>
            <div
              className="absolute inset-x-0 top-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateY(${callOffset}px)` }}
            >
              {callLines.map((line, idx) => (
                <div
                  key={`${line.kind}-${idx}`}
                  className={`absolute inset-x-0 ${exitingCall ? "hg-exit" : "hg-enter"}`}
                  style={{ top: callTops[idx], animationDelay: exitingCall ? `${idx * 70}ms` : undefined }}
                >
                  {line.kind === "head" ? (
                    <CallHead answered={answered} />
                  ) : (
                    // A line is settled once anything has landed after it —
                    // which is what turns the lookup from spinning to done.
                    <CallLine line={line} done={idx < callLines.length - 1} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Cursor — outside the streams so no mask ever clips it. */}
        {phase === "cta" ? (
          <div
            className="absolute left-1/2 z-10"
            style={{ top: streamOffset + tops[tops.length - 1] + GEO.cta.h / 2 }}
          >
            <Cursor clickKey={step >= 1 ? "cta" : undefined} />
          </div>
        ) : null}
        {phase === "launch" ? (
          <div className="absolute left-1/2 z-10" style={{ top: bpPan + BP_CTA_Y + 22 }}>
            <Cursor clickKey={step >= 1 ? "launch" : undefined} />
          </div>
        ) : null}
        {phase === "expose" && !exPublishing ? (
          // One cursor, four targets: it glides between the checkboxes and
          // then down to the button, rather than teleporting.
          <div
            className="absolute z-10 transition-[top,left] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: exOnButton ? "50%" : EX_CURSOR_X,
              top: exOnButton
                ? exOffset + EX_CTA_Y + 22
                : exOffset + EX_ROWS_Y + exRow * EX_ROW_PITCH + EX_ROW_H / 2,
            }}
          >
            <Cursor clickKey={exClicked ? step : undefined} />
          </div>
        ) : null}

        {/* ── The step timeline ──
            All four parts, always on screen, hanging off one rail: the
            three that are not running are a marker and nothing else,
            and the one that is opens into the full box. So the frame
            always answers "which of the four is this?" without the
            visitor having had to watch the overview.

            The rail is on top and the markers hang below it, which is
            what makes a row of icons read as a sequence rather than as
            a toolbar.

            A handover is a morph in three legs, one per beat, and the
            box never leaves the frame: the open box collapses onto its
            own mark (handoff), the four marks redistribute along the
            rail (handoff), and the next one opens out of its mark
            (intro). Sliding the box off to the left and a new one in
            from the right was the earlier attempt; it read as two
            unrelated objects rather than as one timeline advancing. */}
        <div
          className={`absolute bottom-0 transition-opacity duration-500 ${
            phase === "boot" || phase === "overview" || phase === "ovexit" ? "opacity-0" : ""
          }`}
          // The rail overruns the animation on both sides, so it reads
          // as a track the four steps sit on rather than as the bottom
          // edge of a panel that happens to be their width.
          style={{ left: -TL_BLEED, right: -TL_BLEED, height: FOOTER_H }}
        >
          {/* Both ends of the rail fade out rather than stopping dead —
              a hard terminus reads as the edge of a panel, a fade reads
              as a track that carries on past the frame. Masked as one
              layer so the progress fill fades with it. */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
            {/* How far through the four parts the loop has got. */}
            <div
              className="absolute left-0 top-0 h-px bg-cyan-400/50 transition-[width] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${(Math.max(actIndex, -1) + 1) / ACTS.length * 100}%` }}
            />
          </div>

          {/* The markers stay inside the animation's own column; only
              the rail runs past it. */}
          <div
            className="absolute flex items-start"
            style={{ left: TL_BLEED, right: TL_BLEED, top: TL_STEM, gap: TL_GAP }}
          >
            {ACTS.map((a, idx) => {
              // Mid-handover nothing is open: the marks spread evenly
              // along the rail, which is the resting state the next act
              // opens out of.
              const closedRow = actIndex < 0 || phase === "handoff";
              const open = !closedRow && idx === actIndex;
              const lit = idx <= actIndex;

              // Anchor: the centre of this step's mark. It sits at the
              // slot's left edge when closed and behind the box's
              // padding when open, so stem and dot travel with it.
              // +1 for the card's own 1px border, which only exists in
              // the open state.
              const anchor = open ? 1 + TL_PAD + TL_DOT / 2 : TL_DOT / 2;

              return (
                <div
                  key={a.name}
                  className="relative shrink-0 transition-[width] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: open
                      ? `calc(100% - ${(ACTS.length - 1) * (TL_DOT + TL_GAP)}px)`
                      : closedRow
                        ? `calc((100% - ${(ACTS.length - 1) * TL_GAP}px) / ${ACTS.length})`
                        : TL_DOT,
                  }}
                >
                  {/* The dot on the rail, and the stem down from it. The
                      stem is 1px at `anchor`, so its centre is anchor +
                      0.5; the 5px dot is offset by 2 to match. */}
                  <span
                    className={`absolute h-[5px] w-[5px] rounded-full transition-[left,background-color] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      lit ? "bg-cyan-400" : "bg-white/30"
                    }`}
                    style={{ left: anchor - 2, top: -TL_STEM - 2 }}
                  />
                  <span
                    className={`absolute w-px transition-[left,background-color] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      lit ? "bg-cyan-400/40" : "bg-white/[0.12]"
                    }`}
                    style={{ left: anchor, top: -TL_STEM, height: TL_STEM }}
                  />

                  {/* One element in both states. Closed it is the size
                      of the mark and carries none of the panel's own
                      chrome; open it is the box. */}
                  {/* The ring lives on the card, in both states — it is
                      the element `overflow-hidden` clips *to*, so it can
                      never clip itself. Putting it on the mark inside
                      meant that at any width where the card's content
                      box was narrower than the mark, the mark's right
                      edge was cut, which is what made the border blink
                      out partway through the collapse. */}
                  <div
                    className="flex items-center gap-3 overflow-hidden border-solid backdrop-blur-sm transition-[height,border-radius,padding,background-color,border-color] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      width: open ? "100%" : TL_DOT,
                      height: open ? OV_ROW_H : TL_DOT,
                      borderRadius: open ? 10 : 999,
                      borderWidth: 1,
                      paddingLeft: open ? TL_PAD : 0,
                      paddingRight: open ? TL_PAD : 0,
                      borderColor: open
                        ? "rgba(255,255,255,0.07)"
                        : lit
                          ? "rgba(34,211,238,0.40)"
                          : "rgba(255,255,255,0.12)",
                      backgroundColor: open
                        ? "rgba(13,16,19,0.55)"
                        : lit
                          ? "rgba(34,211,238,0.10)"
                          : "rgba(13,16,19,0.55)",
                    }}
                  >
                    {/* 2px narrower when closed, so it always fits the
                        card's content box exactly. */}
                    <span
                      className={`grid shrink-0 place-items-center border-solid transition-[width,height,border-radius,border-width,border-color,background-color,color] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        open ? "text-cyan-400" : lit ? "text-cyan-400/60" : "text-white/25"
                      } ${open && working ? "hg-mark-pulse" : ""}`}
                      style={{
                        height: open ? TL_DOT : TL_DOT - 2,
                        width: open ? TL_DOT : TL_DOT - 2,
                        borderRadius: open ? 6 : 999,
                        borderWidth: open ? 1 : 0,
                        borderColor: open ? "rgba(34,211,238,0.45)" : "transparent",
                        backgroundColor: open ? "rgba(34,211,238,0.13)" : "transparent",
                      }}
                    >
                      <PillarIcon index={a.icon} className="h-[17px] w-[17px]" />
                    </span>

                    {/* The label rides the morph: it is the first thing
                        gone on the way in and the last thing back. */}
                    <div
                      className="min-w-0 flex-1 transition-opacity duration-300"
                      style={{ opacity: open ? 1 : 0 }}
                    >
                      <div className="whitespace-nowrap text-[11px] font-medium tracking-[0.14em] text-white">
                        {a.name}
                      </div>

                      {/* What the part does, and only that. A live
                          status chip (CAPTURING, RUNNING…) sat beside
                          the name and competed with the animation for
                          the same job — the animation is already
                          showing what is happening.

                          Sentence case, so no letter-spacing: the
                          0.14em the name carries is for caps, and on a
                          mixed-case line of this length it reads as a
                          gap between every letter. */}
                      <p className="mt-1.5 whitespace-nowrap text-[10.5px] text-white/55">
                        {a.does}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
