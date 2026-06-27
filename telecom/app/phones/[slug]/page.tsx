import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { devices, lines } from "@/lib/db/schema";
import { customerFromCookie } from "@/lib/auth";
import { formatPrice } from "@/lib/config";
import { OrderPhone } from "@/components/OrderPhone";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await db.query.devices.findFirst({ where: eq(devices.slug, slug) });
  return { title: d?.name ?? "Phone" };
}

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
      <Link href="/phones" className="text-sm text-muted hover:text-foreground">← All phones</Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
          <Image src={device.imageUrl} alt={device.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />
        </div>

        <div>
          <p className="label text-muted">{device.brand}</p>
          <h1 className="mt-1 text-3xl font-semibold">{device.name}</h1>
          <p className="mt-4 text-2xl font-semibold">
            {formatPrice(device.monthlyCents)}<span className="text-base font-normal text-muted">/mo for 24 mo</span>
          </p>
          <p className="text-sm text-muted">or {formatPrice(device.priceCents)} full price</p>
          <p className="mt-5 leading-relaxed text-muted">{device.description}</p>

          <dl className="mt-6 space-y-2 border-y border-border py-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Storage</dt><dd>{device.storage}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Colors</dt><dd>{device.colors.join(", ")}</dd></div>
          </dl>

          <div className="mt-6">
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
    </div>
  );
}
