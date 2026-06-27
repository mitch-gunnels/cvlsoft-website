import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import type { Metadata } from "next";
import { formatPrice } from "@/lib/config";
import { getProductBySlug } from "@/lib/storefront";
import { BuyBox } from "@/components/BuyBox";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const gallery = product.images?.length ? product.images : [product.imageUrl];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/products" className="text-sm text-muted hover:text-foreground">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative col-span-2 aspect-square overflow-hidden rounded-xl border border-border bg-surface">
            <Image
              src={gallery[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          {gallery.slice(1, 3).map((src, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface"
            >
              <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="md:pt-4">
          <div className="text-xs text-muted">
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="tracking-label hover:text-foreground"
              >
                {product.category.name}
              </Link>
            )}
          </div>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{product.name}</h1>
          <p className="mt-1 text-muted">{product.colorway}</p>

          <div className="mt-3 flex items-center gap-3 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current" /> {product.rating.toFixed(1)}
            </span>
            <span>·</span>
            <span className="capitalize">{product.gender}</span>
            <span>·</span>
            <span>{product.fit}</span>
          </div>

          <p className="mt-6 text-2xl">{formatPrice(product.priceCents)}</p>
          <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8">
            <BuyBox
              productId={product.slug}
              sizes={product.sizes}
              sizeStock={product.sizeStock}
            />
          </div>

          <dl className="mt-10 border-t border-border pt-6 text-sm text-muted">
            <div className="flex justify-between py-1.5">
              <dt>Material</dt>
              <dd className="text-foreground">{product.material}</dd>
            </div>
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5">
                <dt className="capitalize">{k}</dt>
                <dd className="text-foreground">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between py-1.5">
              <dt>SKU</dt>
              <dd className="font-mono">{product.sku}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt>Shipping</dt>
              <dd>Free over {formatPrice(7500)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
