import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { getUserById, getUserByEmail, updateUserProfile, getUserAddresses, UserProfile } from '@/lib/insforge/queries';

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let user: UserProfile | null = await getUserById(session.id);
  if (!user && session.email) {
    user = await getUserByEmail(session.email);
  }
  if (!user) {
    user = {
      id: session.id,
      name: session.name || session.email.split('@')[0],
      email: session.email,
      phone: '+234 800 000 0000',
      password_hash: '',
      created_at: new Date().toISOString(),
      ndpa_consent_at: new Date().toISOString(),
    };
  }

  const addresses = await getUserAddresses(user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      created_at: user.created_at,
      ndpa_consent_at: user.ndpa_consent_at,
    },
    addresses,
  });
}

export async function PUT(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone } = body;

    const updated = await updateUserProfile(session.id, { name, phone });
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}
