import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { createAddress, deleteAddress, getUserAddresses } from '@/lib/insforge/queries';

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const addresses = await getUserAddresses(session.id);
  return NextResponse.json({ addresses });
}

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { label, street, city, state, is_default } = body;

    if (!street || !city || !state) {
      return NextResponse.json({ error: 'Please provide street, city, and state.' }, { status: 400 });
    }

    const newAddress = await createAddress(session.id, {
      label: label || 'Home',
      street,
      city,
      state,
      is_default: Boolean(is_default),
    });

    return NextResponse.json({ success: true, address: newAddress }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create address' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const addressId = searchParams.get('id');

  if (!addressId) {
    return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
  }

  const deleted = await deleteAddress(session.id, addressId);
  if (!deleted) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Address removed' });
}
