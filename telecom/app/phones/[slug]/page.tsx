import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { Scale } from "lucide-react";
import { db } from "@/lib/db";
import { devices, lines } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { OrderPhone } from "@/components/OrderPhone";
import { PhoneBuyBox } from "@/components/PhoneBuyBox";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await db.query.devices.findFirst({ where: eq(devices.slug, slug) });
  return { title: d?.name ?? "Phone" };
}

const SPEC_ROWS: { key: keyof NonNullable<typeof devices.$inferSelect.specs>; label: string }[] = [
  { key: "display", label: "Display" },
  { key: "chip", label: "Chip" },
  { key: "camera", label: "Camera" },
  { key: "battery", label: "Battery" },
  { key: "charging", label: "Charging" },
  { key: "water", label: "Durability" },
  { key: "os", label: "OS" },
];

export default async function PhonePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const device = await db.query.devices.findFirst({ where: eq(devices.slug, slug) });
  if (!device) notFound();

  const customer = await customerFromCookie();
  const custLines = customer
    ? await db.query.lines.findMany({ where: eq(lines.customerId, customer.id), with: { device: true } })
    : [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-muted hover:text-foreground">← All phones</Link>
        <Link href={`/compare?phones=${device.slug}`} className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
          <Scale className="h-4 w-4" /> Compare
        </Link>
      </div>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
          <Image src={device.imageUrl} alt={device.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />
        </div>

        <div>
          <p className="label text-muted">{device.brand}</p>
          <h1 className="mt-1 text-3xl font-semibold">{device.name}</h1>
          <p className="mt-4 leading-relaxed text-muted">{device.description}</p>

          <div className="mt-6">
            <PhoneBuyBox storageOptions={device.storageOptions} colorOptions={device.colorOptions} />
          </div>

          <div className="mt-7">
            <OrderPhone
              deviceSlug={device.slug}
              signedIn={!!customer}
              lines={custLines.map((l) => ({
                id: l.id,
                label: l.nickname || l.phoneNumber,
                eligible: l.upgradeEligible,
                current: l.device?.name ?? null,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Spec sheet */}
      {device.specs && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold">Tech specs</h2>
          <dl className="mt-3 grid gap-x-10 gap-y-0 rounded-2xl border border-border bg-surface px-6 sm:grid-cols-2">
            {SPEC_ROWS.map(({ key, label }) => (
              <div key={key} className="flex justify-between gap-4 border-b border-border py-3 text-sm last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                <dt className="text-muted">{label}</dt>
                <dd className="text-right font-medium">{device.specs![key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
