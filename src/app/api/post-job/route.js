export const runtime = "nodejs";

import nodemailer from "nodemailer";
import { getPrismaClient } from "@/lib/db";
import { getSiteUrl } from "@/lib/siteUrl";

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
    if (secretKey) {
      try {
        const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: secretKey,
            response: recaptchaToken,
          }),
        });
        const recaptchaData = await recaptchaRes.json();

        if (!recaptchaData.success) {
          console.error("[post-job api] reCAPTCHA verification failed:", recaptchaData);
          return Response.json({ success: false, error: "Security check failed." }, { status: 400 });
        }

        // For v3, only block if explicitly flagged as bot (score < 0.3)
        if (typeof recaptchaData.score === "number" && recaptchaData.score < 0.3) {
          console.warn("[post-job api] reCAPTCHA low score:", recaptchaData.score);
          return Response.json({ success: false, error: "Security check failed." }, { status: 400 });
        }
      } catch (recaptchaErr) {
        console.error("[post-job api] reCAPTCHA network error:", recaptchaErr);
      }
    } else {
      console.warn("[post-job api] RECAPTCHA_SECRET_KEY is not defined in environment variables.");
    }

    const prisma = getPrismaClient();
    const posting = await prisma.jobPosting.create({
      data: {
        companyName: String(companyName).trim(),
        jobTitle: String(jobTitle).trim(),
        phone: String(phone).trim(),
        location: location ? String(location).trim() : null,
        aboutCompany: aboutCompany ? String(aboutCompany).trim() : null,
        skillsRequired: skillsRequired ? String(skillsRequired).trim() : null,
        eligibility: eligibility ? String(eligibility).trim() : null,
        jobTypes: jobTypes ? String(jobTypes).trim() : null,
        shiftSchedule: shiftSchedule ? String(shiftSchedule).trim() : null,
        status: "pending",
        source: "website",
      },
    });

    try {
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
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    @media (prefers-color-scheme: dark) {
      .locked-bg { background-color: #2d2e2e !important; }
      .locked-text-white { color: #ffffff !important; }
      .locked-text-pink { color: #ffc7c7 !important; }
    }
    u + .body .locked-bg { background-color: #2d2e2e !important; }
    u + .body .locked-text-white { color: #ffffff !important; }
    u + .body .locked-text-pink { color: #ffc7c7 !important; }
  </style>
</head>
<body class="body" style="margin:0;padding:0;background-color:#f4f4f5;">
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background-color:#ffffff;">
    <div class="locked-bg" style="background-color:#2d2e2e;background-image:linear-gradient(to bottom, #2d2e2e, #2d2e2f);padding:24px 32px;">
      <img src="${getSiteUrl()}/zeon-logo.png" alt="Zeon Academy" style="display:block;max-width:150px;height:auto;border:0;margin-bottom:16px;">
      <h2 class="locked-text-white" style="margin:0;font-size:1.4rem;color:#ffffff;">New Job Posting — Pending Review</h2>
      <p class="locked-text-pink" style="margin:6px 0 0;font-size:0.9rem;color:#ffc7c7;">Approve in Admin → Job Postings to publish on Placements</p>
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
        ${row("Submission ID", posting.id)}
      </table>
    </div>
    <div style="background-color:#f9fafb;padding:16px 32px;text-align:center;">
      <p style="color:#9ca3af;font-size:0.8rem;margin:0;">Zeon Academy · Placement & Hiring System</p>
    </div>
  </div>
</body>
</html>`;

      const recipients = [process.env.MAIL_TO, process.env.MAIL_TO_2].filter(Boolean).join(", ");
      if (recipients) {
        await transporter.sendMail({
          from: `"Zeon Academy Jobs" <${process.env.SMTP_USER}>`,
          to: recipients,
          subject: `[Pending Review] ${jobTitle} at ${companyName}`,
          html: htmlBody,
        });
      }
    } catch (mailError) {
      console.error("[post-job] Mail error:", mailError);
    }

    return Response.json({ success: true, id: posting.id });
  } catch (error) {
    console.error("[post-job] Error:", error);
    return Response.json({ success: false, error: "Failed to submit job posting." }, { status: 500 });
  }
}
