type Props = {
  text: string;
  attribution: string;
};

export default function PullQuote({ text, attribution }: Props) {
  return (
    <figure className="border-b border-white/[0.06] py-16 md:py-24">
      <blockquote className="max-w-4xl">
        <p className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-light italic leading-snug tracking-[-0.01em] text-white">
          &ldquo;{text}&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-6 font-mono text-[12px] uppercase tracking-[0.22em] text-slate-400">
        — {attribution}
      </figcaption>
    </figure>
  );
}
