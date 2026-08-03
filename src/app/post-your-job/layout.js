import { buildPageMetadata } from '@/lib/pageSeo';

export async function generateMetadata() {
  return buildPageMetadata('/post-your-job');
}

export default function PostYourJobLayout({ children }) {
  return children;
}
