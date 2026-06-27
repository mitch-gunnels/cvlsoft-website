import { redirect } from "next/navigation";

// The phone storefront now lives at "/". Keep this path working.
export default function PhonesIndex() {
  redirect("/");
}
