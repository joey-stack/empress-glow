import React from 'react';
import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/admin-shell';

export const metadata: Metadata = {
  title: 'Admin Control Center | Empress Glow Emporium',
  description: 'Shopify-style e-commerce administration and catalog suite for Empress Glow Emporium.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
