/**
 * Pillar glyphs — one shared corner-frame container with a different interior
 * mark per part, so the five read as one family at 24px instead of five
 * unrelated pictograms. Literal icons (eye, shield, play) were tried first and
 * looked like a stock set bolted on.
 *
 * Note this is the one place a bracket form survives: as an icon container it
 * earns its keep. Page framing — stats, headings, media — stays node-on-rail.
 *
 * Colour comes from the parent via `currentColor`, which is how the step tab
 * bar dims its inactive tabs.
 *
 * Shared between the page body and the hero animation (HeroGraph), so the act
 * a visitor watches in the hero carries the same mark as the section that
 * explains it further down.
 */
export default function PillarIcon({ index, className = "h-6 w-6" }: { index: number; className?: string }) {
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  /* The container: four corner arms spanning 3 → 21. */
  const TL = "M3 8V3h5";
  const TR = "M16 3h5v5";
  const BR = "M21 16v5h-5";
  const BL = "M8 21H3v-5";
  const frame = `${TL} ${TR} ${BR} ${BL}`;

  /* The interiors have to differ in *silhouette*, not in detail. An
     earlier set varied only by a small mark in the middle — a dot, a
     dashed square, a diamond — which at the 18px the hero timeline
     renders them collapsed into the same blob. Round, linked, solid
     wedge, arcs, bar: each is recognisable at a glance and at size. */
  const glyphs = [
    // 00 Observer — concentric: the watched point, and the watching
    <g key="observer">
      <path d={frame} {...s} />
      <circle cx="12" cy="12" r="4.4" {...s} />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
    </g>,
    // 01 Blueprint — two nodes and the link between them: a graph
    <g key="blueprint">
      <path d={frame} {...s} />
      <path d="M10.4 9.6 13.6 14.4" {...s} />
      <circle cx="9.4" cy="8.6" r="2" {...s} />
      <circle cx="14.6" cy="15.4" r="2" {...s} />
    </g>,
    // 02 Executor — running: a solid wedge, the only filled interior
    <g key="executor">
      <path d={frame} {...s} />
      <path d="M10 8.2 16.2 12 10 15.8Z" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </g>,
    // 03 Communicator — the frame opens right and signal leaves it
    <g key="communicator">
      <path d={`${TL} ${BL}`} {...s} />
      <circle cx="10" cy="12" r="1.9" fill="currentColor" />
      <path d="M13.6 8.9a4.4 4.4 0 0 1 0 6.2" {...s} />
      <path d="M16.6 6.6a8.2 8.2 0 0 1 0 10.8" {...s} />
    </g>,
    // 04 Controller — the gate every action passes through
    <g key="controller">
      <path d={frame} {...s} />
      <path d="M7.6 12h8.8" {...s} strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.3" {...s} strokeWidth="1.7" />
    </g>,
    // 05 Memory — the frame keeps something: a mark held inside it.
    // A bookmark rather than a disk or a clock, because what is kept
    // here is chosen, not logged.
    <g key="memory">
      <path d={frame} {...s} />
      <path d="M9.2 7.4h5.6v9.4L12 14.3l-2.8 2.5z" {...s} />
    </g>,
  ];

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {glyphs[index % glyphs.length]}
    </svg>
  );
}
