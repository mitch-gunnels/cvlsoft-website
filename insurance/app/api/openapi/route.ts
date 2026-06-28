import { NextResponse } from "next/server";
import { BRAND, siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

/** GET /api/openapi — contract for the customer-facing insurance agent. */
export function GET() {
  const P = (summary: string, extra: Record<string, unknown> = {}) => ({ summary, ...extra });
  const idParam = [{ name: "id", in: "path", required: true, schema: { type: "string" } }];
  const body = (schema: object) => ({ requestBody: { required: true, content: { "application/json": { schema } } } });

  const spec = {
    openapi: "3.1.0",
    info: {
      title: `${BRAND.name} Account API`,
      version: "1.0.0",
      description:
        "Demo insurance API for a customer-facing AI agent: shop catalog, policies, coverages, ID cards, claims (FNOL), coverage Q&A, riders, payments, and quotes. The catalog (products/riders) is public; everything else needs a customer bearer token.",
    },
    servers: [{ url: siteUrl() }],
    components: {
      securitySchemes: {
        customerToken: { type: "http", scheme: "bearer", description: "Per-customer token. Demo: hb_tok_ava, hb_tok_marcus, hb_tok_priya." },
      },
    },
    security: [{ customerToken: [] }],
    paths: {
      "/api/me": { get: P("Account overview: policies, premium, amount due, open claims") },
      "/api/products": { get: P("Browse the coverage catalog with tiers (auto, home, renters, life, pet, umbrella)", { security: [] }) },
      "/api/products/{slug}": { get: P("Get one coverage product with its tiers", { security: [], parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }] }) },
      "/api/riders": { get: P("Browse the add-on / rider catalog (roadside, water backup, jewelry…)", { security: [] }) },
      "/api/policies": { get: P("List policies with coverages") },
      "/api/policies/{id}": { get: P("Get a policy (UUID or policy number) with coverages", { parameters: idParam }) },
      "/api/policies/{id}/idcard": { get: P("Auto insurance ID card", { parameters: idParam }) },
      "/api/policies/{id}/pay": { post: P("Pay the premium due (demo: marks paid)", { parameters: idParam }) },
      "/api/policies/{id}/riders": {
        get: P("List riders on a policy", { parameters: idParam }),
        post: P("Add a rider to a policy", { parameters: idParam, ...body({ type: "object", required: ["riderId"], properties: { riderId: { type: "string", description: "Rider slug, e.g. 'roadside'" } } }) }),
      },
      "/api/policies/{id}/riders/{riderSlug}": {
        delete: P("Remove a rider from a policy", { parameters: [...idParam, { name: "riderSlug", in: "path", required: true, schema: { type: "string" } }] }),
      },
      "/api/claims": {
        get: P("List claims"),
        post: P("File a claim (first notice of loss)", body({
          type: "object",
          required: ["policyId", "type", "dateOfLoss", "description"],
          properties: {
            policyId: { type: "string", description: "Policy UUID or number" },
            type: { type: "string", enum: ["collision", "theft", "glass", "water", "fire", "liability", "weather", "other"] },
            dateOfLoss: { type: "string", description: "ISO date" },
            description: { type: "string" },
            photos: { type: "array", items: { type: "string", format: "uri" } },
          },
        })),
      },
      "/api/claims/{id}": { get: P("Get a claim (UUID or claim number)", { parameters: idParam }) },
      "/api/coverage/check": {
        post: P("Is this covered? — reasons over the policy's coverages", body({
          type: "object",
          required: ["policyId", "scenario"],
          properties: { policyId: { type: "string" }, scenario: { type: "string", description: "Plain-English description of what happened" } },
        })),
      },
      "/api/quotes": {
        get: P("List saved quotes"),
        post: P("Generate a quote", body({
          type: "object",
          required: ["type"],
          properties: {
            type: { type: "string", enum: ["auto", "home", "renters", "life", "pet", "umbrella"] },
            coverageLevel: { type: "string", enum: ["basic", "standard", "premium"] },
            details: { type: "object" },
          },
        })),
      },
    },
  };
  return NextResponse.json(spec);
}
