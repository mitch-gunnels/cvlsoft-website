import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { orders, products, returnItems, returns } from "@/lib/db/schema";
import { ApiError, json, parseBody, requireCustomer, route } from "@/lib/api";
import { rmaNumber } from "@/lib/ids";
import { isUuid, serializeReturn } from "@/lib/serializers";

export const dynamic = "force-dynamic";

/** GET /api/returns — the customer's return requests. */
export const GET = route(async (req) => {
  const customer = await requireCustomer(req);
  const rows = await db.query.returns.findMany({
    where: eq(returns.customerId, customer.id),
    with: { items: true },
    orderBy: desc(returns.createdAt),
  });
  return json({ returns: rows.map(serializeReturn) });
});

const createSchema = z.object({
  orderId: z.string().min(1).describe("Order UUID or order number (DM-…)"),
  type: z.enum(["refund", "exchange"]).optional().default("refund"),
  reason: z.string().max(1000).optional().default(""),
  items: z
    .array(
      z.object({
        orderItemId: z.string().min(1),
        quantity: z.number().int().positive(),
        exchangeForSize: z
          .string()
          .min(1)
          .optional()
          .describe("Required per item when type=exchange"),
      }),
    )
    .optional()
    .describe("Omit (refund only) to return the whole order"),
});

/** POST /api/returns — open a refund or size-exchange RMA. */
export const POST = route(async (req) => {
  const customer = await requireCustomer(req);
  const body = await parseBody(req, createSchema);

  const order = await db.query.orders.findFirst({
    where: and(
      eq(orders.customerId, customer.id),
      isUuid(body.orderId)
        ? eq(orders.id, body.orderId)
        : eq(orders.orderNumber, body.orderId),
    ),
    with: { items: true },
  });
  if (!order) throw new ApiError(404, `Order '${body.orderId}' not found`);
  if (!["paid", "fulfilled"].includes(order.status)) {
    throw new ApiError(409, `Order ${order.orderNumber} is not eligible for return (status: ${order.status})`);
  }

  if (body.type === "exchange" && (!body.items || body.items.length === 0)) {
    throw new ApiError(400, "Exchanges require items[] with exchangeForSize per line");
  }

  // Resolve which lines are being returned.
  const byId = new Map(order.items.map((i) => [i.id, i]));
  const requested =
    body.items && body.items.length > 0
      ? body.items
      : order.items.map((i) => ({
          orderItemId: i.id,
          quantity: i.quantity,
          exchangeForSize: undefined as string | undefined,
        }));

  for (const r of requested) {
    const oi = byId.get(r.orderItemId);
    if (!oi) throw new ApiError(400, `Line ${r.orderItemId} is not part of this order`);
    if (r.quantity > oi.quantity) {
      throw new ApiError(400, `Cannot return ${r.quantity} of '${oi.nameSnapshot}' (ordered ${oi.quantity})`);
    }
    if (body.type === "exchange") {
      if (!r.exchangeForSize) {
        throw new ApiError(400, `exchangeForSize required for '${oi.nameSnapshot}'`);
      }
      const product = await db.query.products.findFirst({
        where: eq(products.id, oi.productId),
      });
      if (product && product.sizes.length) {
        if (!product.sizes.includes(r.exchangeForSize)) {
          throw new ApiError(400, `Size '${r.exchangeForSize}' not offered for '${oi.nameSnapshot}'`);
        }
        if ((product.sizeStock[r.exchangeForSize] ?? 0) <= 0) {
          throw new ApiError(409, `Size '${r.exchangeForSize}' of '${oi.nameSnapshot}' is out of stock`);
        }
      }
    }
  }

  const [created] = await db
    .insert(returns)
    .values({
      rmaNumber: rmaNumber(),
      orderId: order.id,
      customerId: customer.id,
      type: body.type,
      reason: body.reason,
      status: "requested",
    })
    .returning();

  await db.insert(returnItems).values(
    requested.map((r) => ({
      returnId: created.id,
      orderItemId: r.orderItemId,
      quantity: r.quantity,
      exchangeForSize: r.exchangeForSize ?? null,
    })),
  );

  const full = await db.query.returns.findFirst({
    where: eq(returns.id, created.id),
    with: { items: true },
  });

  return json({ return: serializeReturn(full!) }, { status: 201 });
});
