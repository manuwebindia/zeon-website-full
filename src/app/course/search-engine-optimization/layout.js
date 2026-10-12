import { buildPageMetadata } from '@/lib/pageSeo';

export async function generateMetadata() {
  return buildPageMetadata('/course/search-engine-optimization');
}

export default function SeoSpecialistLayout({ children }) {
  return children;
}
