import transporter from '@/lib/mailer';
import { buildAdminWelcomeEmail } from '@/lib/emailTemplate';
import { readSettings } from '@/lib/settings';

export async function sendAdminWelcomeEmail({
  displayName,
  username,
  email,
  password,
  groupName,
}) {
  const settings = await readSettings();
  const loginUrl = settings.adminLoginUrl;

  const html = buildAdminWelcomeEmail({
    displayName,
    username,
    email,
    password,
    loginUrl,
    groupName,
  });

  await transporter.sendMail({
    from: `"Zeon Academy Admin" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Zeon Academy Admin Account Details',
    html,
  });
}
