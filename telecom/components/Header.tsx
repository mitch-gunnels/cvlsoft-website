import Link from "next/link";
import { Signal, UserRound } from "lucide-react";
import { BRAND } from "@/lib/config";
import { customerFromCookie } from "@/lib/auth";

export async function Header() {
  const customer = await customerFromCookie();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <Signal className="h-5 w-5 text-accent" />
          {BRAND.name}
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted">
          <Link href="/" className="hover:text-foreground">Overview</Link>
          <Link href="/plans" className="hover:text-foreground">Plans</Link>
          <Link href="/bills" className="hover:text-foreground">Billing</Link>
          <Link href="/support" className="hover:text-foreground">Support</Link>
        </nav>
        <Link href="/account" className="flex items-center gap-2 text-sm text-muted hover:text-foreground">
          <UserRound className="h-4 w-4" />
          <span className="hidden sm:inline">{customer ? customer.name.split(" ")[0] : "Sign in"}</span>
        </Link>
      </div>
    </header>
  );
}
