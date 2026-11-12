import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminCookieName, isValidAdminSession } from '@/lib/admin-session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
  const token = request.cookies.get(adminCookieName())?.value;
  if (!(await isValidAdminSession(token))) {
    const login = new URL('/admin/login', request.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
