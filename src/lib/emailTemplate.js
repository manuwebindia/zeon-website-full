function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://admission.zeonacademy.com'
  ).replace(/\/$/, '');
}

/**
 * Shared Zeon email layout used across contact forms and admin notifications.
 */
export function buildZeonEmailTemplate({
  title,
  subtitle,
  rows = [],
  footer = 'Zeon Academy',
  cta,
}) {
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/zeon-logo.png`;

  const rowsHtml = rows
    .map(({ label, value, html }) => {
      const cellValue = html ? value : escapeHtml(value);
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:140px;font-size:0.9rem;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${cellValue}</td>
        </tr>`;
    })
    .join('');

  const ctaHtml = cta
    ? `
      <div style="margin-top:28px;text-align:center;">
        <a href="${escapeHtml(cta.href)}" style="display:inline-block;background-color:#FF4444;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 28px;border-radius:8px;font-size:0.95rem;">
          ${escapeHtml(cta.label)}
        </a>
      </div>`
    : '';

  return `<!DOCTYPE html>
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
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background-color:#ffffff;">
    <div class="locked-bg" style="background-color:#2d2e2e;background-image:linear-gradient(to bottom,#2d2e2e,#2d2e2f);padding:24px 32px;">
      <img src="${logoUrl}" alt="Zeon Academy" style="display:block;max-width:150px;height:auto;border:0;margin-bottom:16px;">
      <h2 class="locked-text-white" style="margin:0;font-size:1.4rem;color:#ffffff;">${escapeHtml(title)}</h2>
      <p class="locked-text-pink" style="margin:6px 0 0;font-size:0.9rem;color:#ffc7c7;">${escapeHtml(subtitle)}</p>
    </div>
    <div style="padding:32px;background-color:#ffffff;">
      <table style="width:100%;border-collapse:collapse;">
        ${rowsHtml}
      </table>
      ${ctaHtml}
    </div>
    <div style="background-color:#f9fafb;padding:16px 32px;text-align:center;">
      <p style="color:#9ca3af;font-size:0.8rem;margin:0;">${escapeHtml(footer)}</p>
    </div>
  </div>
</body>
</html>`;
}

export function buildAdminWelcomeEmail({
  displayName,
  username,
  email,
  password,
  loginUrl,
  groupName,
}) {
  const safeLoginUrl = escapeHtml(loginUrl);

  return buildZeonEmailTemplate({
    title: 'Your Admin Account Is Ready',
    subtitle: 'Zeon Academy Admin Panel Access',
    footer: 'Zeon Academy · Admin Account Notification',
    rows: [
      { label: 'Name', value: displayName || username },
      { label: 'Username', value: username },
      { label: 'Email', value: email },
      { label: 'Password', value: password },
      { label: 'Group', value: groupName || '—' },
      {
        label: 'Login URL',
        value: `<a href="${safeLoginUrl}" style="color:#FF4444;text-decoration:none;">${safeLoginUrl}</a>`,
        html: true,
      },
    ],
    cta: {
      href: loginUrl,
      label: 'Open Admin Login',
    },
  });
}
