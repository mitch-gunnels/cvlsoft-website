"use client";

import type { LeadFormApi } from "@/app/lib/useLeadForm";

const inputBase =
  "w-full rounded-md border bg-white/[0.05] px-5 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:ring-1";
const inputOk = "border-white/10 focus:border-cyan-400/60 focus:ring-cyan-400/40";
const inputErr = "border-red-400/70 focus:border-red-400 focus:ring-red-400/40";

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-400">
      {message}
    </p>
  );
}

/** All lead-capture fields + inline errors, driven by the useLeadForm hook. */
export function LeadFields({ form }: { form: LeadFormApi }) {
  const { values, errors, setValue, handleBlur } = form;

  const text = (
    field: "firstName" | "lastName" | "email" | "phone" | "company",
    placeholder: string,
    type: string,
    autoComplete: string,
  ) => {
    const err = errors[field];
    return (
      <div>
        <input
          name={field}
          type={type}
          autoComplete={autoComplete}
          value={values[field]}
          onChange={(e) => setValue(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${field}-error` : undefined}
          className={`${inputBase} ${err ? inputErr : inputOk}`}
          placeholder={placeholder}
        />
        <ErrorText id={`${field}-error`} message={err} />
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {text("firstName", "First name", "text", "given-name")}
        {text("lastName", "Last name", "text", "family-name")}
      </div>
      {text("email", "Work email", "email", "email")}
      {text("phone", "Work mobile phone", "tel", "tel")}
      {text("company", "Company", "text", "organization")}

      {/* SMS marketing consent — optional (Twilio requires this to never gate submit) */}
      <label className="flex items-start gap-3 text-left text-xs leading-relaxed text-slate-400">
        <input
          name="smsConsent"
          type="checkbox"
          checked={values.smsConsent}
          onChange={(e) => setValue("smsConsent", e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
        />
        <span>
          I agree to receive recurring automated text messages from cvlSoft &mdash; including account and
          service notifications, appointment and scheduling updates, transaction alerts, product updates, and
          promotional offers &mdash; at the mobile number provided. Message frequency varies. Message and data
          rates may apply. Consent is not a condition of purchase or of requesting a demo. Reply STOP to
          unsubscribe or HELP for assistance. View our{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Privacy Policy</a>{" "}and{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Terms of Service</a>.
        </span>
      </label>

      {/* Terms of Service + Privacy Policy acceptance — required */}
      <div>
        <label className="flex items-start gap-3 text-left text-xs leading-relaxed text-slate-400">
          <input
            name="termsAccepted"
            type="checkbox"
            checked={values.termsAccepted}
            onChange={(e) => setValue("termsAccepted", e.target.checked)}
            onBlur={() => handleBlur("termsAccepted")}
            aria-invalid={errors.termsAccepted ? true : undefined}
            aria-describedby={errors.termsAccepted ? "termsAccepted-error" : undefined}
            className={`mt-0.5 h-4 w-4 shrink-0 accent-cyan-400 ${
              errors.termsAccepted ? "outline outline-1 outline-red-400/70" : ""
            }`}
          />
          <span>
            I have read and agree to the{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Terms of Service</a>{" "}and{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Privacy Policy</a>.
          </span>
        </label>
        <ErrorText id="termsAccepted-error" message={errors.termsAccepted} />
      </div>
    </>
  );
}
