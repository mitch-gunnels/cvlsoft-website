"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { formatPrice } from "@/lib/config";

type Storage = { size: string; priceCents: number };
type Color = { name: string; hex: string };

const monthly = (cents: number) => Math.round(cents / 24);

/** Storage tier + color picker with a live price, like a real phone storefront. */
export function PhoneBuyBox({
  storageOptions,
  colorOptions,
}: {
  storageOptions: Storage[];
  colorOptions: Color[];
}) {
  const [storageIdx, setStorageIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);

  const storage = storageOptions[storageIdx] ?? storageOptions[0];
  const color = colorOptions[colorIdx] ?? colorOptions[0];
  const price = storage?.priceCents ?? 0;

  return (
    <div>
      {/* Live price */}
      <p className="text-2xl font-semibold">
        {formatPrice(monthly(price))}
        <span className="text-base font-normal text-muted">/mo for 24 mo</span>
      </p>
      <p className="text-sm text-muted">or {formatPrice(price)} full price</p>

      {/* Storage */}
      <div className="mt-6">
        <p className="label text-muted">
          Storage{storage ? <span className="ml-1 normal-case tracking-normal text-foreground">· {storage.size}</span> : null}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {storageOptions.map((o, i) => {
            const active = i === storageIdx;
            return (
              <button
                key={o.size}
                onClick={() => setStorageIdx(i)}
                aria-pressed={active}
                className={`rounded-xl border px-4 py-2 text-left text-sm transition ${
                  active ? "border-accent ring-1 ring-accent/30 bg-accent/5" : "border-border hover:border-accent/40"
                }`}
              >
                <span className="block font-medium">{o.size}</span>
                <span className="block text-xs text-muted">{formatPrice(monthly(o.priceCents))}/mo</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      {colorOptions.length > 0 && (
        <div className="mt-5">
          <p className="label text-muted">
            Color{color ? <span className="ml-1 normal-case tracking-normal text-foreground">· {color.name}</span> : null}
          </p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {colorOptions.map((c, i) => {
              const active = i === colorIdx;
              return (
                <button
                  key={c.name}
                  onClick={() => setColorIdx(i)}
                  title={c.name}
                  aria-label={c.name}
                  aria-pressed={active}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                    active ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-accent/40"
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {active && (
                    <Check className="h-4 w-4" style={{ color: isLight(c.hex) ? "#0f172a" : "#fff" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** Rough luminance check so the check mark stays visible on light swatches. */
function isLight(hex: string): boolean {
  const m = hex.replace("#", "");
  if (m.length < 6) return true;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}
