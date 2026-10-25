'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';

interface VariantItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'healthy' | 'low' | 'critical' | 'out_of_stock';
}

interface ProductInventoryItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  vendor: string;
  image: string;
  price: number;
  cost_per_item: number;
  total_stock: number;
  status: string;
  variants: VariantItem[];
  overall_status: 'healthy' | 'low' | 'critical' | 'out_of_stock';
}

interface InventoryAdjustmentRecord {
  id: string;
  product_id: string;
  product_name: string;
  variant_id?: string;
  variant_name?: string;
  sku: string;
  previous_stock: number;
  change_amount: number;
  new_stock: number;
  reason: string;
  note?: string;
  actor: {
    name: string;
    email: string;
    role: string;
  };
  timestamp: string;
}

interface AdminInventoryManagerProps {
  initialInventory: ProductInventoryItem[];
  initialAdjustments: InventoryAdjustmentRecord[];
  initialKpis: {
    total_units: number;
    low_stock_items: number;
    out_of_stock_items: number;
    retail_valuation: number;
    cost_valuation: number;
  };
}

const REASON_LABELS: Record<string, string> = {
  received_shipment: 'Production Batch Received',
  inventory_count: 'Physical Count Reconciliation',
  damaged_goods: 'Damaged / Expired Goods',
  loss_theft: 'Inventory Shrinkage',
  order_fulfillment: 'Order Fulfillment Dispatch',
  customer_return: 'Customer Return Restock',
  manual_adjustment: 'Manual Calibration',
};

export function AdminInventoryManager({
  initialInventory,
  initialAdjustments,
  initialKpis,
}: AdminInventoryManagerProps) {
  const [inventory, setInventory] = useState<ProductInventoryItem[]>(initialInventory);
  const [adjustments, setAdjustments] = useState<InventoryAdjustmentRecord[]>(initialAdjustments);
  const [kpis, setKpis] = useState(initialKpis);

  // Filters
  const [filterTab, setFilterTab] = useState<'all' | 'low_stock' | 'out_of_stock' | 'hero_soap' | 'partner'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Drawer & Modal States
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showBatchIntakeModal, setShowBatchIntakeModal] = useState(false);
  const [activeAdjustTarget, setActiveAdjustTarget] = useState<{
    product: ProductInventoryItem;
    variant?: VariantItem;
  } | null>(null);

  // Single Adjust Form State
  const [adjustMode, setAdjustMode] = useState<'add' | 'subtract' | 'set'>('add');
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('received_shipment');
  const [adjustNote, setAdjustNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Batch Intake Form State
  const [batchReference, setBatchReference] = useState('Batch #' + new Date().toISOString().slice(0, 10));
  const [batchIntakeQuantities, setBatchIntakeQuantities] = useState<Record<string, number>>({});
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);

  // Filtered Inventory List
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      // Tab filter
      if (filterTab === 'low_stock' && item.overall_status !== 'low' && item.overall_status !== 'critical') {
        return false;
      }
      if (filterTab === 'out_of_stock' && item.overall_status !== 'out_of_stock') {
        return false;
      }
      if (filterTab === 'hero_soap' && !item.slug.includes('fruity-soap')) {
        return false;
      }
      if (filterTab === 'partner' && item.vendor.toLowerCase() === 'empress glow') {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesVendor = item.vendor.toLowerCase().includes(query);
        const matchesVariant = item.variants.some(
          (v) => v.name.toLowerCase().includes(query) || v.sku.toLowerCase().includes(query)
        );
        return matchesName || matchesVendor || matchesVariant;
      }

      return true;
    });
  }, [inventory, filterTab, categoryFilter, searchQuery]);

  // Recalculate KPIs helper
  const recalculateKPIs = (items: ProductInventoryItem[]) => {
    let units = 0;
    let low = 0;
    let out = 0;
    let retail = 0;
    let cost = 0;

    for (const item of items) {
      units += item.total_stock;
      retail += item.price * item.total_stock;
      cost += item.cost_per_item * item.total_stock;
      if (item.total_stock === 0) out++;
      else if (item.total_stock <= 10) low++;
    }

    setKpis({
      total_units: units,
      low_stock_items: low,
      out_of_stock_items: out,
      retail_valuation: retail,
      cost_valuation: cost,
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Quick Inline Adjustment (+5 or -1)
  const handleQuickAdjust = async (
    product: ProductInventoryItem,
    variant: VariantItem | undefined,
    delta: number
  ) => {
    try {
      const reason = delta > 0 ? 'received_shipment' : 'manual_adjustment';
      const note = delta > 0 ? 'Quick stock intake (+5 units)' : 'Quick stock deduction (-1 unit)';

      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: variant?.id,
          productId: variant ? undefined : product.id,
          changeAmount: delta,
          reason,
          note,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to adjust stock');
        return;
      }

      // Update local state
      const updated = inventory.map((p) => {
        if (p.id === product.id) {
          if (variant) {
            const updatedVariants = p.variants.map((v) => {
              if (v.id === variant.id) {
                const newStock = Math.max(0, v.stock + delta);
                return {
                  ...v,
                  stock: newStock,
                  status: (newStock === 0 ? 'out_of_stock' : newStock <= 4 ? 'critical' : newStock <= 10 ? 'low' : 'healthy') as any,
                };
              }
              return v;
            });
            const newTotal = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
            return {
              ...p,
              total_stock: newTotal,
              variants: updatedVariants,
              overall_status: (newTotal === 0 ? 'out_of_stock' : newTotal <= 10 ? 'low' : 'healthy') as any,
            };
          } else {
            const newTotal = Math.max(0, p.total_stock + delta);
            return {
              ...p,
              total_stock: newTotal,
              overall_status: (newTotal === 0 ? 'out_of_stock' : newTotal <= 10 ? 'low' : 'healthy') as any,
            };
          }
        }
        return p;
      });

      setInventory(updated);
      recalculateKPIs(updated);

      if (data.data?.adjustment) {
        setAdjustments([data.data.adjustment, ...adjustments]);
      }

      showToast(`Updated stock: ${delta > 0 ? '+' : ''}${delta} units for ${variant ? variant.name : product.name}`);
    } catch (err: any) {
      alert(err.message || 'Error updating stock');
    }
  };

  // Submit Detailed Stock Adjustment Modal
  const handleSubmitDetailedAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAdjustTarget) return;

    setIsSubmitting(true);
    try {
      const { product, variant } = activeAdjustTarget;
      const currentStock = variant ? variant.stock : product.total_stock;

      let delta = adjustAmount;
      if (adjustMode === 'subtract') {
        delta = -Math.abs(adjustAmount);
      } else if (adjustMode === 'set') {
        delta = adjustAmount - currentStock;
      }

      if (delta === 0) {
        setActiveAdjustTarget(null);
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: variant?.id,
          productId: variant ? undefined : product.id,
          changeAmount: delta,
          reason: adjustReason,
          note: adjustNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to adjust stock');
        setIsSubmitting(false);
        return;
      }

      // Update local state
      const updated = inventory.map((p) => {
        if (p.id === product.id) {
          if (variant) {
            const updatedVariants = p.variants.map((v) => {
              if (v.id === variant.id) {
                const newStock = Math.max(0, v.stock + delta);
                return {
                  ...v,
                  stock: newStock,
                  status: (newStock === 0 ? 'out_of_stock' : newStock <= 4 ? 'critical' : newStock <= 10 ? 'low' : 'healthy') as any,
                };
              }
              return v;
            });
            const newTotal = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
            return {
              ...p,
              total_stock: newTotal,
              variants: updatedVariants,
              overall_status: (newTotal === 0 ? 'out_of_stock' : newTotal <= 10 ? 'low' : 'healthy') as any,
            };
          } else {
            const newTotal = Math.max(0, p.total_stock + delta);
            return {
              ...p,
              total_stock: newTotal,
              overall_status: (newTotal === 0 ? 'out_of_stock' : newTotal <= 10 ? 'low' : 'healthy') as any,
            };
          }
        }
        return p;
      });

      setInventory(updated);
      recalculateKPIs(updated);

      if (data.data?.adjustment) {
        setAdjustments([data.data.adjustment, ...adjustments]);
      }

      setActiveAdjustTarget(null);
      setAdjustNote('');
      showToast(`Successfully adjusted stock by ${delta > 0 ? '+' : ''}${delta} units`);
    } catch (err: any) {
      alert(err.message || 'Error updating stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Batch Intake Modal
  const handleSubmitBatchIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemsToSubmit = Object.entries(batchIntakeQuantities)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([variantId, qty]) => ({
        variantId,
        changeAmount: Number(qty),
        reason: 'received_shipment',
        note: `Batch Intake: ${batchReference}`,
      }));

    if (itemsToSubmit.length === 0) {
      alert('Please enter a quantity greater than zero for at least one formulation variant.');
      return;
    }

    setIsSubmittingBatch(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_reference: batchReference,
          items: itemsToSubmit,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to submit batch intake');
        setIsSubmittingBatch(false);
        return;
      }

      // Re-fetch clean list or update locally
      const refreshRes = await fetch('/api/admin/inventory');
      const refreshData = await refreshRes.json();
      if (refreshData.success) {
        setInventory(refreshData.data.inventory);
        setAdjustments(refreshData.data.adjustments);
        setKpis(refreshData.data.kpis);
      }

      setShowBatchIntakeModal(false);
      setBatchIntakeQuantities({});
      showToast(`Batch intake complete: ${itemsToSubmit.length} variants updated`);
    } catch (err: any) {
      alert(err.message || 'Error processing batch intake');
    } finally {
      setIsSubmittingBatch(false);
    }
  };

  // Export Inventory CSV
  const handleExportCSV = () => {
    const headers = ['Product Name', 'Variant / Size', 'SKU', 'Brand / Vendor', 'Unit Price (NGN)', 'Stock Level', 'Status'];
    const rows: string[][] = [];

    for (const p of inventory) {
      if (p.variants.length > 0) {
        for (const v of p.variants) {
          rows.push([
            `"${p.name}"`,
            `"${v.name}"`,
            `"${v.sku}"`,
            `"${p.vendor}"`,
            String(v.price),
            String(v.stock),
            v.status.toUpperCase(),
          ]);
        }
      } else {
        rows.push([
          `"${p.name}"`,
          '"Standard"',
          `"${p.slug}"`,
          `"${p.vendor}"`,
          String(p.price),
          String(p.total_stock),
          p.overall_status.toUpperCase(),
        ]);
      }
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `empress_inventory_matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131010] text-[#f7f1e8] border border-[#2d5508] px-5 py-3 shadow-2xl flex items-center gap-3 animate-fade-in rounded-none">
          <span className="w-2 h-2 bg-[#5a8210] rounded-none animate-pulse" />
          <span className="font-mono text-xs tracking-wider uppercase">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5dcd0]">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
            <span>Shopify Parity Tier A</span>
            <span>•</span>
            <span className="text-[#2d5508] font-bold">Variant-Level Stock Tracking</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#131010]">
            Inventory & Reorder Matrix
          </h1>
          <p className="font-sans text-xs text-[#7b7366] mt-1">
            Real-time SKU-level stock reconciliation, batch intake from Calabar workshop, and immutable FCCPC audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(true)}
            className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 border border-[#e5dcd0] bg-white text-[#131010] hover:border-[#131010] transition-colors rounded-none flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5 text-[#7b7366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Adjustment Log ({adjustments.length})</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 border border-[#e5dcd0] bg-white text-[#131010] hover:border-[#131010] transition-colors rounded-none flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5 text-[#7b7366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBatchIntakeModal(true)}
            className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 bg-[#131010] text-[#f7f1e8] hover:bg-[#2d5508] transition-colors rounded-none flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Receive Batch</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-[#e5dcd0] p-4 rounded-none space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">Total Stock</span>
          <p className="font-serif text-2xl text-[#131010]">{kpis.total_units.toLocaleString('en-NG')} units</p>
          <span className="font-mono text-[10px] text-[#2d5508] block">Across all sizes</span>
        </div>

        <div className="bg-white border border-[#e5dcd0] p-4 rounded-none space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">Low Stock Alerts</span>
          <p className={`font-serif text-2xl ${kpis.low_stock_items > 0 ? 'text-[#a16207]' : 'text-[#131010]'}`}>
            {kpis.low_stock_items}
          </p>
          <span className="font-mono text-[10px] text-[#7b7366] block">&le; 10 units left</span>
        </div>

        <div className="bg-white border border-[#e5dcd0] p-4 rounded-none space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">Out of Stock</span>
          <p className={`font-serif text-2xl ${kpis.out_of_stock_items > 0 ? 'text-[#b91c1c]' : 'text-[#131010]'}`}>
            {kpis.out_of_stock_items}
          </p>
          <span className="font-mono text-[10px] text-[#7b7366] block">Requires urgent batch</span>
        </div>

        <div className="bg-white border border-[#e5dcd0] p-4 rounded-none space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">Retail Valuation</span>
          <p className="font-serif text-2xl text-[#131010]">₦{(kpis.retail_valuation / 1000).toFixed(0)}k</p>
          <span className="font-mono text-[10px] text-[#7b7366] block">Total catalogue GMV</span>
        </div>

        <div className="bg-white border border-[#e5dcd0] p-4 rounded-none space-y-1 col-span-2 md:col-span-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">Cost of Goods</span>
          <p className="font-serif text-2xl text-[#131010]">₦{(kpis.cost_valuation / 1000).toFixed(0)}k</p>
          <span className="font-mono text-[10px] text-[#5a8210] block">Estimated COGS</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5dcd0] pb-3">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: `All Items (${inventory.length})` },
              { id: 'low_stock', label: `Low Stock (${kpis.low_stock_items})` },
              { id: 'out_of_stock', label: `Out of Stock (${kpis.out_of_stock_items})` },
              { id: 'hero_soap', label: 'Hero Fruity Soap (4 Sizes)' },
              { id: 'partner', label: 'Partner Brands' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id as any)}
                className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 transition-colors border rounded-none cursor-pointer whitespace-nowrap ${
                  filterTab === tab.id
                    ? 'bg-[#131010] text-[#f7f1e8] border-[#131010]'
                    : 'bg-white text-[#7b7366] border-[#e5dcd0] hover:text-[#131010]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search SKU, formulation, size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#e5dcd0] px-3.5 py-1.5 text-xs text-[#131010] placeholder-[#7b7366] focus:border-[#131010] outline-none font-sans rounded-none"
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
        </div>
      </div>

      {/* Inventory Matrix Table */}
      <div className="bg-white border border-[#e5dcd0] rounded-none overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e5dcd0] bg-[#faf8f5] text-[10px] font-mono uppercase tracking-wider text-[#7b7366]">
              <th className="py-3 px-4">Formulation & Packaging</th>
              <th className="py-3 px-4">Brand / Vendor</th>
              <th className="py-3 px-4">SKU Code</th>
              <th className="py-3 px-4 text-right">Retail Price</th>
              <th className="py-3 px-4 text-center">Available Stock</th>
              <th className="py-3 px-4 text-center">Stock Health</th>
              <th className="py-3 px-4 text-right">Reconciliation & Intake</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5dcd0] text-xs">
            {filteredInventory.map((product) => {
              const hasVariants = product.variants.length > 0;

              return (
                <React.Fragment key={product.id}>
                  {/* Parent Product Row */}
                  <tr className="hover:bg-[#faf8f5]/60 transition-colors bg-white font-medium">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-[#faf8f5] border border-[#e5dcd0] flex-shrink-0 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover object-center"
                        />
                      </div>
                      <div>
                        <div className="text-[#131010] font-serif text-sm flex items-center gap-2">
                          <span>{product.name}</span>
                          {product.slug === 'empress-glow-fruity-soap' && (
                            <span className="font-mono text-[9px] uppercase tracking-wider bg-[#2d5508] text-white px-2 py-0.5 rounded-none">
                              Flagship Hero
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-[#7b7366] block">
                          {hasVariants ? `${product.variants.length} Managed Variant Sizes` : 'Single Pack Formulation'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#7b7366] font-mono text-[11px]">
                      {product.vendor}
                    </td>

                    <td className="py-3.5 px-4 text-[#7b7366] font-mono text-[11px]">
                      {hasVariants ? 'Multi-SKU' : product.slug.toUpperCase().slice(0, 10)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#131010] font-mono">
                      ₦{product.price.toLocaleString('en-NG')}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#131010]">
                      {product.total_stock} units
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none ${
                          product.overall_status === 'out_of_stock'
                            ? 'bg-[#fee2e2] text-[#991b1b]'
                            : product.overall_status === 'critical'
                            ? 'bg-[#ffedd5] text-[#9a3412]'
                            : product.overall_status === 'low'
                            ? 'bg-[#fef9c3] text-[#854d0e]'
                            : 'bg-[#dcfce7] text-[#166534]'
                        }`}
                      >
                        {product.overall_status === 'out_of_stock'
                          ? 'Out of Stock'
                          : product.overall_status === 'critical'
                          ? 'Critical (<5)'
                          : product.overall_status === 'low'
                          ? 'Low Stock (≤10)'
                          : 'Healthy'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {!hasVariants ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(product, undefined, -1)}
                            title="Quick Deduct -1 unit"
                            className="w-7 h-7 border border-[#e5dcd0] bg-white text-[#7b7366] hover:text-[#131010] hover:border-[#131010] transition-colors font-mono text-xs"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdjust(product, undefined, 5)}
                            title="Quick Add +5 units"
                            className="w-7 h-7 border border-[#e5dcd0] bg-white text-[#7b7366] hover:text-[#131010] hover:border-[#131010] transition-colors font-mono text-xs"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveAdjustTarget({ product });
                              setAdjustAmount(product.total_stock);
                              setAdjustMode('set');
                            }}
                            className="font-mono text-[11px] uppercase tracking-wider px-3 py-1 bg-[#131010] text-[#f7f1e8] hover:bg-[#2d5508] transition-colors ml-1"
                          >
                            Adjust
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono text-[10px] uppercase text-[#7b7366] tracking-wider">
                          Adjust Variants Below ↓
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Sub-Rows: Size Variants Matrix */}
                  {hasVariants &&
                    product.variants.map((variant) => (
                      <tr key={variant.id} className="bg-[#faf8f5]/40 hover:bg-[#faf8f5] transition-colors">
                        <td className="py-2.5 px-4 pl-12 flex items-center gap-2">
                          <span className="text-[#7b7366] font-mono text-xs">↳</span>
                          <div>
                            <span className="text-[#131010] font-sans text-xs font-medium">{variant.name}</span>
                          </div>
                        </td>

                        <td className="py-2.5 px-4 text-[#7b7366] font-mono text-[10px]">
                          Direct Workshop SKU
                        </td>

                        <td className="py-2.5 px-4 text-[#131010] font-mono text-xs">
                          <code className="bg-white border border-[#e5dcd0] px-1.5 py-0.5">{variant.sku}</code>
                        </td>

                        <td className="py-2.5 px-4 text-right text-[#131010] font-mono text-xs">
                          ₦{variant.price.toLocaleString('en-NG')}
                        </td>

                        <td className="py-2.5 px-4 text-center font-mono font-bold text-xs text-[#131010]">
                          {variant.stock} units
                        </td>

                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-block font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-none ${
                              variant.status === 'out_of_stock'
                                ? 'bg-[#fee2e2] text-[#991b1b]'
                                : variant.status === 'critical'
                                ? 'bg-[#ffedd5] text-[#9a3412]'
                                : variant.status === 'low'
                                ? 'bg-[#fef9c3] text-[#854d0e]'
                                : 'bg-[#dcfce7] text-[#166534]'
                            }`}
                          >
                            {variant.status === 'out_of_stock'
                              ? 'Out of Stock'
                              : variant.status === 'critical'
                              ? 'Critical (<5)'
                              : variant.status === 'low'
                              ? 'Low (≤10)'
                              : 'Healthy'}
                          </span>
                        </td>

                        <td className="py-2.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleQuickAdjust(product, variant, -1)}
                              title="Quick Deduct -1 unit"
                              className="w-6 h-6 border border-[#e5dcd0] bg-white text-[#7b7366] hover:text-[#131010] hover:border-[#131010] transition-colors font-mono text-xs"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickAdjust(product, variant, 5)}
                              title="Quick Add +5 units"
                              className="w-6 h-6 border border-[#e5dcd0] bg-white text-[#7b7366] hover:text-[#131010] hover:border-[#131010] transition-colors font-mono text-xs"
                            >
                              +5
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveAdjustTarget({ product, variant });
                                setAdjustAmount(variant.stock);
                                setAdjustMode('set');
                              }}
                              className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 border border-[#131010] text-[#131010] hover:bg-[#131010] hover:text-[#f7f1e8] transition-colors ml-1"
                            >
                              Adjust...
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {filteredInventory.length === 0 && (
          <div className="p-12 text-center text-[#7b7366] space-y-2">
            <p className="font-serif text-lg text-[#131010]">No formulation inventory found matching your filter.</p>
            <button
              type="button"
              onClick={() => {
                setFilterTab('all');
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="font-mono text-xs uppercase tracking-wider text-[#2d5508] underline underline-offset-4"
            >
              Reset all inventory filters
            </button>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {activeAdjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#e5dcd0] w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl rounded-none animate-scale-up">
            <div className="flex items-start justify-between border-b border-[#e5dcd0] pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#2d5508] font-bold block">
                  FCCPC Reconciled Calibration
                </span>
                <h3 className="font-serif text-xl text-[#131010] mt-0.5">
                  Adjust Stock: {activeAdjustTarget.variant ? activeAdjustTarget.variant.name : activeAdjustTarget.product.name}
                </h3>
                <span className="font-mono text-xs text-[#7b7366] block">
                  {activeAdjustTarget.product.name} &bull; SKU: {activeAdjustTarget.variant ? activeAdjustTarget.variant.sku : activeAdjustTarget.product.slug}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveAdjustTarget(null)}
                className="text-[#7b7366] hover:text-[#131010] font-mono text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDetailedAdjust} className="space-y-5">
              {/* Adjustment Mode Selection */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block">
                  Adjustment Operation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'add', label: 'Add Stock (+)' },
                    { id: 'subtract', label: 'Remove Stock (-)' },
                    { id: 'set', label: 'Set Exact Count (=)' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setAdjustMode(mode.id as any)}
                      className={`font-mono text-xs uppercase tracking-wider py-2 transition-colors border rounded-none cursor-pointer ${
                        adjustMode === mode.id
                          ? 'bg-[#131010] text-[#f7f1e8] border-[#131010]'
                          : 'bg-white text-[#7b7366] border-[#e5dcd0] hover:text-[#131010]'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Input */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block">
                  {adjustMode === 'set' ? 'New Total Count (Units)' : 'Units to Adjust'}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#faf8f5] border border-[#e5dcd0] px-4 py-2.5 text-base font-mono text-[#131010] focus:border-[#131010] outline-none rounded-none"
                />
              </div>

              {/* Reason Code Dropdown */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block">
                  Adjustment Reason (Required for FCCPC Audit)
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e5dcd0] px-4 py-2.5 text-xs font-mono text-[#131010] focus:border-[#131010] outline-none rounded-none cursor-pointer"
                >
                  <option value="received_shipment">Received Production Batch (Calabar/Abuja Workshop)</option>
                  <option value="inventory_count">Physical Cycle Count / Inventory Reconciliation</option>
                  <option value="damaged_goods">Damaged Formulation / Jar Broken in Storage</option>
                  <option value="loss_theft">Inventory Shrinkage / Missing Units</option>
                  <option value="customer_return">Customer Return Restocked to Shelf</option>
                  <option value="manual_adjustment">Manual Data Calibration</option>
                </select>
              </div>

              {/* Note / Batch Reference */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block">
                  Reference Note / Batch Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Batch #CAL-2026-OCT-12 fresh extraction"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e5dcd0] px-4 py-2 text-xs font-sans text-[#131010] focus:border-[#131010] outline-none rounded-none"
                />
              </div>

              {/* Summary Calculation Preview */}
              <div className="p-3 bg-[#faf8f5] border border-[#e5dcd0] rounded-none flex items-center justify-between text-xs font-mono">
                <span className="text-[#7b7366]">Current Stock:</span>
                <span className="font-bold text-[#131010]">
                  {activeAdjustTarget.variant ? activeAdjustTarget.variant.stock : activeAdjustTarget.product.total_stock} units
                </span>
                <span className="text-[#7b7366]">&rarr;</span>
                <span className="text-[#2d5508] font-bold">
                  {adjustMode === 'set'
                    ? adjustAmount
                    : adjustMode === 'add'
                    ? (activeAdjustTarget.variant ? activeAdjustTarget.variant.stock : activeAdjustTarget.product.total_stock) + adjustAmount
                    : Math.max(0, (activeAdjustTarget.variant ? activeAdjustTarget.variant.stock : activeAdjustTarget.product.total_stock) - adjustAmount)}{' '}
                  units
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5dcd0]">
                <button
                  type="button"
                  onClick={() => setActiveAdjustTarget(null)}
                  className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 border border-[#e5dcd0] text-[#7b7366] hover:text-[#131010] hover:border-[#131010] transition-colors rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-mono text-xs uppercase tracking-wider px-6 py-2.5 bg-[#131010] text-[#f7f1e8] hover:bg-[#2d5508] transition-colors rounded-none disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Apply Stock Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Intake Modal */}
      {showBatchIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#e5dcd0] w-full max-w-2xl max-h-[90vh] flex flex-col p-6 sm:p-8 space-y-6 shadow-2xl rounded-none animate-scale-up">
            <div className="flex items-start justify-between border-b border-[#e5dcd0] pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#2d5508] font-bold block">
                  Bulk Production Intake
                </span>
                <h3 className="font-serif text-2xl text-[#131010] mt-0.5">
                  Receive Workshop Production Batch
                </h3>
                <span className="font-sans text-xs text-[#7b7366] block">
                  Direct stock receipt for all jar sizes and formulations from the Calabar botanical laboratory.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowBatchIntakeModal(false)}
                className="text-[#7b7366] hover:text-[#131010] font-mono text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBatchIntake} className="space-y-6 overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block">
                  Batch Code / Shipment Reference
                </label>
                <input
                  type="text"
                  required
                  value={batchReference}
                  onChange={(e) => setBatchReference(e.target.value)}
                  placeholder="e.g. BATCH-2026-OCT-CALABAR"
                  className="w-full bg-[#faf8f5] border border-[#e5dcd0] px-4 py-2.5 text-xs font-mono text-[#131010] focus:border-[#131010] outline-none rounded-none"
                />
              </div>

              {/* Variant Intake Matrix Table */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block">
                  Units Received per Variant Size
                </label>
                <div className="border border-[#e5dcd0] divide-y divide-[#e5dcd0] max-h-72 overflow-y-auto">
                  {inventory.map((product) => (
                    <div key={product.id} className="p-3 bg-[#faf8f5]/40 space-y-2">
                      <div className="font-serif text-xs font-bold text-[#131010] flex items-center justify-between">
                        <span>{product.name}</span>
                        <span className="font-mono text-[10px] text-[#7b7366]">Total Current: {product.total_stock} units</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                        {product.variants.map((v) => (
                          <div key={v.id} className="flex items-center justify-between bg-white border border-[#e5dcd0] p-2 text-xs">
                            <div>
                              <span className="font-sans font-medium text-[#131010] block">{v.name}</span>
                              <span className="font-mono text-[10px] text-[#7b7366]">Current: {v.stock} | SKU: {v.sku}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs text-[#2d5508] font-bold">+</span>
                              <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={batchIntakeQuantities[v.id] || ''}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  setBatchIntakeQuantities({
                                    ...batchIntakeQuantities,
                                    [v.id]: val,
                                  });
                                }}
                                className="w-16 bg-[#faf8f5] border border-[#e5dcd0] px-2 py-1 text-xs font-mono text-right text-[#131010] focus:border-[#131010] outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5dcd0]">
                <button
                  type="button"
                  onClick={() => setShowBatchIntakeModal(false)}
                  className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 border border-[#e5dcd0] text-[#7b7366] hover:text-[#131010] hover:border-[#131010] transition-colors rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBatch}
                  className="font-mono text-xs uppercase tracking-wider px-6 py-2.5 bg-[#131010] text-[#f7f1e8] hover:bg-[#2d5508] transition-colors rounded-none disabled:opacity-50"
                >
                  {isSubmittingBatch ? 'Receiving Batch...' : 'Confirm Production Intake'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjustment Log History Drawer */}
      {showHistoryDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-l border-[#e5dcd0] w-full max-w-xl h-full flex flex-col p-6 sm:p-8 space-y-6 shadow-2xl rounded-none animate-slide-left">
            <div className="flex items-start justify-between border-b border-[#e5dcd0] pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#2d5508] font-bold block">
                  Immutable Audit Trail
                </span>
                <h3 className="font-serif text-2xl text-[#131010] mt-0.5">
                  Inventory Adjustment History
                </h3>
                <span className="font-sans text-xs text-[#7b7366] block">
                  Chronological record of stock decrements, production batch intakes, and restocks.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryDrawer(false)}
                className="text-[#7b7366] hover:text-[#131010] font-mono text-lg"
              >
                ✕
              </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {adjustments.map((adj) => (
                <div key={adj.id} className="p-3.5 bg-[#faf8f5] border border-[#e5dcd0] space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-serif font-bold text-sm text-[#131010] block">
                        {adj.product_name}
                      </span>
                      {adj.variant_name && (
                        <span className="font-mono text-[10px] text-[#7b7366] block">
                          Size: {adj.variant_name} &bull; SKU: {adj.sku}
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded-none ${
                        adj.change_amount > 0 ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'
                      }`}
                    >
                      {adj.change_amount > 0 ? `+${adj.change_amount}` : adj.change_amount} units
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono border-t border-[#e5dcd0]/60 pt-2">
                    <span className="text-[#7b7366]">
                      {REASON_LABELS[adj.reason] || adj.reason}
                    </span>
                    <span className="text-[#131010]">
                      {adj.previous_stock} &rarr; <strong>{adj.new_stock} units</strong>
                    </span>
                  </div>

                  {adj.note && (
                    <p className="font-sans text-[11px] text-[#7b7366] italic bg-white p-2 border border-[#e5dcd0]/40">
                      &ldquo;{adj.note}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between font-mono text-[9px] text-[#7b7366] pt-1">
                    <span>Operator: {adj.actor?.name || 'System'} ({adj.actor?.role || 'admin'})</span>
                    <span>{new Date(adj.timestamp).toLocaleString('en-NG')}</span>
                  </div>
                </div>
              ))}

              {adjustments.length === 0 && (
                <div className="py-16 text-center text-[#7b7366] font-mono text-xs">
                  No inventory adjustment records recorded yet.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#e5dcd0] flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryDrawer(false)}
                className="font-mono text-xs uppercase tracking-wider px-6 py-2.5 bg-[#131010] text-[#f7f1e8] hover:bg-[#2d5508] transition-colors rounded-none"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
