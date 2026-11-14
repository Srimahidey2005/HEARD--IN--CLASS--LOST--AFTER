import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getSecretKey } from '@/lib/secret';
import { loginFor } from '@/lib/portal';

// First line of defence. It blocks direct URL access to another role's pages and cross-site writes to the API.
// Every API route and layout still re-checks the role against MongoDB, so a stale or forged cookie never grants access.
const PORTAL_PREFIXES = { '/student': 'student', '/faculty': 'faculty', '/admin': 'admin' };

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const origin = req.headers.get('origin');
      const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
      let sameSite = true;
      if (origin) { try { sameSite = new URL(origin).host === host; } catch { sameSite = false; } }
      if (!sameSite) return NextResponse.json({ message: 'Cross-site requests are not allowed' }, { status: 403 });
    }
    return NextResponse.next();
  }

  const prefix = Object.keys(PORTAL_PREFIXES).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!prefix) return NextResponse.next();
  const portal = PORTAL_PREFIXES[prefix];

  const token = req.cookies.get('p09_token')?.value;
  let role = null;
  if (token) { try { role = (await jwtVerify(token, getSecretKey())).payload.role; } catch { role = null; } }

  if (!role) return NextResponse.redirect(new URL(loginFor(portal), req.url));
  // Keep the visitor on the portal they requested. The role-specific sign-in
  // page lets them authenticate with that account and replace the old session.
  if (role !== portal) return NextResponse.redirect(new URL(loginFor(portal), req.url));
  return NextResponse.next();
}

export const config = { matcher: ['/student/:path*', '/faculty/:path*', '/admin/:path*', '/api/:path*'] };
