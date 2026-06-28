import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { policies, policyRiders } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";
import { insuredLabel } from "@/lib/serializers";
import { RIDERS, riderCategories } from "@/lib/catalog";
import { ShopIcon } from "@/components/ShopIcon";
import { RiderActions, type RiderPolicy } from "@/components/RiderActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Add-ons & riders" };

const BLURB: Record<string, string> = {
  Auto: "Extras that ride along with your car policy.",
  "Home & Property": "Fill the gaps in your home or renters coverage.",
  Everyday: "Protection that follows you, not a single policy.",
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default async function RidersPage() {
  const customer = await customerFromCookie();

  const custPolicies = customer
    ? await db.query.policies.findMany({ where: eq(policies.customerId, customer.id) })
    : [];
  const policyIds = custPolicies.map((p) => p.id);
  const owned = policyIds.length
    ? await db.query.policyRiders.findMany({ where: inArray(policyRiders.policyId, policyIds) })
    : [];
  const ownedSet = new Set(owned.map((o) => `${o.policyId}:${o.riderSlug}`));

  const policiesFor = (slug: string, appliesTo: string[]): RiderPolicy[] =>
    custPolicies
      .filter((p) => appliesTo.includes(p.type))
      .map((p) => ({
        id: p.id,
        label: `${cap(p.type)} · ${insuredLabel(p)}`,
        has: ownedSet.has(`${p.id}:${slug}`),
      }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Add-ons &amp; riders</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Customize any policy with endorsements — roadside, water backup, jewelry coverage, and more.
        Add or remove them anytime{customer ? "" : ", or just ask the assistant"}.
      </p>

      {riderCategories.map((cat) => {
        const items = RIDERS.filter((r) => r.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="mt-10">
            <h2 className="text-lg font-semibold">{cat}</h2>
            <p className="text-sm text-muted">{BLURB[cat]}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => (
                <div key={r.slug} className="flex flex-col rounded-2xl border border-border bg-surface p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <ShopIcon name={r.icon} className="h-5 w-5" />
                    </div>
                    <p className="text-right">
                      <span className="text-lg font-semibold">{formatPrice(r.priceCents)}</span>
                      <span className="block text-xs text-muted">per month</span>
                    </p>
                  </div>
                  <h3 className="mt-3 font-medium">{r.name}</h3>
                  <p className="mt-1 text-sm text-muted">{r.description}</p>
                  {r.perks.length > 0 && (
                    <ul className="mt-3 space-y-1 text-xs text-muted">
                      {r.perks.map((p) => (
                        <li key={p} className="flex items-start gap-1.5">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" /> {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 text-xs text-muted">Works with: {r.appliesTo.map(cap).join(", ")}</p>
                  <div className="mt-auto">
                    <RiderActions riderSlug={r.slug} signedIn={!!customer} policies={policiesFor(r.slug, r.appliesTo)} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
