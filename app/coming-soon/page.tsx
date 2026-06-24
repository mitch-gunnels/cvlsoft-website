import type { Metadata } from "next";
import ComingSoon from "./ComingSoon";

export const metadata: Metadata = {
  title: "AIOS by cvlSoft — Launching Soon",
  description:
    "AIOS (Autonomous Intelligence Operating System) by cvlSoft is launching soon. Turn what your experts know into safe, auditable, autonomous execution. Request early access.",
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}
