import fs from 'fs';
import path from 'path';
import { getSiteUrl } from '@/lib/siteUrl';

export default function robots() {
  const siteUrl = getSiteUrl();
  let universalNoIndex = false;
  
  try {
    const filePath = path.join(process.cwd(), 'src/data/settings.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const settings = JSON.parse(fileContent);
    universalNoIndex = Boolean(settings.universalNoIndex);
  } catch (error) {
    console.error('Failed to read settings in robots.js:', error.message);
  }

  if (universalNoIndex) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin", "/api/", "/thank-you"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
