import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { customerFromRequest } from "./auth";
import type { Customer } from "./db/schema";

/** Thrown anywhere inside a handler to short-circuit with a clean JSON error. */
export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

/**
 * Wrap a route handler so thrown ApiError / ZodError become well-formed JSON.
 * Keeps every endpoint's happy path readable.
 */
export function route<Args extends unknown[]>(
  handler: (req: Request, ...args: Args) => Promise<Response>,
) {
  return async (req: Request, ...args: Args): Promise<Response> => {
    try {
      return await handler(req, ...args);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { error: err.message, details: err.details ?? undefined },
          { status: err.status },
        );
      }
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: "Invalid request body", details: err.issues },
          { status: 400 },
        );
      }
      console.error("[paper api] unhandled error", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

/** Resolve the acting customer or throw 401. */
export async function requireCustomer(req: Request): Promise<Customer> {
  const customer = await customerFromRequest(req);
  if (!customer) {
    throw new ApiError(
      401,
      "Not authenticated. Send 'Authorization: Bearer <apiToken>' or sign in via /account.",
    );
  }
  return customer;
}

/** Parse + validate a JSON body against a Zod schema, or throw 400. */
export async function parseBody<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON");
  }
  return schema.parse(body);
}
