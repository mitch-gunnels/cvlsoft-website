import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { sendConfirmationEmail, sendNotificationEmail } from "@/app/lib/mailer";

const WORK_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PERSONAL_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      company?: string;
      source?: string;
    };

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const company = body.company?.trim() ?? "";

    if (!firstName) {
      return NextResponse.json(
        { ok: false, message: "Please enter your first name." },
        { status: 400 },
      );
    }

    if (!lastName) {
      return NextResponse.json(
        { ok: false, message: "Please enter your last name." },
        { status: 400 },
      );
    }

    if (!WORK_EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid work email." },
        { status: 400 },
      );
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (PERSONAL_DOMAINS.includes(domain)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please use a company email so we can route your request correctly.",
        },
        { status: 400 },
      );
    }

    if (!company) {
      return NextResponse.json(
        { ok: false, message: "Please enter your company name." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("cvlsoft-website");
    const contacts = db.collection("contacts");

    await contacts.insertOne({
      firstName,
      lastName,
      email,
      phone,
      company,
      source: body.source ?? "website_v1",
      createdAt: new Date(),
    });

    // Send confirmation email to requester
    try {
      await sendConfirmationEmail(email, firstName);
    } catch (emailErr) {
      console.error("[mailer] Failed to send confirmation email:", emailErr);
    }

    // Send notification email to team
    try {
      await sendNotificationEmail({ firstName, lastName, email, phone, company });
    } catch (emailErr) {
      console.error("[mailer] Failed to send notification email:", emailErr);
    }

    return NextResponse.json({
      ok: true,
      message: "Thanks. We will follow up to schedule your demo.",
    });
  } catch (error) {
    console.error("[demo-request]", error);
    return NextResponse.json(
      { ok: false, message: "Unable to process request right now." },
      { status: 500 },
    );
  }
}
