export const runtime = "nodejs";

import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      companyName, jobTitle, phone, location,
      aboutCompany, skillsRequired, eligibility,
      jobTypes, shiftSchedule, recaptchaToken,
    } = body;

    if (!companyName || !jobTitle || !phone) {
      return Response.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    if (!recaptchaToken) {
      return Response.json({ success: false, error: "Missing reCAPTCHA token." }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5 || recaptchaData.action !== "post_job") {
      return Response.json({ success: false, error: "Security check failed." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const row = (label, value) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:160px;font-size:0.9rem;vertical-align:top;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;white-space:pre-line;">${value || "—"}</td>
      </tr>`;

    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @media (prefers-color-scheme: dark) {
      .locked-bg { background-color: #2d2e2e !important; }
      .locked-text-white { color: #ffffff !important; }
      .locked-text-accent { color: #ffc7c7 !important; }
    }
    u + .body .locked-bg { background-color: #2d2e2e !important; }
    u + .body .locked-text-white { color: #ffffff !important; }
    u + .body .locked-text-accent { color: #ffc7c7 !important; }
  </style>
</head>
<body class="body" style="margin:0;padding:0;background-color:#f4f4f5;">
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background-color:#ffffff;">
    <div class="locked-bg" style="background-color:#2d2e2e;padding:24px 32px;">
      <img src="https://admission.zeonacademy.com/zeon-logo.png" alt="Zeon Academy" style="display:block;max-width:140px;height:auto;border:0;margin-bottom:14px;">
      <h2 class="locked-text-white" style="margin:0;font-size:1.4rem;color:#ffffff;">New Job Posting Received</h2>
      <p class="locked-text-accent" style="margin:6px 0 0;font-size:0.9rem;color:#ffc7c7;">Via Zeon Academy · Post Your Job</p>
    </div>
    <div style="padding:32px;background-color:#ffffff;">
      <table style="width:100%;border-collapse:collapse;">
        ${row("Company Name", companyName)}
        ${row("Job Title", jobTitle)}
        ${row("Phone", phone)}
        ${row("Location", location)}
        ${row("About Company", aboutCompany)}
        ${row("Skills Required", skillsRequired)}
        ${row("Eligibility", eligibility)}
        ${row("Job Types", jobTypes)}
        ${row("Shift & Schedule", shiftSchedule)}
      </table>
    </div>
    <div style="background-color:#f9fafb;padding:16px 32px;text-align:center;">
      <p style="color:#9ca3af;font-size:0.8rem;margin:0;">Zeon Academy · Job Posting System</p>
    </div>
  </div>
</body>
</html>`;

    const recipients = [process.env.MAIL_TO, process.env.MAIL_TO_2].filter(Boolean).join(", ");
    await transporter.sendMail({
      from: `"Zeon Academy Jobs" <${process.env.SMTP_USER}>`,
      to: recipients,
      subject: `New Job Posting — ${jobTitle} at ${companyName}`,
      html: htmlBody,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[post-job] Mail error:", error);
    return Response.json({ success: false, error: "Failed to send." }, { status: 500 });
  }
}
