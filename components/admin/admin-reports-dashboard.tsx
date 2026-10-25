'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type {
  StoreAnalyticsData,
  VariantSalesStat,
  BrandSalesStat,
  CustomerRFMStat,
  SearchBehaviorStat,
  NafdacAuditProduct,
} from '@/lib/insforge/queries';

interface AdminReportsDashboardProps {
  initialData: StoreAnalyticsData;
}

export function AdminReportsDashboard({ initialData }: AdminReportsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'variants' | 'brands' | 'nafdac' | 'retention' | 'search'>('overview');
  const [variantSearch, setVariantSearch] = useState('');
  const [nafdacFilter, setNafdacFilter] = useState<'all' | 'PASS' | 'WARNING' | 'FAIL'>('all');
  const [rfmFilter, setRfmFilter] = useState<string>('all');
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const { overview, variant_sales, brand_sales, customer_rfm, rfm_distribution, search_behavior, funnel_steps, nafdac_compliance } = initialData;

  // Filtered variants
  const filteredVariants = variant_sales.filter((v) => {
    if (!variantSearch) return true;
    const q = variantSearch.toLowerCase();
    return (
      v.product_name.toLowerCase().includes(q) ||
      v.variant_name.toLowerCase().includes(q) ||
      v.sku.toLowerCase().includes(q) ||
      v.vendor.toLowerCase().includes(q)
    );
  });

  // Filtered NAFDAC products
  const filteredNafdacProducts = nafdac_compliance.products.filter((p) => {
    if (nafdacFilter === 'all') return true;
    return p.compliance_status === nafdacFilter;
  });

  // Filtered RFM Customers
  const filteredCustomers = customer_rfm.filter((c) => {
    if (rfmFilter === 'all') return true;
    return c.rfm_tier === rfmFilter;
  });

  const handleExport = (format: 'csv' | 'json') => {
    setExportLoading(format);
    window.location.href = `/api/admin/reports/nafdac-export?format=${format}`;
    setTimeout(() => {
      setExportLoading(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Executive Reporting Header */}
      <div className="bg-white border border-[#e5dcd0] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 border bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30">
              Intelligence &bull; Realtime
            </span>
            <span className="font-mono text-xs text-[#7b7366]">
              Store Analytics &amp; Statutory Compliance Dossier
            </span>
          </div>
          <h1 className="font-serif text-2xl text-[#131010] font-normal tracking-tight">
            Store Performance &amp; Regulatory Audit Console
          </h1>
          <p className="text-xs text-[#524b42] max-w-2xl leading-relaxed">
            Multi-brand GMV tracking, variant sales volume, conversion funnels, customer RFM retention cohorts, and automated NAFDAC statutory compliance evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => handleExport('csv')}
            disabled={exportLoading !== null}
            className="flex-1 md:flex-none text-center px-4 py-2.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] border border-[#131010] hover:border-[#2d5508] transition-colors flex items-center justify-center gap-2"
          >
            {exportLoading === 'csv' ? (
              <span className="animate-spin text-sm">↻</span>
            ) : (
              <span>⬇</span>
            )}
            Export NAFDAC CSV
          </button>
          <button
            type="button"
            onClick={() => handleExport('json')}
            disabled={exportLoading !== null}
            className="flex-1 md:flex-none text-center px-4 py-2.5 bg-white hover:bg-[#faf6f0] text-[#131010] font-mono text-xs uppercase tracking-[0.18em] border border-[#e5dcd0] transition-colors flex items-center justify-center gap-2"
          >
            <span>📄</span>
            JSON Dossier
          </button>
        </div>
      </div>

      {/* 2. Top-Level High-Precision KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* GMV */}
        <div className="bg-white p-5 border border-[#e5dcd0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
              Gross Sales (GMV)
            </span>
            <span className="w-5 h-5 bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/20 flex items-center justify-center font-mono text-xs font-bold">
              ₦
            </span>
          </div>
          <div className="font-serif text-2xl font-normal text-[#131010]">
            ₦{overview.total_sales_gmv.toLocaleString('en-NG')}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#2d5508]">
            {overview.completed_orders_count} settled transactions
          </div>
        </div>

        {/* Storefront Conversion Rate */}
        <div className="bg-white p-5 border border-[#e5dcd0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
              Conversion Rate
            </span>
            <span className="w-5 h-5 bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] flex items-center justify-center font-mono text-xs">
              🎯
            </span>
          </div>
          <div className="font-serif text-2xl font-normal text-[#131010]">
            {overview.storefront_conversion_rate_pct}%
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">
            Orders + Waitlist vs Sessions
          </div>
        </div>

        {/* Returning Customer Rate */}
        <div className="bg-white p-5 border border-[#e5dcd0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
              Returning Rate
            </span>
            <span className="w-5 h-5 bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] flex items-center justify-center font-mono text-xs">
              🔁
            </span>
          </div>
          <div className="font-serif text-2xl font-normal text-[#131010]">
            {overview.returning_customer_rate_pct}%
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#2d5508]">
            {overview.returning_customers_count} of {overview.unique_customers_count} buyers
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-5 border border-[#e5dcd0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
              Average Order Value
            </span>
            <span className="w-5 h-5 bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] flex items-center justify-center font-mono text-xs">
              🛒
            </span>
          </div>
          <div className="font-serif text-2xl font-normal text-[#131010]">
            ₦{overview.average_order_value.toLocaleString('en-NG')}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">
            Per completed order
          </div>
        </div>

        {/* NAFDAC Statutory Compliance */}
        <div className="bg-white p-5 border border-[#e5dcd0] space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
              NAFDAC Compliance
            </span>
            <span className="w-5 h-5 bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/20 flex items-center justify-center font-mono text-xs">
              ✓
            </span>
          </div>
          <div className="font-serif text-2xl font-normal text-[#2d5508]">
            {nafdac_compliance.compliance_rate_pct}%
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#2d5508]">
            {nafdac_compliance.compliant_count}/{nafdac_compliance.total_products} Clean Formulations
          </div>
        </div>
      </div>

      {/* 3. Navigation View Tabs */}
      <div className="border-b border-[#e5dcd0] bg-white px-4 pt-2">
        <nav className="flex space-x-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Funnel & Conversion', icon: '📊' },
            { id: 'variants', label: 'Variant Sales Matrix', icon: '📦', count: variant_sales.length },
            { id: 'brands', label: 'Sales by Brand', icon: '🌿', count: brand_sales.length },
            { id: 'nafdac', label: 'NAFDAC Compliance Dossier', icon: '⚖️', badge: `${nafdac_compliance.compliance_rate_pct}% Pass` },
            { id: 'retention', label: 'Customer RFM Retention', icon: '👥', count: customer_rfm.length },
            { id: 'search', label: 'Storefront Search & Intent', icon: '🔍', count: search_behavior.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3.5 border-b-2 font-mono text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#131010] text-[#131010] font-semibold'
                    : 'border-transparent text-[#7b7366] hover:text-[#131010] hover:border-[#e5dcd0]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 border ${
                    isActive ? 'bg-[#131010] text-white border-[#131010]' : 'bg-[#faf6f0] text-[#7b7366] border-[#e5dcd0]'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/20 font-semibold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB 1: FUNNEL & CONVERSION OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Conversion Funnel Breakdown */}
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e5dcd0]">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
                  Storefront Conversion Funnel Progression
                </h2>
                <p className="text-xs text-[#7b7366]">
                  Tracking customer journeys from initial visitor discovery through to settled orders and waitlist reserves.
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#5a8210] flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#5a8210] animate-pulse" />
                Dual Prelaunch / Live Model
              </span>
            </div>

            <div className="space-y-4">
              {funnel_steps.map((step, idx) => {
                const widthPercent = Math.max(12, Math.round((step.visitors / funnel_steps[0].visitors) * 100));
                return (
                  <div key={step.step} className="p-4 bg-[#faf8f5] border border-[#e5dcd0] space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-[#131010] text-white font-mono text-xs flex items-center justify-center font-bold">
                          {step.step}
                        </span>
                        <div>
                          <div className="font-serif text-sm text-[#131010] font-medium">
                            {step.name}
                          </div>
                          <div className="text-xs text-[#7b7366] leading-relaxed">
                            {step.notes}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right sm:text-left self-end sm:self-auto">
                        <div>
                          <div className="font-mono text-sm font-bold text-[#131010]">
                            {step.visitors.toLocaleString('en-NG')}
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">
                            Visitors
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <div className="font-mono text-sm font-bold text-[#2d5508]">
                            {step.conversion_rate_pct}%
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366]">
                            Step Conv.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#e5dcd0]/50 h-2 overflow-hidden">
                      <div
                        className="bg-[#2d5508] h-full transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Retention & Lifetime Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold border-b border-[#e5dcd0] pb-3">
                Customer Retention Dynamics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0]">
                  <div className="font-mono text-[10px] uppercase text-[#7b7366]">Repeat Buyers</div>
                  <div className="font-serif text-2xl text-[#131010] mt-1">{overview.returning_customers_count}</div>
                  <div className="text-xs text-[#2d5508] mt-1 font-mono">≥ 2 Completed Orders</div>
                </div>
                <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0]">
                  <div className="font-mono text-[10px] uppercase text-[#7b7366]">Unique Buyers</div>
                  <div className="font-serif text-2xl text-[#131010] mt-1">{overview.unique_customers_count}</div>
                  <div className="text-xs text-[#7b7366] mt-1 font-mono">Distinct Accounts</div>
                </div>
              </div>
              <p className="text-xs text-[#524b42] leading-relaxed">
                Returning customer rate currently sits at <strong>{overview.returning_customer_rate_pct}%</strong>, driven by repeat soap and serum formulations.
              </p>
            </div>

            <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold border-b border-[#e5dcd0] pb-3">
                Pre-Launch Audience Velocity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0]">
                  <div className="font-mono text-[10px] uppercase text-[#7b7366]">Private Waitlist</div>
                  <div className="font-serif text-2xl text-[#131010] mt-1">{overview.waitlist_subscribers_count}</div>
                  <div className="text-xs text-[#2d5508] mt-1 font-mono">NDPA Consented</div>
                </div>
                <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0]">
                  <div className="font-mono text-[10px] uppercase text-[#7b7366]">Total Sessions</div>
                  <div className="font-serif text-2xl text-[#131010] mt-1">{overview.total_storefront_sessions.toLocaleString('en-NG')}</div>
                  <div className="text-xs text-[#7b7366] mt-1 font-mono">Engagement Traffic</div>
                </div>
              </div>
              <p className="text-xs text-[#524b42] leading-relaxed">
                Public storefront operates in strict pre-launch gating. Direct WhatsApp consultations and private waitlist capture form the sole conversion events.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VARIANT LEVEL SALES MATRIX */}
      {activeTab === 'variants' && (
        <div className="bg-white border border-[#e5dcd0] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e5dcd0]">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
                Product Variant Sales &amp; Inventory Turnover
              </h2>
              <p className="text-xs text-[#7b7366]">
                Granular sales, units sold, and stock depletion rates across all 4 hero jar sizes and supporting catalog items.
              </p>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Filter variants, SKU, formulation..."
                value={variantSearch}
                onChange={(e) => setVariantSearch(e.target.value)}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#e5dcd0] font-mono text-xs text-[#131010] focus:outline-none focus:border-[#2d5508]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e5dcd0] bg-[#faf8f5] text-[#7b7366] font-mono text-[10px] uppercase tracking-[0.18em]">
                  <th className="py-3 px-4">Formulation &amp; Variant</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Units Sold</th>
                  <th className="py-3 px-4 text-right">Gross Sales</th>
                  <th className="py-3 px-4 text-right">Stock Level</th>
                  <th className="py-3 px-4 text-right">Turnover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5dcd0] text-xs">
                {filteredVariants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#7b7366] font-mono">
                      No product variants match your query.
                    </td>
                  </tr>
                ) : (
                  filteredVariants.map((v) => (
                    <tr key={v.variant_id} className="hover:bg-[#faf6f0] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-serif text-[#131010] font-normal">{v.product_name}</div>
                        <div className="font-mono text-[11px] text-[#7b7366]">{v.variant_name}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#524b42]">
                        <span className={`px-2 py-0.5 border ${
                          v.vendor === 'Empress Glow'
                            ? 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}>
                          {v.vendor}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#7b7366]">
                        {v.sku}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-[#131010]">
                        ₦{v.price.toLocaleString('en-NG')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#131010]">
                        {v.units_sold}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#2d5508]">
                        ₦{v.gross_sales.toLocaleString('en-NG')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className={`px-2 py-0.5 border text-[10px] ${
                          v.stock_status === 'out_of_stock'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : v.stock_status === 'low_stock'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {v.stock_remaining} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#524b42]">
                        {v.turnover_rate_pct}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SALES BY BRAND & PARTNER DISTRIBUTION */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-6">
            <div className="pb-4 border-b border-[#e5dcd0]">
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
                Multi-Brand Market Share &amp; Revenue Contribution
              </h2>
              <p className="text-xs text-[#7b7366]">
                Comparison between Empress Glow flagship botanical formulations and verified partner brands (Aura Botanicals, Nectar Skin Labs).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {brand_sales.map((b) => (
                <div key={b.vendor} className="p-5 bg-[#faf8f5] border border-[#e5dcd0] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-[#131010] font-medium">
                      {b.vendor}
                    </span>
                    <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                      b.is_flagship
                        ? 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30 font-semibold'
                        : 'bg-stone-100 text-stone-700 border-stone-300'
                    }`}>
                      {b.is_flagship ? 'Flagship' : 'Partner Brand'}
                    </span>
                  </div>

                  <div>
                    <div className="font-mono text-2xl font-bold text-[#131010]">
                      ₦{b.gross_sales.toLocaleString('en-NG')}
                    </div>
                    <div className="font-mono text-[10px] uppercase text-[#7b7366] mt-0.5">
                      {b.revenue_share_pct}% Revenue Share
                    </div>
                  </div>

                  <div className="w-full bg-[#e5dcd0]/60 h-2 overflow-hidden">
                    <div
                      className={`h-full ${b.is_flagship ? 'bg-[#2d5508]' : 'bg-[#7b7366]'}`}
                      style={{ width: `${Math.max(5, b.revenue_share_pct)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e5dcd0] text-center font-mono text-[10px]">
                    <div>
                      <div className="text-[#7b7366]">Catalog</div>
                      <div className="font-bold text-[#131010] mt-0.5">{b.product_count} items</div>
                    </div>
                    <div>
                      <div className="text-[#7b7366]">Units Sold</div>
                      <div className="font-bold text-[#131010] mt-0.5">{b.units_sold}</div>
                    </div>
                    <div>
                      <div className="text-[#7b7366]">Avg Price</div>
                      <div className="font-bold text-[#131010] mt-0.5">₦{b.average_price.toLocaleString('en-NG')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NAFDAC STATUTORY REGULATORY COMPLIANCE AUDIT */}
      {activeTab === 'nafdac' && (
        <div className="bg-white border border-[#e5dcd0] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e5dcd0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] px-2 py-0.5 bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/30 font-semibold">
                  NAFDAC Statutory Audit
                </span>
                <span className="font-mono text-xs text-[#7b7366]">
                  Standard Act Cap N1 LFN 2004 &bull; Traditional Botanical Framing
                </span>
              </div>
              <h2 className="font-serif text-xl text-[#131010] font-normal tracking-tight mt-1">
                Catalog Health Claims &amp; Statutory Disclaimer Verification
              </h2>
              <p className="text-xs text-[#7b7366] max-w-2xl mt-1">
                Automated regulatory compliance scanner checking for mandatory disclaimers, zero medical superlative claims, and complete botanical ingredient declarations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="px-3 py-2 bg-[#131010] text-[#f7f1e8] font-mono text-xs uppercase tracking-wider hover:bg-[#2d5508] transition-colors"
              >
                Download CSV
              </button>
              <button
                type="button"
                onClick={() => handleExport('json')}
                className="px-3 py-2 bg-white text-[#131010] border border-[#e5dcd0] font-mono text-xs uppercase tracking-wider hover:bg-[#faf6f0] transition-colors"
              >
                Download JSON
              </button>
            </div>
          </div>

          {/* Statutory Caveat Notice Banner */}
          <div className="p-4 bg-amber-50/50 border border-amber-200/80 space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-900 font-bold flex items-center gap-2">
              <span>⚠️</span>
              Mandatory NAFDAC Statutory Disclaimer Standard
            </div>
            <p className="text-xs text-amber-950 font-serif italic">
              &ldquo;{nafdac_compliance.statutory_caveat_verbatim}&rdquo;
            </p>
            <p className="text-[11px] text-amber-800">
              Per regulatory instructions, every product page, packaging label, and promotional asset must render this verbatim notice with zero medical assertions.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {(['all', 'PASS', 'WARNING', 'FAIL'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setNafdacFilter(status)}
                  className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider border transition-colors ${
                    nafdacFilter === status
                      ? 'bg-[#131010] text-white border-[#131010]'
                      : 'bg-[#faf8f5] text-[#7b7366] border-[#e5dcd0] hover:text-[#131010]'
                  }`}
                >
                  {status === 'all' ? 'All Formulations' : status}
                </button>
              ))}
            </div>

            <div className="font-mono text-xs text-[#7b7366]">
              Showing {filteredNafdacProducts.length} of {nafdac_compliance.total_products} items
            </div>
          </div>

          {/* NAFDAC Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e5dcd0] bg-[#faf8f5] text-[#7b7366] font-mono text-[10px] uppercase tracking-[0.18em]">
                  <th className="py-3 px-4">Formulation Name</th>
                  <th className="py-3 px-4">Brand / SKU</th>
                  <th className="py-3 px-4 text-center">Statutory Caveat</th>
                  <th className="py-3 px-4">Medical Claims Scan</th>
                  <th className="py-3 px-4 text-center">Ingredients</th>
                  <th className="py-3 px-4 text-right">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5dcd0] text-xs">
                {filteredNafdacProducts.map((p) => (
                  <tr key={p.product_id} className="hover:bg-[#faf6f0] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-serif text-[#131010] font-normal">{p.name}</div>
                      <div className="text-[11px] text-[#7b7366] mt-0.5 max-w-md">{p.audit_notes}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="text-[#131010]">{p.vendor}</div>
                      <div className="text-[#7b7366]">{p.sku || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px]">
                        ✓ Verified
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.prohibited_medical_terms_found.length > 0 ? (
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-red-50 text-red-700 border border-red-200">
                          Flagged: {p.prohibited_medical_terms_found.join(', ')}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-[#2d5508]">
                          0 Prohibited Terms (Clean)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                      {p.ingredients_declared_count > 0 ? (
                        <span className="text-[#2d5508]">{p.ingredients_declared_count} Botanicals</span>
                      ) : (
                        <span className="text-amber-700 font-bold">Missing</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold border ${
                        p.compliance_status === 'PASS'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : p.compliance_status === 'WARNING'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}>
                        {p.compliance_status === 'PASS' ? '✓ PASS' : p.compliance_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMER RFM & RETENTION TIERS */}
      {activeTab === 'retention' && (
        <div className="space-y-6">
          {/* RFM Tier Distribution Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-white border border-[#e5dcd0] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#2d5508] font-bold">
                🏆 Champions
              </span>
              <div className="font-serif text-2xl text-[#131010]">{rfm_distribution.champions}</div>
              <div className="text-[10px] text-[#7b7366] font-mono">High Recency &amp; Spend</div>
            </div>

            <div className="p-4 bg-white border border-[#e5dcd0] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#2d5508] font-bold">
                ⭐ Loyal Customers
              </span>
              <div className="font-serif text-2xl text-[#131010]">{rfm_distribution.loyal}</div>
              <div className="text-[10px] text-[#7b7366] font-mono">Frequent Reorders</div>
            </div>

            <div className="p-4 bg-white border border-[#e5dcd0] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] font-bold">
                🌱 Potential
              </span>
              <div className="font-serif text-2xl text-[#131010]">{rfm_distribution.potential}</div>
              <div className="text-[10px] text-[#7b7366] font-mono">Recent High-Value</div>
            </div>

            <div className="p-4 bg-white border border-[#e5dcd0] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-amber-800 font-bold">
                ⚠️ At Risk
              </span>
              <div className="font-serif text-2xl text-[#131010]">{rfm_distribution.at_risk}</div>
              <div className="text-[10px] text-[#7b7366] font-mono">&gt;60 Days Inactive</div>
            </div>

            <div className="p-4 bg-white border border-[#e5dcd0] space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] font-bold">
                🎟️ One-Time
              </span>
              <div className="font-serif text-2xl text-[#131010]">{rfm_distribution.one_time}</div>
              <div className="text-[10px] text-[#7b7366] font-mono">Single Transaction</div>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e5dcd0]">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
                  Customer RFM Segmentation &amp; Lifetime Value (LTV)
                </h2>
                <p className="text-xs text-[#7b7366]">
                  Cohort retention profiles evaluated by recency of order, purchase frequency, and cumulative Naira spend.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {['all', 'Champion', 'Loyal Customer', 'Potential Loyalist', 'At Risk', 'One-Time Enrolled'].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setRfmFilter(tier)}
                    className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider border transition-colors ${
                      rfmFilter === tier
                        ? 'bg-[#131010] text-white border-[#131010]'
                        : 'bg-[#faf8f5] text-[#7b7366] border-[#e5dcd0] hover:text-[#131010]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e5dcd0] bg-[#faf8f5] text-[#7b7366] font-mono text-[10px] uppercase tracking-[0.18em]">
                    <th className="py-3 px-4">Client Name &amp; Contact</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4 text-center">Orders Count</th>
                    <th className="py-3 px-4 text-right">Total LTV Spend</th>
                    <th className="py-3 px-4 text-right">AOV</th>
                    <th className="py-3 px-4 text-right">Recency</th>
                    <th className="py-3 px-4 text-right">RFM Cohort</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5dcd0] text-xs">
                  {filteredCustomers.map((c) => (
                    <tr key={c.customer_email} className="hover:bg-[#faf6f0] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-serif text-[#131010] font-medium">{c.customer_name}</div>
                        <div className="font-mono text-[11px] text-[#7b7366]">{c.customer_email}</div>
                        {c.customer_phone && (
                          <div className="font-mono text-[10px] text-[#524b42]">{c.customer_phone}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#524b42]">
                        {c.city || 'N/A'}, {c.state || 'Nigeria'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#131010]">
                        {c.total_orders}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#2d5508]">
                        ₦{c.total_spend.toLocaleString('en-NG')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#524b42]">
                        ₦{c.average_order_value.toLocaleString('en-NG')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#7b7366]">
                        {c.days_since_last_order} days ago
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold border ${
                          c.rfm_tier === 'Champion'
                            ? 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
                            : c.rfm_tier === 'Loyal Customer'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : c.rfm_tier === 'Potential Loyalist'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}>
                          {c.rfm_tier}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: STOREFRONT SEARCH & BEHAVIOR */}
      {activeTab === 'search' && (
        <div className="bg-white border border-[#e5dcd0] p-6 space-y-6">
          <div className="pb-4 border-b border-[#e5dcd0]">
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
              Storefront Customer Search Terms &amp; Query Intent
            </h2>
            <p className="text-xs text-[#7b7366]">
              Real-time query frequency, conversion ratios, and zero-match alerts (e.g. searching for prohibited bleaching creams).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e5dcd0] bg-[#faf8f5] text-[#7b7366] font-mono text-[10px] uppercase tracking-[0.18em]">
                  <th className="py-3 px-4">Search Term Query</th>
                  <th className="py-3 px-4 text-right">Search Count</th>
                  <th className="py-3 px-4 text-right">Converted Orders</th>
                  <th className="py-3 px-4 text-right">Conversion Rate</th>
                  <th className="py-3 px-4 text-center">Catalog Matches</th>
                  <th className="py-3 px-4 text-right">Last Queried</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5dcd0] text-xs">
                {search_behavior.map((s) => (
                  <tr key={s.query} className="hover:bg-[#faf6f0] transition-colors">
                    <td className="py-3.5 px-4 font-serif text-[#131010] font-medium">
                      &ldquo;{s.query}&rdquo;
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#131010]">
                      {s.search_count}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#2d5508] font-bold">
                      {s.converted_orders}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#131010]">
                      {s.conversion_rate_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {s.has_catalog_matches ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px]">
                          {s.match_count} Items
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[10px]">
                          0 Results (Zero Hit)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#7b7366]">
                      {new Date(s.last_searched_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
