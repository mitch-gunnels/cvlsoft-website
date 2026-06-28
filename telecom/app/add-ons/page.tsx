import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { addOns, lineAddOns, lines } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";
import { AddOnIcon } from "@/components/AddOnIcon";
import { AddOnActions, type AddOnLine } from "@/components/AddOnActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Add-ons" };

const CATEGORIES: { key: string; title: string; blurb: string }[] = [
  { key: "protection", title: "Protection", blurb: "Cover your device and your identity." },
  { key: "data", title: "Data & Hotspot", blurb: "More high-speed data when you need it." },
  { key: "international", title: "International", blurb: "Stay connected when you travel." },
  { key: "streaming", title: "Streaming & Music", blurb: "Entertainment, bundled into your bill." },
  { key: "connectivity", title: "Connected Devices & Family", blurb: "Extend your plan to more devices and people." },
];

export default async function AddOnsPage() {
  const customer = await customerFromCookie();

  const [rows, custLines] = await Promise.all([
    db.query.addOns.findMany({ where: eq(addOns.active, true), orderBy: asc(addOns.priceCents) }),
    customer
      ? db.query.lines.findMany({ where: eq(lines.customerId, customer.id) })
      : Promise.resolve([]),
  ]);

  const lineIds = custLines.map((l) => l.id);
  const owned = lineIds.length
    ? await db.query.lineAddOns.findMany({ where: inArray(lineAddOns.lineId, lineIds) })
    : [];
  const ownedSet = new Set(owned.map((o) => `${o.lineId}:${o.addOnId}`));

  const linesFor = (addOnId: string): AddOnLine[] =>
    custLines.map((l) => ({
      id: l.id,
      label: l.nickname || l.phoneNumber,
      has: ownedSet.has(`${l.id}:${addOnId}`),
    }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Add-ons</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Customize any line with extras — protection, international data, hotspot, streaming, and more.
        Add or remove them anytime{ customer ? "" : ", or just ask the assistant" }.
      </p>

      {CATEGORIES.map((cat) => {
        const items = rows.filter((a) => a.category === cat.key);
        if (items.length === 0) return null;
        return (
          <section key={cat.key} className="mt-10">
            <h2 className="text-lg font-semibold">{cat.title}</h2>
            <p className="text-sm text-muted">{cat.blurb}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <div key={a.id} className="flex flex-col rounded-2xl border border-border bg-surface p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <AddOnIcon name={a.icon} className="h-5 w-5" />
                    </div>
                    <p className="text-right">
                      <span className="text-lg font-semibold">{formatPrice(a.priceCents)}</span>
                      <span className="block text-xs text-muted">per month</span>
                    </p>
                  </div>
                  <h3 className="mt-3 font-medium">{a.name}</h3>
                  <p className="mt-1 text-sm text-muted">{a.description}</p>
                  {a.perks.length > 0 && (
                    <ul className="mt-3 space-y-1 text-xs text-muted">
                      {a.perks.map((p) => (
                        <li key={p} className="flex items-start gap-1.5">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" /> {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto">
                    <AddOnActions addOnSlug={a.slug} signedIn={!!customer} lines={linesFor(a.id)} />
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
