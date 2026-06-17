export const runtime = "nodejs";

import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, message, recaptchaToken } = body;

    // Basic server-side validation
    if (!full_name || !email || !phone || !message) {
      return Response.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    if (!recaptchaToken) {
      return Response.json({ success: false, error: "Missing reCAPTCHA token." }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5 || recaptchaData.action !== 'contact_form') {
      return Response.json({ success: false, error: "Security check failed (Bot Activity Detected)." }, { status: 400 });
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
      <img src="https://admission.zeonacademy.com/zeon-logo.png" alt="Zeon Academy" style="display:block; max-width:150px; height:auto; border:0; margin-bottom:16px;">
      
      <h2 class="locked-text-white" style="margin:0; font-size:1.4rem; color:#ffffff;">New Contact Inquiry</h2>
      <p class="locked-text-pink" style="margin:6px 0 0; font-size:0.9rem; color:#ffc7c7;">Via Zeon Academy Contact Us Page</p>
    </div>
    
    <!-- BODY -->
    <div style="padding:32px;background-color:#ffffff;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:140px;font-size:0.9rem;">Full Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${full_name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;"><a href="mailto:${email}" style="color:#FF4444;text-decoration:none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:0.9rem;">Phone</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;"><a href="tel:+91${phone}" style="color:#FF4444;text-decoration:none;">+91 ${phone}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#6b7280;font-size:0.9rem;vertical-align:top;">Message</td>
          <td style="padding:10px 0;font-weight:600;color:#111827;white-space:pre-line;">${message}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color:#f9fafb;padding:16px 32px;text-align:center;">
      <p style="color:#9ca3af;font-size:0.8rem;margin:0;">Zeon Academy · Contact Enquiry System</p>
    </div>
    
  </div>
</body>
</html>
    `;

    const recipients = [process.env.MAIL_TO, process.env.MAIL_TO_2].filter(Boolean).join(", ");

    await transporter.sendMail({
      from: `"Zeon Academy Contact" <${process.env.SMTP_USER}>`,
      to: recipients,
      replyTo: email,
      subject: `New Contact Request — ${full_name}`,
      html: htmlBody,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[contact api] Mail error:", error);
    return Response.json({ success: false, error: "Failed to send email." }, { status: 500 });
  }
}
