# CLAUDE.md

## Coming-soon gate (REMOVED 2026-06-27)

The site is **live** — the coming-soon gate has been removed: `middleware.ts` is
deleted and `app/components/ConditionalFooter.tsx` no longer lists `"/"` in
`NO_FOOTER_ROUTES`. `/` serves the real home page (`app/page.tsx`) with the global
footer. The `/coming-soon` page still exists but is no longer the default.

To re-gate, re-add a root-path rewrite middleware to `/coming-soon` and put `"/"`
back in `NO_FOOTER_ROUTES`.

## Monorepo: demo shop (`shop/`)

`shop/` is a **separate Next.js app** ("Sole & Stride", a demo footwear store
for showcasing customer-facing AI agent skills). It is NOT part of the website
build — it has its own `package.json` (pnpm + Drizzle + Stripe), its own
`.env.local`, and deploys as a **separate Vercel project** with Root Directory
`shop` on `shop.cvlsoft.net`. The website (this repo root) uses npm and is
unaffected.

The shop is fenced off from the website's tooling so `next build` at the root
never tries to compile it:
- root `tsconfig.json` → `exclude` contains `"shop"`
- root `eslint.config.mjs` → `globalIgnores` contains `"shop/**"`

Work on the shop from inside `shop/` (see `shop/README.md`). Don't add `shop` to
the website's dependencies or import across the boundary.
