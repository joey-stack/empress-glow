import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createAuthActions } from '@insforge/sdk/ssr';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({ cookies: cookieStore });

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;
    const redirectUrl = new URL('/api/auth/callback', origin).toString();

    const { data, error } = await auth.signInWithOAuth('google', {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
      additionalParams: { prompt: 'select_account' },
    });

    if (error || !data?.url || !data?.codeVerifier) {
      console.error('Google OAuth initialization error:', error);
      return NextResponse.redirect(new URL('/login?error=oauth_init_failed', origin));
    }

    cookieStore.set('insforge_code_verifier', data.codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600,
    });

    const targetRedirect = request.nextUrl.searchParams.get('redirect') || request.nextUrl.searchParams.get('returnTo');
    if (targetRedirect) {
      cookieStore.set('insforge_auth_redirect', targetRedirect, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 600,
      });
    }

    return NextResponse.redirect(data.url);
  } catch (err: any) {
    console.error('OAuth initiation exception:', err);
    return NextResponse.redirect(new URL('/login?error=oauth_error', request.url));
  }
}
