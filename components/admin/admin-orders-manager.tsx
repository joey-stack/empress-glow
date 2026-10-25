'use client';

import React, { useState, useMemo } from 'react';
import type { Order, Product, UserProfile } from '@/lib/insforge/queries';
import { CreateDraftOrderModal } from './create-draft-order-modal';
import { OrderRefundModal } from './order-refund-modal';
import { EditOrderModal } from './edit-order-modal';

interface AdminOrdersManagerProps {
  initialOrders: Order[];
  availableProducts?: Product[];
  registeredCustomers?: UserProfile[];
}

export function AdminOrdersManager({
  initialOrders,
  availableProducts = [],
  registeredCustomers = [],
}: AdminOrdersManagerProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<'all' | 'drafts' | 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'returns_refunds'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'total-desc' | 'total-asc'>('date-desc');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [refundOrderTarget, setRefundOrderTarget] = useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [verifyingFraud, setVerifyingFraud] = useState(false);

  // Inspector form state
  const [editStatus, setEditStatus] = useState<Order['status']>('pending');
  const [editTrackingNotes, setEditTrackingNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Counts
  const draftOrdersCount = orders.filter((o) => o.is_draft).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' && !o.is_draft).length;
  const paidOrdersCount = orders.filter((o) => o.status === 'paid').length;
  const returnsRefundsCount = orders.filter(
    (o) =>
      (o.refunds && o.refunds.length > 0) ||
      o.return_tracking?.return_requested ||
      o.financial_status === 'partially_refunded' ||
      o.financial_status === 'refunded'
  ).length;

  // Filtered orders with multi-field search, date range, product, and sorting
  const filteredOrders = useMemo(() => {
    let result = orders.filter((o) => {
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'drafts'
          ? o.is_draft
          : filter === 'pending'
          ? o.status === 'pending' && !o.is_draft
          : filter === 'returns_refunds'
          ? (o.refunds && o.refunds.length > 0) ||
            o.return_tracking?.return_requested ||
            o.financial_status === 'partially_refunded' ||
            o.financial_status === 'refunded'
          : o.status === filter;

      if (!matchesFilter) return false;

      // Date range filtering
      if (dateFilter !== 'all') {
        const orderTime = new Date(o.created_at).getTime();
        const now = Date.now();
        if (dateFilter === 'today') {
          const isToday = new Date(o.created_at).toDateString() === new Date().toDateString();
          if (!isToday) return false;
        } else if (dateFilter === '7days') {
          if (now - orderTime > 7 * 86400000) return false;
        } else if (dateFilter === '30days') {
          if (now - orderTime > 30 * 86400000) return false;
        }
      }

      // Product formulation filtering
      if (productFilter !== 'all') {
        const hasProduct = o.items.some(
          (item) => item.productId === productFilter || item.name.toLowerCase().includes(productFilter.toLowerCase())
        );
        if (!hasProduct) return false;
      }

      // Fraud risk level filtering
      if (riskFilter !== 'all') {
        const orderRisk = o.fraud_analysis?.risk_level || 'low';
        if (orderRisk !== riskFilter) return false;
      }

      // Query text search (customer name, phone, email, order id, paystack ref, address, city, item name/variant)
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesQuery =
          o.id.toLowerCase().includes(query) ||
          o.customer_name.toLowerCase().includes(query) ||
          o.customer_email.toLowerCase().includes(query) ||
          o.customer_phone.includes(query) ||
          (o.shipping_address && o.shipping_address.toLowerCase().includes(query)) ||
          (o.city && o.city.toLowerCase().includes(query)) ||
          (o.paystack_reference && o.paystack_reference.toLowerCase().includes(query)) ||
          o.items.some(
            (i) =>
              i.name.toLowerCase().includes(query) ||
              (i.variantName && i.variantName.toLowerCase().includes(query))
          );
        if (!matchesQuery) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'date-asc') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'date-desc') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'total-desc') {
      result.sort((a, b) => b.total - a.total);
    } else if (sortBy === 'total-asc') {
      result.sort((a, b) => a.total - b.total);
    }

    return result;
  }, [orders, filter, dateFilter, productFilter, searchQuery, sortBy]);

  const filteredTotalValue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + o.total, 0);
  }, [filteredOrders]);

  const handleOpenInspector = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditTrackingNotes(order.tracking_notes || '');
    setSaveMessage(null);
  };

  const handleCopyPaymentLink = (order: Order) => {
    if (!order.payment_link_url) return;
    navigator.clipboard.writeText(order.payment_link_url);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  const handleSaveFulfillment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: editStatus,
          tracking_notes: editTrackingNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: editStatus, tracking_notes: editTrackingNotes } : o
        )
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: editStatus, tracking_notes: editTrackingNotes } : null
      );
      setSaveMessage('Order fulfillment status updated successfully.');
    } catch (err: any) {
      setSaveMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyFraud = async (orderId: string, verified: boolean) => {
    setVerifyingFraud(true);
    try {
      const res = await fetch('/api/admin/orders/fraud-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          verified,
          notes: 'Customer identity, delivery address, and contact verified by operator.',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update fraud verification');

      if (data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        setSelectedOrder((prev) => (prev?.id === orderId ? data.order : prev));
      }
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`);
    } finally {
      setVerifyingFraud(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 border border-[#e5dcd0]">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
            Fulfillment Queue &bull; Paystack Naira &bull; WhatsApp Sales
          </span>
          <h1 className="font-serif text-2xl font-normal text-[#131010] tracking-tight">
            Customer Orders &amp; Dispatch
          </h1>
          <p className="text-xs text-[#7b7366] mt-1">
            Build manual draft orders for WhatsApp clients, verify Paystack transactions, and dispatch courier logistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDraftModalOpen(true)}
            className="px-4 py-2 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] border border-[#131010] hover:border-[#2d5508] transition-colors flex items-center gap-1.5"
          >
            <span>+ Create Draft Order</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-[#e5dcd0] p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7b7366]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by order #, client name, phone, email, city, or formulation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#faf8f5] focus:bg-white border border-[#e5dcd0] focus:border-[#2d5508] transition-colors placeholder:text-[#7b7366] text-[#131010] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7b7366] hover:text-[#131010]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Tabs (Shopify Style) */}
          <div className="flex flex-wrap gap-1 border border-[#e5dcd0] p-1 bg-[#faf8f5]">
            {(
              [
                { id: 'all', label: `All (${orders.length})` },
                { id: 'drafts', label: `Drafts (${draftOrdersCount})` },
                { id: 'pending', label: `Pending (${pendingOrdersCount})` },
                { id: 'paid', label: `Paid (${paidOrdersCount})` },
                { id: 'shipped', label: 'Shipped' },
                { id: 'delivered', label: 'Delivered' },
                { id: 'cancelled', label: 'Cancelled' },
                { id: 'returns_refunds', label: `Returns & Refunds (${returnsRefundsCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 transition-colors ${
                  filter === tab.id
                    ? 'bg-[#131010] text-[#f7f1e8] font-medium'
                    : 'text-[#7b7366] hover:text-[#131010] hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters: Date Range, Formulation, Sort By & Value Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e5dcd0]/60 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Preset */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">Date:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="bg-[#faf8f5] border border-[#e5dcd0] px-2.5 py-1 text-xs font-mono text-[#131010] outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* Product Formulation Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">Formulation:</span>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="bg-[#faf8f5] border border-[#e5dcd0] px-2.5 py-1 text-xs font-mono text-[#131010] outline-none max-w-xs"
              >
                <option value="all">All Formulations</option>
                {availableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#faf8f5] border border-[#e5dcd0] px-2.5 py-1 text-xs font-mono text-[#131010] outline-none"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="total-desc">Total Value (High to Low)</option>
                <option value="total-asc">Total Value (Low to High)</option>
              </select>
            </div>

            {/* Fraud Risk Filter Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">Risk Level:</span>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="bg-[#faf8f5] border border-[#e5dcd0] px-2.5 py-1 text-xs font-mono text-[#131010] outline-none"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">✓ Low Risk Only</option>
                <option value="medium">⚡ Medium Risk Only</option>
                <option value="high">⚠ High Risk Only</option>
              </select>
            </div>

            {/* Clear Filters CTA */}
            {(dateFilter !== 'all' || productFilter !== 'all' || riskFilter !== 'all' || searchQuery.trim() !== '' || filter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setDateFilter('all');
                  setProductFilter('all');
                  setRiskFilter('all');
                  setSearchQuery('');
                  setFilter('all');
                }}
                className="font-mono text-[10px] uppercase tracking-wider text-[#991b1b] hover:underline"
              >
                Reset Filters ✕
              </button>
            )}
          </div>

          {/* Results Counter & GMV */}
          <div className="font-mono text-[11px] text-[#7b7366] flex items-center gap-2">
            <span>Showing <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? 'order' : 'orders'}</span>
            <span>&bull;</span>
            <span className="text-[#2d5508] font-bold">₦{filteredTotalValue.toLocaleString('en-NG')} GMV</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#e5dcd0] overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-[#7b7366] space-y-2">
            <span className="text-3xl block">📦</span>
            <p className="font-mono text-xs uppercase tracking-wider">
              No {filter !== 'all' ? filter : ''} orders matching your criteria.
            </p>
            {filter === 'drafts' && (
              <button
                onClick={() => setIsDraftModalOpen(true)}
                className="mt-3 text-xs font-mono uppercase tracking-wider text-[#2d5508] underline underline-offset-4"
              >
                Create your first WhatsApp draft order →
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#faf6f0] border-b border-[#e5dcd0] text-[#7b7366] font-mono text-[10px] uppercase tracking-[0.2em]">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Client Contact</th>
                  <th className="py-3 px-4">Type / Channel</th>
                  <th className="py-3 px-4">Formulations</th>
                  <th className="py-3 px-4">Total (₦)</th>
                  <th className="py-3 px-4">Settlement Status</th>
                  <th className="py-3 px-4">Fraud Risk</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5dcd0]">
                {filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-[#131010]">
                        #{order.id.substring(0, 8)}
                        <span className="block font-mono text-[9px] text-[#7b7366] font-normal">
                          {new Date(order.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-[#131010]">{order.customer_name}</div>
                        <div className="font-mono text-[10px] text-[#7b7366]">
                          {order.customer_phone || order.customer_email}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {order.is_draft ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#b88e4e]/40 bg-[#b88e4e]/10 text-[#b88e4e]">
                            <span>WhatsApp Draft</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#e5dcd0] bg-[#faf8f5] text-[#7b7366]">
                            <span>Online Store</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[#524b42] max-w-xs truncate">
                        {order.items.map((i) => `${i.name} (${i.variantName}) × ${i.quantity}`).join(', ')}
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-[#131010]">
                        ₦{order.total.toLocaleString('en-NG')}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                              order.status === 'paid' || order.status === 'delivered'
                                ? 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
                                : order.status === 'shipped'
                                ? 'bg-sky-50 text-sky-800 border-sky-300'
                                : order.status === 'pending'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-[#faf6f0] text-[#524b42] border-[#e5dcd0]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 ${
                                order.status === 'paid' || order.status === 'delivered'
                                  ? 'bg-[#5a8210]'
                                  : order.status === 'shipped'
                                  ? 'bg-sky-500'
                                  : 'bg-amber-500'
                              }`}
                            />
                            {order.status}
                          </span>

                          {order.financial_status === 'partially_refunded' && (
                            <div className="font-mono text-[9px] text-[#b88e4e] font-semibold">
                              Refunded: ₦{order.total_refunded?.toLocaleString('en-NG')}
                            </div>
                          )}
                          {order.financial_status === 'refunded' && (
                            <div className="font-mono text-[9px] text-red-600 font-semibold">
                              Full Refund (₦{order.total.toLocaleString('en-NG')})
                            </div>
                          )}
                          {order.return_tracking?.return_requested && (
                            <div className="font-mono text-[9px] text-purple-800 bg-purple-50 border border-purple-200 px-1 py-0.2">
                              Return: {order.return_tracking.return_status}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Fraud Risk Column */}
                      <td className="py-3 px-4">
                        {order.fraud_analysis ? (
                          <div className="space-y-0.5">
                            <span
                              className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                                order.fraud_analysis.operator_verified
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : order.fraud_analysis.risk_level === 'high'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                                  : order.fraud_analysis.risk_level === 'medium'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              <span>
                                {order.fraud_analysis.operator_verified
                                  ? '🛡 Verified'
                                  : order.fraud_analysis.risk_level === 'high'
                                  ? '⚠ High Risk'
                                  : order.fraud_analysis.risk_level === 'medium'
                                  ? '⚡ Med Risk'
                                  : '✓ Low Risk'}
                              </span>
                              <span className="opacity-70">({order.fraud_analysis.risk_score})</span>
                            </span>
                            {order.fraud_analysis.flags.length > 0 && !order.fraud_analysis.operator_verified && (
                              <span className="block font-mono text-[8px] text-[#991b1b]">
                                {order.fraud_analysis.flags.length} {order.fraud_analysis.flags.length === 1 ? 'flag' : 'flags'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="font-mono text-[9px] text-[#7b7366]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {order.payment_link_url && (
                            <button
                              type="button"
                              onClick={() => handleCopyPaymentLink(order)}
                              title="Copy Paystack Payment Link"
                              className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 text-[#131010] bg-[#faf8f5] hover:bg-[#faf6f0] border border-[#e5dcd0] transition-colors"
                            >
                              {copiedOrderId === order.id ? 'Copied! ✓' : 'Link'}
                            </button>
                          )}

                          {order.customer_phone && (
                            <a
                              href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                                order.customer_name
                              )}%2C%20regarding%20your%20Empress%20Glow%20order%20%23${order.id.substring(0, 8)}...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Direct WhatsApp"
                              className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 text-[#2d5508] bg-[#2d5508]/10 hover:bg-[#2d5508]/20 border border-[#2d5508]/30 transition-colors"
                            >
                              WA
                            </a>
                          )}

                          <button
                            onClick={() => handleOpenInspector(order)}
                            className="bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-[10px] uppercase tracking-wider px-3 py-1 border border-[#131010] hover:border-[#2d5508] transition-colors"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Inspector Modal (Shopify Drawer Style) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-[#e5dcd0] max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-[#e5dcd0]">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
                  Order Inspector &bull; Fulfillment Control
                </span>
                <h3 className="font-serif text-xl text-[#131010] font-normal">
                  Order #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#7b7366] hover:text-[#131010] font-mono text-sm border border-[#e5dcd0] px-2 py-1 hover:bg-[#faf6f0] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="bg-[#faf8f5] border border-[#e5dcd0] p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7b7366]">Recipient Client:</span>
                <span className="font-medium text-[#131010]">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7b7366]">Email Address:</span>
                <span className="font-mono text-[11px] text-[#131010]">{selectedOrder.customer_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7b7366]">WhatsApp / Phone:</span>
                <span className="font-mono text-[11px] text-[#131010]">{selectedOrder.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7b7366]">Delivery Address:</span>
                <span className="font-medium text-[#131010] text-right max-w-xs">
                  {selectedOrder.shipping_address}, {selectedOrder.city}, {selectedOrder.state}
                </span>
              </div>
              {selectedOrder.notes && (
                <div className="pt-2 border-t border-[#e5dcd0]">
                  <span className="text-[#7b7366] block font-mono text-[10px] uppercase">Consultation Notes:</span>
                  <span className="text-[#524b42] italic">{selectedOrder.notes}</span>
                </div>
              )}
              {selectedOrder.payment_link_url && (
                <div className="flex justify-between items-center pt-2 border-t border-[#e5dcd0]">
                  <span className="text-[#7b7366]">Paystack Payment Link:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyPaymentLink(selectedOrder)}
                    className="font-mono text-[10px] uppercase text-[#2d5508] underline"
                  >
                    {copiedOrderId === selectedOrder.id ? 'Copied! ✓' : 'Copy Link'}
                  </button>
                </div>
              )}
            </div>

            {/* Fraud Risk & Address Verification Panel */}
            {selectedOrder.fraud_analysis && (
              <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#131010]">
                      Fraud Risk Analysis
                    </span>
                    <span
                      className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                        selectedOrder.fraud_analysis.operator_verified
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : selectedOrder.fraud_analysis.risk_level === 'high'
                          ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                          : selectedOrder.fraud_analysis.risk_level === 'medium'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {selectedOrder.fraud_analysis.operator_verified
                        ? 'Verified by Operator'
                        : `${selectedOrder.fraud_analysis.risk_level.toUpperCase()} RISK (${selectedOrder.fraud_analysis.risk_score}/100)`}
                    </span>
                  </div>

                  {/* Operator Override / Verify Trigger */}
                  {!selectedOrder.fraud_analysis.operator_verified ? (
                    <button
                      type="button"
                      onClick={() => handleVerifyFraud(selectedOrder.id, true)}
                      disabled={verifyingFraud}
                      className="font-mono text-[10px] uppercase tracking-wider bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] px-2.5 py-1 transition-colors cursor-pointer"
                    >
                      {verifyingFraud ? 'Verifying...' : '✓ Mark Verified'}
                    </button>
                  ) : (
                    <span className="font-mono text-[9px] text-[#2d5508] flex items-center gap-1 font-semibold">
                      <span>✓</span>
                      <span>Verified by {selectedOrder.fraud_analysis.operator_verified_by}</span>
                    </span>
                  )}
                </div>

                {/* Visual Risk Gauge Meter */}
                <div className="space-y-1">
                  <div className="w-full bg-[#e5dcd0] h-2 overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ${
                        selectedOrder.fraud_analysis.risk_level === 'high'
                          ? 'bg-rose-600'
                          : selectedOrder.fraud_analysis.risk_level === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.max(5, selectedOrder.fraud_analysis.risk_score)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-[#7b7366]">
                    <span>0 (Safe)</span>
                    <span>Risk Score: {selectedOrder.fraud_analysis.risk_score} / 100</span>
                    <span>100 (Critical)</span>
                  </div>
                </div>

                {/* Key Risk Indicators Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="p-2 border border-[#e5dcd0] bg-white flex items-center justify-between">
                    <span className="text-[#7b7366]">Address Match:</span>
                    <span className={selectedOrder.fraud_analysis.billing_shipping_match ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                      {selectedOrder.fraud_analysis.billing_shipping_match ? '✓ Matched' : '⚠ Mismatched'}
                    </span>
                  </div>
                  <div className="p-2 border border-[#e5dcd0] bg-white flex items-center justify-between">
                    <span className="text-[#7b7366]">IP Geolocation:</span>
                    <span className="text-[#131010] font-medium truncate max-w-[150px]">
                      {selectedOrder.fraud_analysis.geolocation?.city}, {selectedOrder.fraud_analysis.geolocation?.country}
                    </span>
                  </div>
                  <div className="p-2 border border-[#e5dcd0] bg-white flex items-center justify-between">
                    <span className="text-[#7b7366]">Proxy / VPN:</span>
                    <span className={selectedOrder.fraud_analysis.geolocation?.is_vpn_or_proxy ? 'text-rose-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                      {selectedOrder.fraud_analysis.geolocation?.is_vpn_or_proxy ? '⚠ Commercial VPN' : '✓ Clean IP'}
                    </span>
                  </div>
                  <div className="p-2 border border-[#e5dcd0] bg-white flex items-center justify-between">
                    <span className="text-[#7b7366]">Client IP:</span>
                    <span className="text-[#131010] font-mono">{selectedOrder.fraud_analysis.ip_address || selectedOrder.client_ip || '—'}</span>
                  </div>
                </div>

                {/* Specific Flag Details if any */}
                {selectedOrder.fraud_analysis.flags && selectedOrder.fraud_analysis.flags.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#991b1b] font-semibold block">
                      Flagged Risk Triggers ({selectedOrder.fraud_analysis.flags.length}):
                    </span>
                    <div className="space-y-1">
                      {selectedOrder.fraud_analysis.flags.map((flag, idx) => (
                        <div key={idx} className="p-2 bg-rose-50/70 border border-rose-200 text-xs">
                          <div className="flex justify-between items-center font-mono text-[10px]">
                            <span className="font-bold text-rose-900">{flag.label}</span>
                            <span className="text-rose-700 uppercase text-[8px] px-1 bg-white border border-rose-200">
                              {flag.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                            {flag.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* If verified by operator, show operator verification trail */}
                {selectedOrder.fraud_analysis.operator_verified && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-mono text-[10px] space-y-0.5">
                    <div className="font-semibold">Operator Verification Record:</div>
                    <div>Verified by {selectedOrder.fraud_analysis.operator_verified_by} on {new Date(selectedOrder.fraud_analysis.operator_verified_at || '').toLocaleString('en-GB')}</div>
                    {selectedOrder.fraud_analysis.operator_notes && (
                      <div className="text-[9px] italic text-emerald-800">&ldquo;{selectedOrder.fraud_analysis.operator_notes}&rdquo;</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                  Order Items &amp; Variants ({selectedOrder.items.length})
                </h4>
                {selectedOrder.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => setIsEditOrderModalOpen(true)}
                    className="px-2.5 py-1 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Line Items</span>
                  </button>
                )}
              </div>

              {/* Order Modification History */}
              {selectedOrder.edit_history && selectedOrder.edit_history.length > 0 && (
                <div className="p-2.5 bg-[#faf8f5] border border-[#e5dcd0] space-y-1.5 text-xs font-mono">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#2d5508] font-bold block">
                    Post-Submission Edit Log ({selectedOrder.edit_history.length})
                  </span>
                  <div className="divide-y divide-[#e5dcd0]/60 space-y-1.5">
                    {selectedOrder.edit_history.map((edit) => (
                      <div key={edit.id} className="pt-1.5 first:pt-0">
                        <div className="flex justify-between items-center text-[#131010]">
                          <span className="font-medium text-[11px]">{edit.changes_summary}</span>
                          <span className="text-[#7b7366] text-[9px]">
                            {new Date(edit.timestamp).toLocaleString('en-NG')}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#7b7366] block">
                          Actor: {edit.actor.name} ({edit.actor.role}) &bull; Reason: &ldquo;{edit.reason}&rdquo;
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="border border-[#e5dcd0] p-3 text-xs space-y-2 bg-white">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-[#e5dcd0] last:border-0">
                    <span className="text-[#131010]">
                      {item.name} <span className="text-[#7b7366]">({item.variantName})</span> &times; {item.quantity}
                    </span>
                    <span className="font-mono font-medium text-[#131010]">
                      ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-[#7b7366]">
                  <span>Courier Delivery Fee:</span>
                  <span className="font-mono">₦{selectedOrder.shipping_fee.toLocaleString('en-NG')}</span>
                </div>
                {selectedOrder.discount && selectedOrder.discount > 0 ? (
                  <div className="flex justify-between text-[#2d5508]">
                    <span>Consultation Discount:</span>
                    <span className="font-mono">-₦{selectedOrder.discount.toLocaleString('en-NG')}</span>
                  </div>
                ) : null}
                <div className="flex justify-between pt-2 border-t border-[#e5dcd0] font-medium text-sm text-[#131010]">
                  <span>Total Settled (₦):</span>
                  <span className="font-mono font-bold text-[#2d5508]">
                    ₦{selectedOrder.total.toLocaleString('en-NG')}
                  </span>
                </div>
              </div>
            </div>

            {/* FCCPC Statutory 7-Day Refund Protocol & Gateway Action */}
            {(() => {
              const orderDate = new Date(selectedOrder.paid_at || selectedOrder.created_at);
              const diffDays = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
              const isWithinFCCPC = diffDays <= 7;
              const isRefundable =
                selectedOrder.status !== 'pending' &&
                (!selectedOrder.total_refunded || selectedOrder.total_refunded < selectedOrder.total);

              return (
                <div className="p-3 bg-[#faf8f5] border border-[#e5dcd0] space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 ${isWithinFCCPC ? 'bg-[#5a8210]' : 'bg-[#b88e4e]'}`} />
                        <span className="font-mono text-xs font-semibold text-[#131010]">
                          FCCPC 7-Day Statutory Window:
                        </span>
                        <span className={`font-mono text-xs ${isWithinFCCPC ? 'text-[#2d5508]' : 'text-[#7b7366]'}`}>
                          {isWithinFCCPC
                            ? `Day ${diffDays + 1} of 7 (Defective Product Guarantee)`
                            : `Elapsed (${diffDays} days)`}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-[#7b7366] mt-0.5">
                        Federal Competition and Consumer Protection Commission policy compliance.
                      </p>
                    </div>

                    {isRefundable && (
                      <button
                        type="button"
                        onClick={() => {
                          setRefundOrderTarget(selectedOrder);
                          setIsRefundModalOpen(true);
                        }}
                        className="self-start sm:self-auto px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] transition-colors"
                      >
                        + Issue Paystack Refund
                      </button>
                    )}
                  </div>

                  {selectedOrder.return_tracking?.return_requested && (
                    <div className="pt-2 border-t border-[#e5dcd0] text-xs font-mono">
                      <span className="text-[#b88e4e] font-semibold">Active Return Protocol: </span>
                      <span className="uppercase text-[#131010]">{selectedOrder.return_tracking.return_status}</span>
                      {selectedOrder.return_tracking.return_reason && (
                        <p className="text-[#524b42] text-[11px] mt-0.5">
                          Reason: {selectedOrder.return_tracking.return_reason}
                        </p>
                      )}
                      {selectedOrder.return_tracking.inspection_notes && (
                        <p className="text-[#7b7366] text-[11px] italic mt-0.5">
                          Inspection: {selectedOrder.return_tracking.inspection_notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Refund Records Audit Trail */}
            {selectedOrder.refunds && selectedOrder.refunds.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#e5dcd0]">
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                    Paystack Refund Audit History ({selectedOrder.refunds.length})
                  </h4>
                  <span className="font-mono text-xs font-bold text-[#b88e4e]">
                    Total Refunded: ₦{selectedOrder.total_refunded?.toLocaleString('en-NG')}
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedOrder.refunds.map((rf) => (
                    <div key={rf.id} className="p-2.5 bg-[#faf8f5] border border-[#e5dcd0] text-xs space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="font-bold text-[#131010]">₦{rf.amount.toLocaleString('en-NG')}</span>
                        <span className="px-1.5 py-0.2 uppercase text-[9px] bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/30">
                          Gateway: {rf.paystack_status}
                        </span>
                      </div>
                      <p className="text-[#524b42] text-[11px]">{rf.reason}</p>
                      <div className="flex flex-wrap justify-between text-[10px] font-mono text-[#7b7366] pt-1 border-t border-[#e5dcd0]">
                        <span>Ref: {rf.paystack_refund_id || rf.id}</span>
                        <span>{new Date(rf.initiated_at).toLocaleString('en-GB')}</span>
                        {rf.restock_inventory && <span className="text-[#2d5508]">&bull; Restocked to Catalog</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status & Fulfillment Updater */}
            <form onSubmit={handleSaveFulfillment} className="space-y-4 pt-2">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                  Fulfillment Status Milestone
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Order['status'])}
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none"
                >
                  <option value="pending">Pending Payment Verification</option>
                  <option value="paid">Paid &amp; Ready for Packaging</option>
                  <option value="shipped">Dispatched / In Transit (Courier)</option>
                  <option value="delivered">Delivered to Client</option>
                  <option value="cancelled">Cancelled / Refunded (FCCPC 7-Day)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                  Dispatch &amp; Courier Tracking Notes
                </label>
                <textarea
                  rows={2}
                  value={editTrackingNotes}
                  onChange={(e) => setEditTrackingNotes(e.target.value)}
                  placeholder="e.g. Dispatched via Abuja Local Courier tracking #ABJ-8912. Rider phone: 080..."
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none placeholder:text-[#7b7366]"
                />
              </div>

              {saveMessage && (
                <div
                  className={`p-3 border font-mono text-xs ${
                    saveMessage.startsWith('Error')
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
                  }`}
                >
                  {saveMessage}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-[#e5dcd0]">
                {selectedOrder.customer_phone ? (
                  <a
                    href={`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                      selectedOrder.customer_name
                    )}%2C%20regarding%20your%20Empress%20Glow%20order%20%23${selectedOrder.id.substring(0, 8)}...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-wider text-[#2d5508] hover:text-[#131010] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Direct WhatsApp Client ↗</span>
                  </a>
                ) : (
                  <span />
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] px-6 py-2.5 border border-[#131010] hover:border-[#2d5508] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Fulfillment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Draft Order Modal */}
      <CreateDraftOrderModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        availableProducts={availableProducts}
        registeredCustomers={registeredCustomers}
        onOrderCreated={(newOrder) => {
          setOrders((prev) => [newOrder, ...prev]);
        }}
      />

      {/* Paystack Automated Refund Modal */}
      <OrderRefundModal
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setRefundOrderTarget(null);
        }}
        order={refundOrderTarget}
        onRefundSuccess={(updatedOrder, message) => {
          setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
          if (selectedOrder?.id === updatedOrder.id) {
            setSelectedOrder(updatedOrder);
          }
          setSaveMessage(message);
        }}
      />

      {/* Edit Order Items Modal */}
      {selectedOrder && (
        <EditOrderModal
          isOpen={isEditOrderModalOpen}
          onClose={() => setIsEditOrderModalOpen(false)}
          order={selectedOrder}
          availableProducts={availableProducts}
          onOrderUpdated={(updatedOrder) => {
            setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
            setSelectedOrder(updatedOrder);
            setSaveMessage(`Order #${updatedOrder.id} line items and total updated successfully.`);
          }}
        />
      )}
    </div>
  );
}
