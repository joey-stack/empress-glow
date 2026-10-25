import React from 'react';
import type { Metadata } from 'next';
import { AdminAuditLogViewer } from '@/components/admin/admin-audit-log-viewer';

export const metadata: Metadata = {
  title: 'Activity & Audit Log | Empress Glow Admin',
  description: 'Immutable chronological audit records of administrative mutations and compliance activities.',
};

export default function AdminAuditLogsPage() {
  return <AdminAuditLogViewer />;
}
