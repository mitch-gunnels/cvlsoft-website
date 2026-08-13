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
import SiteHeader from "@/app/components/SiteHeader";
import HeroGraph, { type HeroAct } from "@/app/components/HeroGraph";
import PillarIcon from "@/app/components/PillarIcon";
import { BTN_DARK, BTN_LIGHT, BTN_SOLID } from "@/app/lib/buttons";

type DemoStatus = "idle" | "loading" | "success" | "error";

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

const RAIL_LINE = {
  light: "bg-slate-300",
  dark: "bg-white/20",
  accent: "bg-[#0f1419]/30",
} as const;

/** Horizontal rail: node at the left end, hairline running right. */
function RailH({ tone = "light", className = "" }: { tone?: "light" | "dark" | "accent"; className?: string }) {
  return (
    <span className={`flex items-center ${className}`}>
      <Node tone={tone} />
      <span className={`h-px flex-1 ${RAIL_LINE[tone]}`} />
    </span>
  );
}

/**
 * Vertical rail pinned to the left of a `relative` parent, with the node
 * sitting near the top. Used to flag headings and framed media.
 */
function RailV({ tone = "light", nodeTop = 8 }: { tone?: "light" | "dark" | "accent"; nodeTop?: number }) {
  return (
    <>
      <span className={`pointer-events-none absolute bottom-0 left-0 top-0 w-px ${RAIL_LINE[tone]}`} />
      <span className="pointer-events-none absolute left-0 -translate-x-1/2" style={{ top: nodeTop }}>
        <Node tone={tone} />
      </span>
    </>
  );
}

/**
 * Act marker for the end-to-end flow section — a numbered rule that separates
 * the four beats without turning each into its own <section>.
 */
function FlowAct({ num, label }: { num: string; label: string }) {
  return (
    <div className="reveal-up mb-10 mt-20 flex items-center gap-5 border-t border-slate-200 pt-8 md:mt-24">
      <span className="font-mono text-[13px] text-cyan-700">{num}</span>
      <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#0f1419]">{label}</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

/** Uppercase eyebrow: node + wide-tracked label. */
function Eyebrow({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <p className="flex items-center gap-4">
      <Node tone={tone} />
      <span
        className={`text-[13px] font-medium uppercase tracking-[0.06em] ${
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
}: {
  label: string;
  ratio?: string;
  tone?: "light" | "dark" | "accent";
  src?: string;
  className?: string;
  /** Corner-anchored label instead of a centered one — for full-bleed backdrops
      where a centered caption would collide with the copy sitting on top. */
  quiet?: boolean;
}) {
  if (src) {
    return (
      <div className={`overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
        <img src={src} alt={label} className="h-full w-full object-cover" />
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

/** Prev/next arrows ringed by the ○ from the AIOS mark. */
function ArrowPair({
  onPrev,
  onNext,
  tone = "light",
}: {
  onPrev: () => void;
  onNext: () => void;
  tone?: "light" | "dark";
}) {
  const stroke = tone === "dark" ? "text-slate-300" : "text-slate-900";
  const ring = tone === "dark" ? "border-white/25 hover:border-cyan-400" : "border-slate-300 hover:border-cyan-600";
  return (
    <div className="flex items-center gap-4">
      {[
        { dir: "prev" as const, onClick: onPrev, d: "M19 12H5M11 6l-6 6 6 6", label: "Previous" },
        { dir: "next" as const, onClick: onNext, d: "M5 12h14M13 6l6 6-6 6", label: "Next" },
      ].map((btn) => (
        <button
          key={btn.dir}
          type="button"
          onClick={btn.onClick}
          aria-label={btn.label}
          className={`grid h-14 w-14 place-items-center rounded-full border transition-colors ${ring}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${stroke}`}>
            <path d={btn.d} />
          </svg>
        </button>
      ))}
    </div>
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

/* Risk reversal, not social proof. `kind` states the question the buyer is
   actually asking; the stat answers it. */
const TRUST_STATS = [
  { kind: "If it fails", stat: "$0", label: "You never pay for failed agentic workflow executions" },
  { kind: "Time to production", stat: "4 weeks", label: "From first observation to production deployment" },
  { kind: "What you maintain", stat: "1 core", label: "One cognitive core — not a hundred brittle bots" },
];

/* ── Section 03: one claim, end to end ──────────────────────
   An illustrative walkthrough, not a case study — roles only, no names, and
   the panel is labelled as such. The point of the before/after is that the
   physical inspection still takes two days: only the human and system time
   collapses. Claiming end-to-end minutes would be the kind of lie a claims
   buyer spots on sight.
   ──────────────────────────────────────────────────────────── */

const FLOW_BEFORE = [
  { t: "DAY 1", text: "Claim filed, lands in the intake queue" },
  { t: "DAY 1", text: "Adjuster pulls the policy and checks coverage", meta: "12 min · 3 systems" },
  { t: "DAY 2", text: "Inspection ordered — then waiting" },
  { t: "DAY 4", text: "Estimate returns; adjuster keys it in and compares to the schedule" },
  { t: "DAY 4", text: "Over threshold — emailed to the manager, then waiting" },
  { t: "DAY 5", text: "Manager approves, buried in an email thread" },
  { t: "DAY 6", text: "Payment posted, file noted, customer emailed" },
];

const FLOW_AFTER = [
  { t: "00:00", text: "Policy pulled, coverage checked, duplicate check run" },
  { t: "00:02", text: "Inspection ordered automatically" },
  { t: "", text: "2 days — the inspection is physical. That part doesn't change.", pause: true },
  { t: "00:03", text: "Estimate ingested and compared; over threshold, routed to the manager" },
  { t: "00:03", text: "Manager approves in one click", gate: true },
  { t: "00:04", text: "Payment posted · file documented · customer notified, unprompted" },
];

const FLOW_DELTAS = [
  { label: "Handoffs", before: "11", after: "1" },
  { label: "Adjuster time on this claim", before: "47 min", after: "0" },
  { label: "Customer calls chasing status", before: "2", after: "0" },
  { label: "Manager touch", before: "1 day", after: "90 sec" },
];

const FLOW_CHAT = [
  { who: "Policyholder", text: "Any update on claim 88-4471? It's been a week.", agent: false },
  {
    who: "AIOS",
    text: "Your inspection cleared Tuesday. The repair estimate came in at $12,400 — above the auto-approve limit, so it routed to a manager for review. That was approved this morning. Payment is scheduled for Friday, and I've just texted you the confirmation.",
    agent: true,
  },
];

/* The line under the transcript that makes the whole section land: the answer
   the customer just got is traceable to a specific person and a specific gate. */
const FLOW_PROVENANCE = [
  { k: "Judgment", v: "Captured from a senior adjuster" },
  { k: "Gate", v: "Claims ops manager · policy #4" },
  { k: "Run", v: "2.4s · $0.31 · logged" },
];

const FLOW_ALSO = ["AP invoice exceptions", "Vendor onboarding", "Order status", "Tier-1 support"];



const PILLARS = [
  {
    label: "OBSERVER",
    title: "Lorem ipsum dolor sit",
    body: "Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim.",
  },
  {
    label: "BLUEPRINT",
    title: "Ut enim ad minim veniam",
    body: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor.",
  },
  {
    label: "EXECUTOR",
    title: "Duis aute irure dolor in reprehenderit",
    body: "In voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident.",
  },
  {
    label: "COMMUNICATOR",
    title: "Excepteur sint occaecat",
    body: "Cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis.",
  },
  {
    label: "CONTROLLER",
    title: "Sed ut perspiciatis unde omnis iste natus error",
    body: "Sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
];

const BAND_STATS = [
  { stat: "30%+", label: "Lorem ipsum dolor sit" },
  { stat: "$500M", label: "Consectetur adipiscing" },
  { stat: "6 weeks or less", label: "Sed do eiusmod tempor" },
];

const STEPS = [
  {
    key: "lorem",
    tab: "Lorem.",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed",
    caption: "Tempor incididunt ut labore et dolore",
    body: "Magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.",
    image: "Step one product view",
  },
  {
    key: "ipsum",
    tab: "Ipsum.",
    title: "Irure dolor in reprehenderit in voluptate velit esse cillum",
    caption: "Dolore eu fugiat nulla pariatur excepteur",
    body: "Sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis unde omnis.",
    image: "Step two product view",
  },
  {
    key: "dolor",
    tab: "Dolor.",
    title: "Iste natus error sit voluptatem accusantium doloremque",
    caption: "Laudantium totam rem aperiam eaque ipsa",
    body: "Quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem quia voluptas.",
    image: "Step three product view",
  },
];

const STORIES = [
  {
    stat: "14,000+",
    statLabel: "lorem ipsum dolor sit amet",
    quote:
      "Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    name: "LOREM IPSUM",
    title: "DOLOR SIT AMET",
  },
  {
    stat: "3.2x",
    statLabel: "consectetur adipiscing elit sed",
    quote:
      "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.",
    name: "CONSECTETUR ADIPISCING",
    title: "ELIT SED DO",
  },
  {
    stat: "$4.1M",
    statLabel: "tempor incididunt ut labore",
    quote:
      "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum perspiciatis.",
    name: "EIUSMOD TEMPOR",
    title: "INCIDIDUNT UT",
  },
];

const SECURITY_BADGES = ["Lorem", "Ipsum", "Dolor", "Sit amet", "Consectetur", "Adipiscing"];

const SECURITY_POINTS = [
  { title: "Lorem ipsum dolor", body: "Sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore." },
  { title: "Et dolore magna aliqua", body: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi." },
  { title: "Ut aliquip ex ea commodo", body: "Consequat duis aute irure dolor in reprehenderit in voluptate velit." },
  { title: "Esse cillum dolore eu", body: "Fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt." },
];

const DISCOVER = [
  { label: "OBSERVER", caption: "Lorem ipsum dolor sit amet. Consectetur, adipiscing and elit.", image: "Product view one" },
  { label: "BLUEPRINT", caption: "Sed do eiusmod tempor. Incididunt, labore and dolore.", image: "Product view two" },
  { label: "EXECUTOR", caption: "Magna aliqua ut enim. Minim, veniam and quis.", image: "Product view three" },
  { label: "COMMUNICATOR", caption: "Nostrud exercitation ullamco. Laboris, nisi and aliquip.", image: "Product view four" },
];

const POSTS = [
  { kind: "BLOG POST", date: "JUL 10, 2026", read: "9 MINS", title: "Lorem ipsum dolor sit amet consectetur adipiscing elit" },
  { kind: "BLOG POST", date: "JUL 10, 2026", read: "5 MINS", title: "Sed do eiusmod tempor incididunt ut labore et dolore" },
  { kind: "BLOG POST", date: "JUL 10, 2026", read: "7 MINS", title: "Magna aliqua ut enim ad minim veniam quis nostrud" },
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
  const [story, setStory] = useState(0);
  const [discover, setDiscover] = useState(0);
  const [post, setPost] = useState(0);
  /* Which act of the hero animation is on screen, so the background can
     change with it. HeroGraph reports it; see HERO_VIDEO_CALL. */
  const [heroAct, setHeroAct] = useState<HeroAct>("build");
  const callVideoRef = useRef<HTMLVideoElement>(null);

  /* The call plate has to start at its first frame every time the story
     reaches the call — otherwise it dissolves in at whatever point its
     own loop happens to be at, and the man is mid-sentence before the
     phone has rung.

     It keeps playing the whole time rather than being paused while
     hidden: a paused video can stall on the seek, and a stalled video
     paints nothing, so the dissolve would come up from black instead of
     between two live frames. Seeking a video that is already playing and
     fully buffered is instant, and the first ~150ms of the dissolve is
     under 10% opacity anyway, which covers any hitch. */
  useEffect(() => {
    if (heroAct !== "call") return;
    const video = callVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play();
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
      setFormStatus("error");
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

  const wrap = (n: number, len: number) => ((n % len) + len) % len;

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
                  heroAct === "call" && HERO_VIDEO_CALL ? "opacity-0" : "opacity-100"
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
              <Ph label="Hero background image / video — 2400×1200" ratio="2 / 1" tone="dark" quiet className="h-full w-full" />
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
              torso — the darkest, quietest part of the frame. Desktop only:
              on narrow screens it buries the copy. */}
          <HeroGraph
            onAct={setHeroAct}
            className="absolute bottom-[calc(8%-40px)] right-[3%] hidden w-[380px] lg:block xl:right-[5%] xl:w-[400px]"
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
              <span className="mt-1 block text-white">Now your agents do.</span>
            </h1>

            <p className="hero-fade-up mt-8 max-w-[46ch] text-[17px] leading-[1.6] text-white/70 [animation-delay:160ms]">
              AIOS learns how your experts actually work, turns it into workflows that run
              themselves, and interacts with your customers via voice, SMS, and inside ChatGPT —
              where they&rsquo;re already asking about you, with or without you.
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
                <Node />
                Explore the platform
              </a>
            </div>
          </div>
        </section>

        {/* ══ 02 · TRUSTED BY + BRACKETED STATS ══ */}
        <section data-tone="light" className="bg-white pt-14">
          <div className={GUTTER}>
          <Eyebrow>What we put behind it</Eyebrow>

          <div className="mt-10 border-t border-slate-200" />
          {/* Columns divided by vertical rules rather than a rail over each
              stat — the section is already bracketed by full-width hairlines,
              and a third horizontal line per column made it read as noise. The
              kind label carries the meaning the rail was only decorating. */}
          <div className="grid py-12 md:grid-cols-3">
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
          </div>
        </section>

        {/* ══ 03 · ONE CLAIM, END TO END ══
            Four acts: an expert's judgment is captured, the clerical work around
            it is automated, a manager keeps the gate, and the customer gets the
            answer. The whole argument is provenance — the reply at the end
            traces back to a named role and a specific approval. */}
        <section id="problem" data-tone="light" className="bg-white pt-24 md:pt-32">
          <div className={GUTTER}>
            <Eyebrow>One claim, end to end</Eyebrow>

            <h2 className="reveal-up mt-12 max-w-[22ch] text-[clamp(2.25rem,4.6vw,3.75rem)] font-normal leading-[1.1] tracking-[-0.02em] text-[#0f1419]">
              <span className="block">Your customer talks to an agent.</span>
              <span className="mt-1 block text-slate-400">
                They&rsquo;re really talking to your best people.
              </span>
            </h2>

            <p className="reveal-up mt-8 max-w-[70ch] text-[17px] leading-[1.6] text-slate-600 [animation-delay:80ms]">
              Every process has one person who knows how it really works, and a stack of clerical
              work wrapped around them. AIOS separates the two: it learns the judgment, automates
              everything else, and puts the result in front of the customer.
            </p>

            {/* ── 01 · LEARN ── */}
            <FlowAct num="01" label="Learn" />
            <div className="reveal-up grid gap-8 md:grid-cols-[160px_1fr] md:gap-12">
              <Ph label="Adjuster at work" ratio="1 / 1" className="max-w-[160px]" />
              <div>
                <p className="text-[12px] uppercase tracking-[0.14em] text-slate-500">
                  Senior claims adjuster · 18 years
                </p>
                <blockquote className="mt-4 max-w-[34ch] text-[clamp(1.35rem,2.4vw,1.85rem)] font-normal leading-[1.25] text-[#0f1419]">
                  &ldquo;Anything over $10k goes to a manager — and the policyholder gets told why.&rdquo;
                </blockquote>
                <p className="mt-5 text-[15px] leading-[1.6] text-slate-600">
                  One rule out of hundreds, captured from four interviews and thirty days of
                  observed work. It was never written down anywhere.
                </p>
              </div>
            </div>

            {/* ── 02 · AUTOMATE — the before/after, the centre of the section ── */}
            <FlowAct num="02" label="Automate" />
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Before: desaturated on a flat grey field — it should feel drab */}
              <div className="reveal-up bg-[#f1f2f1] p-7 md:p-9">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-slate-500">Before AIOS</p>
                  <p className="text-[12px] text-slate-500">6 days · 11 handoffs · 4 people</p>
                </div>
                <ol className="mt-7 space-y-4">
                  {FLOW_BEFORE.map((row, i) => (
                    <li key={i} className="grid grid-cols-[46px_1fr] gap-4">
                      <span className="pt-[3px] font-mono text-[11px] tracking-[0.06em] text-slate-400">
                        {row.t}
                      </span>
                      <span className="relative border-l border-slate-300 pb-1 pl-5">
                        <span className="absolute -left-[3.5px] top-[7px] h-[5px] w-[5px] rounded-full bg-slate-300" />
                        <span className="block text-[14px] leading-[1.5] text-slate-600">{row.text}</span>
                        {row.meta ? (
                          <span className="mt-1 block font-mono text-[11px] text-slate-400">{row.meta}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 border-t border-slate-300 pt-4 text-[14px] italic leading-[1.5] text-slate-500">
                  The customer called twice. Both times: &ldquo;still processing.&rdquo;
                </p>
              </div>

              {/* After: full contrast, live nodes, cyan rail */}
              <div className="reveal-up border border-slate-200 bg-white p-7 [animation-delay:80ms] md:p-9">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] text-cyan-700">
                    <Node />
                    With AIOS
                  </p>
                  <p className="text-[12px] text-slate-600">4 min of work · 1 human decision</p>
                </div>
                <ol className="mt-7 space-y-4">
                  {FLOW_AFTER.map((row, i) => (
                    <li key={i} className="grid grid-cols-[46px_1fr] gap-4">
                      <span className="pt-[3px] font-mono text-[11px] tracking-[0.06em] text-slate-400">
                        {row.t}
                      </span>
                      {row.pause ? (
                        /* The physical wait: rail goes dashed and grey. Keeping this
                           visible is what makes the rest of the track believable. */
                        <span className="relative border-l border-dashed border-slate-300 pb-1 pl-5">
                          <span className="block text-[14px] leading-[1.5] text-slate-400">{row.text}</span>
                        </span>
                      ) : (
                        <span className="relative border-l border-cyan-600/30 pb-1 pl-5">
                          <span className="absolute -left-[4px] top-[6px] h-[7px] w-[7px] rounded-full bg-cyan-600" />
                          <span className="block text-[14px] leading-[1.5] text-slate-800">{row.text}</span>
                          {row.gate ? (
                            <span className="mt-1 block font-mono text-[11px] text-cyan-700">
                              HUMAN GATE — the one step that stayed manual
                            </span>
                          ) : null}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
                <p className="mt-6 border-t border-slate-200 pt-4 text-[14px] italic leading-[1.5] text-slate-600">
                  The customer texted a follow-up. Answered in 2.4 seconds.
                </p>
              </div>
            </div>

            {/* Deltas */}
            <div className="reveal-up mt-4 grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {FLOW_DELTAS.map((d) => (
                <div key={d.label} className="bg-white px-6 py-6">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-slate-500">{d.label}</p>
                  <p className="mt-3 flex items-baseline gap-3">
                    <span className="text-[22px] font-normal leading-none text-slate-400 line-through decoration-slate-300">
                      {d.before}
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3.5 w-3.5 shrink-0 text-slate-400">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[26px] font-normal leading-none text-[#0f1419]">{d.after}</span>
                  </p>
                </div>
              ))}
            </div>

            <p className="reveal-up mt-8 max-w-[62ch] text-[17px] leading-[1.6] text-slate-600">
              The adjuster spent that day on the{" "}
              <span className="text-[#0f1419]">3% of claims that are genuinely ambiguous</span> — the
              ones eighteen years of judgment are actually for.
            </p>

            {/* ── 03 · GOVERN ── */}
            <FlowAct num="03" label="Govern" />
            <div className="reveal-up grid gap-8 md:grid-cols-[160px_1fr] md:gap-12">
              <Ph label="Claims manager" ratio="1 / 1" className="max-w-[160px]" />
              <div>
                <p className="text-[12px] uppercase tracking-[0.14em] text-slate-500">
                  Claims operations manager
                </p>
                <p className="mt-4 max-w-[30ch] text-[clamp(1.35rem,2.4vw,1.85rem)] font-normal leading-[1.25] text-[#0f1419]">
                  He wasn&rsquo;t automated away. He was handed the gate.
                </p>
                <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.6] text-slate-600">
                  He reviewed the drafted workflow, certified it, and kept an approval on the exact
                  step the adjuster flagged. Every run that trips it waits for him — and every one
                  that doesn&rsquo;t is logged where he can audit it later.
                </p>
              </div>
            </div>

            {/* ── 04 · ANSWER — the payoff ── */}
            <FlowAct num="04" label="Answer" />
            <div className="reveal-up border border-slate-200">
              <div className="space-y-4 bg-[#f7f8f7] p-7 md:p-10">
                {FLOW_CHAT.map((m) => (
                  <div
                    key={m.who}
                    className={`max-w-[62ch] border p-5 ${
                      m.agent ? "ml-auto border-cyan-600/25 bg-white" : "border-slate-200 bg-white"
                    }`}
                  >
                    <p className="flex items-center gap-2.5 text-[12px] uppercase tracking-[0.14em] text-slate-500">
                      {m.agent ? <Node /> : null}
                      {m.who}
                    </p>
                    <p className="mt-2.5 text-[16px] leading-[1.55] text-[#0f1419]">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Provenance — the actual argument of the section */}
              <div className="grid gap-px border-t border-slate-200 bg-slate-200 sm:grid-cols-3">
                {FLOW_PROVENANCE.map((p) => (
                  <div key={p.k} className="bg-white px-6 py-5">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-700">{p.k}</p>
                    <p className="mt-1.5 text-[14px] text-slate-700">{p.v}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="reveal-up mt-8 max-w-[62ch] text-[17px] leading-[1.6] text-slate-600">
              That answer wasn&rsquo;t improvised. It came from one adjuster&rsquo;s rule, ran through
              one manager&rsquo;s gate, and can be traced back to both.
            </p>

            {/* Breadth — four labels, no detail. Platform, not point solution. */}
            <div className="reveal-up mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-slate-200 pt-8">
              <p className="text-[12px] uppercase tracking-[0.14em] text-slate-500">
                The same loop is running on
              </p>
              {FLOW_ALSO.map((item) => (
                <span key={item} className="flex items-center gap-2.5 text-[15px] text-[#0f1419]">
                  <Node />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 04 · THE PLATFORM — tinted surface, flat square cards ══ */}
        <section id="platform" data-tone="light" className="mt-28 bg-[#f2faf9] py-24 md:py-28">
          <div className={GUTTER}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="reveal-up text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.1] tracking-[-0.02em]">
              The lorem ipsum platform
            </h2>
            <a href="/platform" className={`reveal-up ${BTN_LIGHT}`}>
              <Node />
              Explore the platform
            </a>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.label}
                className={`reveal-up bg-[#e6ebe8] p-10 md:p-12 ${i === PILLARS.length - 1 ? "md:col-span-2" : ""}`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center gap-4 text-cyan-600">
                  <PillarIcon index={i} className="h-7 w-7" />
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

        {/* ══ 05 · FULL-BLEED ACCENT STAT BAND ══ */}
        <section data-tone="light" className="bg-cyan-400">
          <div className={`grid gap-12 py-16 md:grid-cols-3 md:gap-6 ${GUTTER}`}>
            {BAND_STATS.map((item) => (
              <div key={item.stat} className="reveal-up pr-8">
                <RailH tone="accent" />
                <p className="mt-5 text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-none tracking-[-0.02em] text-[#0f1419]">
                  {item.stat}
                </p>
                <p className="mt-3 text-[17px] text-[#0f1419]/80">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 06 · HOW IT WORKS — dark, sticky step tabs ══ */}
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
                  {/* Steps reuse the first three pillar icons — observe,
                      design, run — which is exactly what the steps are. */}
                  <span className={`transition-colors ${i === activeStep ? "text-cyan-400" : "text-cyan-400/30"}`}>
                    <PillarIcon index={i} className="h-7 w-7" />
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
            <h2 className="reveal-up max-w-[22ch] text-[clamp(2.25rem,4.6vw,3.75rem)] font-normal leading-[1.08] tracking-[-0.02em]">
              Lorem ipsum dolor sit amet, consectetur adipiscing
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
                <Ph label={s.image} ratio="4 / 3" tone="dark" className="reveal-up" />
                <div className="reveal-up lg:pt-6 [animation-delay:80ms]">
                  <h3 className="max-w-[24ch] text-[clamp(1.5rem,2.6vw,2rem)] font-normal leading-[1.2] tracking-[-0.01em] text-white">
                    {s.caption}
                  </h3>
                  <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-white/60">{s.body}</p>
                  <p className="mt-8 flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] text-white/35">
                    <Node />
                    Step {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="h-16" />
        </section>

        {/* ══ 07 · CUSTOMER STORIES — carousel with peeking neighbors ══ */}
        <section id="proof" data-tone="light" className="bg-white py-24 md:py-32">
          <div className={`flex flex-wrap items-end justify-between gap-8 ${GUTTER}`}>
            <div>
              <h2 className="reveal-up max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)] font-normal leading-[1.1] tracking-[-0.02em]">
                Lorem ipsum dolor sit amet consectetur
              </h2>
              <a href="#demo" className={`reveal-up mt-8 ${BTN_LIGHT}`}>
                <Node />
                See all stories
              </a>
            </div>
            <ArrowPair
              onPrev={() => setStory((n) => wrap(n - 1, STORIES.length))}
              onNext={() => setStory((n) => wrap(n + 1, STORIES.length))}
            />
          </div>

          {/* Card is 86% of the content measure with a 24px gap; the 7% lead-in
              centers the active card and leaves the neighbours peeking. */}
          <div className={`relative mt-16 overflow-hidden ${GUTTER}`}>
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(calc(7% - ${story} * (86% + 24px)))` }}
            >
              {STORIES.map((s, i) => (
                <article key={s.name} className="relative w-[86%] shrink-0">
                  <div className={`relative transition-opacity duration-500 ${i === story ? "opacity-100" : "opacity-45"}`}>
                    <Ph label="Customer story still" ratio="16 / 8" tone="dark" />
                    <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
                      <div className="self-start">
                        <RailH tone="dark" className="w-40" />
                        <p className="mt-3.5 text-[clamp(1.35rem,2.4vw,1.85rem)] font-normal leading-none text-white">
                          {s.stat}
                        </p>
                      </div>
                      <div>
                        <blockquote className="max-w-[46ch] text-[clamp(1rem,1.6vw,1.35rem)] font-normal leading-[1.35] text-white">
                          {s.quote}
                        </blockquote>
                        <div className="mt-6 flex flex-wrap gap-x-10 gap-y-2">
                          <span className="text-[12px] uppercase tracking-[0.14em] text-white/70">{s.name}</span>
                          <span className="text-[12px] uppercase tracking-[0.14em] text-white/50">{s.title}</span>
                        </div>
                      </div>
                      <span className="pointer-events-none absolute right-8 top-8 text-[12px] uppercase tracking-[0.14em] text-white/60 md:right-12 md:top-12">
                        {s.statLabel}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 08 · ENTERPRISE SCALE & SECURITY ══ */}
        <section id="security" data-tone="light" className="bg-white py-16 md:py-24">
          <div className={GUTTER}>
          <div className="reveal-up relative py-2 pl-8">
            <RailV nodeTop={14} />
            <h2 className="max-w-[16ch] text-[clamp(2rem,4.2vw,3.25rem)] font-normal leading-[1.1] tracking-[-0.02em]">
              Lorem ipsum dolor sit amet
            </h2>
          </div>

          <a href="/platform" className="reveal-up mt-8 flex items-center gap-4 text-[16px] text-[#0f1419] hover:text-cyan-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4">
              <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Learn more about lorem ipsum
          </a>

          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {SECURITY_BADGES.map((badge) => (
              <div key={badge} className="reveal-up grid h-[100px] place-items-center bg-[#e9edea]">
                <span className="text-[13px] uppercase tracking-[0.14em] text-slate-500">{badge}</span>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {SECURITY_POINTS.map((point, i) => (
              <div key={point.title} className="reveal-up" style={{ animationDelay: `${i * 70}ms` }}>
                <h3 className="max-w-[16ch] text-[clamp(1.25rem,2vw,1.6rem)] font-normal leading-[1.2] tracking-[-0.01em]">
                  {point.title}
                </h3>
                <p className="mt-5 max-w-[34ch] text-[16px] leading-[1.6] text-slate-600">{point.body}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* ══ 09 · DISCOVER THE PLATFORM — carousel ══ */}
        <section data-tone="light" className="bg-white py-16 md:py-24">
          <div className={`flex flex-wrap items-center justify-between gap-8 ${GUTTER}`}>
            <h2 className="reveal-up text-[clamp(2rem,4.2vw,3.25rem)] font-normal leading-[1.1] tracking-[-0.02em]">
              Discover the lorem ipsum platform
            </h2>
            <ArrowPair
              onPrev={() => setDiscover((n) => wrap(n - 1, DISCOVER.length))}
              onNext={() => setDiscover((n) => wrap(n + 1, DISCOVER.length))}
            />
          </div>

          <div className={`mt-14 overflow-hidden ${GUTTER}`}>
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(calc(${discover} * -1 * (32.6% + 24px)))` }}
            >
              {DISCOVER.map((item) => (
                <article key={item.label} className="w-[85%] shrink-0 sm:w-[48%] lg:w-[32.6%]">
                  <p className="flex items-center gap-4 text-[13px] font-medium uppercase tracking-[0.06em] text-[#0f1419]">
                    <Node />
                    {item.label}
                  </p>
                  <Ph label={item.image} ratio="4 / 3" className="mt-6" />
                  <p className="mt-6 max-w-[34ch] text-[17px] leading-[1.5] text-[#0f1419]">{item.caption}</p>
                  <a href="/platform" className="mt-5 flex items-center gap-3 text-[15px] text-slate-600 hover:text-cyan-700">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4">
                      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Learn more
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 10 · MORE TO … — post carousel ══ */}
        <section data-tone="light" className="bg-white py-16 md:py-24">
          <div className={GUTTER}>
            <h2 className="reveal-up text-[clamp(2rem,4.2vw,3.25rem)] font-normal leading-[1.1] tracking-[-0.02em]">
              More to lorem
            </h2>
          </div>

          <div className={`mt-12 flex items-start gap-10 ${GUTTER}`}>
            <div className="hidden shrink-0 pt-2 lg:block">
              <ArrowPair
                onPrev={() => setPost((n) => wrap(n - 1, POSTS.length))}
                onNext={() => setPost((n) => wrap(n + 1, POSTS.length))}
              />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(calc(${post} * -1 * (32.6% + 24px)))` }}
              >
                {POSTS.map((p) => (
                  <article key={p.title} className="w-[85%] shrink-0 sm:w-[48%] lg:w-[32.6%]">
                    <Ph label="Article cover art" ratio="16 / 10" tone="accent" />
                    <div className="mt-6 flex flex-wrap items-center gap-x-4 text-[12px] uppercase tracking-[0.12em] text-slate-500">
                      <span className="text-[#0f1419]">{p.kind}</span>
                      <Node />
                      <span>{p.date}</span>
                      <span className="ml-auto">{p.read}</span>
                    </div>
                    <h3 className="mt-4 max-w-[26ch] text-[clamp(1.15rem,1.8vw,1.5rem)] font-normal leading-[1.25] tracking-[-0.01em]">
                      {p.title}
                    </h3>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className={`mt-10 lg:hidden ${GUTTER}`}>
            <ArrowPair
              onPrev={() => setPost((n) => wrap(n - 1, POSTS.length))}
              onNext={() => setPost((n) => wrap(n + 1, POSTS.length))}
            />
          </div>
        </section>

        {/* ══ 11 · CLOSING CTA + LEAD FORM ══ */}
        <section id="demo" data-tone="dark" className="relative overflow-hidden bg-[#15181b] py-24 md:py-32">
          {/* faint pixel dashes along the top and bottom edges, as on skan */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-3 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #fff 0 14px, transparent 14px 30px)" }} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #fff 0 14px, transparent 14px 30px)" }} />

          <div className={GUTTER}>
            <h2 className="reveal-up max-w-[16ch] text-[clamp(2.25rem,4.8vw,3.75rem)] font-normal leading-[1.08] tracking-[-0.02em]">
              <span className="text-white/45">Lorem ipsum dolor into</span>{" "}
              <span className="text-white">sit amet consectetur</span>
            </h2>

            <form noValidate className="reveal-up mt-12 grid max-w-xl gap-3 [animation-delay:120ms]" onSubmit={handleSubmit}>
              <LeadFields form={form} />
              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={formStatus === "loading"}
                  onClick={() => handleCtaClick("demo_form")}
                  className={`${BTN_DARK} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <Node />
                  {formStatus === "loading" ? "Submitting..." : "Request a demo"}
                </button>
                <a href="#platform" className={BTN_DARK}>
                  <Node />
                  Explore the platform
                </a>
              </div>
              {formMessage ? (
                <p className={`text-sm ${formStatus === "error" ? "text-slate-300" : "text-cyan-400"}`}>{formMessage}</p>
              ) : null}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
