"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ShopIcon } from "@/components/ShopIcon";

export type ShopProduct = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  image: string;
  icon: string;
  from: string;
  fromCents: number;
};

type Sort = "featured" | "price-asc" | "price-desc";

export function ShopStorefront({ products, categories }: { products: ShopProduct[]; categories: string[] }) {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<Sort>("featured");

  const shown = useMemo(() => {
    let list = cat === "All" ? products : products.filter((p) => p.category === cat);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.fromCents - b.fromCents);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.fromCents - a.fromCents);
    return list;
  }, [products, cat, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((c) => {
            const active = c === cat;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                  active ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted"
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <Link key={p.slug} href={`/shop/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface hover:border-accent/40">
            <div className="relative aspect-[16/10] bg-background">
              <Image src={p.image} alt={p.name} fill sizes="(max-width:640px) 100vw, 360px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium">
                <ShopIcon name={p.icon} className="h-3.5 w-3.5 text-accent" />
                {p.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted">{p.tagline}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm"><span className="text-muted">from </span><span className="font-semibold">{p.from}</span></p>
                <span className="inline-flex items-center gap-1 text-sm text-accent">View <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
