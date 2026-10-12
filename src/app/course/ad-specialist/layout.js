import { buildPageMetadata } from '@/lib/pageSeo';

export async function generateMetadata() {
  return buildPageMetadata('/courses/ads-specialist');
}

export default function AdsSpecialistLayout({ children }) {
  return children;
}
