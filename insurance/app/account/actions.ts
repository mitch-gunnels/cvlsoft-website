"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CUSTOMER_COOKIE } from "@/lib/auth";

export async function signInAs(formData: FormData) {
  const id = String(formData.get("customerId") ?? "");
  if (!id) return;
  const store = await cookies();
  store.set(CUSTOMER_COOKIE, id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  redirect("/overview");
}

export async function signOut() {
  const store = await cookies();
  store.delete(CUSTOMER_COOKIE);
  redirect("/account");
}
