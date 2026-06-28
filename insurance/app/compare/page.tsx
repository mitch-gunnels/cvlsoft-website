import { PRODUCTS, fromPriceCents } from "@/lib/catalog";
import { formatPrice } from "@/lib/config";
import { ProductCompare, type CompareProduct } from "@/components/ProductCompare";

export const dynamic = "force-dynamic";
export const metadata = { title: "Compare coverage" };

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ products?: string }>;
}) {
  const { products: q } = await searchParams;

  const products: CompareProduct[] = PRODUCTS.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.image,
    from: `${formatPrice(fromPriceCents(p))}/mo`,
    bestFor: p.bestFor,
    quoteType: p.quoteType,
    tiers: p.tiers.map((t) => ({ key: t.key, name: t.name, price: `${formatPrice(t.priceCents)}/mo`, limit: t.limit })),
  }));

  const initial = (q ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Compare coverage</h1>
      <p className="mt-2 text-muted">Put policies side by side — pricing, coverage levels, and what each is best for.</p>
      <div className="mt-6">
        <ProductCompare products={products} initial={initial} />
      </div>
    </div>
  );
}
