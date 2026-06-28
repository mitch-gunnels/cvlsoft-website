"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, X } from "lucide-react";

export type CompareTier = { key: string; name: string; price: string; limit: string };
export type CompareProduct = {
  slug: string;
  name: string;
  category: string;
  image: string;
  from: string;
  bestFor: string;
  quoteType: string | null;
  tiers: CompareTier[];
};

const MAX = 4;

export function ProductCompare({ products, initial }: { products: CompareProduct[]; initial: string[] }) {
  const valid = initial.filter((s) => products.some((p) => p.slug === s));
  const [selected, setSelected] = useState<string[]>(
    (valid.length ? valid : products.slice(0, 3).map((p) => p.slug)).slice(0, MAX),
  );

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const picked = selected.map((s) => bySlug.get(s)!).filter(Boolean);
  const tierFor = (p: CompareProduct, key: string) => p.tiers.find((t) => t.key === key);

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length >= MAX ? prev : [...prev, slug],
    );
  }

  const ROWS: { label: string; render: (p: CompareProduct) => React.ReactNode }[] = [
    { label: "Starting price", render: (p) => <span className="font-medium">{p.from}</span> },
    { label: "Basic", render: (p) => tierLine(tierFor(p, "basic")) },
    { label: "Standard", render: (p) => tierLine(tierFor(p, "standard")) },
    { label: "Premium", render: (p) => tierLine(tierFor(p, "premium")) },
    { label: "Best for", render: (p) => <span className="text-muted">{p.bestFor}</span> },
  ];

  return (
    <div>
      <p className="label text-muted">Pick up to {MAX} to compare</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {products.map((p) => {
          const on = selected.includes(p.slug);
          const full = !on && selected.length >= MAX;
          return (
            <button
              key={p.slug}
              onClick={() => toggle(p.slug)}
              disabled={full}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                on ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted hover:border-accent/40 hover:text-foreground"
              } ${full ? "cursor-not-allowed opacity-40" : ""}`}
            >
              {on ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {p.name.replace(" Insurance", "")}
            </button>
          );
        })}
      </div>

      {picked.length === 0 ? (
        <p className="mt-10 text-center text-muted">Select coverage above to compare.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-36 align-bottom" />
                {picked.map((p) => (
                  <th key={p.slug} className="p-3 text-left align-bottom">
                    <Link href={`/shop/${p.slug}`} className="group block">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-surface">
                        <Image src={p.image} alt={p.name} fill sizes="200px" className="object-cover" />
                      </div>
                      <p className="mt-2 font-semibold group-hover:text-accent">{p.name.replace(" Insurance", "")}</p>
                      <p className="text-xs text-muted">{p.category}</p>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={row.label} className={ri % 2 ? "bg-surface" : ""}>
                  <th scope="row" className="rounded-l-lg p-3 text-left text-sm font-medium text-muted">{row.label}</th>
                  {picked.map((p) => (
                    <td key={p.slug} className="p-3 align-top text-sm last:rounded-r-lg">{row.render(p)}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="p-3" />
                {picked.map((p) => (
                  <td key={p.slug} className="p-3 align-top">
                    {p.quoteType && (
                      <Link href={`/quote?type=${p.quoteType}`} className="inline-block rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">
                        Get a quote
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function tierLine(t?: CompareTier) {
  if (!t) return "—";
  return (
    <>
      <span className="font-medium">{t.price}</span>
      <span className="block text-xs text-muted">{t.limit}</span>
    </>
  );
}
