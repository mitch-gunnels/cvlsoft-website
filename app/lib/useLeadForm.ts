"use client";

import { useCallback, useState } from "react";

export type LeadValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  /** Optional SMS marketing consent (Twilio: must never be required). */
  smsConsent: boolean;
  /** Required Terms of Service + Privacy Policy acceptance. */
  termsAccepted: boolean;
};

export type LeadField = keyof LeadValues;
export type LeadErrors = Partial<Record<LeadField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PERSONAL_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"];

/** Fields that block submission, in display order (drives validate-all + focus). */
export const REQUIRED_FIELDS: LeadField[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "termsAccepted",
];

/** Pure, per-field validation — returns an error message or undefined. */
export function validateLeadField(field: LeadField, v: LeadValues): string | undefined {
  switch (field) {
    case "firstName":
      return v.firstName.trim() ? undefined : "Enter your first name.";
    case "lastName":
      return v.lastName.trim() ? undefined : "Enter your last name.";
    case "email": {
      if (!EMAIL_RE.test(v.email.trim())) return "Enter a valid email address.";
      const domain = v.email.split("@")[1]?.toLowerCase();
      if (domain && PERSONAL_DOMAINS.includes(domain))
        return "Use your company email so we can route your request.";
      return undefined;
    }
    case "phone": {
      const digits = v.phone.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15
        ? undefined
        : "Enter a valid mobile number (at least 10 digits).";
    }
    case "company":
      return v.company.trim() ? undefined : "Enter your company name.";
    case "termsAccepted":
      return v.termsAccepted ? undefined : "Please accept the Terms of Service and Privacy Policy.";
    default:
      return undefined; // smsConsent is optional
  }
}

const EMPTY: LeadValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  smsConsent: false,
  termsAccepted: false,
};

/**
 * Controlled lead-form state with modern per-field validation:
 * validate on blur, live-clear the error as the user fixes a touched field,
 * and validate everything on submit. Shared by the home form and demo modal.
 */
export function useLeadForm() {
  const [values, setValues] = useState<LeadValues>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [touched, setTouched] = useState<Partial<Record<LeadField, boolean>>>({});

  const setValue = useCallback(
    <K extends LeadField>(field: K, value: LeadValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      // Once a field has been touched (blurred), re-validate live so the error
      // clears the moment the input becomes valid.
      setErrors((errs) =>
        touched[field]
          ? { ...errs, [field]: validateLeadField(field, { ...values, [field]: value }) }
          : errs,
      );
    },
    [values, touched],
  );

  const handleBlur = useCallback(
    (field: LeadField) => {
      setTouched((t) => ({ ...t, [field]: true }));
      setErrors((errs) => ({ ...errs, [field]: validateLeadField(field, values) }));
    },
    [values],
  );

  /** Validate every required field, mark all touched, and return the errors. */
  const validateAll = useCallback((): LeadErrors => {
    const found: LeadErrors = {};
    for (const f of REQUIRED_FIELDS) {
      const msg = validateLeadField(f, values);
      if (msg) found[f] = msg;
    }
    setErrors(found);
    setTouched((t) => {
      const next = { ...t };
      for (const f of REQUIRED_FIELDS) next[f] = true;
      return next;
    });
    return found;
  }, [values]);

  const reset = useCallback(() => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
  }, []);

  return { values, errors, touched, setValue, handleBlur, validateAll, reset };
}

export type LeadFormApi = ReturnType<typeof useLeadForm>;
