import { NextResponse } from 'next/server';

function makeLogoutResponse(targetUrl, isJson = false) {
  const res = isJson
    ? NextResponse.json({ message: 'Logged out successfully' })
    : NextResponse.redirect(targetUrl);

  res.cookies.set('p09_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax'
  });

  return res;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const redirectTo = searchParams.get('redirect') || '/login';
  const target = new URL(redirectTo, req.url);
  return makeLogoutResponse(target, false);
}

export async function POST(req) {
  const isJson = req.headers.get('content-type')?.includes('application/json') ||
                 req.headers.get('accept')?.includes('application/json');

  const { searchParams } = new URL(req.url);
  const redirectTo = searchParams.get('redirect');

  if (!isJson && redirectTo) {
    const target = new URL(redirectTo, req.url);
    return makeLogoutResponse(target, false);
  }

  return makeLogoutResponse(new URL('/login', req.url), isJson);
}
