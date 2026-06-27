# CLAUDE.md

## Coming-soon gate (TEMPORARY)

The site is currently gated behind the coming-soon page. Visiting `/` serves
`/coming-soon` while keeping the URL at `/`. The real home page is untouched at
`app/page.tsx`.

**To go live (remove the gate):**
1. Delete `middleware.ts` (the root-path rewrite).
2. In `app/components/ConditionalFooter.tsx`, remove `"/"` from `NO_FOOTER_ROUTES`
   (leave `"/coming-soon"`).

After this, `/` serves the real home page again and the global footer returns.

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
