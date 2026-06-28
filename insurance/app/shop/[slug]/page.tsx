import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Scale } from "lucide-react";
import { RIDERS, productBySlug } from "@/lib/catalog";
import { formatPrice } from "@/lib/config";
import { ShopIcon } from "@/components/ShopIcon";
import { TierPicker } from "@/components/TierPicker";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: productBySlug(slug)?.name ?? "Coverage" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const riders = RIDERS.filter((r) => r.appliesTo.includes(product.slug)).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <Link href="/shop" className="text-sm text-muted hover:text-foreground">← All coverage</Link>
        <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
          <Scale className="h-4 w-4" /> Compare
        </Link>
      </div>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
            <Image src={product.image} alt={product.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />
          </div>
          <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
            <p className="label text-muted">Why Harbor</p>
            <ul className="mt-3 space-y-2 text-sm">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {h}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted"><span className="font-medium text-foreground">Best for:</span> {product.bestFor}</p>
          </div>
        </div>

        <div>
          <p className="label flex items-center gap-1.5 text-accent">
            <ShopIcon name={product.icon} className="h-4 w-4" /> {product.category}
          </p>
          <h1 className="mt-1 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-1 text-lg text-muted">{product.tagline}</p>
          <p className="mt-4 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-6">
            <TierPicker tiers={product.tiers} quoteType={product.quoteType} />
          </div>
        </div>
      </div>

      {/* Compare coverage levels */}
      <div className="mt-14">
        <h2 className="text-lg font-semibold">Compare coverage levels</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {product.tiers.map((t) => {
            const featured = t.key === "standard";
            return (
              <div key={t.key} className={`flex flex-col rounded-2xl border bg-surface p-5 ${featured ? "border-accent ring-1 ring-accent/30" : "border-border"}`}>
                {featured && <span className="label mb-2 w-fit rounded-full bg-accent/10 px-2 py-0.5 text-accent">Most popular</span>}
                <h3 className="font-semibold">{t.name}</h3>
                <p className="mt-1 text-2xl font-semibold">{formatPrice(t.priceCents)}<span className="text-sm font-normal text-muted">/mo</span></p>
                <p className="mt-1 text-xs text-muted">{t.limit}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {t.coverages.map((c) => (
                    <li key={c} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {c}</li>
                  ))}
                </ul>
                {product.quoteType && (
                  <Link href={`/quote?type=${product.quoteType}&level=${t.key}`} className={`mt-5 rounded-full px-4 py-2 text-center text-sm font-medium ${featured ? "bg-accent text-accent-foreground hover:opacity-90" : "border border-border hover:border-accent/40"}`}>
                    Choose {t.name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Relevant riders */}
      {riders.length > 0 && (
        <div className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Popular add-ons</h2>
            <Link href="/riders" className="text-sm text-accent hover:underline">All add-ons →</Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {riders.map((r) => (
              <Link key={r.slug} href="/riders" className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ShopIcon name={r.icon} className="h-5 w-5" />
                </div>
                <p className="mt-3 font-medium">{r.name}</p>
                <p className="mt-1 text-sm text-muted">{formatPrice(r.priceCents)}/mo</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
