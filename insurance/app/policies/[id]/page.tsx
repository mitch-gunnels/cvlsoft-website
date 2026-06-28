import Image from "next/image";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Anchor } from "lucide-react";
import { db } from "@/lib/db";
import { policies } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { BRAND, formatDollars, formatPrice } from "@/lib/config";
import { insuredLabel, isUuid } from "@/lib/serializers";
import { riderBySlug } from "@/lib/catalog";
import { CoverageCheck } from "@/components/CoverageCheck";
import { PayButton } from "@/components/PayButton";
import { PolicyRiderList } from "@/components/PolicyRiderList";

export const dynamic = "force-dynamic";

export default async function PolicyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await customerFromCookie();
  if (!customer) notFound();

  const policy = await db.query.policies.findFirst({
    where: and(eq(policies.customerId, customer.id), isUuid(id) ? eq(policies.id, id) : eq(policies.policyNumber, id)),
    with: { coverages: true, riders: true },
  });
  if (!policy) notFound();
  const i = policy.insured || {};

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/overview" className="text-sm text-muted hover:text-foreground">← Overview</Link>

      <div className="mt-4 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="relative aspect-[16/9] bg-background">
            <Image src={policy.imageUrl} alt={insuredLabel(policy)} fill sizes="(max-width:768px) 100vw, 520px" className="object-cover" priority />
          </div>
          <div className="p-5">
            <p className="label text-muted capitalize">{policy.type} policy · {policy.policyNumber}</p>
            <h1 className="mt-1 text-2xl font-semibold">{insuredLabel(policy)}</h1>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {policy.type === "auto" ? (
                <><Field k="VIN" v={String(i.vin ?? "—")} /><Field k="Trim" v={String(i.trim ?? "—")} /></>
              ) : (
                <><Field k="Year built" v={String(i.yearBuilt ?? "—")} /><Field k="Sq ft" v={String(i.sqft ?? "—")} /></>
              )}
              <Field k="Premium" v={`${formatPrice(policy.premiumCents)}/mo`} />
              <Field k="Deductible" v={policy.deductibleCents > 0 ? formatDollars(policy.deductibleCents) : "—"} />
              <Field k="Renews" v={new Date(policy.renewalDate).toLocaleDateString()} />
              <Field k="Status" v={policy.status} />
            </dl>
          </div>
        </div>

        <div className="space-y-4">
          {policy.amountDueCents > 0 && (
            <div className="rounded-2xl border border-warn/40 bg-warn/5 p-5">
              <p className="label text-warn">Payment due</p>
              <p className="mt-1 text-2xl font-semibold">{formatPrice(policy.amountDueCents)}</p>
              {policy.dueDate && <p className="text-sm text-muted">Due {new Date(policy.dueDate).toLocaleDateString()}</p>}
              <div className="mt-3"><PayButton policyNumber={policy.policyNumber} /></div>
            </div>
          )}

          {policy.type === "auto" && (
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
              <div className="flex items-center justify-between">
                <p className="label text-accent">Insurance ID card</p>
                <Anchor className="h-4 w-4 text-accent" />
              </div>
              <p className="mt-2 font-semibold">{BRAND.name}</p>
              <dl className="mt-2 space-y-1 text-sm">
                <Field k="Policy" v={policy.policyNumber} />
                <Field k="Insured" v={customer.name} />
                <Field k="Vehicle" v={insuredLabel(policy)} />
                <Field k="Effective" v={`${new Date(policy.effectiveDate).toLocaleDateString()} – ${new Date(policy.renewalDate).toLocaleDateString()}`} />
              </dl>
            </div>
          )}

          <PolicyRiderList
            policyId={policy.id}
            items={policy.riders.map((r) => ({
              slug: r.riderSlug,
              name: r.label,
              price: formatPrice(r.priceCents),
              icon: riderBySlug(r.riderSlug)?.icon ?? "Shield",
            }))}
          />
        </div>
      </div>

      {/* Coverages */}
      <h2 className="mt-10 text-lg font-semibold">Coverages</h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-background text-muted">
            <tr><th className="px-4 py-2 text-left font-medium">Coverage</th><th className="px-4 py-2 text-right font-medium">Limit</th><th className="px-4 py-2 text-right font-medium">Deductible</th></tr>
          </thead>
          <tbody>
            {policy.coverages.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-2.5">{c.label}</td>
                <td className="px-4 py-2.5 text-right">{c.limitCents > 0 ? formatDollars(c.limitCents) : "Included"}</td>
                <td className="px-4 py-2.5 text-right text-muted">{c.deductibleCents > 0 ? formatDollars(c.deductibleCents) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <CoverageCheck policyNumber={policy.policyNumber} />
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="label text-muted">Need to file something?</p>
          <p className="mt-1 text-sm text-muted">Start a claim against this policy.</p>
          <Link href="/claims" className="mt-3 inline-block rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">File a claim</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium capitalize">{v}</dd>
    </div>
  );
}
