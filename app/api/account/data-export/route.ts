import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { getUserById, getUserAddresses, getOrdersByCustomerEmail } from '@/lib/insforge/queries';

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserById(session.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const addresses = await getUserAddresses(user.id);
  const orders = await getOrdersByCustomerEmail(user.email);

  const exportPackage = {
    metadata: {
      generated_at: new Date().toISOString(),
      regulations: 'Nigeria Data Protection Act (NDPA) 2023',
      data_controller: 'Empress Glow Emporium Ltd',
      dpo_contact: 'dpo@empressglowemporium.com',
    },
    user_profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      created_at: user.created_at,
      ndpa_consent_at: user.ndpa_consent_at,
    },
    saved_addresses: addresses.map((a) => ({
      label: a.label,
      street: a.street,
      city: a.city,
      state: a.state,
      is_default: a.is_default,
    })),
    order_history: orders.map((o) => ({
      order_id: o.id,
      date: o.created_at,
      status: o.status,
      items: o.items,
      total_ngn: o.total,
      shipping_fee_ngn: o.shipping_fee,
      shipping_address: `${o.shipping_address}, ${o.city}, ${o.state}`,
      paystack_reference: o.paystack_reference || 'N/A',
    })),
  };

  return new NextResponse(JSON.stringify(exportPackage, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="empress-glow-personal-data.json"',
    },
  });
}
