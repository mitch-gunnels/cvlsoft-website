// One-off harness: renders the confirmation + notification emails and sends
// both to a single recipient for visual QA. Does not touch the DB.
// Run with: node --env-file=.env scripts/send-test-emails.mjs [recipient]

import nodemailer from "nodemailer";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const to = process.argv[2] || "mgunnels@cvlsoft.net";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

function findLogoPath() {
  const p = resolve(process.cwd(), "public/logo-email.png");
  if (!existsSync(p)) throw new Error(`logo not found: ${p}`);
  return p;
}

function buildConfirmationEmail(firstName) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f7f8fb;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f8fb;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="background-color:#020618;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="padding-right:12px;vertical-align:middle;">
                <img src="cid:aios-logo" alt="AIOS" width="36" height="36" style="display:block;border:0;" />
              </td>
              <td style="vertical-align:middle;">
                <span style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.025em;">AIOS</span>
                <span style="font-family:'Manrope',system-ui,sans-serif;font-size:12px;font-weight:500;color:#94a3b8;margin-left:6px;">by cvlSoft</span>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="background-color:#ffffff;padding:40px;">
          <h1 style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:22px;font-weight:600;color:#020618;margin:0 0 8px;letter-spacing:-0.025em;">
            Hi ${firstName},
          </h1>
          <p style="font-family:'Manrope',system-ui,sans-serif;font-size:14px;color:#62748e;margin:0 0 28px;line-height:1.6;">
            Thanks for your interest in <strong style="color:#020618;">AIOS</strong>. A member of our team will reach out shortly to schedule a walkthrough tailored to your environment.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdfa;border-radius:12px;">
            <tr><td style="padding:24px;">
              <p style="font-family:'Manrope',system-ui,sans-serif;font-size:12px;font-weight:600;color:#0e7490;letter-spacing:0.06em;margin:0 0 8px;">WHAT IS AIOS?</p>
              <p style="font-family:'Manrope',system-ui,sans-serif;font-size:14px;line-height:1.7;color:#334155;margin:0;">
                <strong>AIOS</strong> (Autonomous Intelligence Operating System) transforms your operational knowledge &mdash; SOPs, runbooks, and tribal expertise &mdash; into autonomous execution with enterprise-grade guardrails, security, and evidence-first observability.
              </p>
            </td></tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:12px;margin-top:16px;">
            <tr><td style="padding:24px;">
              <p style="font-family:'Manrope',system-ui,sans-serif;font-size:12px;font-weight:600;color:#0e7490;letter-spacing:0.06em;margin:0 0 8px;">WHAT TO EXPECT</p>
              <ul style="margin:0;padding-left:18px;font-family:'Manrope',system-ui,sans-serif;font-size:14px;line-height:1.8;color:#334155;">
                <li>A brief intro call to understand your use case</li>
                <li>A live platform walkthrough using your scenarios</li>
                <li>A clear next-steps plan &mdash; no pressure</li>
              </ul>
            </td></tr>
          </table>
          <p style="font-family:'Manrope',system-ui,sans-serif;font-size:14px;line-height:1.6;color:#62748e;margin:28px 0 0;">
            In the meantime, feel free to reply directly to this email with any questions.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 0;">
            <tr><td style="background-color:#020618;border-radius:9999px;text-align:center;">
              <a href="https://www.cvlsoft.com" target="_blank"
                 style="display:inline-block;padding:14px 36px;font-family:'Manrope',system-ui,sans-serif;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">
                Visit cvlsoft.com
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background-color:#f7f8fb;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
          <p style="font-family:'Manrope',system-ui,sans-serif;font-size:11px;color:#94a3b8;margin:0 0 4px;letter-spacing:0.03em;">
            AIOS &mdash; Autonomous Intelligence Operating System
          </p>
          <p style="font-family:'Manrope',system-ui,sans-serif;font-size:11px;color:#cbd5e1;margin:0;">
            Enterprise AI that actually ships to production.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildNotificationEmail(data) {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
  <h2 style="margin:0 0 16px;font-size:18px;color:#0f172a;">New <strong>AIOS</strong> Demo Request</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;color:#334155;">
    <tr><td style="padding:8px 0;font-weight:600;width:100px;">Name</td><td style="padding:8px 0;">${data.firstName} ${data.lastName}</td></tr>
    <tr><td style="padding:8px 0;font-weight:600;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#0e7490;">${data.email}</a></td></tr>
    <tr><td style="padding:8px 0;font-weight:600;">Phone</td><td style="padding:8px 0;">${data.phone || "—"}</td></tr>
    <tr><td style="padding:8px 0;font-weight:600;">Company</td><td style="padding:8px 0;">${data.company}</td></tr>
  </table>
</div>`;
}

const sample = {
  firstName: "Mitchell",
  lastName: "Gunnels",
  email: "mgunnels@cvlsoft.net",
  phone: "+1 555 867 5309",
  company: "cvlSoft (test)",
};

console.log(`Sending test emails to ${to}…`);

const confInfo = await transporter.sendMail({
  from: `"cvlSoft" <sales@cvlsoft.com>`,
  to,
  subject: "[TEST] cvlSoft — AIOS Demo Request (confirmation)",
  html: buildConfirmationEmail(sample.firstName),
  attachments: [
    {
      filename: "logo.png",
      content: readFileSync(findLogoPath()),
      cid: "aios-logo",
    },
  ],
});
console.log("  confirmation →", confInfo.messageId, confInfo.response);

const notifInfo = await transporter.sendMail({
  from: `"cvlSoft Website" <sales@cvlsoft.com>`,
  to,
  subject: `[TEST] New Demo Request: ${sample.firstName} ${sample.lastName} — ${sample.company}`,
  html: buildNotificationEmail(sample),
});
console.log("  notification →", notifInfo.messageId, notifInfo.response);

console.log("Done.");
