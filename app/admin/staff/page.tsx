import React from 'react';
import type { Metadata } from 'next';
import { AdminStaffManager } from '@/components/admin/admin-staff-manager';

export const metadata: Metadata = {
  title: 'Staff Accounts & Permissions | Empress Glow Admin',
  description: 'Manage administrative roles, Super Admin access, and staff permissions for Empress Glow Emporium.',
};

export default function AdminStaffPage() {
  return <AdminStaffManager />;
}
