import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { devices } from "@/lib/db/schema";
import { formatPrice } from "@/lib/config";
import { PhoneCompare, type CompareDevice } from "@/components/PhoneCompare";

export const dynamic = "force-dynamic";
export const metadata = { title: "Compare phones" };

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ phones?: string }>;
}) {
  const { phones } = await searchParams;
  const rows = await db.query.devices.findMany({
    where: eq(devices.active, true),
    orderBy: asc(devices.priceCents),
  });

  const compareDevices: CompareDevice[] = rows.map((d) => ({
    slug: d.slug,
    name: d.name,
    brand: d.brand,
    image: d.imageUrl,
    monthly: formatPrice(d.monthlyCents),
    price: formatPrice(d.priceCents),
    storages: d.storageOptions.map((o) => o.size).join(" · "),
    colors: d.colorOptions,
    specs: d.specs ?? null,
  }));

  const initial = (phones ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Compare phones</h1>
      <p className="mt-2 text-muted">Put any phones side by side — specs, storage, colors, and price.</p>
      <div className="mt-6">
        <PhoneCompare devices={compareDevices} initial={initial} />
      </div>
    </div>
  );
}
