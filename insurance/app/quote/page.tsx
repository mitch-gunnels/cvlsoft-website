import Link from "next/link";
import { customerFromCookie } from "@/lib/auth";
import { GetQuote } from "@/components/GetQuote";

export const dynamic = "force-dynamic";
export const metadata = { title: "Get a quote" };

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; level?: string }>;
}) {
  const { type, level } = await searchParams;
  const customer = await customerFromCookie();
  if (!customer) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Get a quote</h1>
        <p className="mt-3 text-muted">Choose a demo policyholder first.</p>
        <Link href="/account" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm text-accent-foreground hover:opacity-90">Choose policyholder</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Get a quote</h1>
      <p className="mt-2 text-muted">Instant estimate — adjust the coverage level to see the price change.</p>
      <div className="mt-6"><GetQuote initialType={type ?? "auto"} initialLevel={level ?? "standard"} /></div>
    </div>
  );
}
