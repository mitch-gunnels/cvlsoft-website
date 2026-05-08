import type { Stat } from "../data";

export default function StatRow({ stats }: { stats: [Stat, Stat, Stat] }) {
  return (
    <div className="border-y border-white/[0.06] py-12 md:py-16">
      <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-slate-500">Impact</p>
      <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <p className="text-[clamp(2.25rem,4vw,3rem)] font-light leading-none tracking-[-0.02em] text-white">
              {stat.value}
            </p>
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
