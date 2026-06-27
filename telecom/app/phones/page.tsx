import Image from "next/image";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { devices } from "@/lib/db/schema";
import { formatPrice } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Phones" };

export default async function PhonesPage() {
  const rows = await db.query.devices.findMany({
    where: eq(devices.active, true),
    orderBy: asc(devices.priceCents),
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Phones</h1>
      <p className="mt-2 text-muted">Browse the latest devices. Upgrade an eligible line, or just ask the assistant.</p>

      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3">
        {rows.map((d) => (
          <Link key={d.id} href={`/phones/${d.slug}`} className="group rounded-2xl border border-border bg-surface p-4 hover:border-accent/40">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-background">
              <Image src={d.imageUrl} alt={d.name} fill sizes="(max-width:640px) 50vw, 300px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="label mt-3 text-muted">{d.brand}</p>
            <div className="mt-0.5 flex items-baseline justify-between gap-2">
              <h3 className="font-medium">{d.name}</h3>
              <span className="text-sm text-muted">{d.storage}</span>
            </div>
            <p className="mt-1 text-sm">
              <span className="font-medium">{formatPrice(d.monthlyCents)}/mo</span>
              <span className="text-muted"> · {formatPrice(d.priceCents)}</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
