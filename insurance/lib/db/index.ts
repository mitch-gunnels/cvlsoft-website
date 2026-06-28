import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Accept either our own DATABASE_URL or the POSTGRES_URL that Vercel Postgres
// (Neon) injects automatically, so the prod integration works with no config.
const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL (or POSTGRES_URL) is not set. Copy .env.example to .env.local and point it at a Postgres database.",
  );
}

/**
 * Reuse a single postgres.js client across hot reloads (dev) and warm
 * serverless invocations (prod) to avoid exhausting connections.
 * `prepare: false` keeps us compatible with transaction-mode poolers (Neon /
 * Vercel Postgres / PgBouncer).
 */
const globalForDb = globalThis as unknown as {
  __shopDbClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__shopDbClient ?? postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== "production") globalForDb.__shopDbClient = client;

export const db = drizzle(client, { schema });
export { schema };
