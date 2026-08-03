export const runtime = "nodejs";

import nodemailer from "nodemailer";
import { getPrismaClient } from "@/lib/db";

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
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;">
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background-color:#ffffff;">
    <div style="background-color:#2d2e2e;padding:24px 32px;">
      <h2 style="margin:0;font-size:1.4rem;color:#ffffff;">New Job Posting — Pending Review</h2>
      <p style="margin:6px 0 0;font-size:0.9rem;color:#ffc7c7;">Approve in Admin → Job Postings to publish on Placements</p>
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
