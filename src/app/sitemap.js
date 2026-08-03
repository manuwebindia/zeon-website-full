import { buildSitemapEntries } from '@/lib/sitemapBuilder';

export default async function sitemap() {
  return buildSitemapEntries();
}
