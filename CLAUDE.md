# CLAUDE.md

## `_archive/` — retired pages and assets (2026-08-13)

Dead routes, unreferenced images/video and one-off production artifacts live in
`_archive/`, which is **gitignored**. See `_archive/README.md` for the full
manifest, what was deliberately *kept* in `public/`, and how to restore a page.

Before archiving anything else, grep for template-literal asset paths — e.g.
`app/page.tsx:251` loads partner logos as `` `/partners/${brand.file}` ``, which a
literal-path grep will not find.

Routes are now: `/`, `/about`, `/contact`, `/privacy`, `/terms` and the
`/api/demo-request` handler. Nothing else.

## Coming-soon gate (REMOVED 2026-06-27, page archived 2026-08-13)

The site is **live**. `middleware.ts` is deleted, `ConditionalFooter` is gone
(`app/layout.tsx` renders `SiteFooter` directly), and the `/coming-soon` page has
been moved to `_archive/app/coming-soon/`. `/` serves the real home page
(`app/page.tsx`) with the global footer.

To re-gate: restore `_archive/app/coming-soon/`, re-add a root-path rewrite
middleware pointing at it, and reintroduce a footer guard for that route.

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
