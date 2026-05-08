type Props = {
  label: string;
  paragraphs: string[];
  emphasizeLast?: boolean;
};

export default function ChallengeSolution({ label, paragraphs, emphasizeLast = false }: Props) {
  const body = emphasizeLast ? paragraphs.slice(0, -1) : paragraphs;
  const thesis = emphasizeLast ? paragraphs.at(-1) : undefined;

  return (
    <div className="grid gap-8 border-b border-white/[0.06] py-12 md:grid-cols-[200px_1fr] md:gap-16 md:py-16">
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-cyan-400 md:sticky md:top-32">
          {label}
        </p>
      </div>
      <div className="max-w-2xl space-y-5">
        {body.map((p, idx) => (
          <p key={idx} className="text-[17px] leading-relaxed text-slate-300 md:text-[18px]">
            {p}
          </p>
        ))}
        {thesis ? (
          <p className="pt-4 text-[clamp(1.25rem,2.4vw,1.625rem)] font-light leading-relaxed tracking-[-0.01em] text-white">
            {thesis}
          </p>
        ) : null}
      </div>
    </div>
  );
}
