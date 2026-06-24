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
