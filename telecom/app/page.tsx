import Link from "next/link";
import { and, asc, eq } from "drizzle-orm";
import { ArrowRight, CreditCard, Smartphone } from "lucide-react";
import { db } from "@/lib/db";
import { bills, lines } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";
import { serializeLine } from "@/lib/serializers";

export const dynamic = "force-dynamic";

function UsageBar({ pct, overage }: { pct: number | null; overage: boolean }) {
  if (pct === null)
    return <div className="mt-2 text-xs text-muted">Unlimited data</div>;
  const color = overage ? "bg-bad" : pct >= 80 ? "bg-warn" : "bg-accent";
  return (
    <div className="mt-2">
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const customer = await customerFromCookie();

  if (!customer) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Welcome to Beacon Mobile</h1>
        <p className="mt-3 text-muted">Pick a demo account to view its lines, usage, and bills.</p>
        <Link href="/account" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90">
          Choose an account
        </Link>
      </div>
    );
  }

  const [custLines, dueBills] = await Promise.all([
    db.query.lines.findMany({ where: eq(lines.customerId, customer.id), with: { plan: true, device: true }, orderBy: asc(lines.createdAt) }),
    db.query.bills.findMany({ where: and(eq(bills.customerId, customer.id), eq(bills.status, "due")) }),
  ]);
  const balance = dueBills.reduce((s, b) => s + b.totalCents, 0);
  const nextDue = dueBills.map((b) => b.dueDate).sort((a, b) => +new Date(a) - +new Date(b))[0];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label text-muted">Account {customer.accountNumber}</p>
          <h1 className="mt-1 text-2xl font-semibold">Hi, {customer.name.split(" ")[0]}</h1>
        </div>
      </div>

      {/* Balance card */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2 rounded-2xl border border-border bg-surface p-6">
          <p className="label text-muted">Balance due</p>
          <p className="mt-1 text-3xl font-semibold">{formatPrice(balance)}</p>
          <p className="mt-1 text-sm text-muted">
            {balance > 0 && nextDue ? `Due ${new Date(nextDue).toLocaleDateString()}` : "You're all paid up."}
          </p>
          {balance > 0 && (
            <Link href="/bills" className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90">
              <CreditCard className="h-4 w-4" /> Pay bill
            </Link>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="label text-muted">Lines</p>
          <p className="mt-1 text-3xl font-semibold">{custLines.length}</p>
          <Link href="/plans" className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
            Compare plans <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Lines */}
      <h2 className="mt-10 text-lg font-semibold">Your lines</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {custLines.map((l) => {
          const s = serializeLine(l);
          return (
            <Link key={l.id} href={`/lines/${l.id}`} className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{l.nickname || "Line"}</p>
                  <p className="text-sm text-muted">{l.phoneNumber}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs ${l.status === "active" ? "bg-ok/10 text-ok" : "bg-border text-muted"}`}>
                  {l.status}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted">{s.plan.name}</span>
                <span className={s.usage.overage ? "text-bad font-medium" : "text-foreground"}>
                  {s.usage.used} / {s.usage.limit}
                </span>
              </div>
              <UsageBar pct={s.usage.percentUsed} overage={s.usage.overage} />
              {s.usage.overage && (
                <p className="mt-2 text-xs text-bad">Over by {Math.round(s.usage.overageMb / 1024 * 10) / 10} GB — consider Unlimited.</p>
              )}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <Smartphone className="h-3.5 w-3.5" />
                {l.device ? l.device.name : "No device on file"}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
