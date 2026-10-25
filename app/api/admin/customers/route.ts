import { NextResponse } from 'next/server';
import { getAllUsers, getAllOrders } from '@/lib/insforge/queries';

export async function GET() {
  try {
    const [users, orders] = await Promise.all([getAllUsers(), getAllOrders()]);

    const enrichedUsers = users.map((u) => {
      const userOrders = orders.filter(
        (o) => o.customer_email.toLowerCase() === u.email.toLowerCase()
      );
      const totalSpent = userOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);

      return {
        id: u.id,
        email: u.email,
        name: u.name,
        phone: u.phone,
        created_at: u.created_at,
        ndpa_consent_at: u.ndpa_consent_at,
        orders_count: userOrders.length,
        total_spent: totalSpent,
        last_order_date: userOrders[0]?.created_at || null,
      };
    });

    return NextResponse.json({ customers: enrichedUsers });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
