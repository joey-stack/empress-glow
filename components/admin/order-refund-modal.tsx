'use client';

import React, { useState, useEffect } from 'react';
import type { Order } from '@/lib/insforge/queries';

interface OrderRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onRefundSuccess: (updatedOrder: Order, message: string) => void;
}

export function OrderRefundModal({
  isOpen,
  onClose,
  order,
  onRefundSuccess,
}: OrderRefundModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [reasonCategory, setReasonCategory] = useState<
    'defective_product' | 'damaged_in_transit' | 'wrong_item_sent' | 'customer_cancellation' | 'fccpc_statutory'
  >('defective_product');
  const [reasonText, setReasonText] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [merchantNote, setMerchantNote] = useState('');
  const [restockInventory, setRestockInventory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alreadyRefunded = order?.total_refunded || 0;
  const maxRefundable = order ? Math.max(0, order.total - alreadyRefunded) : 0;

  // Initialize form when opened with order
  useEffect(() => {
    if (order) {
      const remaining = Math.max(0, order.total - (order.total_refunded || 0));
      setAmount(remaining);
      setReasonCategory('defective_product');
      setReasonText('Defective formulation verified within FCCPC 7-day return guarantee.');
      setCustomerNote('Refund issued by Empress Glow Emporium in accordance with FCCPC return policy.');
      setMerchantNote(`Admin inspection confirmed return for order ${order.id}.`);
      setRestockInventory(false); // Default false for defects so broken batches aren't resold
      setError(null);
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleSelectPreset = (value: number) => {
    setAmount(Math.min(maxRefundable, Math.max(1, value)));
  };

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > maxRefundable) {
      setError(`Amount must be between ₦1 and ₦${maxRefundable.toLocaleString('en-NG')}.`);
      return;
    }

    if (!reasonText.trim()) {
      setError('Please provide a specific reason for audit compliance.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/orders/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.id,
          amount,
          reason: reasonText.trim(),
          reason_category: reasonCategory,
          customer_note: customerNote.trim(),
          merchant_note: merchantNote.trim(),
          restock_inventory: restockInventory,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process Paystack refund.');
      }

      onRefundSuccess(data.order, data.message);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Refund request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#e5dcd0] shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto rounded-none animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#e5dcd0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#b88e4e] font-semibold">
                Paystack Gateway &bull; FCCPC 7-Day Protocol
              </span>
            </div>
            <h2 className="font-serif text-xl font-normal text-[#131010] mt-0.5">
              Issue Refund &amp; Return Settlement
            </h2>
            <p className="font-mono text-xs text-[#7b7366] mt-0.5">
              Order #{order.id} &bull; {order.customer_name} ({order.customer_email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#7b7366] hover:text-[#131010] text-xl font-mono leading-none p-1"
          >
            &times;
          </button>
        </div>

        {/* Financial Balance Summary */}
        <div className="grid grid-cols-3 gap-3 my-4 p-3 bg-[#faf8f5] border border-[#e5dcd0]">
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-[#7b7366]">Settled Total</span>
            <span className="font-mono font-bold text-sm text-[#131010]">
              ₦{order.total.toLocaleString('en-NG')}
            </span>
          </div>
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-[#7b7366]">Already Refunded</span>
            <span className="font-mono font-bold text-sm text-[#b88e4e]">
              ₦{alreadyRefunded.toLocaleString('en-NG')}
            </span>
          </div>
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-[#2d5508]">Remaining Max</span>
            <span className="font-mono font-bold text-sm text-[#2d5508]">
              ₦{maxRefundable.toLocaleString('en-NG')}
            </span>
          </div>
        </div>

        {/* Paystack Reference Notice */}
        <div className="mb-4 p-2.5 bg-[#2d5508]/5 border border-[#2d5508]/20 flex items-center justify-between text-xs font-mono">
          <span className="text-[#2d5508]">Gateway Reference:</span>
          <span className="text-[#131010] font-semibold">
            {order.paystack_reference || 'Ref not set (Mock Simulation)'}
          </span>
        </div>

        <form onSubmit={handleSubmitRefund} className="space-y-4">
          {/* Quick Presets */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1.5">
              Refund Amount Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset(maxRefundable)}
                className={`py-2 px-3 text-xs font-mono border transition-colors ${
                  amount === maxRefundable
                    ? 'bg-[#131010] text-white border-[#131010]'
                    : 'bg-white text-[#131010] border-[#e5dcd0] hover:bg-[#faf8f5]'
                }`}
              >
                Full (₦{maxRefundable.toLocaleString('en-NG')})
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(Math.round(maxRefundable * 0.5))}
                className={`py-2 px-3 text-xs font-mono border transition-colors ${
                  amount === Math.round(maxRefundable * 0.5) && amount !== maxRefundable
                    ? 'bg-[#131010] text-white border-[#131010]'
                    : 'bg-white text-[#131010] border-[#e5dcd0] hover:bg-[#faf8f5]'
                }`}
              >
                50% (₦{Math.round(maxRefundable * 0.5).toLocaleString('en-NG')})
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(order.shipping_fee)}
                className={`py-2 px-3 text-xs font-mono border transition-colors ${
                  amount === order.shipping_fee && amount !== maxRefundable
                    ? 'bg-[#131010] text-white border-[#131010]'
                    : 'bg-white text-[#131010] border-[#e5dcd0] hover:bg-[#faf8f5]'
                }`}
              >
                Shipping (₦{order.shipping_fee.toLocaleString('en-NG')})
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
              Custom Refund Amount (₦ Naira) *
            </label>
            <input
              type="number"
              min={1}
              max={maxRefundable}
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2 text-sm font-mono border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none"
              required
            />
          </div>

          {/* Reason Category */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
              Statutory Reason Category (FCCPC Rules) *
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white text-[#131010] outline-none"
            >
              <option value="defective_product">FCCPC 7-Day Defective Product Return (Statutory)</option>
              <option value="damaged_in_transit">Package Damaged in Transit by Courier</option>
              <option value="wrong_item_sent">Wrong Formulation / Variant Dispatched</option>
              <option value="customer_cancellation">Buyer Requested Cancellation Prior to Dispatch</option>
              <option value="fccpc_statutory">Goodwill Resolution / Regulatory Accord</option>
            </select>
          </div>

          {/* Reason Explanation */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
              Detailed Reason / Defect Inspection Notes *
            </label>
            <textarea
              rows={2}
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="e.g. Pump mechanism arrived fractured; client submitted WhatsApp verification photo within 4 days."
              className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white text-[#131010] outline-none"
              required
            />
          </div>

          {/* Restock Inventory Toggle */}
          <div className="flex items-center gap-2 p-3 bg-[#faf8f5] border border-[#e5dcd0]">
            <input
              type="checkbox"
              id="restock_items"
              checked={restockInventory}
              onChange={(e) => setRestockInventory(e.target.checked)}
              className="w-4 h-4 accent-[#2d5508] border-[#e5dcd0] cursor-pointer"
            />
            <label htmlFor="restock_items" className="text-xs text-[#131010] cursor-pointer select-none">
              <span className="font-semibold">Restock Items to Catalog:</span> Return {order.items?.length || 0}{' '}
              product item(s) back into warehouse available stock count.
            </label>
          </div>

          {/* Customer Note */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
              Note to Customer (Displayed on Gateway Receipt)
            </label>
            <input
              type="text"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white text-[#131010] outline-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 font-mono text-xs">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#e5dcd0]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#7b7366] border border-[#e5dcd0] hover:bg-[#faf8f5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || amount <= 0 || amount > maxRefundable}
              className="px-6 py-2.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing via Paystack...' : `Execute ₦${amount.toLocaleString('en-NG')} Refund`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
