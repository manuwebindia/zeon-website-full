export const runtime = "nodejs";

import nodemailer from "nodemailer";
import { getPrismaClient } from "@/lib/db";
import { getSiteUrl } from "@/lib/siteUrl";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, jobTitle, companyName, jobSlug, recaptchaToken } = body;

    // Basic validation
    if (!name || !phone) {
      return Response.json(
        { success: false, error: "Please enter your name and phone number." },
        { status: 400 }
      );
    }

    // Optional reCAPTCHA verification if token provided
    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      try {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
        const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
        const recaptchaData = await recaptchaRes.json();
        if (recaptchaData.success === false && recaptchaData.score < 0.3) {
          return Response.json(
            { success: false, error: "Security check failed (Bot activity detected)." },
            { status: 400 }
          );
        }
      } catch (err) {
        console.warn("[job-apply api] reCAPTCHA validation error:", err);
      }
    }

    const prisma = getPrismaClient();
    const applicationLead = await prisma.contactLead.create({
      data: {
        name: String(name).trim(),
        email: email ? String(email).trim() : null,
        phone: String(phone).trim(),
        service: jobTitle ? `${jobTitle} (${companyName || "Hiring Partner"})` : "Placement Vacancy",
        message: message ? String(message).trim() : null,
        source: "job_application",
        status: "new",
        notes: `Applied for: ${jobTitle || "Vacancy"} at ${companyName || "N/A"}${jobSlug ? ` (Slug: ${jobSlug})` : ""}`,
      },
    });

    // Send email notification using standard Zeon email template
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const cleanPhone = phone.replace(/[^0-9]/g, "");

      const htmlBody = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    /* General Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      .locked-bg { background-color: #2d2e2e !important; }
      .locked-text-white { color: #ffffff !important; }
      .locked-text-pink { color: #ffc7c7 !important; }
    }
    
    /* Gmail App Specific Override Hack */
    u + .body .locked-bg { background-color: #2d2e2e !important; }
    u + .body .locked-text-white { color: #ffffff !important; }
    u + .body .locked-text-pink { color: #ffc7c7 !important; }
  </style>
</head>
<body class="body" style="margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background-color:#ffffff;">
    
    <!-- HEADER -->
    <div class="locked-bg" style="background-color:#2d2e2e; background-image:linear-gradient(to bottom, #2d2e2e, #2d2e2f); padding:24px 32px;">
      <img src="${getSiteUrl()}/zeon-logo.png" alt="Zeon Academy" style="display:block; max-width:150px; height:auto; border:0; margin-bottom:16px;">
      
      <h2 class="locked-text-white" style="margin:0; font-size:1.4rem; color:#ffffff;">New Job Application</h2>
      <p class="locked-text-pink" style="margin:6px 0 0; font-size:0.9rem; color:#ffc7c7;">Via Zeon Academy Placement Cell</p>
    </div>
    
    <!-- BODY -->
    <div style="padding:32px;background-color:#ffffff;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:140px;font-size:0.9rem;">Position</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${jobTitle || "—"}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">Company</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${companyName || "—"}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">Candidate Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">Phone</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;"><a href="tel:+91${cleanPhone}" style="color:#D40303;text-decoration:none;">+91 ${phone}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${email ? `<a href="mailto:${email}" style="color:#D40303;text-decoration:none;">${email}</a>` : '—'}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;vertical-align:top;">Message / Cover Note</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;white-space:pre-line;">${message || '—'}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#6b7280;font-size:0.9rem;">Lead ID</td>
          <td style="padding:10px 0;font-weight:600;color:#111827;">${applicationLead.id}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color:#f9fafb;padding:16px 32px;text-align:center;">
      <p style="color:#9ca3af;font-size:0.8rem;margin:0;">Zeon Academy · Placement Cell Application System</p>
    </div>
    
  </div>
</body>
</html>
      `;

      const recipients = [process.env.MAIL_TO, process.env.MAIL_TO_2].filter(Boolean).join(", ");

      if (recipients) {
        await transporter.sendMail({
          from: `"Zeon Academy Placement Cell" <${process.env.SMTP_USER}>`,
          to: recipients,
          replyTo: email || undefined,
          subject: `New Job Application — ${name} for ${jobTitle || "Vacancy"}${companyName ? ` (${companyName})` : ""}`,
          html: htmlBody,
        });
      }
    } catch (mailErr) {
      console.error("[job-apply api] Mail error:", mailErr);
    }

    return Response.json({ success: true, leadId: applicationLead.id });
  } catch (err) {
    console.error("[job-apply api] Error:", err);
    return Response.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
