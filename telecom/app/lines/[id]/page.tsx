import Image from "next/image";
import Link from "next/link";
import { and, asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { devices as devicesTable, lines, plans as plansTable } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";
import { planData, serializeLine } from "@/lib/serializers";
import { LineActions } from "@/components/LineActions";

export const dynamic = "force-dynamic";

export default async function LineDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await customerFromCookie();
  if (!customer) notFound();

  const line = await db.query.lines.findFirst({
    where: and(eq(lines.customerId, customer.id), eq(lines.id, id)),
    with: { plan: true, device: true },
  });
  if (!line) notFound();

  const [allPlans, allDevices] = await Promise.all([
    db.query.plans.findMany({ where: eq(plansTable.active, true), orderBy: asc(plansTable.priceCents) }),
    line.upgradeEligible
      ? db.query.devices.findMany({ where: eq(devicesTable.active, true), orderBy: asc(devicesTable.priceCents) })
      : Promise.resolve([]),
  ]);

  const s = serializeLine(line);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/" className="text-sm text-muted hover:text-foreground">← Overview</Link>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{line.nickname || "Line"}</h1>
          <p className="text-muted">{line.phoneNumber}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs ${line.status === "active" ? "bg-ok/10 text-ok" : "bg-border text-muted"}`}>{line.status}</span>
      </div>

      {/* Usage + plan + device summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="label text-muted">Data this cycle</p>
          <p className="mt-1 text-xl font-semibold">{s.usage.used}</p>
          <p className="text-sm text-muted">of {s.usage.limit}</p>
          {s.usage.overage && <p className="mt-1 text-xs text-bad">Over by {Math.round(s.usage.overageMb / 1024 * 10) / 10} GB</p>}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="label text-muted">Plan</p>
          <p className="mt-1 text-xl font-semibold">{line.plan.name}</p>
          <p className="text-sm text-muted">{formatPrice(line.plan.priceCents)}/mo · {planData(line.plan)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="label text-muted">Current phone</p>
          <div className="mt-2 flex items-center gap-3">
            {line.device && (
              <Image src={line.device.imageUrl} alt={line.device.name} width={44} height={44} className="h-11 w-11 rounded-lg border border-border object-cover" />
            )}
            <div>
              <p className="font-semibold">{line.device ? line.device.name : "—"}</p>
              <p className="text-xs text-muted">{line.upgradeEligible ? "Upgrade eligible" : "Not eligible yet"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <LineActions
          lineId={line.id}
          currentPlanSlug={line.plan.slug}
          plans={allPlans.map((p) => ({ slug: p.slug, label: `${p.name} — ${formatPrice(p.priceCents)}/mo` }))}
          upgradeEligible={line.upgradeEligible}
          devices={allDevices.map((d) => ({ slug: d.slug, label: `${d.name} — ${formatPrice(d.monthlyCents)}/mo` }))}
        />
      </div>
    </div>
  );
}
