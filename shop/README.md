# Sole & Stride — demo footwear store

A self-contained demo e-commerce app for showcasing **customer-facing AI agent
skills**. A footwear catalog with **per-size inventory** drives the most common
real support flows: fit advice, size-exchange returns, order tracking. It
exposes a clean REST API (catalog → cart → checkout → orders → returns/exchanges)
that an agent drives with a per-customer bearer token, plus a storefront UI for
humans.

Lives inside the `cvlsoft-website` repo as an **independent app** (its own
`package.json`, deployed as a separate Vercel project at `shop.cvlsoft.net`). It
shares no code or styles with the marketing site.

## Stack

- **Next.js 16** (App Router) — UI + API route handlers
- **Postgres + Drizzle ORM** — catalog, carts, orders, returns
- **Stripe** (test mode) — real hosted Checkout
- Tailwind v4

## Quick start

```bash
cd shop
cp .env.example .env.local        # already has local defaults
docker compose up -d              # local Postgres on :5433
pnpm install                      # if not already
pnpm db:push                      # create tables
pnpm db:seed                      # catalog + 3 customers + sample order
pnpm dev                          # http://localhost:3002
```

Catalog/cart/orders/returns work immediately. **Checkout** needs Stripe keys —
paste your new test-account `STRIPE_SECRET_KEY` into `.env.local`, then for
local webhooks:

```bash
stripe listen --forward-to localhost:3002/api/webhooks/stripe
# copy the printed whsec_... into STRIPE_WEBHOOK_SECRET, restart dev
```

(The success page also reconciles the order straight from Stripe, so checkout
still completes even without the webhook running.)

## The AI-agent surface

Machine-readable contract: **`GET /api/openapi`**. Point your agent there.

Seeded customer tokens (send as `Authorization: Bearer <token>`):
`shop_tok_ava`, `shop_tok_marcus`, `shop_tok_priya`.

```bash
# Browse (public)
curl -s "localhost:3002/api/products?category=trail" | jq '.products[].name'
curl -s localhost:3002/api/products/veld-tempo | jq '.product | {name, fit, availableSizes}'

# Act as a customer (size is required)
T="Authorization: Bearer shop_tok_ava"
curl -s -X POST localhost:3002/api/cart/items -H "$T" -H 'content-type: application/json' \
  -d '{"productId":"veld-tempo","size":"10","quantity":1}' | jq
curl -s localhost:3002/api/cart -H "$T" | jq
curl -s -X POST localhost:3002/api/checkout -H "$T" | jq   # → { checkoutUrl }
curl -s localhost:3002/api/orders -H "$T" | jq

# Size exchange against Ava's seeded order (she has the Tempo Knit in size 9):
curl -s localhost:3002/api/orders -H "$T" | jq '.orders[0].items'   # get orderItem id
curl -s -X POST localhost:3002/api/returns -H "$T" -H 'content-type: application/json' \
  -d '{"orderId":"LMN-XXXXXX","type":"exchange",
       "items":[{"orderItemId":"<id>","quantity":1,"exchangeForSize":"10"}]}' | jq
```

Ava is seeded with one fulfilled order (Tempo Knit 9, Classic Low 10), so
"track my order", "start a refund", and "exchange for a different size" all demo
out of the box.

### Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/products` | – | list / search (`q`, `category`, `sort`, `inStock`) |
| GET | `/api/products/{id}` | – | by UUID or slug |
| GET | `/api/categories` | – | categories |
| GET | `/api/me` | ✓ | current customer |
| GET/DELETE | `/api/cart` | ✓ | view / empty cart |
| POST | `/api/cart/items` | ✓ | add line (`productId` + `size`) |
| PATCH/DELETE | `/api/cart/items/{id}` | ✓ | set qty (0 = remove) / remove |
| POST | `/api/checkout` | ✓ | create Stripe session |
| POST | `/api/checkout/confirm` | ✓ | reconcile + finalize |
| GET | `/api/orders` · `/api/orders/{id}` | ✓ | history / detail |
| GET/POST | `/api/returns` | ✓ | list / open RMA (refund or size exchange) |
| POST | `/api/webhooks/stripe` | sig | payment confirmation |

## Deploy (Vercel, monorepo)

1. New Vercel project from the **same** `cvlsoft-website` repo.
2. **Root Directory → `shop`** (this is what makes the subdomain independent).
3. Env vars: `DATABASE_URL` (Neon/Vercel Postgres), `STRIPE_SECRET_KEY`,
   `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`,
   `NEXT_PUBLIC_SITE_URL=https://shop.cvlsoft.net`.
4. Add domain `shop.cvlsoft.net` to this project.
5. Stripe → add webhook endpoint `https://shop.cvlsoft.net/api/webhooks/stripe`
   (event `checkout.session.completed`); paste its secret into the env var.
6. After first deploy, run `pnpm db:push && pnpm db:seed` against the prod DB.

The existing website project keeps Root Directory `.`; it ignores `shop/`
(fenced off in the root `tsconfig.json` and `eslint.config.mjs`).
