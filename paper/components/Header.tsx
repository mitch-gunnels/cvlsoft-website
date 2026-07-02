import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";
import { customerFromCookie } from "@/lib/auth";
import { getCartView } from "@/lib/cart";

/** Dunder Mifflin wordmark lockup: stacked-paper mark + serif wordmark. */
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden="true">
        {/* back sheet */}
        <rect x="3.5" y="6" width="15" height="19" rx="2" fill="#ffffff" stroke="#1b3c6e" strokeWidth="1.4" opacity="0.55" />
        {/* front sheet */}
        <rect x="8" y="3.5" width="16.5" height="20.5" rx="2.2" fill="#ffffff" stroke="#1b3c6e" strokeWidth="1.6" />
        <line x1="11.5" y1="9.5" x2="21" y2="9.5" stroke="#1b3c6e" strokeWidth="1.4" />
        <line x1="11.5" y1="13.5" x2="21" y2="13.5" stroke="#1b3c6e" strokeWidth="1.4" />
        <line x1="11.5" y1="17.5" x2="18" y2="17.5" stroke="#1b3c6e" strokeWidth="1.4" />
      </svg>
      <span className="leading-none">
        <span className="block font-serif text-[16px] font-semibold tracking-[0.14em] text-accent">
          DUNDER MIFFLIN
        </span>
        <span className="mt-0.5 block text-[8.5px] font-medium tracking-[0.32em] text-muted">
          PAPER COMPANY, INC.
        </span>
      </span>
    </Link>
  );
}

export async function Header() {
  const customer = await customerFromCookie();
  const cart = customer ? await getCartView(customer.id) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-6">
        <Logo />

        <nav className="hidden sm:flex items-center gap-7 text-sm text-muted">
          <Link href="/products" className="hover:text-foreground">
            Shop paper
          </Link>
          <Link href="/orders" className="hover:text-foreground">
            Orders
          </Link>
        </nav>

        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/account"
            className="flex items-center gap-2 text-muted hover:text-foreground"
          >
            <UserRound className="h-4 w-4" />
            <span className="hidden sm:inline">
              {customer ? customer.name.split(" ")[0] : "Sign in"}
            </span>
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-2 hover:opacity-70"
          >
            <ShoppingBag className="h-5 w-5" />
            {cart && cart.itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
                {cart.itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
