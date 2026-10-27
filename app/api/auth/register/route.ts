import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/insforge/queries';
import { hashPassword, createSession } from '@/lib/auth/session';
import { getSafeRedirectUrl } from '@/lib/auth/redirect';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, ndpaConsent, redirect: requestedRedirect } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Please provide a valid phone number (e.g. +234 801 234 5678).' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    // NDPA 2023 Requirement: Affirmative consent must be actively selected
    if (ndpaConsent !== true) {
      return NextResponse.json(
        { error: 'You must affirmatively accept the Privacy Policy and NDPA consent to create an account.' },
        { status: 400 }
      );
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const password_hash = hashPassword(password);
    const user = await createUser({
      name,
      email,
      phone,
      password_hash,
    });

    // Synchronize account with InsForge BaaS Auth engine
    try {
      const { insforge } = await import('@/lib/insforge/client');
      const signUpRes = await insforge.auth.signUp({
        email: user.email,
        password,
        name: user.name,
      });
      if (signUpRes.error && !signUpRes.error.message?.includes('already exists')) {
        console.warn('InsForge BaaS account sync notice:', signUpRes.error.message);
      }
    } catch (e) {
      // Continue seamlessly if InsForge cloud sync notice occurs
      console.warn('InsForge BaaS account sync notice:', e);
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json(
      {
        success: true,
        redirectUrl: getSafeRedirectUrl(requestedRedirect, '/account'),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          ndpa_consent_at: user.ndpa_consent_at,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
