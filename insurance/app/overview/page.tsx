import Image from "next/image";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Car, FileText, Home as HomeIcon, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { claims, policies } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";
import { insuredLabel } from "@/lib/serializers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Overview" };

export default async function Overview() {
  const customer = await customerFromCookie();
  if (!customer) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-accent" />
        <h1 className="mt-4 text-2xl font-semibold">Welcome to Harbor Insurance</h1>
        <p className="mt-3 text-muted">Pick a demo policyholder to view policies, claims, and ID cards.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/account" className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90">
            Choose a policyholder
          </Link>
          <Link href="/" className="inline-block rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-accent/40">
            Browse coverage
          </Link>
        </div>
      </div>
    );
  }

  const [pols, custClaims] = await Promise.all([
    db.query.policies.findMany({ where: eq(policies.customerId, customer.id), orderBy: desc(policies.createdAt) }),
    db.query.claims.findMany({ where: eq(claims.customerId, customer.id), orderBy: desc(claims.createdAt) }),
  ]);
  const amountDue = pols.reduce((s, p) => s + p.amountDueCents, 0);
  const monthly = pols.reduce((s, p) => s + p.premiumCents, 0);
  const duePolicy = pols.find((p) => p.amountDueCents > 0);
  const openClaims = custClaims.filter((c) => ["submitted", "in_review", "approved"].includes(c.status));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="label text-muted">Account {customer.accountNumber}</p>
      <h1 className="mt-1 text-2xl font-semibold">Hi, {customer.name.split(" ")[0]}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2 rounded-2xl border border-border bg-surface p-6">
          <p className="label text-muted">Amount due</p>
          <p className="mt-1 text-3xl font-semibold">{formatPrice(amountDue)}</p>
          <p className="mt-1 text-sm text-muted">
            {amountDue > 0 && duePolicy?.dueDate ? `Due ${new Date(duePolicy.dueDate).toLocaleDateString()} · ${formatPrice(monthly)}/mo total` : `${formatPrice(monthly)}/mo · all paid up`}
          </p>
          {duePolicy && (
            <Link href={`/policies/${duePolicy.policyNumber}`} className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90">
              Review &amp; pay
            </Link>
          )}
        </div>
        <Link href="/claims" className="rounded-2xl border border-border bg-surface p-6 hover:border-accent/40">
          <p className="label text-muted">Open claims</p>
          <p className="mt-1 text-3xl font-semibold">{openClaims.length}</p>
          <p className="mt-1 text-sm text-accent">View all claims →</p>
        </Link>
      </div>

      <div className="mt-10 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Your policies</h2>
        <Link href="/" className="text-sm text-accent hover:underline">Shop coverage →</Link>
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {pols.map((p) => (
          <Link key={p.id} href={`/policies/${p.policyNumber}`} className="group overflow-hidden rounded-2xl border border-border bg-surface hover:border-accent/40">
            <div className="relative aspect-[16/9] bg-background">
              <Image src={p.imageUrl} alt={insuredLabel(p)} fill sizes="(max-width:640px) 100vw, 400px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium capitalize">
                {p.type === "auto" ? <Car className="h-3.5 w-3.5" /> : <HomeIcon className="h-3.5 w-3.5" />}
                {p.type}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{insuredLabel(p)}</p>
                  <p className="font-mono text-xs text-muted">{p.policyNumber}</p>
                </div>
                <span className="text-sm">{formatPrice(p.premiumCents)}/mo</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                <FileText className="h-3.5 w-3.5" />
                Renews {new Date(p.renewalDate).toLocaleDateString()}
                {p.amountDueCents > 0 && <span className="ml-auto rounded-full bg-warn/10 px-2 py-0.5 font-medium text-warn">Payment due</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
