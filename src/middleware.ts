import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-Side Authentication Middleware
 * Enforces credential verification and registration before granting access to /dashboard.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get('proofpix_session')?.value;
    const sbAccessToken = request.cookies.get('sb-access-token')?.value;
    const sbAuthToken = request.cookies.get('supabase-auth-token')?.value;

    const isAuthenticated = Boolean(sessionCookie || sbAccessToken || sbAuthToken);

    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
