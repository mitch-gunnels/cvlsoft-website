import { NextResponse } from "next/server";

const WORK_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      company?: string;
      source?: string;
      timestamp?: string;
    };

    const email = body.email?.trim() ?? "";
    const company = body.company?.trim() ?? "";

    if (!WORK_EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid work email." },
        { status: 400 },
      );
    }

    if (email.endsWith("@gmail.com") || email.endsWith("@yahoo.com") || email.endsWith("@hotmail.com")) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please use a company email so we can route your request correctly.",
        },
        { status: 400 },
      );
    }

    // Placeholder: wire this payload into CRM/email automation in a follow-up iteration.
    console.info("[demo-request]", {
      email,
      company,
      source: body.source ?? "website_v1",
      timestamp: body.timestamp ?? new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      message: "Thanks. We will follow up to schedule your demo.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to process request right now." },
      { status: 500 },
    );
  }
}
