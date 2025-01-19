import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 認証が必要なパス
const protectedPaths = ['/dreams', '/profile'];
// 認証済みユーザーがアクセスできないパス
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // APIリクエストはスキップ
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 認証が必要なパスへのアクセス
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      return response;
    }
  }

  // 認証済みユーザーがアクセスできないパス
  if (authPaths.includes(pathname)) {
    if (token) {
      const response = NextResponse.redirect(new URL('/dreams', request.url));
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
