import { formatPrice } from "./config";
import type {
  Category,
  Order,
  OrderItem,
  Product,
  Return,
  ReturnItem,
} from "./db/schema";

export function serializeProduct(
  p: Product,
  category?: Pick<Category, "slug" | "name"> | null,
) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceCents: p.priceCents,
    price: formatPrice(p.priceCents),
    currency: p.currency,
    image: p.imageUrl,
    images: p.images,
    brand: p.brand,
    gender: p.gender,
    material: p.material,
    colorway: p.colorway,
    useCase: p.useCase,
    fit: p.fit,
    sizes: p.sizes,
    /** Sizes that are actually purchasable right now. */
    availableSizes: p.sizes.filter((s) => (p.sizeStock[s] ?? 0) > 0),
    sizeStock: p.sizeStock,
    specs: p.specs,
    inventory: p.inventory,
    inStock: p.inventory > 0,
    sku: p.sku,
    rating: p.rating,
    category: category ? { slug: category.slug, name: category.name } : undefined,
  };
}

export function serializeOrder(o: Order & { items: OrderItem[] }) {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    createdAt: o.createdAt,
    currency: o.currency,
    subtotalCents: o.subtotalCents,
    shippingCents: o.shippingCents,
    totalCents: o.totalCents,
    subtotal: formatPrice(o.subtotalCents),
    shipping: formatPrice(o.shippingCents),
    total: formatPrice(o.totalCents),
    shippingAddress: o.shippingAddress ?? null,
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.nameSnapshot,
      size: i.size,
      priceCents: i.priceCents,
      price: formatPrice(i.priceCents),
      quantity: i.quantity,
      lineTotalCents: i.priceCents * i.quantity,
    })),
  };
}

export function serializeReturn(r: Return & { items: ReturnItem[] }) {
  return {
    id: r.id,
    rmaNumber: r.rmaNumber,
    orderId: r.orderId,
    type: r.type,
    status: r.status,
    reason: r.reason,
    createdAt: r.createdAt,
    items: r.items.map((i) => ({
      id: i.id,
      orderItemId: i.orderItemId,
      quantity: i.quantity,
      exchangeForSize: i.exchangeForSize,
    })),
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (s: string) => UUID_RE.test(s);
