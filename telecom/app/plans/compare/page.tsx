import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { Check, Minus } from "lucide-react";
import { db } from "@/lib/db";
import { plans, type Plan } from "@/lib/db/schema";
import { formatPrice } from "@/lib/config";
import { planData } from "@/lib/serializers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Compare plans" };

const TIER: Record<string, number> = { essentials: 0, standard: 1, unlimited: 2, "unlimited-plus": 3 };
const tier = (p: Plan) => TIER[p.slug] ?? 0;

const yes = <Check className="mx-auto h-4 w-4 text-ok" />;
const no = <Minus className="mx-auto h-4 w-4 text-muted/50" />;

const ROWS: { label: string; render: (p: Plan) => React.ReactNode }[] = [
  { label: "Monthly price", render: (p) => <span className="font-semibold">{formatPrice(p.priceCents)}<span className="text-xs font-normal text-muted">/mo</span></span> },
  { label: "High-speed data", render: (p) => planData(p) },
  { label: "Mobile hotspot", render: (p) => (p.hotspotGb > 0 ? `${p.hotspotGb} GB` : no) },
  { label: "5G access", render: () => yes },
  { label: "Unlimited talk & text", render: () => yes },
  { label: "Streaming quality", render: (p) => (["480p SD", "720p HD", "1080p HD", "4K UHD"][tier(p)]) },
  { label: "No overage charges", render: (p) => (tier(p) >= 2 ? yes : no) },
  { label: "Premium data (no slowdowns)", render: (p) => (tier(p) >= 3 ? yes : no) },
  { label: "International roaming", render: (p) => (tier(p) >= 3 ? yes : no) },
  { label: "Streaming bundle included", render: (p) => (tier(p) >= 3 ? yes : no) },
];

export default async function ComparePlansPage() {
  const rows = await db.query.plans.findMany({ where: eq(plans.active, true), orderBy: asc(plans.priceCents) });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Compare plans</h1>
          <p className="mt-2 text-muted">Every feature, side by side. Switch any line from its line page or just ask the assistant.</p>
        </div>
        <Link href="/plans" className="text-sm text-accent hover:underline">← Plan cards</Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-56" />
              {rows.map((p) => {
                const featured = p.slug === "unlimited";
                return (
                  <th key={p.id} className={`p-3 text-center align-bottom ${featured ? "rounded-t-xl bg-accent/5" : ""}`}>
                    {featured && <span className="label mb-1 block text-accent">Most popular</span>}
                    <span className="block text-base font-semibold">{p.name}</span>
                    <span className="block text-sm text-muted">{formatPrice(p.priceCents)}/mo</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, ri) => (
              <tr key={row.label} className={ri % 2 ? "bg-surface" : ""}>
                <th scope="row" className="rounded-l-lg p-3 text-left text-sm font-medium text-muted">{row.label}</th>
                {rows.map((p) => {
                  const featured = p.slug === "unlimited";
                  return (
                    <td key={p.id} className={`p-3 text-center text-sm ${featured ? "bg-accent/5" : ""} last:rounded-r-lg`}>
                      {row.render(p)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-muted">
        Want extras like device protection or international data?{" "}
        <Link href="/add-ons" className="text-accent hover:underline">Browse add-ons →</Link>
      </p>
    </div>
  );
}
