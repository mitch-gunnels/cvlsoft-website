"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";

// Routes that render full-screen without the global site footer.
// "/" is here only while the coming-soon gate (middleware.ts) rewrites
// the root to /coming-soon — remove it when the site goes live.
const NO_FOOTER_ROUTES = new Set(["/coming-soon", "/"]);

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (NO_FOOTER_ROUTES.has(pathname)) return null;
  return <SiteFooter />;
}
