import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { signInAs, signOut } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account" };

export default async function AccountPage() {
  const [current, all] = await Promise.all([
    customerFromCookie(),
    db.query.customers.findMany({ orderBy: asc(customers.name) }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Demo account</h1>
      <p className="mt-2 text-muted">
        No real login — pick a seeded customer. Each has an API token your AI agent uses as
        <code className="mx-1 rounded bg-background px-1.5 py-0.5 text-xs">Authorization: Bearer &lt;token&gt;</code>.
      </p>

      {current && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
          <span className="text-sm">Signed in as <strong>{current.name}</strong> · {current.accountNumber}</span>
          <form action={signOut}><button className="text-sm text-muted hover:text-foreground">Sign out</button></form>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {all.map((c) => {
          const active = current?.id === c.id;
          return (
            <div key={c.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-4 py-4">
              <div className="min-w-0">
                <p className="font-medium">{c.name}</p>
                <p className="truncate text-sm text-muted">{c.email} · {c.accountNumber} · ZIP {c.zip}</p>
                <p className="mt-1 truncate font-mono text-xs text-muted">{c.apiToken}</p>
              </div>
              <form action={signInAs}>
                <input type="hidden" name="customerId" value={c.id} />
                <button disabled={active} className="whitespace-nowrap rounded-full bg-accent px-5 py-2 text-sm text-accent-foreground hover:opacity-90 disabled:opacity-40">
                  {active ? "Current" : "Use this"}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
