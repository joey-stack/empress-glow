import React from 'react';
import type { Metadata } from 'next';
import { isPrelaunch } from '@/lib/phase';

export const metadata: Metadata = {
  title: 'Store Settings & Policies | Empress Glow Admin',
  description: 'Manage store details, Nigerian regulatory standards, Paystack credentials, and Two-Phase settings.',
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#e5dcd0] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
            Configuration &bull; System Standards
          </span>
          <h1 className="font-serif text-2xl text-[#131010] font-normal tracking-tight">
            Store Settings &amp; Legal Policies
          </h1>
          <p className="text-xs text-[#7b7366] max-w-2xl mt-1 leading-relaxed">
            Enterprise store profile, Two-Phase architecture status, Nigerian statutory compliance (NAFDAC, NDPA, FCCPC), and payment infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border border-[#e5dcd0] bg-[#faf6f0] text-[#131010]">
            Abuja HQ &bull; NGN (₦)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Core Settings */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Operating Phase Controller */}
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
            <div className="pb-3 border-b border-[#e5dcd0] flex items-center justify-between">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold">
                  Two-Phase Architecture Controller
                </h2>
                <p className="text-xs text-[#7b7366]">Configured via NEXT_PUBLIC_SITE_PHASE environment variable</p>
              </div>
              <span
                className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                  isPrelaunch
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
                }`}
              >
                {isPrelaunch ? 'Phase 1 Active' : 'Phase 2 Active'}
              </span>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0] space-y-2 text-xs">
              <div className="font-medium text-[#131010] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#5a8210]" />
                Current Mode: {isPrelaunch ? 'Pre-launch Waitlist Mode' : 'Live E-Commerce Mode'}
              </div>
              <p className="text-xs text-[#524b42] leading-relaxed">
                {isPrelaunch
                  ? 'All prices, Add to Cart buttons, customer cart drawers, and direct checkout routes are strictly suppressed. Product pages render "Notify Me When Available" reservation forms and WhatsApp care consultation CTAs.'
                  : 'Full live e-commerce active. All 4-size fruity soap variants render prices, Paystack checkout is unlocked, customer accounts and order fulfillment are operational.'}
              </p>
            </div>
          </div>

          {/* Section 2: Store Identity & Formulator Profile */}
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold pb-3 border-b border-[#e5dcd0]">
              Brand &amp; Formulator Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5] space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block">
                  Store Legal Entity
                </span>
                <span className="font-medium text-[#131010] block">Empress Glow Emporium</span>
                <span className="text-[11px] text-[#7b7366]">Handcrafted Nigerian Botanical Skincare</span>
              </div>

              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5] space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block">
                  Founder &amp; Master Formulator
                </span>
                <span className="font-medium text-[#131010] block">Mary Asuquo</span>
                <span className="text-[11px] text-[#7b7366]">Artisan Soapmaker &bull; Abuja HQ</span>
              </div>

              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5] space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block">
                  Direct WhatsApp Care Hotline
                </span>
                <span className="font-mono text-xs text-[#131010] block">+234 803 565 0299</span>
                <span className="text-[11px] text-[#7b7366]">Skin Assessment Consultations</span>
              </div>

              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5] space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block">
                  Data Protection Officer (DPO)
                </span>
                <span className="font-mono text-xs text-[#131010] block">dpo@empressglowemporium.com</span>
                <span className="text-[11px] text-[#7b7366]">NDPA Compliance Monitored Inbox</span>
              </div>
            </div>
          </div>

          {/* Section 3: Nigerian Regulatory Standards (NAFDAC, NDPA, FCCPC, VAT) */}
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold pb-3 border-b border-[#e5dcd0]">
              Statutory Regulatory Compliance
            </h2>

            <div className="space-y-3">
              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5] flex items-start gap-3">
                <span className="text-base">⚖️</span>
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-[#131010] flex items-center gap-2">
                    NAFDAC Traditional Use Protocol
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#2d5508] bg-[#2d5508]/10 border border-[#2d5508]/30 px-1.5 py-0.5">
                      Strict Enforcement
                    </span>
                  </div>
                  <p className="text-xs text-[#524b42] leading-relaxed">
                    Mandatory disclaimer: &ldquo;These claims have not been evaluated by NAFDAC.&rdquo; Rendered on all product surfaces. No medical curative claims allowed.
                  </p>
                </div>
              </div>

              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5] flex items-start gap-3">
                <span className="text-base">🛡️</span>
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-[#131010] flex items-center gap-2">
                    FCCPC 7-Day Defective Product Return Guarantee
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#2d5508] bg-[#2d5508]/10 border border-[#2d5508]/30 px-1.5 py-0.5">
                      Compliant
                    </span>
                  </div>
                  <p className="text-xs text-[#524b42] leading-relaxed">
                    Refund policy: &ldquo;Refunds only for defective products within 7 days of delivery. Contact us via WhatsApp to initiate a return.&rdquo; Zero &ldquo;no refunds&rdquo; clauses permitted.
                  </p>
                </div>
              </div>

              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5] flex items-start gap-3">
                <span className="text-base">🔒</span>
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-[#131010] flex items-center gap-2">
                    NDPA Cookie Consent &amp; Privacy Standards
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#2d5508] bg-[#2d5508]/10 border border-[#2d5508]/30 px-1.5 py-0.5">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#524b42] leading-relaxed">
                    Explicit consent banner, timestamped records stored in database, zero tracking without consent, and one-click withdrawal link in footer.
                  </p>
                </div>
              </div>

              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5] flex items-start gap-3">
                <span className="text-base">💼</span>
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-[#131010] flex items-center gap-2">
                    FIRS Statutory VAT Exemption
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#2d5508] bg-[#2d5508]/10 border border-[#2d5508]/30 px-1.5 py-0.5">
                      Exempt
                    </span>
                  </div>
                  <p className="text-xs text-[#524b42] leading-relaxed">
                    Empress Glow Emporium qualifies under Nigerian small-business tax incentives. Zero VAT added at checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Integrations & Infrastructure */}
        <div className="lg:col-span-4 space-y-6">
          {/* Payment Gateway */}
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold pb-2 border-b border-[#e5dcd0]">
              Payment Infrastructure
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#131010]">Paystack Payments</span>
                  <span className="font-mono text-[9px] uppercase text-[#2d5508] font-bold">Enabled</span>
                </div>
                <p className="text-[11px] text-[#7b7366] leading-relaxed">
                  Settling in Nigerian Naira (NGN ₦). Webhooks configured as single source of truth for order fulfillment.
                </p>
              </div>

              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#131010]">InsForge Database</span>
                  <span className="font-mono text-[9px] uppercase text-[#2d5508] font-bold">Connected</span>
                </div>
                <p className="text-[11px] text-[#7b7366] leading-relaxed">
                  Postgres catalog, orders, waitlist subscribers, and customer profiles.
                </p>
              </div>

              <div className="p-3 border border-[#e5dcd0] bg-[#faf8f5]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#131010]">Transactional Email</span>
                  <span className="font-mono text-[9px] uppercase text-[#2d5508] font-bold">mail.empressglow...</span>
                </div>
                <p className="text-[11px] text-[#7b7366] leading-relaxed">
                  Order receipts and waitlist announcements sent via dedicated authenticated domain.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Help / Documentation */}
          <div className="bg-white border border-[#e5dcd0] p-6 space-y-3 text-xs">
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#131010] font-semibold pb-2 border-b border-[#e5dcd0]">
              System Documentation
            </h3>
            <p className="text-xs text-[#7b7366] leading-relaxed">
              For complete deployment instructions and backup/restore protocols, reference:
            </p>
            <ul className="space-y-1.5 font-mono text-[10px] text-[#2d5508]">
              <li>&bull; docs/architecture/backend.md</li>
              <li>&bull; docs/design/system.md</li>
              <li>&bull; docs/runbook/backup-restore.md</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
