import fs from 'fs';
import path from 'path';

const SITE_URL = "https://admission.zeonacademy.com";

export default function robots() {
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
        disallow: ["/api/", "/thank-you"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
