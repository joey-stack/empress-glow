'use client';

import React, { useState } from 'react';
import type { Product } from '@/lib/insforge/queries';

interface BulkActionBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onSuccess: (updatedProducts: Product[], message: string) => void;
}

export function BulkActionBar({
  selectedIds,
  onClearSelection,
  onSuccess,
}: BulkActionBarProps) {
  const [activeModal, setActiveModal] = useState<
    'status' | 'vendor' | 'price' | 'category' | 'delete' | null
  >(null);

  // Form states
  const [targetStatus, setTargetStatus] = useState<'draft' | 'active' | 'archived'>('active');
  const [targetVendor, setTargetVendor] = useState('Empress Glow');
  const [targetCategory, setTargetCategory] = useState('Fruit Soaps');
  const [priceType, setPriceType] = useState<'fixed' | 'percent'>('percent');
  const [priceValue, setPriceValue] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (selectedIds.length === 0) return null;

  const handleExecuteBulk = async (action: string, payload: Record<string, any>) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          action,
          payload,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Bulk operation failed.');
      }

      setActiveModal(null);
      onClearSelection();
      onSuccess(data.products, data.message || `Updated ${selectedIds.length} formulation(s).`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error executing bulk operation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bottom Bar (Shopify Polaris Style) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 animate-slide-up">
        <div className="bg-[#131010] text-[#f7f1e8] border border-[#262220] p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider px-2 py-0.5 bg-[#2d5508] text-white">
              {selectedIds.length} Selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-xs text-[#a89e90] hover:text-white underline underline-offset-2 font-mono"
            >
              Deselect All
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setActiveModal('status');
              }}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-[#f7f1e8] transition-colors"
            >
              Set Status
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setActiveModal('vendor');
              }}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-[#f7f1e8] transition-colors"
            >
              Set Brand
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setActiveModal('price');
              }}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-[#f7f1e8] transition-colors"
            >
              Adjust Price
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setActiveModal('category');
              }}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-[#f7f1e8] transition-colors"
            >
              Set Category
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setActiveModal('delete');
              }}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-red-950/60 hover:bg-red-900 border border-red-700/50 text-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Modals */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#e5dcd0] max-w-md w-full p-6 space-y-4 rounded-none shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5dcd0] pb-3">
              <h3 className="font-serif text-lg text-[#131010] font-normal">
                {activeModal === 'status' && 'Update Formulation Status'}
                {activeModal === 'vendor' && 'Assign Brand / Vendor'}
                {activeModal === 'price' && 'Batch Price Adjustment'}
                {activeModal === 'category' && 'Assign Product Category'}
                {activeModal === 'delete' && 'Delete Selected Formulations'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#7b7366] hover:text-[#131010] font-mono text-sm border border-[#e5dcd0] px-2 py-0.5"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 font-mono">
                {errorMessage}
              </div>
            )}

            {/* Modal Body: Status */}
            {activeModal === 'status' && (
              <div className="space-y-3">
                <p className="text-xs text-[#524b42]">
                  Set the publication status for {selectedIds.length} selected formulation(s):
                </p>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] text-[#131010] outline-none"
                >
                  <option value="active">Active (Visible on public catalog)</option>
                  <option value="draft">Draft (Prelaunch reservation only)</option>
                  <option value="archived">Archived (Unpublished)</option>
                </select>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#e5dcd0]">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#7b7366] border border-[#e5dcd0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleExecuteBulk('update_status', { status: targetStatus })}
                    className="px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Applying...' : 'Apply Status'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: Vendor */}
            {activeModal === 'vendor' && (
              <div className="space-y-3">
                <p className="text-xs text-[#524b42]">
                  Assign vendor brand for {selectedIds.length} formulation(s):
                </p>
                <select
                  value={targetVendor}
                  onChange={(e) => setTargetVendor(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] text-[#131010] outline-none"
                >
                  <option value="Empress Glow">Empress Glow (Mary Asuquo Flagship)</option>
                  <option value="Aura Botanicals">Aura Botanicals (Partner)</option>
                  <option value="Savanna Organics">Savanna Organics (Partner)</option>
                  <option value="Sahel Essentials">Sahel Essentials (Partner)</option>
                </select>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#e5dcd0]">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#7b7366] border border-[#e5dcd0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleExecuteBulk('update_vendor', { vendor: targetVendor })}
                    className="px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Assigning...' : 'Assign Brand'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: Price */}
            {activeModal === 'price' && (
              <div className="space-y-3">
                <p className="text-xs text-[#524b42]">
                  Adjust prices across {selectedIds.length} formulation(s) and their size variants:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-mono text-[10px] text-[#7b7366] mb-1">Adjustment Type</label>
                    <select
                      value={priceType}
                      onChange={(e) => setPriceType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] text-[#131010] outline-none"
                    >
                      <option value="percent">Percentage (+/- %)</option>
                      <option value="fixed">Fixed Naira Amount (+/- ₦)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-[#7b7366] mb-1">Value (e.g. 10 or -500)</label>
                    <input
                      type="number"
                      value={priceValue}
                      onChange={(e) => setPriceValue(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-mono border border-[#e5dcd0] bg-[#faf8f5] text-[#131010] outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#e5dcd0]">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#7b7366] border border-[#e5dcd0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleExecuteBulk('adjust_price', {
                        priceAdjustmentType: priceType,
                        priceAdjustmentValue: priceValue,
                      })
                    }
                    className="px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adjusting...' : 'Update Prices'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: Category */}
            {activeModal === 'category' && (
              <div className="space-y-3">
                <p className="text-xs text-[#524b42]">
                  Set category for {selectedIds.length} formulation(s):
                </p>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] text-[#131010] outline-none"
                >
                  <option value="Fruit Soaps">Fruit Soaps</option>
                  <option value="Serums">Serums</option>
                  <option value="Moisturizers">Moisturizers</option>
                  <option value="Sun Protection">Sun Protection</option>
                  <option value="Botanical Care">Botanical Care</option>
                </select>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#e5dcd0]">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#7b7366] border border-[#e5dcd0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleExecuteBulk('update_category', { category: targetCategory })}
                    className="px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Assigning...' : 'Assign Category'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: Delete */}
            {activeModal === 'delete' && (
              <div className="space-y-3">
                <p className="text-xs text-red-700 leading-relaxed">
                  Are you sure you want to permanently delete {selectedIds.length} selected formulation(s)? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#e5dcd0]">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#7b7366] border border-[#e5dcd0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleExecuteBulk('delete', {})}
                    className="px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] bg-red-700 hover:bg-red-800 text-white transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
