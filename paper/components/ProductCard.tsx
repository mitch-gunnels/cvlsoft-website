import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/config";
import type { Product } from "@/lib/db/schema";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-surface border border-border">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.inventory <= 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/80 px-2 py-1 text-[10px] tracking-label text-background">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
          <span className="text-sm text-muted whitespace-nowrap">
            {formatPrice(product.priceCents)}
          </span>
        </div>
        {product.colorway && (
          <p className="text-xs text-muted">{product.colorway}</p>
        )}
      </div>
    </Link>
  );
}
