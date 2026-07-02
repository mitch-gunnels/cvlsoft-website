# CLAUDE.md

## Coming-soon gate (REMOVED 2026-06-27)

The site is **live** — the coming-soon gate has been removed: `middleware.ts` is
deleted and `app/components/ConditionalFooter.tsx` no longer lists `"/"` in
`NO_FOOTER_ROUTES`. `/` serves the real home page (`app/page.tsx`) with the global
footer. The `/coming-soon` page still exists but is no longer the default.

To re-gate, re-add a root-path rewrite middleware to `/coming-soon` and put `"/"`
back in `NO_FOOTER_ROUTES`.

## Monorepo: demo sub-apps (`shop/`, `telecom/`, `insurance/`, `paper/`)

Each of these is a **separate Next.js app** for showcasing customer-facing AI
agent skills. They are NOT part of the website build — each has its own
`package.json` (pnpm + Drizzle + Stripe), its own `.env.local`, and deploys as a
**separate Vercel project** with its own Root Directory + subdomain. The website
(this repo root) uses npm and is unaffected.

| Dir | Demo | Dev port | Postgres | Subdomain |
|---|---|---|---|---|
| `shop/` | Sole & Stride (footwear) | 3002 | 5433 | `shop.cvlsoft.net` |
| `telecom/` | telecom carrier | 3003 | 5434 | `telecom.cvlsoft.net` |
| `insurance/` | insurance | 3004 | 5435 | `insurance.cvlsoft.net` |
| `paper/` | Dunder Mifflin (paper) | 3005 | 5436 | `paper.cvlsoft.net` |

Each sub-app is fenced off from the website's tooling so `next build` at the root
never tries to compile it:
- root `tsconfig.json` → `exclude` contains the dir name
- root `eslint.config.mjs` → `globalIgnores` contains `"<dir>/**"`

Work on a sub-app from inside its own directory (see its `README.md`). Don't add
a sub-app to the website's dependencies or import across the boundary. Per the
demo-domains convention, attach each subdomain on `.net`, `.com` **and** `.ai`.
