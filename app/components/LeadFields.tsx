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

/* The per-field error line is always in the layout, empty or not. If it were
   conditional the form would grow the moment anything failed validation, and
   the panel — plus the video plate sized behind it — would resize under the
   user mid-typing. `truncate` keeps a message to the one reserved line. */
function ErrorSlot({ id, message }: { id: string; message?: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 h-4 truncate text-xs leading-4 text-red-400"
    >
      {message ?? ""}
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
        <ErrorSlot id={`${field}-error`} message={err} />
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

      {/* Both consents live in one inset box. It is a lot of legal copy to sit
          loose under the inputs; the border makes it read as fine print rather
          than as more of the form, and scrolls it out of the way on small
          screens without hiding anything either policy requires be visible.

          Its height is fixed, not capped: the consent error appears inside it,
          and at wide panel widths the copy is short enough that a cap would
          still let that error grow the box. */}
      <div className="mt-1 grid h-48 content-start gap-4 overflow-y-auto rounded-md border border-white/10 bg-white/[0.03] p-4">
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
          I agree to receive recurring automated marketing text messages (promotions, product news, and special
          offers) from cvlSoft at the mobile number provided. Consent is not a condition of purchase or of
          requesting a demo. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe
          or HELP for assistance. View our{" "}
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
      </div>
    </>
  );
}
