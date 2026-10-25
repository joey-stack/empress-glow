import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const phase = process.env.NEXT_PUBLIC_SITE_PHASE || 'prelaunch';
  const isPrelaunch = phase === 'prelaunch';

  if (isPrelaunch) {
    const { pathname } = request.nextUrl;

    // Direct Phase 2 consumer routes to homepage
    if (
      pathname.startsWith('/shop') ||
      pathname.startsWith('/cart') ||
      pathname.startsWith('/checkout') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/account') ||
      pathname.startsWith('/order')
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Direct Phase 2 admin subroutes to /admin
    if (
      pathname.startsWith('/admin/orders') ||
      pathname.startsWith('/admin/reviews')
    ) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/shop/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/login/:path*',
    '/register/:path*',
    '/account/:path*',
    '/order/:path*',
    '/admin/orders/:path*',
    '/admin/reviews/:path*',
  ],
};
