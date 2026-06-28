import Link from "next/link";
import { Scale } from "lucide-react";
import { PRODUCTS, fromPriceCents, productCategories } from "@/lib/catalog";
import { formatPrice } from "@/lib/config";
import { ShopStorefront, type ShopProduct } from "@/components/ShopStorefront";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop coverage" };

export default function ShopPage() {
  const products: ShopProduct[] = PRODUCTS.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    tagline: p.tagline,
    image: p.image,
    icon: p.icon,
    fromCents: fromPriceCents(p),
    from: `${formatPrice(fromPriceCents(p))}/mo`,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Hero */}
      <section className="rounded-3xl border border-border bg-surface px-8 py-12 text-center sm:py-14">
        <p className="label text-accent">Harbor Insurance</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Coverage for everything you care about.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Auto, home, life, and more — pick a coverage level, add the extras you want, and get an instant quote.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/quote" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90">Get a quote</Link>
          <Link href="/compare" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-accent/40">
            <Scale className="h-4 w-4" /> Compare coverage
          </Link>
        </div>
      </section>

      <div className="mt-12 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold">Shop coverage</h2>
        <Link href="/riders" className="text-sm text-accent hover:underline">Browse add-ons →</Link>
      </div>

      <div className="mt-6">
        <ShopStorefront products={products} categories={productCategories} />
      </div>
    </div>
  );
}
