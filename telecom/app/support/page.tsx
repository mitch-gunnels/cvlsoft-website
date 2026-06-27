import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tickets } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { NetworkCheck } from "@/components/NetworkCheck";
import { NewTicket } from "@/components/NewTicket";

export const dynamic = "force-dynamic";
export const metadata = { title: "Support" };

export default async function SupportPage() {
  const customer = await customerFromCookie();
  if (!customer) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Support</h1>
        <p className="mt-3 text-muted">Choose a demo account to manage support.</p>
        <Link href="/account" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm text-accent-foreground hover:opacity-90">Choose account</Link>
      </div>
    );
  }

  const rows = await db.query.tickets.findMany({
    where: eq(tickets.customerId, customer.id),
    orderBy: desc(tickets.createdAt),
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Support</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <NetworkCheck defaultZip={customer.zip} />
        <NewTicket />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Your tickets</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-muted">No tickets yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((t) => (
            <li key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4">
              <div>
                <p className="font-medium">{t.subject}</p>
                <p className="text-sm text-muted">
                  <span className="font-mono">{t.ticketNumber}</span> · {t.category} · {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${t.status === "open" ? "bg-warn/10 text-warn" : "bg-ok/10 text-ok"}`}>{t.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
