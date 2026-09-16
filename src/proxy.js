import { NextResponse } from 'next/server';
import redirectsData from '@/data/redirects.json';
import { findMatchingRedirect } from '@/lib/redirects';

export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  // Check if requested path matches any active redirect rule
  const match = findMatchingRedirect(pathname, redirectsData?.redirects || []);
  if (match && match.matchedDestination) {
    let dest = match.matchedDestination;
    if (search && !dest.includes('?')) {
      dest = `${dest}${search}`;
    }

    const redirectUrl = new URL(dest, request.url);
    const statusCode = match.statusCode === 302 ? 302 : 301;
    return NextResponse.redirect(redirectUrl, statusCode);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image
     * - api routes
     * - admin dashboard
     * - static file extensions
     */
    '/((?!api|_next/static|_next/image|admin|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|map)$).*)',
  ],
};
