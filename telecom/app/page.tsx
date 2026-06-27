import Image from "next/image";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { devices } from "@/lib/db/schema";
import { BRAND, formatPrice } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rows = await db.query.devices.findMany({
    where: eq(devices.active, true),
    orderBy: asc(devices.priceCents),
  });

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
        <Link href="/overview" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90">
          Go to my account <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Phone storefront */}
      <div className="mt-12 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold">Shop phones</h2>
        <Link href="/plans" className="text-sm text-accent hover:underline">Compare plans →</Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
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
