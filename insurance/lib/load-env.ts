/**
 * Side-effect module: loads env for standalone scripts (seed, drizzle-kit).
 * Import this FIRST, before any module that reads process.env (e.g. ./db).
 * Next.js loads .env.local automatically for the app itself, so this is only
 * needed outside the Next runtime.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config(); // fallback to .env
