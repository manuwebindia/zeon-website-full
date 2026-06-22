const SITE_URL = "https://admission.zeonacademy.com";

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/testimonials`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/thank-you`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: `${SITE_URL}/post-your-job`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
