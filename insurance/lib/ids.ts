import { randomBytes, randomUUID } from "crypto";

function digits(n: number): string {
  const max = 10 ** n;
  const val = parseInt(randomBytes(6).toString("hex"), 16) % max;
  return String(val).padStart(n, "0");
}

export const accountNumber = () => `HB-${digits(8)}`;
export const policyNumber = () => `POL-${digits(8)}`;
export const claimNumber = () => `CLM-${digits(7)}`;
export const quoteNumber = () => `QTE-${digits(6)}`;

/** Per-customer bearer token used by AI agents. */
export const apiToken = () => `hb_tok_${randomBytes(20).toString("hex")}`;

export const uuid = () => randomUUID();
