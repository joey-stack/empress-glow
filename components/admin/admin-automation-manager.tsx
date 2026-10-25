'use client';

import React, { useState } from 'react';
import type { WorkflowRule, WorkflowExecutionLog } from '@/lib/insforge/queries';

interface AdminAutomationManagerProps {
  initialRules: WorkflowRule[];
  initialLogs: WorkflowExecutionLog[];
}

export function AdminAutomationManager({
  initialRules,
  initialLogs,
}: AdminAutomationManagerProps) {
  const [rules, setRules] = useState<WorkflowRule[]>(initialRules);
  const [logs, setLogs] = useState<WorkflowExecutionLog[]>(initialLogs);
  const [runningRuleId, setRunningRuleId] = useState<string | null>(null);
  const [runningAll, setRunningAll] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleRule = async (ruleId: string, currentEnabled: boolean) => {
    try {
      const res = await fetch('/api/admin/automation/rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ruleId, is_enabled: !currentEnabled }),
      });
      const data = await res.json();
      if (data.success && data.rule) {
        setRules((prev) =>
          prev.map((r) => (r.id === ruleId ? { ...r, is_enabled: data.rule.is_enabled } : r))
        );
        showNotification(
          'success',
          `Automation rule "${data.rule.title}" ${data.rule.is_enabled ? 'enabled' : 'disabled'}.`
        );
      } else {
        throw new Error(data.error || 'Failed to toggle rule');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error updating automation rule');
    }
  };

  const handleRunRule = async (ruleId: string) => {
    setRunningRuleId(ruleId);
    try {
      const res = await fetch('/api/admin/automation/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const { rule, executionLog, affectedCount } = data.data;
        setRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
        setLogs((prev) => [executionLog, ...prev.slice(0, 49)]);
        showNotification(
          'success',
          `Executed "${rule.title}": ${executionLog.action_taken}`
        );
      } else {
        throw new Error(data.error || 'Execution failed');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error executing automation rule');
    } finally {
      setRunningRuleId(null);
    }
  };

  const handleRunAll = async () => {
    setRunningAll(true);
    try {
      const res = await fetch('/api/admin/automation/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh rules and logs from server
        const rulesRes = await fetch('/api/admin/automation/rules');
        const refreshed = await rulesRes.json();
        if (refreshed.success) {
          setRules(refreshed.rules);
          setLogs(refreshed.recentLogs);
        }
        showNotification('success', data.message || 'All enabled rules executed successfully.');
      } else {
        throw new Error(data.error || 'Failed to execute all rules');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error running all automations');
    } finally {
      setRunningAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 border font-mono text-xs flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{notification.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs hover:underline font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-white border border-[#e5dcd0] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 border bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30">
              Event-Driven Workflows
            </span>
            <span className="font-mono text-xs text-[#7b7366]">
              Autonomous Background Rules &amp; Guardrails
            </span>
          </div>
          <h1 className="font-serif text-2xl text-[#131010] font-normal tracking-tight">
            Workflow Automation Engine &amp; Policy Triggers
          </h1>
          <p className="text-xs text-[#524b42] max-w-2xl leading-relaxed">
            Automate low-stock alerts, enforce statutory NAFDAC claim guidelines on product descriptions, intercept high-value fraud orders, and tag VIP customers for priority consultations.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={handleRunAll}
            disabled={runningAll}
            className="flex-1 md:flex-none text-center px-4 py-2.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] border border-[#131010] hover:border-[#2d5508] transition-colors flex items-center justify-center gap-2"
          >
            {runningAll ? (
              <span className="animate-spin text-sm">↻</span>
            ) : (
              <span>⚡</span>
            )}
            Run All Enabled Rules
          </button>
        </div>
      </div>

      {/* 2. Automation Rules Matrix */}
      <div className="bg-white border border-[#e5dcd0] p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5dcd0]">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
              Configured Automation Rules ({rules.length})
            </h2>
            <p className="text-xs text-[#7b7366]">
              Active background triggers executing on catalog updates, inventory thresholds, and order settlements.
            </p>
          </div>
          <span className="font-mono text-[10px] text-[#2d5508] bg-[#2d5508]/10 px-2 py-0.5 border border-[#2d5508]/20">
            {rules.filter((r) => r.is_enabled).length} of {rules.length} Active
          </span>
        </div>

        <div className="space-y-4">
          {rules.map((rule) => {
            const isRunning = runningRuleId === rule.id;
            return (
              <div
                key={rule.id}
                className="p-5 bg-[#faf8f5] border border-[#e5dcd0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#2d5508]/50 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border font-semibold ${
                        rule.trigger_type === 'low_stock'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : rule.trigger_type === 'nafdac_compliance'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : rule.trigger_type === 'fraud_threshold'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {rule.trigger_type.replace('_', ' ')}
                    </span>
                    <h3 className="font-serif text-base text-[#131010] font-medium">
                      {rule.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#524b42] max-w-2xl leading-relaxed">
                    {rule.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-[#7b7366]">
                    <div>
                      <span className="text-[#131010] font-semibold">Condition:</span>{' '}
                      {rule.condition_summary}
                    </div>
                    <div>
                      <span className="text-[#131010] font-semibold">Action:</span>{' '}
                      {rule.action_summary}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#e5dcd0]">
                  <div className="text-right font-mono text-[10px] text-[#7b7366] hidden lg:block">
                    <div>Executions: <strong className="text-[#131010]">{rule.executions_count}</strong></div>
                    <div>Last run: {rule.last_triggered_at ? new Date(rule.last_triggered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}</div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.is_enabled}
                      onChange={() => handleToggleRule(rule.id, rule.is_enabled)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#e5dcd0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#e5dcd0] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2d5508] relative" />
                    <span className="font-mono text-xs uppercase tracking-wider text-[#131010]">
                      {rule.is_enabled ? 'Active' : 'Off'}
                    </span>
                  </label>

                  {/* Manual Run Button */}
                  <button
                    type="button"
                    onClick={() => handleRunRule(rule.id)}
                    disabled={isRunning}
                    className="px-3 py-1.5 bg-white hover:bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                  >
                    {isRunning ? (
                      <span className="animate-spin text-xs">↻</span>
                    ) : (
                      <span>⚡</span>
                    )}
                    Run Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Execution History Log */}
      <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5dcd0]">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
              Automation Execution History &amp; Audit Trail
            </h2>
            <p className="text-xs text-[#7b7366]">
              Immutable log of autonomous actions, security alerts, and replenishment requisitions dispatched.
            </p>
          </div>
          <span className="font-mono text-[10px] text-[#7b7366]">
            Showing {logs.length} most recent triggers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e5dcd0] bg-[#faf8f5] text-[#7b7366] font-mono text-[10px] uppercase tracking-[0.18em]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Rule Title</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Action Dispatched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5dcd0] text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#faf6f0] transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-[#7b7366] whitespace-nowrap">
                    {new Date(log.triggered_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4 font-serif text-[#131010] font-medium">
                    {log.rule_title}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span
                      className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${
                        log.status === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : log.status === 'warning'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#524b42]">
                    {log.target_title || log.target_id || 'System'}
                  </td>
                  <td className="py-3 px-4 text-[#131010] leading-relaxed max-w-md">
                    {log.action_taken}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
