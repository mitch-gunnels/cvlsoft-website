# Beacon Mobile — demo telecom portal

A self-contained demo wireless-carrier app for showcasing **customer-facing AI
agent skills** in an *account & service* shape (not a product cart): explain a
bill, change a plan, check usage, upgrade a device, pay a bill, troubleshoot the
network, add a line.

Sibling demo to the footwear shop; lives in the `cvlsoft-website` repo as its own
app, deployed as a separate Vercel project at `telecom.cvlsoft.net`.

## Stack
- Next.js 16 (App Router) — portal UI + API route handlers
- Postgres + Drizzle ORM
- Tailwind v4

## Quick start
```bash
cd telecom
cp .env.example .env.local      # has local defaults
docker compose up -d            # Postgres on :5434
pnpm install
pnpm db:migrate && pnpm db:seed
pnpm dev                        # http://localhost:3003
```

## The AI-agent surface
Contract: **`GET /api/openapi`**. Seeded tokens (`Authorization: Bearer <token>`):
`bm_tok_ava`, `bm_tok_marcus`, `bm_tok_priya`.

```bash
T="Authorization: Bearer bm_tok_ava"
curl -s localhost:3003/api/me -H "$T" | jq                       # account + lines + balance
curl -s localhost:3003/api/bills -H "$T" | jq '.bills[0]'        # latest bill (explain charges)
curl -s "localhost:3003/api/usage" -H "$T" | jq                  # data usage per line
curl -s -X POST localhost:3003/api/lines/<id>/plan -H "$T" \
  -H 'content-type: application/json' -d '{"planId":"unlimited"}' # change plan
curl -s "localhost:3003/api/network?zip=73301" | jq              # outage check
```

Ava is seeded with a 3-GB **data overage** on a Standard line (so "why is my bill
higher?" → upgrade to Unlimited demos cleanly), an **upgrade-eligible** line, an
open network ticket, and a due bill. Marcus's billing ZIP is in an **outage** area.

### Endpoints
`GET /api/me` · `GET /api/plans[/:id]` · `GET /api/devices[/:id]` ·
`GET/POST /api/lines` · `GET/PATCH /api/lines/:id` · `POST /api/lines/:id/plan` ·
`GET /api/lines/:id/upgrade` · `POST /api/lines/:id/device` · `GET /api/usage` ·
`GET /api/bills[/:id]` · `POST /api/bills/:id/pay` · `GET/POST /api/tickets` ·
`GET /api/network` · `POST /api/network/report`

## Deploy (Vercel, monorepo)
Separate Vercel project, **Root Directory = `telecom`**, framework **Next.js**,
**Include source files outside Root Directory = OFF**, env `DATABASE_URL` +
`NEXT_PUBLIC_SITE_URL`. Domain `telecom.cvlsoft.net`. Run `db:migrate && db:seed`
against the prod DB after first deploy.
