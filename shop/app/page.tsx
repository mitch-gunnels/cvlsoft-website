import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/config";
import { featuredProducts, listCategories } from "@/lib/storefront";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, categories] = await Promise.all([
    featuredProducts(8),
    listCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
        <p className="tracking-label text-xs text-muted">{BRAND.tagline}</p>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.1] sm:text-6xl">
          Find your perfect fit.
        </h1>
        <p className="mt-5 max-w-md text-muted">
          Running, trail, court and everyday sneakers — curated, honestly sized,
          and easy to exchange. Free shipping over {BRAND.currencySymbol}75.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          Shop the collection <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted hover:text-foreground hover:border-foreground/30"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-6 mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl">Most loved</h2>
          <Link href="/products" className="text-sm text-muted hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
