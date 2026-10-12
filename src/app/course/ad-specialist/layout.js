import { buildPageMetadata } from '@/lib/pageSeo';

export async function generateMetadata() {
  return buildPageMetadata('/course/ad-specialist');
}

export default function AdsSpecialistLayout({ children }) {
  return children;
}
