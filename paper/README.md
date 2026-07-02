# Dunder Mifflin — demo paper store

A self-contained demo e-commerce app for showcasing **customer-facing AI agent
skills**, themed as the *Dunder Mifflin Paper Company* (Scranton branch). A paper
catalog with **per-format inventory** (Letter / Legal / A4 / #10 …) drives the
most common support flows: stock questions, format exchanges, reorders, order
tracking. It exposes a clean REST API (catalog → cart → checkout → orders →
returns/exchanges) that an agent drives with a per-customer bearer token, plus a
storefront UI for humans.

Lives inside the `cvlsoft-website` repo as an **independent app** (its own
`package.json`, deployed as a separate Vercel project at `paper.cvlsoft.net`). It
shares no code or styles with the marketing site or the other demo stores.

Checkout is **instant and payment-free** — placing an order creates a paid order,
decrements inventory, and empties the cart, so the whole order/return lifecycle
demos without any payment processor.

## Stack

- **Next.js 16** (App Router) — UI + API route handlers
- **Postgres + Drizzle ORM** — catalog, carts, orders, returns
- Tailwind v4
- Product art is **locally-generated SVG** (`scripts/gen-product-images.ts`) — no
  external image hosts, so nothing ever 404s.

## Quick start

```bash
cd paper
cp .env.example .env.local        # already has local defaults
docker compose up -d              # local Postgres on :5436
pnpm install                      # if not already
pnpm images                       # render ream art → public/products/*.svg
pnpm db:migrate                   # create tables
pnpm db:seed                      # catalog + 4 employees + sample order
pnpm dev                          # http://localhost:3005
```

Catalog, cart, checkout, orders, and returns all work immediately — no keys or
external services required.

## The AI-agent surface

Machine-readable contract: **`GET /api/openapi`**. Point your agent there.

Seeded customer tokens (send as `Authorization: Bearer <token>`):
`dm_tok_michael`, `dm_tok_pam`, `dm_tok_jim`, `dm_tok_dwight`.

```bash
# Browse (public)
curl -s "localhost:3005/api/products?category=copy" | jq '.products[].name'
curl -s localhost:3005/api/products/premium-multipurpose | jq '.product | {name, fit, availableSizes}'

# Act as a customer (paper size is required)
T="Authorization: Bearer dm_tok_michael"
curl -s -X POST localhost:3005/api/cart/items -H "$T" -H 'content-type: application/json' \
  -d '{"productId":"premium-multipurpose","size":"Letter","quantity":5}' | jq
curl -s localhost:3005/api/cart -H "$T" | jq
curl -s -X POST localhost:3005/api/checkout -H "$T" | jq   # → { orderId, orderNumber, redirectUrl }
curl -s localhost:3005/api/orders -H "$T" | jq

# Format exchange against Michael's seeded order (Premium Multipurpose, Letter):
curl -s localhost:3005/api/orders -H "$T" | jq '.orders[0].items'   # get orderItem id
curl -s -X POST localhost:3005/api/returns -H "$T" -H 'content-type: application/json' \
  -d '{"orderId":"DM-XXXXXX","type":"exchange",
       "items":[{"orderItemId":"<id>","quantity":1,"exchangeForSize":"A4"}]}' | jq
```

Michael Scott is seeded with one fulfilled order (Premium Multipurpose ×5 Letter,
Cardstock Cover ×1), so "track my order", "start a refund", and "swap me to A4"
all demo out of the box.

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
| POST | `/api/checkout` | ✓ | place cart as a paid order (no payment processor) |
| GET | `/api/orders` · `/api/orders/{id}` | ✓ | history / detail |
| GET/POST | `/api/returns` | ✓ | list / open RMA (refund or format exchange) |

## Catalog data

Everything lives in **`lib/catalog.ts`** (categories + products). `lib/db/seed.ts`
loads it into Postgres and `scripts/gen-product-images.ts` renders the matching
ream art — edit the catalog once and run `pnpm images && pnpm db:reset`.

## Deploy (Vercel, monorepo)

1. New Vercel project from the **same** `cvlsoft-website` repo.
2. **Root Directory → `paper`** (this is what makes the subdomain independent).
3. Env vars: `DATABASE_URL` (Neon/Vercel Postgres) and
   `NEXT_PUBLIC_SITE_URL=https://paper.cvlsoft.net`.
4. Add domain `paper.cvlsoft.net` to this project.
5. After first deploy, run `pnpm db:migrate && pnpm db:seed` against the prod DB.
   (Ream art is committed under `public/products/`, so it ships with the build.)

The existing website project keeps Root Directory `.`; it ignores `paper/`
(fenced off in the root `tsconfig.json` and `eslint.config.mjs`).
