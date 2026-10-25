'use client';
import React, { useState, useEffect } from 'react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  category: 'catalog' | 'orders' | 'finance' | 'staff' | 'settings' | 'auth';
  target_type: string;
  target_id?: string;
  summary: string;
  details?: Record<string, any>;
  ip_address?: string;
}

export function AdminAuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('limit', '100');

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      } else {
        setError(data.error || 'Failed to fetch audit logs');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `empress_glow_audit_trail_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'catalog':
        return (
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#2d5508] bg-[#2d5508]/10 text-[#2d5508] font-semibold">
            Catalog
          </span>
        );
      case 'finance':
        return (
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#b88e4e] bg-[#b88e4e]/10 text-[#8c6b32] font-semibold">
            Finance
          </span>
        );
      case 'orders':
        return (
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-blue-300 bg-blue-50 text-blue-900 font-semibold">
            Orders
          </span>
        );
      case 'staff':
        return (
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-purple-300 bg-purple-50 text-purple-900 font-semibold">
            Security &amp; Staff
          </span>
        );
      default:
        return (
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#7b7366] bg-[#7b7366]/10 text-[#7b7366] font-semibold">
            {category}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-[#e5dcd0] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
            System Traceability &bull; Statutory Audit Log
          </span>
          <h1 className="font-serif text-2xl text-[#131010] font-normal tracking-tight">
            Administrative Activity &amp; Audit Trail
          </h1>
          <p className="text-xs text-[#7b7366] max-w-2xl mt-1 leading-relaxed">
            Immutable chronological record of all administrative state mutations, including bulk pricing adjustments, Paystack refunds, customer return inspections, and staff role privilege changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#e5dcd0] bg-white hover:bg-[#faf6f0] text-xs font-mono uppercase tracking-wider text-[#131010] transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#5a8210]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] px-4 py-2 border border-[#131010] hover:border-[#2d5508] transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#5a8210]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Trail (JSON)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e5dcd0] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {['all', 'catalog', 'finance', 'orders', 'staff', 'settings'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#131010] text-[#f7f1e8] border-[#131010]'
                  : 'bg-white text-[#7b7366] border-[#e5dcd0] hover:border-[#131010]'
              }`}
            >
              {cat === 'all' ? 'All Activity' : cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-sm w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, actor, or Order ID..."
            className="flex-1 px-3 py-1.5 border border-[#e5dcd0] text-xs text-[#131010] focus:border-[#131010] focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#faf8f5] border border-[#e5dcd0] text-xs font-mono uppercase tracking-wider text-[#131010] hover:border-[#131010]"
          >
            Filter
          </button>
        </form>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 text-xs flex items-center justify-between font-medium">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-900 hover:underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* Audit Log Table */}
      <div className="bg-white border border-[#e5dcd0] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e5dcd0] bg-[#faf8f5] font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366]">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Operator</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Action Summary</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dcd0]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-[#7b7366] font-mono">
                  Loading cryptographic audit records...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-[#7b7366] font-mono">
                  No audit log entries found for current criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isExpanded = expandedLogId === log.id;

                return (
                  <React.Fragment key={log.id}>
                    <tr
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className={`cursor-pointer hover:bg-[#faf8f5]/80 transition-colors ${
                        isExpanded ? 'bg-[#faf8f5]' : ''
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#7b7366] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('en-NG', {
                          dateStyle: 'short',
                          timeStyle: 'medium',
                        })}
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-[#131010] text-[#f7f1e8] font-mono text-[9px] flex items-center justify-center font-bold">
                            {log.actor.name[0]}
                          </span>
                          <div>
                            <div className="font-medium text-[#131010] leading-tight">{log.actor.name}</div>
                            <div className="font-mono text-[9px] text-[#7b7366]">{log.actor.role}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getCategoryBadge(log.category)}
                      </td>

                      {/* Summary */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#131010]">{log.summary}</div>
                        <div className="font-mono text-[10px] text-[#7b7366] flex items-center gap-2 mt-0.5">
                          <span className="text-[#2d5508]">{log.action}</span>
                          {log.target_id && (
                            <>
                              <span>&bull;</span>
                              <span>Target: {log.target_id}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Expand Indicator */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono text-[10px] text-[#5a8210] hover:underline">
                          {isExpanded ? 'Hide Payload' : 'Inspect Details'}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Payload / Inspection Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#faf8f5] border-y border-[#e5dcd0]">
                        <td colSpan={5} className="p-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div className="p-3 bg-white border border-[#e5dcd0] space-y-1">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block">
                                Audit Log Record ID
                              </span>
                              <span className="font-mono text-xs text-[#131010]">{log.id}</span>
                            </div>

                            <div className="p-3 bg-white border border-[#e5dcd0] space-y-1">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block">
                                Operator Email &amp; IP
                              </span>
                              <span className="font-mono text-xs text-[#131010]">
                                {log.actor.email} &bull; {log.ip_address || '127.0.0.1'}
                              </span>
                            </div>

                            <div className="p-3 bg-white border border-[#e5dcd0] space-y-1">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block">
                                Target Entity Type
                              </span>
                              <span className="font-mono text-xs text-[#131010]">
                                {log.target_type} ({log.target_id || 'N/A'})
                              </span>
                            </div>
                          </div>

                          {/* JSON Payload Inspection */}
                          {log.details && (
                            <div className="bg-[#131010] text-[#f7f1e8] p-3.5 border border-[#262220] font-mono text-[11px] overflow-x-auto">
                              <div className="text-[9px] uppercase tracking-[0.2em] text-[#5a8210] mb-1 font-semibold">
                                Mutation Payload Details:
                              </div>
                              <pre className="text-[#e5dcd0]">{JSON.stringify(log.details, null, 2)}</pre>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
