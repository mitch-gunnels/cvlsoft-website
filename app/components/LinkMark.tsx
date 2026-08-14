/** Nodes and the edges between them — the smallest thing that is a graph
    rather than a bullet. Same mark the Blueprint pillar icon is built
    from, so the eyebrow says what the product is instead of just marking
    a spot.

    Three nodes by default: two is a link, three is a path, and a path is
    what a workflow is. The nodes are 5px, not the 7px of a lone `Node` —
    in a row at 7px they read as an ellipsis — and the edges are 6px so
    the whole mark stays under 30px and does not become a rule with dots
    on it. Only the trailing node glows: the eye travels along the path
    into the label, and three lit dots at this size are a smear rather
    than three points.

    Lifted out of page.tsx so the hero animation can head its own
    overview with the same mark every section eyebrow on the page uses. */
const LINK_EDGE = {
  light: "bg-cyan-600/45",
  dark: "bg-cyan-400/40",
  accent: "bg-[#0f1419]/40",
} as const;

const LINK_DOT = 5;
const LINK_GAP = 6;

export default function LinkMark({
  tone = "light",
  nodes = 3,
  className = "",
}: {
  tone?: "light" | "dark" | "accent";
  nodes?: number;
  className?: string;
}) {
  const dot = tone === "dark" ? "bg-cyan-400" : tone === "accent" ? "bg-[#0f1419]" : "bg-cyan-600";
  const glow =
    tone === "dark"
      ? "shadow-[0_0_9px_rgba(34,211,238,0.65)]"
      : tone === "accent"
        ? ""
        : "shadow-[0_0_7px_rgba(8,145,178,0.45)]";
  return (
    <span className={`inline-flex shrink-0 items-center ${className}`} aria-hidden="true">
      {Array.from({ length: nodes }, (_, i) => (
        <span key={i} className="contents">
          {i > 0 ? <span className={`h-px ${LINK_EDGE[tone]}`} style={{ width: LINK_GAP }} /> : null}
          <span
            className={`rounded-full ${dot} ${i === nodes - 1 ? glow : ""}`}
            style={{ height: LINK_DOT, width: LINK_DOT }}
          />
        </span>
      ))}
    </span>
  );
}
