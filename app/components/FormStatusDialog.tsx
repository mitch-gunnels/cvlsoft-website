"use client";

import { useEffect, useRef } from "react";

export type FormStatus = "idle" | "loading" | "success" | "error";

const COPY: Record<
  "loading" | "success" | "error",
  { title: string; fallback: string }
> = {
  loading: { title: "Sending your request", fallback: "One moment." },
  success: { title: "Request received", fallback: "Thanks. We will follow up to schedule your demo." },
  error: { title: "Something went wrong", fallback: "Please try again." },
};

function Icon({ status }: { status: "loading" | "success" | "error" }) {
  if (status === "loading") {
    return (
      <span
        aria-hidden="true"
        className="block h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-cyan-400"
      />
    );
  }
  const success = status === "success";
  return (
    <span
      aria-hidden="true"
      className={`flex h-9 w-9 items-center justify-center rounded-full ${
        success ? "bg-cyan-400/15 text-cyan-400" : "bg-red-400/15 text-red-400"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        {success ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
        ) : (
          <>
            <path strokeLinecap="round" d="M12 7.5v6" />
            <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
          </>
        )}
      </svg>
    </span>
  );
}

/**
 * Submit result, shown over the page instead of under the form.
 *
 * The form itself never changes height for a result — that would resize the
 * panel and the video plate behind it — so loading, success and failure all
 * land here. `loading` is deliberately not dismissible: the request is
 * already in flight and there is nothing for a close button to cancel.
 */
export function FormStatusDialog({
  status,
  message,
  onClose,
}: {
  status: FormStatus;
  message: string;
  onClose: () => void;
}) {
  const dismissible = status === "success" || status === "error";
  const open = dismissible || status === "loading";
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissible) onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, dismissible, onClose]);

  // Keyboard focus has to follow the dialog, or the next Tab walks the form
  // sitting behind the backdrop.
  useEffect(() => {
    if (dismissible) closeRef.current?.focus();
  }, [dismissible, status]);

  if (!open) return null;

  const copy = COPY[status];

  return (
    <div
      role={status === "error" ? "alertdialog" : "dialog"}
      aria-modal="true"
      aria-labelledby="form-status-title"
      aria-describedby="form-status-message"
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8"
    >
      <div
        onClick={dismissible ? onClose : undefined}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f1419] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center">
          <Icon status={status} />
        </div>

        <h2 id="form-status-title" className="mt-5 text-lg font-normal tracking-[-0.01em] text-white">
          {copy.title}
        </h2>
        <p id="form-status-message" className="mt-2 text-sm leading-relaxed text-slate-400">
          {message || copy.fallback}
        </p>

        {dismissible ? (
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-md bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {status === "success" ? "Done" : "Try again"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
