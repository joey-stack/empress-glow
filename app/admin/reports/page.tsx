import React from 'react';
import type { Metadata } from 'next';
import { getStoreAnalyticsData } from '@/lib/insforge/queries';
import { AdminReportsDashboard } from '@/components/admin/admin-reports-dashboard';

export const metadata: Metadata = {
  title: 'Analytics & Regulatory Compliance Reports | Empress Glow Admin',
  description:
    'Comprehensive store performance, variant sales matrix, brand market share, customer RFM retention cohorts, and NAFDAC statutory audit dossier.',
};

export default async function AdminReportsPage() {
  const analyticsData = await getStoreAnalyticsData();

  return (
    <div className="py-2">
      <AdminReportsDashboard initialData={analyticsData} />
    </div>
  );
}
