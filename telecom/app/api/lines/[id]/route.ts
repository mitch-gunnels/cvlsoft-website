import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { lines } from "@/lib/db/schema";
import { json, parseBody, requireCustomer, route } from "@/lib/api";
import { serializeLine } from "@/lib/serializers";
import { lineWithRelations, resolveLine } from "@/lib/account";

export const dynamic = "force-dynamic";

/** GET /api/lines/:id — id may be a UUID, nickname, or phone number. */
export const GET = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const line = await resolveLine(c.id, id);
  return json({ line: serializeLine(line) });
});

const patchSchema = z.object({
  nickname: z.string().max(40).optional(),
  status: z.enum(["active", "suspended"]).optional(),
});

/** PATCH /api/lines/:id — rename or suspend/resume a line. */
export const PATCH = route(async (req, ctx: { params: Promise<{ id: string }> }) => {
  const c = await requireCustomer(req);
  const { id } = await ctx.params;
  const line = await resolveLine(c.id, id);
  const body = await parseBody(req, patchSchema);

  await db
    .update(lines)
    .set({
      nickname: body.nickname ?? line.nickname,
      status: body.status ?? line.status,
    })
    .where(eq(lines.id, line.id));

  return json({ line: serializeLine(await lineWithRelations(line.id)) });
});
