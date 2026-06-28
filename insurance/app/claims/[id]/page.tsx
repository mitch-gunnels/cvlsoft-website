import Image from "next/image";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { db } from "@/lib/db";
import { claims } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";
import { isUuid } from "@/lib/serializers";

export const dynamic = "force-dynamic";

const STEPS = ["submitted", "in_review", "approved", "paid"];
const LABELS: Record<string, string> = { submitted: "Submitted", in_review: "In review", approved: "Approved", paid: "Paid" };

export default async function ClaimDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await customerFromCookie();
  if (!customer) notFound();

  const claim = await db.query.claims.findFirst({
    where: and(eq(claims.customerId, customer.id), isUuid(id) ? eq(claims.id, id) : eq(claims.claimNumber, id)),
    with: { policy: true },
  });
  if (!claim) notFound();

  const denied = claim.status === "denied";
  const currentIdx = STEPS.indexOf(claim.status);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/claims" className="text-sm text-muted hover:text-foreground">← All claims</Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold font-mono">{claim.claimNumber}</h1>
          <p className="mt-1 text-sm text-muted capitalize">{claim.type} · {claim.policy?.policyNumber}</p>
        </div>
        {denied && <span className="rounded-full bg-bad/10 px-3 py-1 text-xs font-medium text-bad">Denied</span>}
      </div>

      {/* Status tracker */}
      {!denied && (
        <div className="mt-8 flex items-center">
          {STEPS.map((s, idx) => (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${idx <= currentIdx ? "bg-accent text-accent-foreground" : "bg-border text-muted"}`}>
                  {idx < currentIdx ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span className={`mt-1 text-[11px] ${idx <= currentIdx ? "text-foreground" : "text-muted"}`}>{LABELS[s]}</span>
              </div>
              {idx < STEPS.length - 1 && <div className={`mx-1 h-0.5 flex-1 ${idx < currentIdx ? "bg-accent" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      )}

      <dl className="mt-8 space-y-2 border-y border-border py-4 text-sm">
        <Row k="Date of loss" v={new Date(claim.dateOfLoss).toLocaleDateString()} />
        <Row k="Adjuster" v={claim.adjuster || "—"} />
        <Row k="Estimate" v={claim.estimateCents > 0 ? formatPrice(claim.estimateCents) : "—"} />
        <Row k="Payout" v={claim.payoutCents > 0 ? formatPrice(claim.payoutCents) : "—"} />
      </dl>

      <p className="mt-4 text-sm leading-relaxed">{claim.description}</p>

      {claim.photos.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {claim.photos.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background">
              <Image src={src} alt="" fill sizes="180px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>;
}
