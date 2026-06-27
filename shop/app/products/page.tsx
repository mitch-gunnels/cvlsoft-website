import Link from "next/link";
import { listCategories, listProducts } from "@/lib/storefront";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

type SP = { category?: string; q?: string; sort?: string };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([
    listProducts({ categorySlug: sp.category, q: sp.q, sort: sp.sort }),
    listCategories(),
  ]);

  const activeCat = categories.find((c) => c.slug === sp.category);

  const chip = (label: string, href: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      className={`rounded-full border px-4 py-2 text-sm ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-surface text-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-serif text-3xl">
        {activeCat ? activeCat.name : sp.q ? `Results for “${sp.q}”` : "Shop all"}
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {chip("All", "/products", !sp.category)}
        {categories.map((c) =>
          chip(c.name, `/products?category=${c.slug}`, sp.category === c.slug),
        )}
      </div>

      <p className="mt-6 text-sm text-muted">{products.length} items</p>

      {products.length === 0 ? (
        <p className="mt-10 text-muted">Nothing here yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
