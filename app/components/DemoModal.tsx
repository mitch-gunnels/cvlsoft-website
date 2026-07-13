"use client";

import {
  FormEvent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { trackEvent } from "@/app/lib/analytics";
import { useLeadForm, REQUIRED_FIELDS } from "@/app/lib/useLeadForm";
import { LeadFields } from "./LeadFields";

type DemoStatus = "idle" | "loading" | "success" | "error";

type DemoModalContextValue = {
  open: () => void;
  close: () => void;
};

const DemoModalContext = createContext<DemoModalContextValue | null>(null);

export function useDemoModal() {
  const ctx = useContext(DemoModalContext);
  if (!ctx) {
    throw new Error("useDemoModal must be used within DemoModalProvider");
  }
  return ctx;
}

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useLeadForm();
  const [formStatus, setFormStatus] = useState<DemoStatus>("idle");
  const [formMessage, setFormMessage] = useState("");

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Auto-clear success state after 5 seconds (matches home form behavior)
  useEffect(() => {
    if (formStatus !== "success") return;
    const timer = setTimeout(() => {
      setFormStatus("idle");
      setFormMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [formStatus]);

  // Lock body scroll when open + close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  function handleCtaClick(location: string) {
    trackEvent("bold_claim_cta_click", { location });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");

    const errs = form.validateAll();
    const firstInvalid = REQUIRED_FIELDS.find((f) => errs[f]);
    if (firstInvalid) {
      setFormStatus("error");
      event.currentTarget
        .querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    setFormStatus("loading");

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form.values, source: "website_v2" }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };
      trackEvent("demo_form_submit", { status: response.ok ? "success" : "error" });

      if (!response.ok) {
        setFormStatus("error");
        setFormMessage(data.message ?? "Unable to submit demo request.");
        return;
      }

      setFormStatus("success");
      setFormMessage(data.message ?? "Thanks. We will follow up to schedule your demo.");
      form.reset();
    } catch {
      setFormStatus("error");
      setFormMessage("Network error. Please try again.");
      trackEvent("demo_form_submit", { status: "error" });
    }
  }

  return (
    <DemoModalContext.Provider value={{ open, close }}>
      {children}

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close demo request"
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d1322] p-8 shadow-2xl md:p-10">
            {/* Decorative orbs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[60px]" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-[60px]" />

            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <h2 id="demo-modal-title" className="relative text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.02em] text-white">
              Not hype. <span className="text-cyan-400">Real enterprise agentic AI.</span>
            </h2>
            <p className="relative mt-3 text-base leading-relaxed text-slate-400">
              See it now.
            </p>

            <form noValidate className="relative mt-6 grid gap-3" onSubmit={handleSubmit}>
              <LeadFields form={form} />
              <button
                type="submit"
                disabled={formStatus === "loading"}
                onClick={() => handleCtaClick("demo_modal")}
                className="mt-2 rounded-md bg-cyan-400 px-8 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formStatus === "loading" ? "Submitting..." : "Start the conversation"}
              </button>
              {formMessage ? (
                <p className={`text-center text-sm ${formStatus === "error" ? "text-slate-300" : "text-cyan-400"}`}>
                  {formMessage}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </DemoModalContext.Provider>
  );
}
