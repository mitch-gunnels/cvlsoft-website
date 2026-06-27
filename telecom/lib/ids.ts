import { randomBytes, randomUUID } from "crypto";

function digits(n: number): string {
  const max = 10 ** n;
  const val = parseInt(randomBytes(6).toString("hex"), 16) % max;
  return String(val).padStart(n, "0");
}

export const accountNumber = () => `BM-${digits(8)}`;
export const invoiceNumber = () => `INV-${digits(8)}`;
export const ticketNumber = () => `TKT-${digits(6)}`;

/** US-style phone number for a new line (555 range for the demo). */
export const phoneNumber = () => `(555) ${digits(3)}-${digits(4)}`;

/** Per-customer bearer token used by AI agents. */
export const apiToken = () => `bm_tok_${randomBytes(20).toString("hex")}`;

export const uuid = () => randomUUID();
