export const runtime = "nodejs";

import nodemailer from "nodemailer";
import { getSiteUrl } from "@/lib/siteUrl";
import { getPrismaClient } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, full_name, email, phone, city, batch, message, courseName, recaptchaToken } = body;
    const resolvedName = (name || full_name || "").trim();
    const resolvedEmail = (email || "").trim();
    const resolvedPhone = (phone || "").trim();
    const resolvedCourse = (courseName || "Free Demo Class").trim();

    // Basic server-side validation
    if (!resolvedName || !resolvedEmail || !resolvedPhone) {
      return Response.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (secretKey) {
      if (!recaptchaToken) {
        return Response.json({ success: false, error: "Security check required (Missing reCAPTCHA token)." }, { status: 400 });
      }

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
          console.error("[book-demo api] reCAPTCHA verification failed:", recaptchaData);
          return Response.json({ success: false, error: "Security check failed (Bot Activity Detected)." }, { status: 400 });
        }

        // For v3, only block if explicitly flagged as bot (score < 0.3)
        if (typeof recaptchaData.score === "number" && recaptchaData.score < 0.3) {
          console.warn("[book-demo api] reCAPTCHA low score:", recaptchaData.score);
          return Response.json({ success: false, error: "Security check failed (Bot Activity Detected)." }, { status: 400 });
        }
      } catch (recaptchaErr) {
        console.error("[book-demo api] reCAPTCHA network error:", recaptchaErr);
      }
    }

    // Save lead to database
    try {
      const prisma = getPrismaClient();
      await prisma.contactLead.create({
        data: {
          name: resolvedName,
          email: resolvedEmail,
          phone: resolvedPhone,
          service: resolvedCourse,
          message: [
            city ? `City: ${city}` : "",
            batch ? `Preferred Time: ${batch}` : "",
            message ? `Note: ${message}` : "",
          ].filter(Boolean).join(" | "),
          source: "course_demo",
          status: "new",
        },
      });
    } catch (dbErr) {
      console.warn("[book-demo api] DB save note:", dbErr);
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlBody = `
      <!DOCTYPE html>
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
<body class="body" style="margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background-color:#ffffff;">
    
    <div class="locked-bg" style="background-color:#2d2e2e; background-image:linear-gradient(to bottom, #2d2e2e, #2d2e2f); padding:24px 32px;">
      <img src="${getSiteUrl()}/zeon-logo.png" alt="Zeon Academy" style="display:block; max-width:150px; height:auto; border:0; margin-bottom:16px;">
      <h2 class="locked-text-white" style="margin:0; font-size:1.4rem; color:#ffffff;">New Demo Class Registration</h2>
      <p class="locked-text-pink" style="margin:6px 0 0; font-size:0.9rem; color:#ffc7c7;">Via Zeon Academy Website</p>
    </div>
    
    <div style="padding:32px;background-color:#ffffff;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:140px;font-size:0.9rem;">Full Name</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${resolvedName}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">Course Requested</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${resolvedCourse}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${resolvedEmail}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">Phone (WhatsApp)</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">+91 ${resolvedPhone}</td></tr>
        ${city ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">City</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${city}</td></tr>` : ""}
        ${batch ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">Preferred Date & Time</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${batch}</td></tr>` : ""}
        ${message ? `<tr><td style="padding:10px 0;color:#6b7280;font-size:0.9rem;vertical-align:top;">Message</td><td style="padding:10px 0;color:#111827;">${message}</td></tr>` : ""}
      </table>
    </div>
    
    <div style="background-color:#f9fafb;padding:16px 32px;text-align:center;">
      <p style="color:#9ca3af;font-size:0.8rem;margin:0;">Zeon Academy · Demo Booking System</p>
    </div>
    
  </div>
</body>
</html>
    `;

    const recipients = [process.env.MAIL_TO, process.env.MAIL_TO_2].filter(Boolean).join(", ");

    await transporter.sendMail({
      from: `"Zeon Academy Website" <${process.env.SMTP_USER}>`,
      to: recipients,
      replyTo: resolvedEmail,
      subject: `Live Demo Booking — ${resolvedName} (${resolvedCourse})`,
      html: htmlBody,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[book-demo] Mail error:", error);
    return Response.json({ success: false, error: "Failed to send email." }, { status: 500 });
  }
}
