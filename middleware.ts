import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ──────────────────────────────────────────────────────────
   TEMPORARY: gate the site behind the coming-soon page.
   Visiting "/" serves /coming-soon while keeping the URL at "/".
   The real home page is untouched at app/page.tsx.

   To go live later: delete this file (and remove "/" from
   NO_FOOTER_ROUTES in app/components/ConditionalFooter.tsx).
   ────────────────────────────────────────────────────────── */

export function middleware(request: NextRequest) {
  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

// Match only the root path — every other route is unaffected.
export const config = {
  matcher: ["/"],
};
