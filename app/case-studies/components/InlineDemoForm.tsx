"use client";

import { FormEvent, useEffect, useState } from "react";
import { trackEvent } from "@/app/lib/analytics";

type DemoStatus = "idle" | "loading" | "success" | "error";

export default function InlineDemoForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [formStatus, setFormStatus] = useState<DemoStatus>("idle");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    if (formStatus !== "success") return;
    const timer = setTimeout(() => {
      setFormStatus("idle");
      setFormMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [formStatus]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("idle");
    setFormMessage("");

    if (!firstName.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your last name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormStatus("error");
      setFormMessage("Please enter a valid email address.");
      return;
    }
    const domain = email.split("@")[1]?.toLowerCase();
    if (["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"].includes(domain)) {
      setFormStatus("error");
      setFormMessage("Please use a company email so we can route your request correctly.");
      return;
    }
    if (!phone.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your work phone number.");
      return;
    }
    if (!company.trim()) {
      setFormStatus("error");
      setFormMessage("Please enter your company name.");
      return;
    }

    setFormStatus("loading");

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          company,
          source: "website_v2",
        }),
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
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCompany("");
    } catch {
      setFormStatus("error");
      setFormMessage("Network error. Please try again.");
      trackEvent("demo_form_submit", { status: "error" });
    }
  }

  return (
    <section className="relative py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16 md:items-center">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-cyan-400">Embed with us</p>
          <h2 className="mt-5 text-[clamp(1.875rem,4vw,2.75rem)] font-light leading-tight tracking-[-0.02em] text-white">
            Not hype. Real enterprise agentic AI.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-400">
            We get paid based on real outcomes. Tell us about your operation and we&rsquo;ll come back with a scoped engagement.
          </p>
        </div>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="rounded-md border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
              placeholder="First name"
            />
            <input
              name="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="rounded-md border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
              placeholder="Last name"
            />
          </div>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
            placeholder="Work email"
          />
          <input
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="rounded-md border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
            placeholder="Work phone"
          />
          <input
            name="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="rounded-md border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
            placeholder="Company"
          />
          <button
            type="submit"
            disabled={formStatus === "loading"}
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
    </section>
  );
}
