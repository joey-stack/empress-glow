import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSubscribers } from '@/lib/insforge/queries';
import { SubscribersView } from '@/components/admin/subscribers-view';

export const metadata: Metadata = {
  title: 'Waitlist Subscribers | Empress Glow Admin',
  description: 'Manage and export pre-launch waitlist leads and product-specific notification signups.',
};

export default async function AdminSubscribersPage() {
  const subscribers = await getSubscribers();

  return <SubscribersView initialSubscribers={subscribers} />;
}
