"use client";

import { ReactNode } from "react";
import { useDemoModal } from "./DemoModal";

type Props = {
  children?: ReactNode;
  className?: string;
};

export default function DemoButton({ children = "Request a Demo", className }: Props) {
  const { open } = useDemoModal();
  return (
    <button
      type="button"
      onClick={open}
      className={
        className ??
        "inline-block rounded-md bg-cyan-400 px-7 py-3.5 text-sm font-semibold tracking-tight text-slate-950 transition hover:bg-cyan-300"
      }
    >
      {children}
    </button>
  );
}
