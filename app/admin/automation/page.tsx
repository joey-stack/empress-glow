import React from 'react';
import type { Metadata } from 'next';
import { getWorkflowRules, getWorkflowExecutionLogs } from '@/lib/insforge/queries';
import { AdminAutomationManager } from '@/components/admin/admin-automation-manager';

export const metadata: Metadata = {
  title: 'Workflow Automation & Policy Triggers | Empress Glow Admin',
  description:
    'Event-driven rules for low-stock threshold replenishment, NAFDAC non-medical claim enforcement, fraud order interception, and VIP customer tagging.',
};

export default async function AdminAutomationPage() {
  const [rules, logs] = await Promise.all([
    getWorkflowRules(),
    getWorkflowExecutionLogs(40),
  ]);

  return (
    <div className="py-2">
      <AdminAutomationManager initialRules={rules} initialLogs={logs} />
    </div>
  );
}
