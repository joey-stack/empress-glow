'use client';

import React, { useState, useMemo } from 'react';
import type { Subscriber } from '@/lib/insforge/queries';

interface SubscribersViewProps {
  initialSubscribers: Subscriber[];
}

export function SubscribersView({ initialSubscribers }: SubscribersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [subscribers] = useState<Subscriber[]>(initialSubscribers);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{ success: boolean; message: string } | null>(null);

  // Filtered subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchesSearch =
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesProduct =
        selectedProduct === 'all' || sub.product_slug === selectedProduct;
      return matchesSearch && matchesProduct;
    });
  }, [subscribers, searchTerm, selectedProduct]);

  // Counts
  const counts = useMemo(() => {
    const total = subscribers.length;
    const heroSoap = subscribers.filter((s) => s.product_slug === 'empress-glow-fruity-soap').length;
    const serum = subscribers.filter((s) => s.product_slug === 'empress-glow-serum').length;
    const general = subscribers.filter((s) => s.product_slug === 'general' || s.product_slug === 'general-newsletter').length;
    return { total, heroSoap, serum, general };
  }, [subscribers]);

  // CSV Export
  const exportToCSV = () => {
    const headers = ['ID', 'Email', 'Name', 'Product Slug', 'Subscribed At'];
    const rows = filteredSubscribers.map((s) => [
      `"${s.id}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${s.product_slug}"`,
      `"${s.created_at}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `empress_glow_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-[#e5dcd0] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
            Marketing &bull; Private Reservation Circle
          </span>
          <h1 className="font-serif text-2xl font-normal text-[#131010] tracking-tight">
            Waitlist Audience &amp; Early Access
          </h1>
          <p className="text-xs text-[#7b7366] mt-1">
            Verified customer opt-ins captured per NDPA 2023 regulations for batch announcements and priority launches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] border border-[#131010] hover:border-[#2d5508] transition-colors"
          >
            📢 Launch Broadcast
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredSubscribers.length === 0}
            className="px-4 py-2 bg-white hover:bg-[#faf6f0] text-[#131010] font-mono text-xs uppercase tracking-[0.18em] border border-[#e5dcd0] transition-colors disabled:opacity-50"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e5dcd0] p-5 space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366] block">
            Total Captured
          </span>
          <span className="font-serif text-2xl font-normal text-[#131010] block">
            {counts.total}
          </span>
          <span className="font-mono text-[10px] text-[#2d5508]">100% Consent Logged</span>
        </div>
        <div className="bg-white border border-[#e5dcd0] p-5 space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366] block">
            Fruity Soap Waitlist
          </span>
          <span className="font-serif text-2xl font-normal text-[#2d5508] block">
            {counts.heroSoap}
          </span>
          <span className="font-mono text-[10px] text-[#7b7366]">Flagship 4-Sizes</span>
        </div>
        <div className="bg-white border border-[#e5dcd0] p-5 space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366] block">
            Glow Serum Waitlist
          </span>
          <span className="font-serif text-2xl font-normal text-[#b88e4e] block">
            {counts.serum}
          </span>
          <span className="font-mono text-[10px] text-[#7b7366]">Aura Botanicals</span>
        </div>
        <div className="bg-white border border-[#e5dcd0] p-5 space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366] block">
            General VIP Circle
          </span>
          <span className="font-serif text-2xl font-normal text-[#131010] block">
            {counts.general}
          </span>
          <span className="font-mono text-[10px] text-[#7b7366]">Newsletter Roster</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#e5dcd0] overflow-hidden">
        {/* Actions Bar */}
        <div className="p-4 border-b border-[#e5dcd0] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#faf8f5]">
          {/* Search Input */}
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#e5dcd0] bg-white focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none placeholder:text-[#7b7366]"
            />
            <span className="absolute left-3 top-2.5 text-xs text-[#7b7366]">
              🔍
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-2 text-xs border border-[#e5dcd0] bg-white text-[#131010] outline-none font-mono text-[11px]"
            >
              <option value="all">All Products ({counts.total})</option>
              <option value="empress-glow-fruity-soap">Fruity Soap ({counts.heroSoap})</option>
              <option value="empress-glow-serum">Glow Serum ({counts.serum})</option>
              <option value="general">General VIP ({counts.general})</option>
            </select>
          </div>
        </div>

        {/* Broadcast Modal */}
        {showBroadcastModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white border border-[#e5dcd0] max-w-lg w-full p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-[#e5dcd0] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📢</span>
                  <h3 className="font-serif text-lg text-[#131010] font-normal">
                    Phase 2 Live Launch Broadcast
                  </h3>
                </div>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="text-[#7b7366] hover:text-[#131010] font-mono text-sm border border-[#e5dcd0] px-2 py-1"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-[#524b42] space-y-3">
                <p>
                  Dispatches the official <strong>Launch Announcement Dispatch</strong> to waitlist clients notifying them that Empress Glow Emporium is licensed and active for direct online orders.
                </p>
                <div className="bg-[#faf8f5] p-3 border border-[#e5dcd0] space-y-1 font-mono text-[11px]">
                  <p><strong>Recipients:</strong> {counts.total} active waitlist subscribers</p>
                  <p><strong>Catalog Prices:</strong> Small ₦3,000 / Med ₦7,000 / Lrg ₦11,000 / XL ₦16,000</p>
                  <p><strong>CTAs:</strong> Direct Store Link + WhatsApp Consultation</p>
                </div>
                {broadcastResult && (
                  <div
                    className={`p-3 border font-mono text-xs ${
                      broadcastResult.success
                        ? 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {broadcastResult.message}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5dcd0]">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  disabled={isBroadcasting}
                  className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#524b42] hover:bg-[#faf8f5] border border-[#e5dcd0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isBroadcasting}
                  onClick={async () => {
                    setIsBroadcasting(true);
                    setBroadcastResult(null);
                    try {
                      const res = await fetch('/api/admin/broadcast-launch', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                      });
                      const data = await res.json();
                      if (data.success) {
                        setBroadcastResult({
                          success: true,
                          message: data.message || `Dispatched to ${data.sent_count} subscribers!`,
                        });
                      } else {
                        setBroadcastResult({
                          success: false,
                          message: data.error || 'Failed to dispatch broadcast',
                        });
                      }
                    } catch (err: any) {
                      setBroadcastResult({
                        success: false,
                        message: err.message || 'Connection error',
                      });
                    } finally {
                      setIsBroadcasting(false);
                    }
                  }}
                  className="px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#f7f1e8] bg-[#131010] hover:bg-[#2d5508] disabled:opacity-50 border border-[#131010] hover:border-[#2d5508] transition-colors"
                >
                  {isBroadcasting ? 'Dispatching...' : 'Confirm & Dispatch'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf6f0] uppercase tracking-[0.2em] text-[10px] text-[#7b7366] font-mono border-b border-[#e5dcd0]">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Client Subscriber
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Product Target
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Enrollment Date
                </th>
                <th scope="col" className="px-6 py-3.5">
                  NDPA Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5dcd0]">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#7b7366] font-mono text-xs">
                    No waitlist subscribers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#131010] text-sm">
                        {sub.email}
                      </div>
                      <div className="text-[#7b7366] text-xs font-mono">
                        {sub.name || 'Anonymous Guest'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-0.5 border border-[#e5dcd0] bg-[#faf8f5] text-[#131010] font-mono text-[10px] uppercase tracking-wider">
                        {sub.product_slug === 'empress-glow-fruity-soap'
                          ? 'Hero Fruity Soap'
                          : sub.product_slug === 'empress-glow-serum'
                          ? 'Empress Glow Serum'
                          : 'General Launch VIP'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#7b7366] font-mono text-[10px]">
                      {new Date(sub.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#2d5508]/30 bg-[#2d5508]/10 text-[#2d5508]">
                        <span className="w-1.5 h-1.5 bg-[#5a8210]"></span>
                        Consent Logged
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-[#e5dcd0] bg-[#faf8f5] font-mono text-[10px] uppercase tracking-wider text-[#7b7366] flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            Displaying {filteredSubscribers.length} of {subscribers.length} total subscribers
          </span>
          <span>
            NDPA 2023 &bull; Explicit commercial opt-in captured with audit timestamp
          </span>
        </div>
      </div>
    </div>
  );
}
