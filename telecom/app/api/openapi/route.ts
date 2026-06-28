import { NextResponse } from "next/server";
import { BRAND, siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

/** GET /api/openapi — machine-readable contract for the customer-facing agent. */
export function GET() {
  const P = (summary: string, extra: Record<string, unknown> = {}) => ({ summary, ...extra });
  const idParam = [{ name: "id", in: "path", required: true, schema: { type: "string" } }];

  const spec = {
    openapi: "3.1.0",
    info: {
      title: `${BRAND.name} Account API`,
      version: "1.0.0",
      description:
        "Demo wireless-carrier API for a customer-facing AI agent: account, lines, plans, devices, usage, billing, support, and network status. Plans/devices/network are public; everything else needs a customer bearer token.",
    },
    servers: [{ url: siteUrl() }],
    components: {
      securitySchemes: {
        customerToken: {
          type: "http",
          scheme: "bearer",
          description: "Per-customer token. Demo: bm_tok_ava, bm_tok_marcus, bm_tok_priya.",
        },
      },
    },
    security: [{ customerToken: [] }],
    paths: {
      "/api/me": { get: P("Account overview: profile, lines, balance due") },
      "/api/plans": { get: P("List plans", { security: [] }) },
      "/api/plans/{id}": { get: P("Get a plan by UUID or slug", { security: [], parameters: idParam }) },
      "/api/devices": { get: P("List devices for upgrade", { security: [] }) },
      "/api/devices/{id}": { get: P("Get a device by UUID or slug", { security: [], parameters: idParam }) },
      "/api/addons": { get: P("List plan add-ons / extras (protection, international, hotspot, streaming…)", { security: [] }) },
      "/api/lines": {
        get: P("List the account's lines"),
        post: P("Add a new line", {
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", required: ["planId"], properties: { planId: { type: "string", description: "Plan UUID or slug" }, nickname: { type: "string" } } } } },
          },
        }),
      },
      "/api/lines/{id}": {
        get: P("Get a line (id = UUID, nickname, or phone number)", { parameters: idParam }),
        patch: P("Rename or suspend/resume a line", {
          parameters: idParam,
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { nickname: { type: "string" }, status: { type: "string", enum: ["active", "suspended"] } } } } } },
        }),
      },
      "/api/lines/{id}/plan": {
        post: P("Change a line's plan", {
          parameters: idParam,
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["planId"], properties: { planId: { type: "string" } } } } } },
        }),
      },
      "/api/lines/{id}/upgrade": { get: P("Device-upgrade eligibility + options for a line", { parameters: idParam }) },
      "/api/lines/{id}/device": {
        post: P("Upgrade a line to a new device (24-mo installment)", {
          parameters: idParam,
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["deviceId"], properties: { deviceId: { type: "string" } } } } } },
        }),
      },
      "/api/lines/{id}/addons": {
        get: P("List add-ons currently on a line", { parameters: idParam }),
        post: P("Add an add-on to a line", {
          parameters: idParam,
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["addOnId"], properties: { addOnId: { type: "string", description: "Add-on UUID or slug, e.g. 'device-protection'" } } } } } },
        }),
      },
      "/api/lines/{id}/addons/{addonId}": {
        delete: P("Remove an add-on from a line", {
          parameters: [...idParam, { name: "addonId", in: "path", required: true, schema: { type: "string" }, description: "Add-on UUID or slug" }],
        }),
      },
      "/api/usage": {
        get: P("Data usage this cycle for all lines, or one via ?lineId=", {
          parameters: [{ name: "lineId", in: "query", schema: { type: "string" }, description: "UUID, nickname, or phone number" }],
        }),
      },
      "/api/bills": { get: P("List bills, newest first") },
      "/api/bills/{id}": { get: P("Get a bill (UUID or invoice number) with line items — use to explain charges", { parameters: idParam }) },
      "/api/bills/{id}/pay": { post: P("Pay a due bill (demo: marks it paid)", { parameters: idParam }) },
      "/api/tickets": {
        get: P("List support tickets"),
        post: P("Open a support ticket", {
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["subject"], properties: { category: { type: "string", enum: ["billing", "network", "device", "account"] }, subject: { type: "string" }, body: { type: "string" } } } } } },
        }),
      },
      "/api/network": {
        get: P("Network/outage status for a ZIP (defaults to billing ZIP)", { security: [], parameters: [{ name: "zip", in: "query", schema: { type: "string" } }] }),
      },
      "/api/network/report": {
        post: P("Report a network problem (opens a ticket)", {
          requestBody: { required: false, content: { "application/json": { schema: { type: "object", properties: { zip: { type: "string" }, note: { type: "string" } } } } } },
        }),
      },
    },
  };

  return NextResponse.json(spec);
}
