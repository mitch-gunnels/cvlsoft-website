import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";
import { BRAND } from "@/lib/config";
import { customerFromCookie } from "@/lib/auth";
import { getCartView } from "@/lib/cart";

export async function Header() {
  const customer = await customerFromCookie();
  const cart = customer ? await getCartView(customer.id) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="font-serif text-xl tracking-tight">
          {BRAND.name}
        </Link>

        <nav className="hidden sm:flex items-center gap-7 text-sm text-muted">
          <Link href="/products" className="hover:text-foreground">
            Shop all
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
