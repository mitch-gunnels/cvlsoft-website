"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, X } from "lucide-react";

export type CompareDevice = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  monthly: string;
  price: string;
  storages: string;
  colors: { name: string; hex: string }[];
  specs: {
    display: string;
    chip: string;
    camera: string;
    battery: string;
    charging: string;
    water: string;
    os: string;
  } | null;
};

const MAX = 4;

const ROWS: { label: string; get: (d: CompareDevice) => React.ReactNode }[] = [
  { label: "Price", get: (d) => <><span className="font-medium">From {d.monthly}/mo</span><span className="block text-xs text-muted">{d.price} full price</span></> },
  { label: "Storage", get: (d) => d.storages },
  { label: "Colors", get: (d) => (
    <div className="flex flex-wrap gap-1.5">
      {d.colors.map((c) => <span key={c.name} title={c.name} className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: c.hex }} />)}
    </div>
  ) },
  { label: "Display", get: (d) => d.specs?.display ?? "—" },
  { label: "Chip", get: (d) => d.specs?.chip ?? "—" },
  { label: "Camera", get: (d) => d.specs?.camera ?? "—" },
  { label: "Battery", get: (d) => d.specs?.battery ?? "—" },
  { label: "Charging", get: (d) => d.specs?.charging ?? "—" },
  { label: "Durability", get: (d) => d.specs?.water ?? "—" },
  { label: "OS", get: (d) => d.specs?.os ?? "—" },
];

export function PhoneCompare({ devices, initial }: { devices: CompareDevice[]; initial: string[] }) {
  const valid = initial.filter((s) => devices.some((d) => d.slug === s));
  const [selected, setSelected] = useState<string[]>(
    (valid.length ? valid : devices.slice(0, 3).map((d) => d.slug)).slice(0, MAX),
  );

  const bySlug = new Map(devices.map((d) => [d.slug, d]));
  const picked = selected.map((s) => bySlug.get(s)!).filter(Boolean);

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length >= MAX ? prev : [...prev, slug],
    );
  }

  return (
    <div>
      {/* Picker */}
      <p className="label text-muted">Pick up to {MAX} phones</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {devices.map((d) => {
          const on = selected.includes(d.slug);
          const full = !on && selected.length >= MAX;
          return (
            <button
              key={d.slug}
              onClick={() => toggle(d.slug)}
              disabled={full}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                on ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted hover:border-accent/40 hover:text-foreground"
              } ${full ? "cursor-not-allowed opacity-40" : ""}`}
            >
              {on ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {d.name}
            </button>
          );
        })}
      </div>

      {/* Table */}
      {picked.length === 0 ? (
        <p className="mt-10 text-center text-muted">Select phones above to compare.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-32 align-bottom" />
                {picked.map((d) => (
                  <th key={d.slug} className="p-3 text-left align-bottom">
                    <Link href={`/phones/${d.slug}`} className="group block">
                      <div className="relative mx-auto aspect-square w-24 overflow-hidden rounded-xl border border-border bg-surface">
                        <Image src={d.image} alt={d.name} fill sizes="96px" className="object-cover" />
                      </div>
                      <p className="label mt-2 text-muted">{d.brand}</p>
                      <p className="font-semibold group-hover:text-accent">{d.name}</p>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={row.label} className={ri % 2 ? "bg-surface" : ""}>
                  <th scope="row" className="rounded-l-lg p-3 text-left text-sm font-medium text-muted">{row.label}</th>
                  {picked.map((d) => (
                    <td key={d.slug} className="p-3 align-top text-sm last:rounded-r-lg">{row.get(d)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
