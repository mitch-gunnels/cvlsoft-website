import { redirect } from "next/navigation";

// The coverage storefront now lives at "/". Keep this path working.
export default function ShopIndex() {
  redirect("/");
}
