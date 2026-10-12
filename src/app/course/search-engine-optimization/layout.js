import { buildPageMetadata } from '@/lib/pageSeo';

export async function generateMetadata() {
  return buildPageMetadata('/courses/seo-specialist');
}

export default function SeoSpecialistLayout({ children }) {
  return children;
}
