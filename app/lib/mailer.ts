import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildConfirmationEmail(firstName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f7f8fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fb;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.06);">
        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:32px 40px;text-align:center;">
            <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.10em;font-family:'Courier New',monospace;">cvlSoft</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#0f172a;letter-spacing:-0.02em;">
              ${firstName},
            </h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;">
              Thanks for your interest in AIOS. A member of our team will reach out shortly to schedule a walkthrough tailored to your environment.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border-radius:12px;width:100%;">
              <tr>
                <td style="padding:24px;">
                  <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#0e7490;letter-spacing:0.06em;text-transform:uppercase;">What is AIOS?</p>
                  <p style="margin:8px 0 0;font-size:14px;line-height:1.8;color:#334155;">
                    AIOS is cvlSoft's enterprise autonomy platform that transforms your operational knowledge &mdash; SOPs, runbooks, and tribal expertise &mdash; into reusable super agents with deterministic policy controls, enterprise-grade security, and evidence-first observability. No more brittle, one-off agentic workflows.
                  </p>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;width:100%;margin-top:16px;">
              <tr>
                <td style="padding:24px;">
                  <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#0e7490;letter-spacing:0.06em;text-transform:uppercase;">What to expect</p>
                  <ul style="margin:8px 0 0;padding-left:18px;font-size:14px;line-height:1.8;color:#334155;">
                    <li>A brief intro call to understand your use case</li>
                    <li>A live platform walkthrough using your scenarios</li>
                    <li>A clear next-steps plan &mdash; no pressure</li>
                  </ul>
                </td>
              </tr>
            </table>

            <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#475569;">
              In the meantime, feel free to reply directly to this email with any questions or visit our website to learn more.
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 0;text-align:center;">
              <tr>
                <td style="background:#0f172a;border-radius:9999px;padding:12px 28px;">
                  <a href="https://www.cvlsoft.net" style="font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Visit cvlsoft.net</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
            <a href="https://www.cvlsoft.net" style="font-size:12px;color:#0e7490;text-decoration:none;">www.cvlsoft.net</a>
            <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">
              cvlSoft &middot; Enterprise Autonomy Platform
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendConfirmationEmail(to: string, name: string): Promise<void> {
  const firstName = name.split(" ")[0] || "there";
  await transporter.sendMail({
    from: `"cvlSoft" <${process.env.SMTP_USER}>`,
    to,
    subject: "cvlSoft — AIOS Demo Request",
    html: buildConfirmationEmail(firstName),
  });
}

export async function sendNotificationEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}): Promise<void> {
  await transporter.sendMail({
    from: `"cvlSoft Website" <${process.env.SMTP_USER}>`,
    to: "mgunnels@cvlsoft.net",
    subject: `New Demo Request: ${data.firstName} ${data.lastName} — ${data.company}`,
    html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
  <h2 style="margin:0 0 16px;font-size:18px;color:#0f172a;">New AIOS Demo Request</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;color:#334155;">
    <tr><td style="padding:8px 0;font-weight:600;width:100px;">Name</td><td style="padding:8px 0;">${data.firstName} ${data.lastName}</td></tr>
    <tr><td style="padding:8px 0;font-weight:600;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#0e7490;">${data.email}</a></td></tr>
    <tr><td style="padding:8px 0;font-weight:600;">Phone</td><td style="padding:8px 0;">${data.phone || "—"}</td></tr>
    <tr><td style="padding:8px 0;font-weight:600;">Company</td><td style="padding:8px 0;">${data.company}</td></tr>
  </table>
</div>`,
  });
}
