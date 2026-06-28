import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { Check, Scale } from "lucide-react";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { formatPrice } from "@/lib/config";
import { planData } from "@/lib/serializers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Plans" };

export default async function PlansPage() {
  const rows = await db.query.plans.findMany({ where: eq(plans.active, true), orderBy: asc(plans.priceCents) });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold">Plans</h1>
        <Link href="/plans/compare" className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
          <Scale className="h-4 w-4" /> Compare all features
        </Link>
      </div>
      <p className="mt-2 text-muted">Switch any line to a new plan from its line page (or just ask the assistant).</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {rows.map((p) => {
          const featured = p.slug === "unlimited";
          return (
            <div key={p.id} className={`flex flex-col rounded-2xl border bg-surface p-6 ${featured ? "border-accent ring-1 ring-accent/30" : "border-border"}`}>
              {featured && <span className="label mb-2 w-fit rounded-full bg-accent/10 px-2 py-0.5 text-accent">Most popular</span>}
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="mt-1 text-3xl font-semibold">
                {formatPrice(p.priceCents)}<span className="text-sm font-normal text-muted">/mo</span>
              </p>
              <p className="mt-1 text-sm text-muted">{planData(p)} {p.dataGb === -1 ? "" : "high-speed data"}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {perk}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
