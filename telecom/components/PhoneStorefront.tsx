"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/config";

export type StoreDevice = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  storage: string;
  storageCount: number;
  colorHexes: string[];
  monthlyCents: number;
  priceCents: number;
};

type Sort = "featured" | "price-asc" | "price-desc";

export function PhoneStorefront({ devices }: { devices: StoreDevice[] }) {
  const brands = useMemo(
    () => ["All", ...Array.from(new Set(devices.map((d) => d.brand)))],
    [devices],
  );
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState<Sort>("featured");

  const shown = useMemo(() => {
    let list = brand === "All" ? devices : devices.filter((d) => d.brand === brand);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceCents - a.priceCents);
    return list;
  }, [devices, brand, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => {
            const active = b === brand;
            return (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                  active ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted"
          aria-label="Sort phones"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {shown.map((d) => (
          <Link key={d.id} href={`/phones/${d.slug}`} className="group rounded-2xl border border-border bg-surface p-4 hover:border-accent/40">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-background">
              <Image src={d.image} alt={d.name} fill sizes="(max-width:640px) 50vw, 300px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="label mt-3 text-muted">{d.brand}</p>
            <div className="mt-0.5 flex items-baseline justify-between gap-2">
              <h3 className="font-medium">{d.name}</h3>
              <span className="text-sm text-muted">{d.storage}</span>
            </div>
            <p className="mt-1 text-sm">
              <span className="font-medium">From {formatPrice(d.monthlyCents)}/mo</span>
              <span className="text-muted"> · {formatPrice(d.priceCents)}</span>
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1">
                {d.colorHexes.slice(0, 4).map((hex, i) => (
                  <span key={i} className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: hex }} />
                ))}
              </div>
              {d.storageCount > 1 && <span className="text-xs text-muted">· {d.storageCount} sizes</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
