// This file replaces the deprecated `middleware.ts` convention.
// The logic is identical to the previous middleware; it handles
// authentication redirects for protected routes.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const authRoutes = ['/login', '/register'];
const middlewareSecret =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === 'production' ? undefined : 'dev-secret');

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (authRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: middlewareSecret });

  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname.startsWith('/profile') || pathname.startsWith('/events/new')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile', '/events/new', '/login', '/register']
};
