import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createAuthActions } from '@insforge/sdk/ssr';
import { createSession, AdminRole } from '@/lib/auth/session';
import { getSafeRedirectUrl } from '@/lib/auth/redirect';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('insforge_code');
  const oauthError = request.nextUrl.searchParams.get('error');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const origin = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;

  if (oauthError || !code) {
    console.warn('OAuth callback failed or missing code:', { error: oauthError });
    return NextResponse.redirect(new URL('/login?error=oauth_cancelled', origin));
  }

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get('insforge_code_verifier')?.value;
  if (!codeVerifier) {
    console.warn('OAuth callback missing codeVerifier cookie');
    return NextResponse.redirect(new URL('/login?error=missing_verifier', origin));
  }

  // Clear codeVerifier cookie
  cookieStore.delete('insforge_code_verifier');

  try {
    const auth = createAuthActions({ cookies: cookieStore });
    const { data, error } = await auth.exchangeOAuthCode(code, codeVerifier);

    if (error || !data?.user) {
      console.error('OAuth exchange error:', error);
      return NextResponse.redirect(new URL('/login?error=exchange_failed', origin));
    }

    const ifUser = data.user;
    const metadata = (ifUser.metadata || {}) as Record<string, any>;
    const rawRole = metadata.role || 'customer';
    const role: AdminRole | 'customer' = ['super_admin', 'inventory_manager', 'support_staff', 'read_only'].includes(rawRole)
      ? (rawRole as AdminRole)
      : 'customer';
    const userName = ifUser.profile?.name || metadata.name || ifUser.email?.split('@')[0] || 'Empress Member';
    const isAdmin = role !== 'customer';

    // Create session cookie
    await createSession({
      id: ifUser.id,
      email: ifUser.email || '',
      name: userName,
      role,
    });

    const targetRedirectCookie = cookieStore.get('insforge_auth_redirect')?.value;
    cookieStore.delete('insforge_auth_redirect');

    let destination = isAdmin ? '/admin' : '/account';
    if (targetRedirectCookie) {
      if (isAdmin && targetRedirectCookie.startsWith('/admin')) {
        destination = getSafeRedirectUrl(targetRedirectCookie, '/admin');
      } else if (!isAdmin) {
        destination = getSafeRedirectUrl(targetRedirectCookie, '/account');
      }
    }

    return NextResponse.redirect(new URL(destination, origin));
  } catch (err: any) {
    console.error('OAuth callback exception:', err);
    return NextResponse.redirect(new URL('/login?error=oauth_exception', origin));
  }
}
