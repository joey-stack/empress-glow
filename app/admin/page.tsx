import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getSubscribers,
  getBlogPosts,
  getProducts,
  getAllOrders,
  getAllUsers,
  getStoreAnalyticsData,
} from '@/lib/insforge/queries';
import { getSessionUser } from '@/lib/auth/session';
import { isPrelaunch } from '@/lib/phase';

export const metadata: Metadata = {
  title: 'Executive Store Dashboard | Empress Glow Admin',
  description: 'Shopify-style command dashboard for sales metrics, multi-brand products, orders, and customer management.',
};

export default async function AdminDashboardPage() {
  const session = await getSessionUser();
  if (
    !session ||
    !session.role ||
    !['super_admin', 'inventory_manager', 'support_staff', 'read_only'].includes(session.role as any)
  ) {
    redirect('/admin/login');
  }

  const [subscribers, blogPosts, products, orders, users, analyticsData] = await Promise.all([
    getSubscribers(),
    getBlogPosts(),
    getProducts(),
    getAllOrders(),
    getAllUsers(),
    getStoreAnalyticsData(),
  ]);

  const recentOrders = orders.slice(0, 5);
  const recentSignups = subscribers.slice(0, 5);

  const completedOrders = orders.filter(
    (o) => o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped'
  );
  const totalRevenue = completedOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  const aov = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;
  const distinctBrands = Array.from(new Set(products.map((p) => p.vendor || 'Empress Glow')));

  const pendingFulfillments = orders.filter((o) => o.status === 'paid');

  return (
    <div className="space-y-6">
      {/* 1. Operating Phase Status Banner (Shopify Style) */}
      <div className="bg-white border border-[#e5dcd0] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 border ${
                isPrelaunch
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
              }`}
            >
              {isPrelaunch ? 'Phase 1: Pre-Launch Active' : 'Phase 2: Live Store Active'}
            </span>
            <span className="font-mono text-xs text-[#7b7366]">
              Empress Glow Emporium &bull; Abuja HQ
            </span>
          </div>
          <h1 className="font-serif text-2xl text-[#131010] font-normal tracking-tight">
            {isPrelaunch
              ? 'Storefront Gated in Waitlist Reservation Mode'
              : 'E-Commerce Storefront Open for Online Commerce'}
          </h1>
          <p className="text-xs text-[#524b42] max-w-2xl leading-relaxed">
            {isPrelaunch
              ? 'Prices and Add to Cart are suppressed on public customer surfaces per regulatory pre-launch protocol. Direct WhatsApp consultations and private waitlist enrollment active.'
              : 'Full botanical catalog live with Paystack Naira checkout, automated receipts, 4-size fruity soap variants, and order fulfillment queue.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
          <Link
            href="/admin/products?tab=new"
            className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] border border-[#131010] hover:border-[#2d5508] transition-colors"
          >
            + Add Product
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-white hover:bg-[#faf6f0] text-[#131010] font-mono text-xs uppercase tracking-[0.18em] border border-[#e5dcd0] transition-colors"
          >
            Live Store ↗
          </Link>
        </div>
      </div>

      {/* 2. Shopify Action Center ("Things To Do Today") */}
      <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5dcd0]">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
              Action Center &bull; Operational Tasks
            </h2>
            <p className="text-xs text-[#7b7366]">Tasks requiring admin dispatch or customer follow-up</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#5a8210] flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#5a8210] animate-pulse" />
            Live Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Item 1: Pending Orders */}
          <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                Fulfillment
              </span>
              <span className="font-mono text-xs font-bold text-[#131010]">
                {pendingFulfillments.length}
              </span>
            </div>
            <div className="text-sm font-medium text-[#131010]">
              {pendingFulfillments.length > 0
                ? `${pendingFulfillments.length} orders ready to ship`
                : 'All orders fulfilled'}
            </div>
            <p className="text-xs text-[#7b7366] leading-relaxed">
              Track delivery logistics and dispatch Abuja local courier shipments.
            </p>
            <Link
              href="/admin/orders"
              className="inline-block pt-1 font-mono text-[11px] uppercase tracking-wider text-[#2d5508] hover:underline font-semibold"
            >
              Open Orders &rarr;
            </Link>
          </div>

          {/* Item 2: Waitlist Inquiries */}
          <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                Early Access
              </span>
              <span className="font-mono text-xs font-bold text-[#131010]">
                {subscribers.length}
              </span>
            </div>
            <div className="text-sm font-medium text-[#131010]">
              {subscribers.length} Private Reservation Clients
            </div>
            <p className="text-xs text-[#7b7366] leading-relaxed">
              Notify interested clientele upon cold-pressed soap batch maturation.
            </p>
            <Link
              href="/admin/subscribers"
              className="inline-block pt-1 font-mono text-[11px] uppercase tracking-wider text-[#2d5508] hover:underline font-semibold"
            >
              View Subscribers &rarr;
            </Link>
          </div>

          {/* Item 3: Regulatory & Multi-Brand Compliance */}
          <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                Compliance
              </span>
              <span className="font-mono text-[10px] text-[#2d5508] font-semibold">
                Verified ✓
              </span>
            </div>
            <div className="text-sm font-medium text-[#131010]">
              NAFDAC, NDPA &amp; FCCPC Rules
            </div>
            <p className="text-xs text-[#7b7366] leading-relaxed">
              Disclaimers active, 7-day refund guarantee posted, VAT exempt small-business status.
            </p>
            <Link
              href="/admin/settings"
              className="inline-block pt-1 font-mono text-[11px] uppercase tracking-wider text-[#2d5508] hover:underline font-semibold"
            >
              Review Policies &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Shopify-Style KPI Ribbon (GMV, Conversion, Retention, Orders, Catalog, Compliance) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Revenue / GMV */}
        <div className="bg-white p-4 border border-[#e5dcd0] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366]">
              Total Sales GMV
            </span>
            <span className="w-5 h-5 bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/20 flex items-center justify-center font-mono text-xs font-bold">
              ₦
            </span>
          </div>
          <div>
            <div className="font-serif text-xl font-normal text-[#131010]">
              ₦{totalRevenue.toLocaleString('en-NG')}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#2d5508] mt-0.5">
              {completedOrders.length} settled payments
            </div>
          </div>
        </div>

        {/* Card 2: Storefront Conversion Rate */}
        <div className="bg-white p-4 border border-[#e5dcd0] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366]">
              Conversion Rate
            </span>
            <span className="w-5 h-5 bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] flex items-center justify-center font-mono text-xs">
              🎯
            </span>
          </div>
          <div>
            <div className="font-serif text-xl font-normal text-[#131010]">
              {analyticsData.overview.storefront_conversion_rate_pct}%
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] mt-0.5">
              Waitlist + Orders / Visits
            </div>
          </div>
        </div>

        {/* Card 3: Returning Customer Rate */}
        <div className="bg-white p-4 border border-[#e5dcd0] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366]">
              Returning Rate
            </span>
            <span className="w-5 h-5 bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] flex items-center justify-center font-mono text-xs">
              🔁
            </span>
          </div>
          <div>
            <div className="font-serif text-xl font-normal text-[#131010]">
              {analyticsData.overview.returning_customer_rate_pct}%
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#2d5508] mt-0.5">
              {analyticsData.overview.returning_customers_count} repeat clients
            </div>
          </div>
        </div>

        {/* Card 4: Orders & AOV */}
        <div className="bg-white p-4 border border-[#e5dcd0] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366]">
              Orders &bull; AOV
            </span>
            <span className="w-5 h-5 bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] flex items-center justify-center font-mono text-xs">
              📦
            </span>
          </div>
          <div>
            <div className="font-serif text-xl font-normal text-[#131010]">
              {orders.length} <span className="font-sans text-xs text-[#7b7366] font-normal">orders</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] mt-0.5">
              AOV: ₦{aov.toLocaleString('en-NG')}
            </div>
          </div>
        </div>

        {/* Card 5: Products & Brands */}
        <div className="bg-white p-4 border border-[#e5dcd0] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366]">
              Multi-Brand
            </span>
            <span className="w-5 h-5 bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] flex items-center justify-center font-mono text-xs">
              🌿
            </span>
          </div>
          <div>
            <div className="font-serif text-xl font-normal text-[#131010]">
              {products.length} <span className="font-sans text-xs text-[#7b7366] font-normal">items</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#2d5508] mt-0.5">
              {distinctBrands.length} partner brands
            </div>
          </div>
        </div>

        {/* Card 6: NAFDAC Statutory Compliance */}
        <div className="bg-white p-4 border border-[#e5dcd0] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7b7366]">
              NAFDAC Audit
            </span>
            <span className="w-5 h-5 bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/20 flex items-center justify-center font-mono text-xs">
              ✓
            </span>
          </div>
          <div>
            <div className="font-serif text-xl font-normal text-[#2d5508]">
              {analyticsData.nafdac_compliance.compliance_rate_pct}% Pass
            </div>
            <Link
              href="/admin/reports"
              className="font-mono text-[9px] uppercase tracking-wider text-[#2d5508] hover:underline mt-0.5 inline-block font-semibold"
            >
              Open Dossier &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Main Workspace Grid: Orders & Products Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recent Orders / Fulfillment Tracker (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5dcd0]">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
                  Recent Orders &bull; Paystack Transactions
                </h3>
                <p className="text-xs text-[#7b7366]">Customer orders tracked with Naira settlement references</p>
              </div>
              <Link
                href="/admin/orders"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2d5508] hover:text-[#131010] transition-colors"
              >
                View All Orders &rarr;
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="text-2xl">📦</div>
                <div className="text-xs text-[#7b7366]">
                  No orders recorded yet. As customers check out on the live store, transactions will appear here.
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf6f0] text-[#7b7366] font-mono text-[10px] uppercase tracking-[0.2em] border-b border-[#e5dcd0]">
                    <tr>
                      <th className="py-3 px-3">Order</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Items</th>
                      <th className="py-3 px-3 text-right">Total (₦)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5dcd0]">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#faf8f5] transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-[#131010]">
                          #{ord.id.substring(0, 8)}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-[#131010]">{ord.customer_name}</div>
                          <div className="font-mono text-[10px] text-[#7b7366]">{ord.customer_email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                              ord.status === 'delivered' || ord.status === 'paid'
                                ? 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
                                : ord.status === 'shipped'
                                ? 'bg-sky-50 text-sky-800 border-sky-300'
                                : ord.status === 'pending'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-[#faf6f0] text-[#524b42] border-[#e5dcd0]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 ${
                                ord.status === 'paid' || ord.status === 'delivered'
                                  ? 'bg-[#5a8210]'
                                  : ord.status === 'shipped'
                                  ? 'bg-sky-500'
                                  : 'bg-amber-500'
                              }`}
                            />
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#524b42] font-mono text-[11px]">
                          {ord.items.length} item{ord.items.length !== 1 ? 's' : ''}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-medium text-[#131010]">
                          ₦{ord.total.toLocaleString('en-NG')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Waitlist Subscribers Summary */}
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5dcd0]">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
                  Private Reservation Waitlist
                </h3>
                <p className="text-xs text-[#7b7366]">Clientele enrolled for batch dispatches and launch allocations</p>
              </div>
              <Link
                href="/admin/subscribers"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2d5508] hover:text-[#131010] transition-colors"
              >
                View All ({subscribers.length}) &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf6f0] text-[#7b7366] font-mono text-[10px] uppercase tracking-[0.2em] border-b border-[#e5dcd0]">
                  <tr>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Product Reservation</th>
                    <th className="py-3 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5dcd0]">
                  {recentSignups.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-medium text-[#131010] block">
                          {sub.name || 'Anonymous Guest'}
                        </span>
                        <span className="font-mono text-[10px] text-[#7b7366]">{sub.email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 border border-[#e5dcd0] bg-[#faf6f0] text-[#131010] font-mono text-[10px] uppercase tracking-wider">
                          {sub.product_slug}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-[#7b7366] font-mono text-[10px]">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Hub & Multi-Brand Overview (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold pb-2 border-b border-[#e5dcd0]">
              Management Shortcuts
            </h3>

            <div className="space-y-2">
              <Link
                href="/admin/products?tab=new"
                className="w-full py-2.5 px-3 border border-[#e5dcd0] hover:border-[#131010] bg-[#faf8f5] hover:bg-white text-[#131010] text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span>Add Product (Flagship or Partner)</span>
                <span className="text-[#5a8210] font-bold">+</span>
              </Link>
              <Link
                href="/admin/products"
                className="w-full py-2.5 px-3 border border-[#e5dcd0] hover:border-[#131010] bg-[#faf8f5] hover:bg-white text-[#131010] text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span>Manage Multi-Brand Catalog</span>
                <span className="text-[#7b7366]">&rarr;</span>
              </Link>
              <Link
                href="/admin/customers"
                className="w-full py-2.5 px-3 border border-[#e5dcd0] hover:border-[#131010] bg-[#faf8f5] hover:bg-white text-[#131010] text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span>Customer Directory &amp; NDPA</span>
                <span className="text-[#7b7366]">&rarr;</span>
              </Link>
              <Link
                href="/admin/content"
                className="w-full py-2.5 px-3 border border-[#e5dcd0] hover:border-[#131010] bg-[#faf8f5] hover:bg-white text-[#131010] text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span>Story &amp; Rituals CMS</span>
                <span className="text-[#7b7366]">&rarr;</span>
              </Link>
              <Link
                href="/admin/blog"
                className="w-full py-2.5 px-3 border border-[#e5dcd0] hover:border-[#131010] bg-[#faf8f5] hover:bg-white text-[#131010] text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span>Write Botanical Journal Article</span>
                <span className="text-[#7b7366]">&rarr;</span>
              </Link>
              <Link
                href="/admin/settings"
                className="w-full py-2.5 px-3 border border-[#e5dcd0] hover:border-[#131010] bg-[#faf8f5] hover:bg-white text-[#131010] text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span>Store Settings &amp; Policies</span>
                <span className="text-[#7b7366]">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Brands Breakdown Card */}
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold pb-2 border-b border-[#e5dcd0]">
              Brand Directory Breakdown
            </h3>
            <div className="space-y-2">
              {distinctBrands.map((brand) => {
                const count = products.filter((p) => (p.vendor || 'Empress Glow') === brand).length;
                const isHero = brand === 'Empress Glow';

                return (
                  <div
                    key={brand}
                    className="flex items-center justify-between p-3 border border-[#e5dcd0] bg-[#faf8f5] text-xs"
                  >
                    <div>
                      <span className="font-medium text-[#131010] block">{brand}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366]">
                        {isHero ? 'Mary Asuquo Flagship' : 'Curated Partner'}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 border border-[#e5dcd0] bg-white font-mono text-[10px] text-[#131010]">
                      {count} items
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regulatory Standards Card */}
          <div className="bg-white border border-[#e5dcd0] p-6 text-xs text-[#524b42] space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#131010] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-[#5a8210]" />
              Nigerian Regulatory Protocol
            </div>
            <p className="leading-relaxed text-[11px] text-[#7b7366]">
              Empress Glow Emporium operations strictly adhere to:
            </p>
            <ul className="space-y-1.5 font-mono text-[10px] text-[#524b42]">
              <li>&bull; NAFDAC Traditional Formulation Notice</li>
              <li>&bull; FCCPC 7-Day Defective Product Return</li>
              <li>&bull; NDPA Data Protection &amp; Consent Opt-Out</li>
              <li>&bull; Statutory VAT Exemption (FIRS Small Co.)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
