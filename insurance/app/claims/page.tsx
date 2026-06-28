import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { claims, policies } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";
import { insuredLabel } from "@/lib/serializers";
import { FileClaim } from "@/components/FileClaim";

export const dynamic = "force-dynamic";
export const metadata = { title: "Claims" };

const STATUS: Record<string, string> = {
  submitted: "bg-accent/10 text-accent",
  in_review: "bg-warn/10 text-warn",
  approved: "bg-ok/10 text-ok",
  paid: "bg-ok/10 text-ok",
  denied: "bg-bad/10 text-bad",
};

export default async function ClaimsPage() {
  const customer = await customerFromCookie();
  if (!customer) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Claims</h1>
        <p className="mt-3 text-muted">Choose a demo policyholder to manage claims.</p>
        <Link href="/account" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm text-accent-foreground hover:opacity-90">Choose policyholder</Link>
      </div>
    );
  }

  const [rows, pols] = await Promise.all([
    db.query.claims.findMany({ where: eq(claims.customerId, customer.id), orderBy: desc(claims.createdAt) }),
    db.query.policies.findMany({ where: eq(policies.customerId, customer.id), orderBy: asc(policies.createdAt) }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Claims</h1>

      <div className="mt-6">
        <FileClaim policies={pols.map((p) => ({ value: p.policyNumber, label: `${p.policyNumber} — ${insuredLabel(p)}` }))} />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Your claims</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-muted">No claims filed.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((c) => (
            <li key={c.id}>
              <Link href={`/claims/${c.claimNumber}`} className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 hover:border-accent/40">
                <div>
                  <p className="font-mono text-sm">{c.claimNumber}</p>
                  <p className="text-sm text-muted capitalize">{c.type} · loss {new Date(c.dateOfLoss).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  {c.payoutCents > 0 ? <span className="text-sm">{formatPrice(c.payoutCents)}</span> : c.estimateCents > 0 ? <span className="text-sm text-muted">est. {formatPrice(c.estimateCents)}</span> : null}
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS[c.status] ?? "bg-border text-muted"}`}>{c.status.replace("_", " ")}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
