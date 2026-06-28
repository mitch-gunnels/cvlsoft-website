import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { ArrowRight, Scale } from "lucide-react";
import { db } from "@/lib/db";
import { devices } from "@/lib/db/schema";
import { BRAND } from "@/lib/config";
import { PhoneStorefront, type StoreDevice } from "@/components/PhoneStorefront";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rows = await db.query.devices.findMany({
    where: eq(devices.active, true),
    orderBy: asc(devices.priceCents),
  });

  const storeDevices: StoreDevice[] = rows.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    brand: d.brand,
    image: d.imageUrl,
    storage: d.storage,
    storageCount: d.storageOptions.length,
    colorHexes: d.colorOptions.map((c) => c.hex),
    monthlyCents: d.monthlyCents,
    priceCents: d.priceCents,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Hero */}
      <section className="rounded-3xl border border-border bg-surface px-8 py-12 text-center sm:py-16">
        <p className="label text-accent">{BRAND.tagline}</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          The latest phones on a network that just works.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Shop devices, pick a plan, and manage everything in one place — free shipping, no activation fees.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/overview" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90">
            Go to my account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/compare" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-accent/40">
            <Scale className="h-4 w-4" /> Compare phones
          </Link>
        </div>
      </section>

      {/* Phone storefront */}
      <div className="mt-12 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold">Shop phones</h2>
        <Link href="/plans" className="text-sm text-accent hover:underline">Compare plans →</Link>
      </div>

      <div className="mt-6">
        <PhoneStorefront devices={storeDevices} />
      </div>
    </div>
  );
}
