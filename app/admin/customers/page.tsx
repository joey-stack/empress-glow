import React from 'react';
import type { Metadata } from 'next';
import { getAllUsers, getAllOrders } from '@/lib/insforge/queries';
import { AdminCustomersManager } from '@/components/admin/admin-customers-manager';

export const metadata: Metadata = {
  title: 'Customers Directory | Empress Glow Admin',
  description: 'Manage registered customer profiles, NDPA consent audit records, and customer lifetime value.',
};

export default async function AdminCustomersPage() {
  const [users, orders] = await Promise.all([getAllUsers(), getAllOrders()]);

  const customers = users.map((u) => {
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

  return (
    <div className="space-y-6">
      <AdminCustomersManager initialCustomers={customers} />
    </div>
  );
}
