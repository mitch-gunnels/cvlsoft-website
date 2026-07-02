import { NextResponse } from "next/server";
import { BRAND, siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * GET /api/openapi — machine-readable contract for the storefront API.
 * Point your customer-facing AI agent at this to auto-discover its tools.
 */
export function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: `${BRAND.name} Storefront API`,
      version: "1.0.0",
      description:
        "Demo paper-supply commerce API for customer-facing AI agents. Catalog is public; cart/checkout/orders/returns require a customer bearer token (each seeded customer has one).",
    },
    servers: [{ url: siteUrl() }],
    components: {
      securitySchemes: {
        customerToken: {
          type: "http",
          scheme: "bearer",
          description:
            "Per-customer API token. Seeded demo tokens: dm_tok_michael, dm_tok_pam, dm_tok_jim, dm_tok_dwight.",
        },
      },
    },
    security: [{ customerToken: [] }],
    paths: {
      "/api/products": {
        get: {
          summary: "List / search products",
          security: [],
          parameters: [
            { name: "q", in: "query", schema: { type: "string" }, description: "Name search" },
            { name: "category", in: "query", schema: { type: "string" }, description: "Category slug" },
            { name: "sort", in: "query", schema: { type: "string", enum: ["newest", "price_asc", "price_desc", "rating"] } },
            { name: "inStock", in: "query", schema: { type: "boolean" } },
            { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
            { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          ],
          responses: { "200": { description: "Matching products" } },
        },
      },
      "/api/products/{id}": {
        get: {
          summary: "Get a product by UUID or slug",
          security: [],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Product" }, "404": { description: "Not found" } },
        },
      },
      "/api/categories": {
        get: { summary: "List categories", security: [], responses: { "200": { description: "Categories" } } },
      },
      "/api/me": {
        get: { summary: "Current authenticated customer", responses: { "200": { description: "Customer" }, "401": { description: "Unauthenticated" } } },
      },
      "/api/cart": {
        get: { summary: "Get the open cart with totals", responses: { "200": { description: "Cart" } } },
        delete: { summary: "Empty the cart", responses: { "200": { description: "Cart" } } },
      },
      "/api/cart/items": {
        post: {
          summary: "Add a product to the cart (merges existing line)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["productId"],
                  properties: {
                    productId: { type: "string", description: "Product UUID or slug" },
                    size: { type: "string", description: "Paper size / format — required when the product offers sizes (see product.availableSizes), e.g. Letter, Legal, A4" },
                    quantity: { type: "integer", default: 1, minimum: 1, maximum: 99 },
                  },
                },
              },
            },
          },
          responses: { "201": { description: "Updated cart" }, "404": { description: "Product not found" }, "409": { description: "Out of stock" } },
        },
      },
      "/api/cart/items/{id}": {
        patch: {
          summary: "Set a cart line quantity (0 removes it)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", required: ["quantity"], properties: { quantity: { type: "integer", minimum: 0, maximum: 99 } } } } },
          },
          responses: { "200": { description: "Updated cart" } },
        },
        delete: {
          summary: "Remove a cart line",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Updated cart" } },
        },
      },
      "/api/checkout": {
        post: {
          summary: "Place the cart as a paid order (demo — no payment processor)",
          responses: { "201": { description: "{ orderId, orderNumber, redirectUrl }" }, "400": { description: "Empty cart" } },
        },
      },
      "/api/orders": {
        get: { summary: "List the customer's orders", responses: { "200": { description: "Orders" } } },
      },
      "/api/orders/{id}": {
        get: {
          summary: "Get an order by UUID or order number (DM-…)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Order" }, "404": { description: "Not found" } },
        },
      },
      "/api/returns": {
        get: { summary: "List the customer's returns", responses: { "200": { description: "Returns" } } },
        post: {
          summary: "Open a return (RMA) against a paid/fulfilled order",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["orderId"],
                  properties: {
                    orderId: { type: "string", description: "Order UUID or number" },
                    type: { type: "string", enum: ["refund", "exchange"], default: "refund" },
                    reason: { type: "string" },
                    items: {
                      type: "array",
                      description: "Omit (refund only) to return the whole order. For exchanges, one entry per line with exchangeForSize.",
                      items: {
                        type: "object",
                        required: ["orderItemId", "quantity"],
                        properties: {
                          orderItemId: { type: "string" },
                          quantity: { type: "integer", minimum: 1 },
                          exchangeForSize: { type: "string", description: "Required when type=exchange" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: { "201": { description: "Created return" }, "409": { description: "Order not eligible" } },
        },
      },
    },
  };

  return NextResponse.json(spec);
}
