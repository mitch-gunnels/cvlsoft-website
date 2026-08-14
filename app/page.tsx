"use client";

/**
 * Home — a structural recreation of skan.ai's homepage.
 *
 * Layout and section order are taken from skan.ai:
 *   • flat, square-cornered cards on a tinted surface — no rounding, no shadow
 *   • full-bleed accent band for the results stats
 *   • dark section with a sticky three-step tab bar
 *   • carousels with prev/next arrows
 *
 * The ornament is NOT theirs. Where skan.ai frames things in corner brackets,
 * this uses AIOS's own node-on-a-rail — see the Primitives block below.
 *
 * Differences from the source, per request: copy is lorem ipsum, the accent is
 * cyan instead of purple, and every image is a <Ph> placeholder. The five
 * pillar names (Observer / Blueprint / Executor / Communicator / Controller)
 * are kept as card labels so the real product structure is still legible.
 */

import { FormEvent, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/app/lib/analytics";
import { useLeadForm, REQUIRED_FIELDS } from "@/app/lib/useLeadForm";
import { LeadFields } from "@/app/components/LeadFields";
import { FormStatusDialog, type FormStatus } from "@/app/components/FormStatusDialog";
import SiteHeader from "@/app/components/SiteHeader";
import HeroGraph, { type HeroAct } from "@/app/components/HeroGraph";
import PillarIcon from "@/app/components/PillarIcon";
import LinkMark from "@/app/components/LinkMark";
import { BTN_DARK, BTN_SOLID } from "@/app/lib/buttons";

type DemoStatus = FormStatus;

/* ────────────────────────────────────────────────────────────
   Primitives
   ──────────────────────────────────────────────────────────── */

/* ── The AIOS mark: node on a rail ──────────────────────────
   Replaces skan.ai's corner brackets. Taken from what the site already
   owned — the old SectionScrollLine (a glowing cyan node riding a vertical
   hairline) and the hero spiral's pulse dots traveling along flow paths.
   A node marks the point of interest; a rail carries it. Reads as signal
   and telemetry rather than camera viewfinder.
   ──────────────────────────────────────────────────────────── */

/** The node itself — a glowing cyan dot. Heads every rail. */
function Node({ tone = "light", className = "" }: { tone?: "light" | "dark" | "accent"; className?: string }) {
  const fill =
    tone === "dark"
      ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
      : tone === "accent"
        ? "bg-[#0f1419]"
        : "bg-cyan-600 shadow-[0_0_8px_rgba(8,145,178,0.45)]";
  return <span className={`inline-block h-[7px] w-[7px] shrink-0 rounded-full ${fill} ${className}`} />;
}

/** Section eyebrow: node + label. Sentence case — the label is a short
    phrase, and set in caps it read as a system status rather than the
    start of a thought. Letter-spacing goes with the caps: 0.06em is for
    uppercase, and on a mixed-case line it only pulls the words apart. */
/** The one control glyph on the page that means "bigger". Two strokes,
    so it reads at 16px and cannot be mistaken for a close mark. */
function Plus({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function Eyebrow({
  children,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p className={`flex items-center gap-3.5 ${className}`}>
      <LinkMark tone={tone} />
      <span
        className={`text-[14px] font-medium tracking-[0] ${
          tone === "dark" ? "text-slate-300" : "text-slate-900"
        }`}
      >
        {children}
      </span>
    </p>
  );
}

/**
 * Image placeholder. Square corners, hatched fill, centered label — pass `src`
 * once real art exists and the same slot renders the image at the same size.
 */
function Ph({
  label,
  ratio = "16 / 10",
  tone = "light",
  src,
  className = "",
  quiet = false,
  overlay,
}: {
  label: string;
  ratio?: string;
  tone?: "light" | "dark" | "accent";
  src?: string;
  className?: string;
  /** Corner-anchored label instead of a centered one — for full-bleed backdrops
      where a centered caption would collide with the copy sitting on top. */
  quiet?: boolean;
  overlay?: React.ReactNode;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
        <img src={src} alt={label} className="h-full w-full object-cover" />
        {overlay}
      </div>
    );
  }

  const surface =
    tone === "dark"
      ? "bg-[#1a1e22] text-slate-500"
      : tone === "accent"
        ? "bg-cyan-100 text-cyan-800"
        : "bg-[#e9edea] text-slate-500";
  const hatch =
    tone === "dark" ? "rgba(255,255,255,0.045)" : tone === "accent" ? "rgba(8,145,178,0.10)" : "rgba(15,23,42,0.045)";

  return (
    <div
      className={`relative overflow-hidden ${surface} ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Image placeholder: ${label}`}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, ${hatch} 0 1px, transparent 1px 12px)` }}
      />
      {quiet ? (
        <p className="absolute bottom-5 right-6 text-[11px] uppercase tracking-[0.16em] opacity-70">{label}</p>
      ) : (
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-8 w-8 opacity-60">
              <rect x="3" y="4" width="18" height="16" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="m21 16-4.5-5L9 20" />
            </svg>
            <p className="mt-3 text-[11px] uppercase tracking-[0.16em]">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
}



/** A partner mark plus its wordmark. The brand SVGs carry their own colors;
    `grayscale` flattens them so the row reads as one list rather than seven
    competing logos, and hover returns the color for anyone who looks twice. */
function PartnerLogo({ brand }: { brand: { name: string; file: string } }) {
  return (
    <span className="group flex shrink-0 items-center gap-2.5">
      <img
        src={`/partners/${brand.file}`}
        alt=""
        aria-hidden="true"
        className="h-5 w-5 shrink-0 opacity-70 grayscale transition duration-200 group-hover:opacity-100 group-hover:grayscale-0"
      />
      <span className="whitespace-nowrap text-[15px] font-medium tracking-tight text-slate-700">
        {brand.name}
      </span>
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   Content — lorem ipsum stand-in copy
   ──────────────────────────────────────────────────────────── */

/* Hero background media. The video plays on a loop; the image is its poster —
   shown while the video buffers, and served instead of it to anyone who has
   asked for reduced motion. Set HERO_VIDEO to null to use the still alone.
   Both encodes carry a 1s crossfade into their own opening frame, so the loop
   has no visible seam (see the ffmpeg recipe in README/commit notes). */
const HERO_VIDEO: { webm: string; mp4: string } | null = {
  webm: "/videos/hero.webm",
  mp4: "/videos/hero.mp4",
};
const HERO_IMAGE: string | null = "/header_image.png";

/* The architecture diagram, beside the cognitive-core claim. It is a
   1672×941 export of dense small type: readable full-bleed, not readable
   at half a column, which is the whole reason it opens. */
const ARCH_IMAGE = "/aios_arch.png";
const ARCH_ALT =
  "The AIOS platform architecture: trust, governance and observability over configuration and orchestration, agentic execution and connectors, the surfaces and triggers work arrives on, and the platform infrastructure underneath.";

/* Second background, for the call act of the hero animation: the customer
   on the phone rather than the expert at her desk. HeroGraph reports which
   act is on screen (see its `onAct` prop) and the two crossfade.

   Encoded from the supplied `customer_call.mp4` the same way as the first
   plate — 1600×900, 24fps, with the last second crossfaded into the opening
   frame so the loop has no seam. Set to null to hold the first plate for
   the whole animation. Brief: docs/hero-call-video-brief.md. */
const HERO_VIDEO_CALL: { webm: string; mp4: string } | null = {
  webm: "/videos/hero-call.webm",
  mp4: "/videos/hero-call.mp4",
};

/* Third background, for the Customer Memory act: the same customer, six
   weeks later, on a text thread rather than a call. Encoded from the
   supplied `customer_text.mp4` on exactly the recipe the call plate uses
   — 1600×900, 24fps, last second crossfaded into the opening frame — so
   the three plates cut together. Null holds whichever plate is up. */
const HERO_VIDEO_TEXT: { webm: string; mp4: string } | null = {
  webm: "/videos/hero-text.webm",
  mp4: "/videos/hero-text.mp4",
};

/* Closing-CTA background — "the floor after". Encoded from the supplied
   `aios_helps.mp4` on the same recipe as the hero plates: 24fps, no audio
   track at all, and the last second crossfaded into the opening frame so
   the loop has no seam. Brief: docs/demo-cta-video-brief.md. Null holds
   the flat #15181b the section paints underneath. */
const CTA_VIDEO: { webm: string; mp4: string } | null = {
  webm: "/videos/cta.webm",
  mp4: "/videos/cta.mp4",
};

/* Risk reversal, not social proof. `kind` states the question the buyer is
   actually asking; the stat answers it. */
const TRUST_STATS = [
  { kind: "If it fails", stat: "$0", label: "You never pay for failed agentic executions" },
  { kind: "Time to production", stat: "4 weeks", label: "From first observation to production deployment" },
  { kind: "What you maintain", stat: "1 core", label: "One cognitive core, not a hundred brittle agents" },
];

/* The parts of the core, in the order the hero animates them.

   `icon` indexes PillarIcon and is carried explicitly rather than taken
   from array position: the glyph set still holds the Controller mark at
   4, which nothing on this page shows any more, so Customer Memory's 5
   would come out as a gate if position picked the glyph. */
const PILLARS = [
  {
    icon: 0,
    label: "OBSERVER",
    title: "Capture what process documents miss",
    body: "AIOS watches your experts work, records what they open, decide, and do, then asks why. It captures the judgment that makes the work repeatable.",
  },
  {
    icon: 1,
    label: "BLUEPRINT",
    title: "Turn expertise into an approved workflow",
    body: "Each session becomes a plain-language workflow: steps, systems, decisions, and reasoning. Nothing is hidden in a prompt. Your team reviews it before execution.",
  },
  {
    icon: 2,
    label: "EXECUTOR",
    title: "Run autonomously within your rules",
    body: "Workflows trigger automatically and operate within the limits you set. Exceptions route to a person with the full case and a recommended action.",
  },
  {
    icon: 3,
    label: "COMMUNICATOR",
    title: "Deliver resolution on every channel",
    body: "Deploy the same approved workflow across voice, chat, SMS, ChatGPT, and Claude. Customers get resolution without a transfer, callback, or status update.",
  },
  {
    icon: 5,
    label: "CUSTOMER MEMORY",
    title: "Continue every conversation without restarting",
    body: "Every interaction records decisions, commitments, preferences, and next steps. The next conversation starts with context, not repetition.",
  },
];


const STEPS = [
  {
    key: "captured",
    tab: "Captured.",
    icon: 1,
    caption: "We learn the work, not a prompt",
    body: "This is how a loan team actually chases post-approval conditions: pull the open items from Encompass, decide which ones belong to the borrower, open the Salesforce task, send the text, and follow up at the right time. AIOS captures the steps and the judgment behind them in a graph the team can read. No prompt engineering. No code.",
    image: "/product-tour/01-captured-v3.webp",
    alt: "The AIOS Workflow Studio showing the Post-Approval Stips Chase graph: an Encompass pull, a classify step, a fork into a Salesforce task and an SMS to the borrower, then a 24-hour timed gate.",
    focus: { x: "50%", y: "53%" },
  },
  {
    key: "approved",
    tab: "Approved.",
    /* 04 is the gate glyph — the only pillar mark that means "nothing
       passes without permission", and nothing else on the page uses it. */
    icon: 4,
    caption: "Your rules stay in charge",
    body: "Before anything is written back, the work pauses with the person you named. They see what AIOS has done, what it wants to do next, and the evidence behind the decision.",
    alt: "The AIOS approval drawer, paused on \"Loan officer approves the write-back — awaiting approval\", with completed steps above it and two steps queued up next.",
    image: "/product-tour/02-approved-v4.webp",
    focus: { x: "72%", y: "50%" },
  },
  {
    key: "run",
    tab: "Run.",
    icon: 2,
    caption: "Automation leaves a record",
    body: "Once approved, the same knowledge runs the process across the systems already in place. Every step, decision, connector call, and result stays attached to the graph. Six months later, when someone asks why a condition was cleared, the answer is there. Nobody has to reconstruct it from logs or memory.",
    image: "/product-tour/03-run-v2.webp",
    alt: "The AIOS run monitor trace: the workflow's steps in order, each with its node type, duration, and the connector calls made underneath it.",
    focus: { x: "58%", y: "57%" },
  },
  {
    key: "answered",
    tab: "Answered.",
    icon: 3,
    caption: "Now the customer can use it too",
    body: "With one click, the loan team can make this approved process available to borrowers by phone or text. It is not a second agent with a copied prompt. It is the same knowledge, rules, context, and audit trail, so the customer gets an answer without a transfer, a callback, or another explanation.",
    image: "/product-tour/04-answered-v7.webp",
    alt: "An AIOS conversation transcript: the stips assistant and the borrower on a voice call, with both the voice and SMS threads listed behind it.",
    focus: { x: "78%", y: "48%" },
  },
];

/* Four controls, not four adjectives. Each one is a thing an auditor can be
   shown — a gate, a signature, a log, a switch — because the section has to
   survive a security review, not just read well. */
const SECURITY_POINTS = [
  {
    title: "Every action is policy-gated",
    body: "AIOS plans before it executes. Each tool call is checked against a deterministic policy engine, with per-tenant overrides, before it touches a system of record.",
  },
  {
    title: "A person signs the steps that matter",
    body: "Put an approval gate on any step. The run pauses, a named person decides, and the decision is recorded alongside the execution it authorized.",
  },
  {
    title: "An immutable audit ledger",
    body: "Every action, input, and output is written to an append-only log. Months after the fact, reconstruct exactly what ran, on whose authority, and why.",
  },
  {
    title: "Kill switches and circuit breakers",
    body: "Halt one execution or the entire tenant instantly. Breakers trip on their own when cost, error rate, or scope leaves the band you set.",
  },
];

/* Restored from the pre-redesign home page, where it sat under the hero.
   It belongs beside Trust & Security instead: who the models come from and
   what the platform runs on is the same question as who governs it. */
const PARTNER_GROUPS = [
  {
    eyebrow: "Working with",
    items: [
      { name: "OpenAI", file: "openai.svg" },
      { name: "Anthropic", file: "anthropic.svg" },
      { name: "Google", file: "google.svg" },
      { name: "Microsoft", file: "microsoft.svg" },
    ],
  },
  {
    eyebrow: "Built on",
    items: [
      { name: "AWS", file: "amazonwebservices.svg" },
      { name: "MongoDB", file: "mongodb.svg" },
      { name: "Next.js", file: "nextjs.svg" },
    ],
  },
];

/* Shared content container — a centered 1320px measure, matching skan.ai's
   (~60px gutters at a 1440 viewport). Section backgrounds stay full-bleed;
   only the content inside them is constrained. */
const GUTTER = "mx-auto w-full max-w-[1320px] px-6 sm:px-10 lg:px-[60px]";


/* ────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────── */

export default function Home() {
  const form = useLeadForm();
  const [formStatus, setFormStatus] = useState<DemoStatus>("idle");
  const [formMessage, setFormMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  /* Which act of the hero animation is on screen, so the background can
     change with it. HeroGraph reports it; see HERO_VIDEO_CALL. */
  const [heroAct, setHeroAct] = useState<HeroAct>("build");
  const callVideoRef = useRef<HTMLVideoElement>(null);
  const textVideoRef = useRef<HTMLVideoElement>(null);
  /** The architecture diagram, opened full size. */
  const [archOpen, setArchOpen] = useState(false);

  /* Escape closes it and the page underneath stops scrolling while it is
     open — a full-screen overlay that lets the page move behind it reads
     as broken the first time anyone touches a trackpad. */
  useEffect(() => {
    if (!archOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setArchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [archOpen]);

  /* A customer plate has to start at its first frame every time the story
     reaches its act — otherwise it dissolves in at whatever point its
     own loop happens to be at, and the man is mid-sentence before the
     phone has rung.

     It keeps playing the whole time rather than being paused while
     hidden: a paused video can stall on the seek, and a stalled video
     paints nothing, so the dissolve would come up from black instead of
     between two live frames. Seeking a video that is already playing and
     fully buffered is instant, and the first ~150ms of the dissolve is
     under 10% opacity anyway, which covers any hitch.

     Chrome power-saves "video-only background media": a muted, audio-less
     video that isn't visible gets paused on its own, so the plate we cut to
     is usually paused by the time its act arrives, and the play() we fire on
     the cut can be interrupted by that same power-save pause — an
     unhandled rejection in the console. So: swallow the rejection, and
     re-arm on pause while this act is on screen. Once the plate is actually
     visible the browser stops pausing it, so the retry settles after a beat
     rather than looping; the counter is the backstop for the case where it
     doesn't (a hidden tab), and the listener is torn down on act change. */
  useEffect(() => {
    const video =
      heroAct === "call"
        ? callVideoRef.current
        : heroAct === "text"
          ? textVideoRef.current
          : null;
    if (!video) return;
    video.currentTime = 0;

    let retries = 0;
    const start = () => {
      video.play().catch(() => {});
    };
    const onPause = () => {
      if (document.hidden || retries >= 3) return;
      retries += 1;
      start();
    };

    start();
    video.addEventListener("pause", onPause);
    return () => video.removeEventListener("pause", onPause);
  }, [heroAct]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (formStatus !== "success") return;
    const timer = setTimeout(() => {
      setFormStatus("idle");
      setFormMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [formStatus]);

  /* Sticky tab bar tracks whichever step block is under it, the way skan's
     Scan/Distill/Deploy bar does as you scroll the dark section. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-step-index"));
            if (!Number.isNaN(idx)) setActiveStep(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleCtaClick(location: string) {
    trackEvent("bold_claim_cta_click", { location });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");

    const errs = form.validateAll();
    const firstInvalid = REQUIRED_FIELDS.find((f) => errs[f]);
    if (firstInvalid) {
      // Field-level problems stay on the fields. Only a submit that actually
      // reached the API — or failed to — is worth a dialog over the page.
      setFormStatus("idle");
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setFormStatus("loading");

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form.values, source: "website_v3" }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };
      trackEvent("demo_form_submit", { status: response.ok ? "success" : "error" });

      if (!response.ok) {
        setFormStatus("error");
        setFormMessage(data.message ?? "Unable to submit demo request.");
        return;
      }

      setFormStatus("success");
      setFormMessage(data.message ?? "Thanks. We will follow up to schedule your demo.");
      form.reset();
    } catch {
      setFormStatus("error");
      setFormMessage("Network error. Please try again.");
      trackEvent("demo_form_submit", { status: "error" });
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white text-[#0f1419]">
      <SiteHeader />

      <main id="top">
        {/* ══ 01 · HERO ══
            Full-bleed media behind left-aligned copy, two-tone headline, HUD
            annotations floating over the right half. */}
        <section data-tone="dark" className="relative flex min-h-[810px] items-center overflow-hidden bg-[#15181b]">
          <div className="absolute inset-0">
            {/* object-right keeps the subject in frame when the section is taller
                than the media's 2:1 — the left of the shot is empty anyway, so
                that's the side that should get cropped. */}
            {HERO_VIDEO ? (
              <video
                className={`absolute inset-0 h-full w-full object-cover object-right transition-opacity duration-[1500ms] ease-in-out motion-reduce:hidden ${
                  (heroAct === "call" && HERO_VIDEO_CALL) ||
                  (heroAct === "text" && HERO_VIDEO_TEXT)
                    ? "opacity-0"
                    : "opacity-100"
                }`}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={HERO_IMAGE ?? undefined}
                aria-hidden="true"
              >
                {/* WebM first — browsers pick the first type they support. */}
                <source src={HERO_VIDEO.webm} type="video/webm" />
                <source src={HERO_VIDEO.mp4} type="video/mp4" />
              </video>
            ) : null}
            {/* Call act: the customer on the phone. Stacked over the first
                background and crossfaded in when HeroGraph reaches the call.
                It plays throughout — starting it on the cut would show a
                black frame while it buffers. */}
            {HERO_VIDEO_CALL ? (
              <video
                ref={callVideoRef}
                className={`absolute inset-0 h-full w-full object-cover object-right transition-opacity duration-[1500ms] ease-in-out motion-reduce:hidden ${
                  heroAct === "call" ? "opacity-100" : "opacity-0"
                }`}
                // Plays from load and never pauses — see the effect above for
                // why. It is only ever seeked back to zero, never started.
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
              >
                <source src={HERO_VIDEO_CALL.webm} type="video/webm" />
                <source src={HERO_VIDEO_CALL.mp4} type="video/mp4" />
              </video>
            ) : null}
            {/* Customer Memory act: the same customer on a text thread.
                Same treatment as the call plate — stacked, always
                playing, crossfaded in when HeroGraph reaches the act. */}
            {HERO_VIDEO_TEXT ? (
              <video
                ref={textVideoRef}
                className={`absolute inset-0 h-full w-full object-cover object-right transition-opacity duration-[1500ms] ease-in-out motion-reduce:hidden ${
                  heroAct === "text" ? "opacity-100" : "opacity-0"
                }`}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
              >
                <source src={HERO_VIDEO_TEXT.webm} type="video/webm" />
                <source src={HERO_VIDEO_TEXT.mp4} type="video/mp4" />
              </video>
            ) : null}
            {/* Still fallback: the only media when there's no video, and the
                motion-reduce substitute when there is. */}
            {HERO_IMAGE ? (
              <img
                src={HERO_IMAGE}
                alt=""
                aria-hidden="true"
                className={`h-full w-full object-cover object-right ${
                  HERO_VIDEO ? "hidden motion-reduce:block" : ""
                }`}
              />
            ) : !HERO_VIDEO ? (
              <Ph label="Hero background image / video, 2400×1200" ratio="2 / 1" tone="dark" quiet className="h-full w-full" />
            ) : null}
            {/* The shot already falls to black on the left, so this scrim only
                needs to hold text contrast — not build the darkness. */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#15181b] via-[#15181b]/60 to-transparent" />
            {/* Narrow screens crop past the empty left side and put the subject
                directly behind the headline, so push her back there only. */}
            <div className="absolute inset-0 bg-[#15181b]/55 md:hidden" />
          </div>

          {/* ── The story, over the media ──
              The Observer watches an expert and captures not just what she
              did but why → that becomes a blueprint → the blueprint is
              launched, armed, and run by an inbound event → then a customer
              phones about the same case and the same workflow answers them.
              See HeroGraph.tsx for the timeline. Sits over the subject's
              torso — the darkest, quietest part of the frame.

              Desktop only: the column is a fixed 400px, so below 1074px it
              has nowhere to sit that isn't on top of the copy, and it goes
              away entirely. Above that it is pinned 20px off the right edge
              at every width — being trialled against the older behaviour,
              where it eased inboard as the viewport grew. */}
          <HeroGraph
            onAct={setHeroAct}
            className="absolute bottom-[calc(8%-55px)] right-5 hidden w-[400px] min-[1074px]:block"
          />

          <div className={`relative z-10 w-full ${GUTTER} py-24`}>
            {/* Two-tone: muted clause sets up the contrast, white clause is the
                claim. Keep both halves short — this renders at up to 4.5rem. */}
            {/* Each clause is its own block so the tone change always falls on a
                line break — inline, the two halves collide mid-line and the last
                word orphans. Measure and size are tuned to keep the muted clause
                at two lines and the payoff on one. */}
            <h1 className="hero-fade-up max-w-[24ch] text-[clamp(2.25rem,4.4vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.02em]">
              <span className="block text-white/45">Your experts know how the work actually gets done.</span>
              <span className="mt-1 block text-white">AIOS makes it autonomous.</span>
            </h1>

            <p className="hero-fade-up mt-8 max-w-[46ch] text-[17px] leading-[1.6] text-white/70 [animation-delay:160ms]">
              AIOS learns how your experts actually work, turns it into workflows that run
              themselves, and interacts with your customers via voice, SMS, and inside ChatGPT.
            </p>

            <div className="hero-fade-up mt-10 flex flex-wrap items-center gap-4 [animation-delay:300ms]">
              <a
                href="#demo"
                onClick={() => handleCtaClick("hero_primary")}
                className={BTN_DARK}
              >
                <Node />
                Request a demo
              </a>
              <a
                href="#platform"
                onClick={() => handleCtaClick("hero_secondary")}
                className={BTN_SOLID}
              >
                Explore the platform
              </a>
            </div>
          </div>
        </section>

        {/* ══ 02 · TRUSTED BY + BRACKETED STATS ══ */}
        {/* Tinted band, not white. Section 03 below is also light, and with
            both on white the stats + equation ran straight into the "One
            cognitive core" heading with nothing marking the seam. The tint is
            the same one section 04 uses, so light sections alternate
            white / tint down the page rather than needing a new color. */}
        <section id="commitments" data-tone="light" className="bg-[#f7f6f3] pt-20 pb-16 md:pt-24 md:pb-20">
          <div className={GUTTER}>
          <Eyebrow>What we put behind it</Eyebrow>

          <div className="mt-10 border-t border-slate-200" />
          {/* Columns divided by vertical rules rather than a rail over each
              stat — the section is already bracketed by full-width hairlines,
              and a third horizontal line per column made it read as noise. The
              kind label carries the meaning the rail was only decorating. */}
          <div className="grid py-14 md:grid-cols-3 md:py-16">
            {TRUST_STATS.map((item, i) => (
              <div
                key={item.stat}
                className={`reveal-up py-4 md:py-0 md:px-10 ${
                  i === 0 ? "md:pl-0" : "md:border-l md:border-slate-200"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="text-[12px] uppercase tracking-[0.14em] text-cyan-700">{item.kind}</p>
                <p className="mt-5 text-[clamp(1.75rem,3vw,2.35rem)] font-normal leading-none tracking-[-0.02em]">
                  {item.stat}
                </p>
                <p className="mt-3 max-w-[30ch] text-[17px] leading-[1.5] text-slate-700">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200" />

          {/* The whole model in three terms, and the hinge into section 03:
              the middle step everyone assumes they need is struck out. Kept
              out of the stat grid above on purpose — those three are parallel
              quantities, and an equation in one column breaks the reading. */}
          <p className="reveal-up flex flex-wrap items-baseline justify-center gap-x-8 gap-y-2 py-12 text-[clamp(1.5rem,2.8vw,2.15rem)] font-normal leading-none tracking-[-0.02em] text-[#0f1419] md:gap-x-14 md:py-14">
            <span>Knowledge in.</span>
            {/* line-through takes the muted rule color, not the text color, so
                the deleted term recedes twice over. */}
            <span className="text-slate-400 line-through decoration-slate-300 decoration-[0.09em]">Brittle agents.</span>
            <span>Autonomy out.</span>
          </p>

          {/* Closes the bracket the rule above the stats opened. The section
              has bottom padding now, so this reads as a rule under the
              equation rather than as the band's own edge. */}
          <div className="border-t border-slate-200" />
          </div>
        </section>

        {/* ══ 03 · ONE CORE, END TO END ══
            The claim, stated and left to stand: knowledge is captured once into
            a single core, and channels are doors into it rather than copies of
            it. This used to carry a five-act walkthrough of one insurance claim
            as proof — removed 2026-08-12, kept in docs/archive/. If evidence
            goes back in here, it belongs after this intro. */}
        <section id="problem" data-tone="light" className="bg-white pt-24 md:pt-32">
          <div className={GUTTER}>
            {/* The claim on the left, the thing itself on the right. The
                diagram is far too dense to read at column width, which is
                what the modal is for — so the card is a control, not a
                figure, and says so with the plus. */}
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="reveal-up max-w-[22ch] text-[clamp(2.25rem,4.6vw,3.75rem)] font-normal leading-[1.1] tracking-[-0.02em] text-[#0f1419]">
                  <span className="block">One cognitive core</span>
                  <span className="mt-2 block text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.2] text-slate-400">
                    Every process. Every channel. One governed intelligence layer.
                  </span>
                </h2>

                <p className="reveal-up mt-8 max-w-[62ch] text-[17px] leading-[1.6] text-slate-600 [animation-delay:80ms]">
                  Most enterprise AI is built one agent at a time: a phone agent, a chat agent, one for
                  invoices, another for claims. Each brings its own rules, tools, memory, and
                  operating burden.
                </p>

                <p className="reveal-up mt-5 max-w-[62ch] text-[17px] leading-[1.6] text-slate-600 [animation-delay:120ms]">
                  AIOS reverses that model. It captures what your people know once as governed,
                  executable workflows in a shared cognitive core. Voice, SMS, web chat, APIs,
                  schedules, and external agents are controlled doors into the same processes,
                  policies, connectors, customer memory, and evolving context.
                </p>

                <p className="reveal-up mt-5 max-w-[62ch] text-[17px] font-medium leading-[1.6] text-[#0f1419] [animation-delay:160ms]">
                  We don&apos;t build brittle agents. We capture what your experts already know and
                  put it to work. If you can explain how your company runs, AIOS can run it.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setArchOpen(true)}
                aria-label="Open the AIOS platform architecture at full size"
                className="reveal-up group relative block w-full cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white p-2 transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(15,20,25,0.12)] [animation-delay:160ms]"
              >
                <img src={ARCH_IMAGE} alt={ARCH_ALT} className="w-full" />
                {/* The affordance. Sits on the image rather than under it
                    so it is impossible to read the card as a static
                    figure, and grows on hover so the whole card reads as
                    one target. */}
                <span className="pointer-events-none absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white/95 text-slate-700 shadow-sm backdrop-blur transition-all duration-200 group-hover:scale-110 group-hover:border-cyan-500 group-hover:text-cyan-600">
                  <Plus />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ══ 04 · THE PLATFORM — tinted surface, flat square cards ══ */}
        <section id="platform" data-tone="light" className="mt-28 bg-[#f7f6f3] py-24 md:py-28">
          <div className={GUTTER}>
          {/* The heading alone. It carried an "Explore the platform" button
              on the right until 2026-08-13 — the hero already sends anyone
              who wants the tour there, and a second copy of that CTA at the
              top of the cards asked the reader to leave the section before
              they had read a word of it. */}
          <h2 className="reveal-up text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.1] tracking-[-0.02em]">
            <span className="block">The Operating System</span>
            <span className="block">for Autonomous Intelligence.</span>
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.label}
                // A lone last card spans the row rather than sitting
                // half-width beside a gap. With an even count nothing
                // spans, which is why this asks the length rather than
                // hard-coding the widow.
                className={`reveal-up bg-[#ebe8e2] p-10 md:p-12 ${
                  i === PILLARS.length - 1 && PILLARS.length % 2 === 1 ? "md:col-span-2" : ""
                }`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center gap-4 text-cyan-600">
                  <PillarIcon index={pillar.icon} className="h-7 w-7" />
                  <span className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#0f1419]">
                    {pillar.label}
                  </span>
                </div>
                <h3 className="mt-8 max-w-[20ch] text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.02em]">
                  {pillar.title}
                </h3>
                <p className="mt-5 max-w-[62ch] text-[16px] leading-[1.6] text-slate-600">{pillar.body}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* ══ INTELLIGENCE THAT COMPOUNDS ══ */}
        <section id="learning" data-tone="light" className="bg-white py-24 md:py-28">
          <div className={GUTTER}>
            <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
              <div>
                <Eyebrow className="reveal-up">Intelligence that compounds</Eyebrow>
                <h2 className="reveal-up mt-6 max-w-[18ch] text-[clamp(2.25rem,4.6vw,3.75rem)] font-normal leading-[1.08] tracking-[-0.02em] text-[#0f1419] [animation-delay:40ms]">
                  Every run makes the next one better.
                </h2>
                <p className="reveal-up mt-7 max-w-[56ch] text-[17px] leading-[1.6] text-slate-600 [animation-delay:80ms]">
                  AIOS turns execution outcomes into a governed playbook of strategies, error patterns,
                  resolutions, and constraints. The next plan starts with what the system has already learned.
                </p>
              </div>

              <div className="border-t border-slate-200">
                {[
                  {
                    num: "01",
                    title: "Recall what matters",
                    body: "Before planning, AIOS retrieves the lessons relevant to the task at hand.",
                  },
                  {
                    num: "02",
                    title: "Reflect on the outcome",
                    body: "After each run, it records what helped, what failed, and what resolved the issue.",
                  },
                  {
                    num: "03",
                    title: "Curate with evidence",
                    body: "Useful lessons rise. Harmful ones are pruned. Human edits remain protected.",
                  },
                ].map((item, i) => (
                  <div
                    key={item.num}
                    className="reveal-up grid grid-cols-[42px_1fr] gap-5 border-b border-slate-200 py-8"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="font-mono text-[12px] tracking-[0.14em] text-cyan-700">{item.num}</span>
                    <div>
                      <h3 className="text-[clamp(1.25rem,2vw,1.6rem)] font-normal leading-[1.2] tracking-[-0.01em] text-[#0f1419]">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-[44ch] text-[16px] leading-[1.6] text-slate-600">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 05 · HOW IT WORKS — dark, sticky step tabs ══ */}
        <section id="how-it-works" data-tone="dark" className="relative bg-[#15181b] text-white">
          {/* Sticky tab bar */}
          {/* Pinned to the very top: the site nav is transparent and slides away
              past HIDE_AFTER_Y, so reserving an offset for it would just leave a
              strip of page content scrolling above this bar. */}
          <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#15181b]/95 backdrop-blur-sm">
            <div className={`flex items-center justify-between gap-4 overflow-x-auto py-5 ${GUTTER}`}>
              {STEPS.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => {
                    stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="flex shrink-0 items-center gap-5 transition-opacity"
                  aria-current={i === activeStep}
                >
                  {/* Each step carries the pillar mark that matches what its
                      screen shows — see `icon` on STEPS. Not the loop index:
                      Approved needs the gate glyph, which sits at 4. */}
                  <span className={`transition-colors ${i === activeStep ? "text-cyan-400" : "text-cyan-400/30"}`}>
                    <PillarIcon index={s.icon} className="h-7 w-7" />
                  </span>
                  <span
                    className={`text-[clamp(1.5rem,3vw,2.25rem)] font-normal leading-none tracking-[-0.02em] transition-colors ${
                      i === activeStep ? "text-white" : "text-white/35"
                    }`}
                  >
                    {s.tab}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={`pt-20 pb-8 ${GUTTER}`}>
            <Eyebrow tone="dark" className="reveal-up">
              Omnichannel AI without the agent sprawl
            </Eyebrow>
            <h2 className="reveal-up mt-5 max-w-[24ch] text-[clamp(2.25rem,4.6vw,3.75rem)] font-normal leading-[1.08] tracking-[-0.02em] [animation-delay:40ms]">
              <span className="block">Teach one system how your company works.</span>
              <span className="mt-2 block text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.2] text-white/40">
                Then put that intelligence everywhere.
              </span>
            </h2>
          </div>

          {STEPS.map((s, i) => (
            <div
              key={s.key}
              data-step-index={i}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              /* Clears the 77px sticky tab bar plus a little breathing room. */
              className={`scroll-mt-[100px] py-16 ${GUTTER}`}
            >
              <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
                {/* Each capture is normalized to 16:10 so the real interface
                    stays intact rather than being cropped again in the page. */}
                <Ph
                  src={s.image}
                  label={s.alt}
                  ratio="16 / 10"
                  tone="dark"
                  className="reveal-up rounded-lg bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
                  overlay={
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at ${s.focus.x} ${s.focus.y}, rgba(34,211,238,0.14) 0%, rgba(34,211,238,0.055) 18%, transparent 40%), radial-gradient(ellipse 92% 88% at ${s.focus.x} ${s.focus.y}, transparent 48%, rgba(7,12,16,0.08) 74%, rgba(7,12,16,0.28) 100%)`,
                        boxShadow: "inset 0 0 70px rgba(7,12,16,0.16)",
                      }}
                    />
                  }
                />
                <div className="reveal-up lg:pt-6 [animation-delay:80ms]">
                  <h3 className="max-w-[24ch] text-[clamp(1.5rem,2.6vw,2rem)] font-normal leading-[1.2] tracking-[-0.01em] text-white">
                    {s.caption}
                  </h3>
                  <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-white/60">{s.body}</p>
                  <p className="mt-8 flex items-center gap-3.5 text-[12px] tracking-[0] text-white/35">
                    <LinkMark tone="dark" />
                    Step {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="h-16" />
        </section>

        {/* ══ PRODUCTION GOVERNANCE ══ */}
        <section id="validation" data-tone="light" className="bg-[#f7f6f3] py-24 md:py-28">
          <div className={GUTTER}>
            <div>
              <h2 className="reveal-up max-w-[28ch] text-[clamp(2.25rem,4.6vw,3.75rem)] font-normal leading-[1.08] tracking-[-0.02em] text-[#0f1419] [animation-delay:40ms]">
                Nothing reaches production on confidence alone.
              </h2>
              <p className="reveal-up mt-7 max-w-[62ch] text-[17px] leading-[1.6] text-slate-600 [animation-delay:80ms]">
                Every release is versioned, evaluated against expected behavior, reviewed by a person, and
                kept separate from the working draft.
              </p>
            </div>

            <div className="mt-14 grid border-y border-slate-200 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  num: "01",
                  title: "Version.",
                  body: "Capture an immutable snapshot of the workflow and its configuration.",
                },
                {
                  num: "02",
                  title: "Evaluate.",
                  body: "Test expected paths, correctness, and policy compliance in Draft.",
                },
                {
                  num: "03",
                  title: "Approve.",
                  body: "A reviewer other than the requester decides what moves forward.",
                },
                {
                  num: "04",
                  title: "Promote.",
                  body: "Run with Production connections and return to a previous release when needed.",
                },
              ].map((item, i) => (
                <div
                  key={item.num}
                  className={`reveal-up py-9 md:px-8 lg:py-10 ${
                    i % 2 === 1 ? "md:border-l md:border-slate-200" : ""
                  } ${i > 0 ? "border-t border-slate-200 md:border-t-0" : ""} ${
                    i > 1 ? "md:border-t md:border-slate-200 lg:border-t-0" : ""
                  } ${
                    i > 0 ? "lg:border-l lg:border-slate-200" : "lg:pl-0"
                  }`}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <p className="font-mono text-[12px] tracking-[0.14em] text-cyan-700">{item.num}</p>
                  <h3 className="mt-6 text-[clamp(1.4rem,2.4vw,1.85rem)] font-normal leading-[1.2] tracking-[-0.01em] text-[#0f1419]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-[30ch] text-[16px] leading-[1.6] text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 07 · TRUST & SECURITY ══
            Reads top-down as claim → controls → attestations → supply chain.
            The four controls come before the badge row on purpose: a
            certification says someone audited the company, the controls say
            what the software actually does on every run, and the second is
            the thing a buyer's security team is really asking about. */}
        <section id="security" data-tone="light" className="bg-white py-20 md:py-28">
          <div className={GUTTER}>
          {/* No left rail on this section: the heading has to hold one line, so
              it scales down on narrow viewports and a rail's node would float
              beside a much shorter block than it was drawn for. */}
          <div className="reveal-up">
            {/* One line at every width — the clamp floor is what keeps it
                unbroken on a phone, and nowrap stops it wrapping in between. */}
            <h2 className="whitespace-nowrap text-[clamp(1.35rem,4.35vw,3.25rem)] font-normal leading-[1.1] tracking-[-0.02em]">
              Autonomy you can hand to an auditor
            </h2>
            <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.6] text-slate-600">
              Governance isn&rsquo;t a setting in AIOS. It&rsquo;s the path every execution runs
              through. Nothing reaches a system of record without a policy allowing it, and
              nothing happens that you can&rsquo;t reconstruct afterward.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {SECURITY_POINTS.map((point, i) => (
              <div key={point.title} className="reveal-up" style={{ animationDelay: `${i * 70}ms` }}>
                <h3 className="max-w-[18ch] text-[clamp(1.25rem,2vw,1.6rem)] font-normal leading-[1.2] tracking-[-0.01em]">
                  {point.title}
                </h3>
                <p className="mt-5 max-w-[34ch] text-[16px] leading-[1.6] text-slate-600">{point.body}</p>
              </div>
            ))}
          </div>

          {/* ── Working with / Built on ──
              Restored from the pre-redesign home page, retoned for light.
              Label on the left, marks flowing right, so the two groups read
              as one compact band instead of two more stacked blocks. Mobile
              keeps the original continuous marquee. Marks are monochrome —
              this is a supply-chain statement, not a logo salad. */}
          <div className="mt-16 border-t border-slate-200">
            <div className="overflow-hidden py-8 md:hidden">
              <p className="text-center text-[12px] uppercase tracking-[0.14em] text-slate-500">
                Working with &middot; Built on
              </p>
              <div className="marquee-track mt-5">
                {[0, 1].map((set) => (
                  <ul key={set} className="flex shrink-0 items-center" aria-hidden={set === 1 || undefined}>
                    {PARTNER_GROUPS.flatMap((g) => g.items).map((b) => (
                      <li
                        key={`${set}-${b.name}`}
                        className="flex shrink-0 items-center border-l border-slate-200 px-7 first:border-l-0"
                      >
                        <PartnerLogo brand={b} />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            {/* Side by side at 4fr/3fr — the original proportion, and the only
                arrangement that fills the 1320 measure. It only fits from lg
                up though: at tablet width the right column is too narrow for
                three marks and "Next.js" runs off the edge, so md stacks the
                two groups instead. */}
            <div className="hidden md:block lg:grid lg:grid-cols-[4fr_3fr]">
              {PARTNER_GROUPS.map((group, gi) => (
                <div
                  key={group.eyebrow}
                  className={`py-8 lg:py-10 ${
                    gi > 0 ? "border-t border-slate-200 lg:border-l lg:border-t-0 lg:pl-12" : "lg:pr-12"
                  }`}
                >
                  <p className="text-[12px] uppercase tracking-[0.14em] text-slate-500">{group.eyebrow}</p>
                  <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4 lg:justify-between">
                    {group.items.map((b) => (
                      <li key={b.name}>
                        <PartnerLogo brand={b} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>

        {/* ══ PATH TO PRODUCTION ══ */}
        <section id="rollout" data-tone="light" className="bg-[#f7f6f3] py-24 md:py-28">
          <div className={GUTTER}>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
              <div>
                <Eyebrow className="reveal-up">From observation to production</Eyebrow>
                <h2 className="reveal-up mt-6 max-w-[17ch] text-[clamp(2.25rem,4.6vw,3.75rem)] font-normal leading-[1.08] tracking-[-0.02em] text-[#0f1419] [animation-delay:40ms]">
                  What four weeks contains.
                </h2>
                <p className="reveal-up mt-7 max-w-[54ch] text-[17px] leading-[1.6] text-slate-600 [animation-delay:80ms]">
                  cvlSoft engineers work with your experts, systems, and controls until the first process is
                  running in production. Then your team takes ownership.
                </p>
              </div>

              <ol className="grid gap-x-10 border-t border-slate-200 sm:grid-cols-2">
                {[
                  {
                    num: "01",
                    title: "Observe and scope",
                    body: "Choose the process, capture the work, and define the outcome.",
                  },
                  {
                    num: "02",
                    title: "Build and connect",
                    body: "Turn the process into a workflow and connect the systems it uses.",
                  },
                  {
                    num: "03",
                    title: "Validate and approve",
                    body: "Test expected behavior, tune policies, and secure signoff.",
                  },
                  {
                    num: "04",
                    title: "Go live and improve",
                    body: "Promote the release, monitor outcomes, and compound what the system learns.",
                  },
                ].map((item, i) => (
                  <li
                    key={item.num}
                    className="reveal-up border-b border-slate-200 py-8"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <p className="font-mono text-[12px] tracking-[0.14em] text-cyan-700">{item.num}</p>
                    <h3 className="mt-5 text-[clamp(1.25rem,2vw,1.6rem)] font-normal leading-[1.2] tracking-[-0.01em] text-[#0f1419]">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[31ch] text-[16px] leading-[1.6] text-slate-600">{item.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ══ 08 · CLOSING CTA + LEAD FORM ══ */}
        <section id="demo" data-tone="dark" className="relative overflow-hidden bg-[#15181b] py-24 md:py-32">
          {/* Background plate. Both scrims below stay — they are what keep
              the form legible over moving footage. motion-reduce falls back
              to the flat #15181b the section already paints. */}
          {CTA_VIDEO ? (
            <video
              /* Nudged left. The section is wider than the plate's 16:9 at
                 desktop widths, so it crops top/bottom and object-position
                 has nothing to move — the shift has to be a transform. The
                 scale is what keeps the right edge covered. */
              className="absolute inset-0 h-full w-full origin-center -translate-x-[8%] scale-[1.16] object-cover motion-reduce:hidden"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src={CTA_VIDEO.webm} type="video/webm" />
              <source src={CTA_VIDEO.mp4} type="video/mp4" />
            </video>
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-black/40" />

          <div className={`relative ${GUTTER}`}>
            {/* The form sits in its own frosted panel, centred in the
                section, so it stays readable over moving footage. */}
            <div className="reveal-up mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f1419]/55 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12">
              <h2 className="mx-auto max-w-[18ch] text-center text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-[-0.02em]">
                <span className="text-white/45">Not hype.</span>{" "}
                <span className="text-white">Real enterprise agentic AI.</span>
              </h2>
              <p className="mt-4 text-center text-lg text-slate-300 md:text-xl">See it now.</p>

              <form noValidate className="mt-10 grid gap-3" onSubmit={handleSubmit}>
                <LeadFields form={form} />
                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                  {/* Secondary to the point of being quiet — a text link, not
                      a second button competing with submit. Clears the fields
                      and validation state plus the submit result; a stale
                      "thanks" over an empty form reads as if it sent again.
                      Sits left of submit so the primary action ends the row. */}
                  <button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setFormStatus("idle");
                      setFormMessage("");
                    }}
                    className="text-sm text-slate-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={formStatus === "loading"}
                    onClick={() => handleCtaClick("demo_form")}
                    className={`${BTN_DARK} disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {formStatus === "loading" ? "Submitting..." : "Submit"}
                  </button>
                </div>
                {/* The result is a dialog, not a line under the button — see
                    FormStatusDialog. Nothing here changes the form's height. */}
              </form>
            </div>
          </div>
        </section>
      </main>

      <FormStatusDialog
        status={formStatus}
        message={formMessage}
        onClose={() => {
          setFormStatus("idle");
          setFormMessage("");
        }}
      />

      {/* ══ The architecture, full size ══
          Backdrop closes; the sheet stops the click so a drag across the
          diagram never dismisses it. The image is capped by viewport
          height rather than width, since the thing that makes it legible
          is height on screen. */}
      {archOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AIOS platform architecture"
          onClick={() => setArchOpen(false)}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0f1419]/85 p-4 backdrop-blur-sm md:p-10"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-full w-full max-w-[1500px] overflow-auto rounded-lg bg-white p-3 shadow-[0_30px_120px_rgba(0,0,0,0.5)] md:p-4"
          >
            <img src={ARCH_IMAGE} alt={ARCH_ALT} className="mx-auto w-full" />
          </div>

          <button
            type="button"
            onClick={() => setArchOpen(false)}
            aria-label="Close"
            autoFocus
            className="absolute right-5 top-5 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition-colors hover:border-white/60 hover:bg-white/20"
          >
            <Plus className="h-4 w-4 rotate-45" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
