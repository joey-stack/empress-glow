'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NafdacCaveat } from '@/components/ui/nafdac-caveat';

type TabKey = 'shipping' | 'returns' | 'privacy' | 'terms' | 'regulatory';

export function PolicyTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('returns');

  const tabs: { key: TabKey; label: string; badge?: string }[] = [
    { key: 'returns', label: 'Returns & Refunds', badge: 'FCCPC' },
    { key: 'shipping', label: 'Shipping & Delivery' },
    { key: 'privacy', label: 'Privacy Policy', badge: 'NDPA 2023' },
    { key: 'terms', label: 'Terms of Service' },
    { key: 'regulatory', label: 'Regulatory Disclosures', badge: 'CAC / NAFDAC' },
  ];

  return (
    <div className="bg-white rounded-none border border-[#e5dcd0] overflow-hidden shadow-none">
      {/* Tab Navigation Strip */}
      <div className="border-b border-[#e5dcd0] bg-[#faf8f5] px-4 sm:px-8 pt-4 flex overflow-x-auto space-x-2 sm:space-x-4 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.key
                ? 'border-[#2d5508] text-[#2d5508] bg-white rounded-t-xl -mb-[1px]'
                : 'border-transparent text-[#6e6a5f] hover:text-[#131010]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-none font-mono ${
                  activeTab === tab.key
                    ? 'bg-[#2d5508]/10 text-[#2d5508]'
                    : 'bg-[#e5dcd0] text-[#6e6a5f]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Panes */}
      <div className="p-6 sm:p-10 lg:p-12 text-[#4a473f] text-sm sm:text-base leading-relaxed font-sans space-y-6">
        {/* 1. RETURNS & REFUNDS (FCCPC) */}
        {activeTab === 'returns' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-l-4 border-[#2d5508] bg-[#faf8f5] p-4 sm:p-6 rounded-r-2xl mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2d5508] block mb-1">
                Consumer Protection Guarantee (FCCPC Compliant)
              </span>
              <p className="font-serif text-lg sm:text-xl text-[#131010] font-normal leading-snug">
                "Refunds only for defective products within 7 days of delivery. Contact us via WhatsApp to initiate a return."
              </p>
            </div>

            <h3 className="font-serif text-2xl text-[#131010] font-normal">
              1. Defective Product Returns & Replacements
            </h3>
            <p className="text-[#7b7366]">
              Under the Federal Competition and Consumer Protection Act (FCCPA 2018), consumers have the right to receive goods of merchantable quality. If you receive an Empress Glow Emporium formulation that is damaged in transit, possesses a broken container seal, or exhibits a material defect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#7b7366]">
              <li>
                <strong>Notification Window:</strong> You must notify us within seven (7) calendar days of delivery confirmation.
              </li>
              <li>
                <strong>Evidence:</strong> Send a photograph or short video of the damaged item along with your delivery confirmation to our official WhatsApp care line.
              </li>
              <li>
                <strong>Resolution Choice:</strong> We will provide an immediate complimentary replacement dispatched via expedited courier, or issue a full refund to your original payment method.
              </li>
            </ul>

            <h3 className="font-serif text-2xl text-[#131010] font-normal pt-4">
              2. Hygiene & Unsealed Skincare Exclusions
            </h3>
            <p className="text-[#7b7366]">
              Because Empress Glow formulations are handcrafted botanical skincare products without synthetic formaldehyde preservatives, open jars and applied cosmetic containers cannot be returned for change of mind or personal scent preference once the protective safety seal has been broken, unless a verifiable manufacturing defect exists.
            </p>

            <h3 className="font-serif text-2xl text-[#131010] font-normal pt-4">
              3. Return Dispatch Procedure
            </h3>
            <p className="text-[#7b7366]">
              Return logistics within Abuja (FCT) will be coordinated directly by Empress Glow Emporium courier partners at our expense for all verified defective items. For deliveries outside Abuja, our WhatsApp care team will supply return drop-off instructions.
            </p>

            <div className="pt-6 border-t border-[#e5dcd0] flex items-center justify-between">
              <span className="text-xs text-[#7b7366]">FCCPA 2018 Statutory Compliance</span>
              <a
                href="https://wa.me/2348035650299"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#2d5508] hover:underline"
              >
                Initiate Return on WhatsApp →
              </a>
            </div>
          </div>
        )}

        {/* 2. SHIPPING & DELIVERY */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-serif text-2xl text-[#131010] font-normal">
              Nationwide Nigerian Delivery Policy
            </h3>
            <p className="text-[#7b7366]">
              Empress Glow Emporium handcrafts, packages, and dispatches all orders directly from our laboratory studio in Abuja, Nigeria.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-none bg-[#faf8f5] border border-[#e5dcd0]">
                <span className="font-serif text-lg text-[#131010] font-normal block mb-1">
                  Abuja Metropolitan Delivery
                </span>
                <span className="text-xs font-semibold text-[#2d5508] block mb-2">1 to 3 Business Days</span>
                <p className="text-xs text-[#7b7366] leading-relaxed">
                  Direct dispatch via local trusted courier service. Doorstep delivery across Island and Mainland.
                </p>
              </div>

              <div className="p-5 rounded-none bg-[#faf8f5] border border-[#e5dcd0]">
                <span className="font-serif text-lg text-[#131010] font-normal block mb-1">
                  Nationwide Interstate Delivery
                </span>
                <span className="text-xs font-semibold text-[#2d5508] block mb-2">3 to 7 Business Days</span>
                <p className="text-xs text-[#7b7366] leading-relaxed">
                  Dispatched via verified interstate logistics partners (Abuja, Port Harcourt, Ibadan, Kano, and all 36 states).
                </p>
              </div>
            </div>

            <h3 className="font-serif text-2xl text-[#131010] font-normal pt-4">
              Pre-Launch Notice
            </h3>
            <p className="text-[#7b7366]">
              During our Pre-Launch Mode, public purchasing is paused while regulatory standardization is finalized. You may join the waitlist for notifications, or arrange custom pre-launch sample shipments directly with Mary on WhatsApp.
            </p>

            <div className="pt-6 border-t border-[#e5dcd0]">
              <a
                href="https://wa.me/2348035650299"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#2d5508] hover:underline"
              >
                Inquire About Delivery Details on WhatsApp →
              </a>
            </div>
          </div>
        )}

        {/* 3. PRIVACY POLICY (NDPA 2023) */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-l-4 border-[#2d5508] bg-[#faf8f5] p-4 sm:p-6 rounded-r-2xl mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2d5508] block mb-1">
                Nigeria Data Protection Act (NDPA 2023) Compliant
              </span>
              <p className="text-xs sm:text-sm text-[#7b7366]">
                Empress Glow Emporium respects and defends your privacy rights. Our Data Protection Officer can be reached directly at{' '}
                <a href="mailto:dpo@empressglowemporium.com" className="font-semibold text-[#131010] underline">
                  dpo@empressglowemporium.com
                </a>.
              </p>
            </div>

            <h3 className="font-serif text-2xl text-[#131010] font-normal">
              1. Identity of the Data Controller
            </h3>
            <p className="text-[#7b7366]">
              Empress Glow Emporium operates as a registered Nigerian business entity headquartered in Abuja, Nigeria. We act as the Data Controller responsible for processing personal data collected on empressglowemporium.com.
            </p>

            <h3 className="font-serif text-2xl text-[#131010] font-normal pt-4">
              2. Data We Collect & Lawful Basis
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-[#7b7366]">
              <li>
                <strong>Waitlist & Newsletter Data:</strong> Email address, optional name, and product slug of interest (Lawful basis: Consent).
              </li>
              <li>
                <strong>Order & Customer Care Data:</strong> Delivery recipient name, shipping address, WhatsApp phone number, and transaction references (Lawful basis: Contractual necessity).
              </li>
              <li>
                <strong>Technical Cookies:</strong> Essential session cookies and analytics (subject to non-pre-ticked cookie consent).
              </li>
            </ul>

            <h3 className="font-serif text-2xl text-[#131010] font-normal pt-4">
              3. Data Retention Schedule
            </h3>
            <p className="text-[#7b7366]">
              Commercial order records and invoices are retained for exactly six (6) years to comply with statutory Nigerian tax and accounting requirements (Federal Inland Revenue Service standards), after which they are irreversibly anonymized or purged. Marketing subscriber records are retained until consent is explicitly withdrawn.
            </p>

            <h3 className="font-serif text-2xl text-[#131010] font-normal pt-4">
              4. Authorized Sub-Processors
            </h3>
            <p className="text-[#7b7366]">
              We share minimum required data strictly with certified infrastructure partners: InsForge (database), Paystack (PCI-DSS certified payment gateway), Resend (transactional email routing), and Vercel (secure edge cloud hosting). We never sell or lease user data to third-party advertisers.
            </p>

            <h3 className="font-serif text-2xl text-[#131010] font-normal pt-4">
              5. Your Statutory Rights as a Data Subject
            </h3>
            <p className="text-[#7b7366]">
              Under Part V of the NDPA 2023, you have the right to request a copy of your personal data, rectify inaccuracies, request erasure ("right to be forgotten"), and object to unsolicited messages. To exercise these rights, email our DPO at{' '}
              <a href="mailto:dpo@empressglowemporium.com" className="text-[#2d5508] font-semibold underline">
                dpo@empressglowemporium.com
              </a>.
            </p>
          </div>
        )}

        {/* 4. TERMS OF SERVICE */}
        {activeTab === 'terms' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-serif text-2xl text-[#131010] font-normal">
              Empress Glow Emporium Terms of Service
            </h3>
            <p className="text-[#7b7366]">
              Welcome to Empress Glow Emporium. By accessing or using our platform and WhatsApp channels, you agree to comply with and be bound by the following terms.
            </p>

            <h3 className="font-serif text-2xl text-[#131010] font-normal pt-4">
              1. Digital Economy & E-Commerce Standards (Section 39)
            </h3>
            <p className="text-[#7b7366]">
              In accordance with Section 39 of the Nigerian Digital Economy and E-Governance legal framework:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#7b7366]">
              <li>Full transparent pricing in Nigerian Naira (₦) with zero hidden fees is provided prior to transaction completion.</li>
              <li>Customers retain clear cancellation rights and access to an online dispute mechanism via our dedicated WhatsApp resolution channel.</li>
              <li>You may opt out of promotional messages at any time.</li>
            </ul>

            <h3 className="font-serif text-2xl text-[#131010] font-normal pt-4">
              2. Intellectual Property
            </h3>
            <p className="text-[#7b7366]">
              The brand name "Empress Glow Emporium", our signature tagline "...Own your spot.", logos, product packaging mockups, botanical descriptions, and editorial articles are protected intellectual property.
            </p>

            <h3 className="font-serif text-2xl text-[#131010] font-normal pt-4">
              3. Governing Law & Jurisdiction
            </h3>
            <p className="text-[#7b7366]">
              These terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes that cannot be settled amicably shall be submitted to the exclusive jurisdiction of the competent courts of the Federal Capital Territory (Abuja).
            </p>
          </div>
        )}

        {/* 5. REGULATORY DISCLOSURES */}
        {activeTab === 'regulatory' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-serif text-2xl text-[#131010] font-normal">
              Corporate & Regulatory Disclosures
            </h3>
            <p className="text-[#7b7366]">
              Empress Glow Emporium operates with utmost transparency and compliance under Nigerian commercial and public health laws:
            </p>

            <div className="space-y-4 my-6">
              <div className="p-5 rounded-none bg-[#faf8f5] border border-[#e5dcd0]">
                <span className="font-semibold text-xs text-[#131010] uppercase tracking-wider block mb-1">
                  1. Corporate Affairs Commission (CAC)
                </span>
                <p className="text-xs text-[#7b7366] leading-relaxed">
                  Empress Glow Emporium is a legally registered Nigerian enterprise in Abuja (FCT) under the Companies and Allied Matters Act (CAMA).
                </p>
              </div>

              <div className="p-5 rounded-none bg-[#faf8f5] border border-[#e5dcd0]">
                <span className="font-semibold text-xs text-[#131010] uppercase tracking-wider block mb-1">
                  2. Value Added Tax (VAT) Exemption
                </span>
                <p className="text-xs text-[#7b7366] leading-relaxed">
                  Empress Glow Emporium is exempt from Value Added Tax under the Nigerian Finance Act micro-enterprise provisions (annual turnover below ₦50,000,000 threshold). Consequently, zero VAT is assessed or added to customer orders.
                </p>
              </div>

              <div className="p-5 rounded-none bg-[#faf8f5] border border-[#e5dcd0]">
                <span className="font-semibold text-xs text-[#131010] uppercase tracking-wider block mb-1">
                  3. NAFDAC Regulatory Notice
                </span>
                <p className="text-xs text-[#7b7366] leading-relaxed mb-3">
                  Our formulations are prepared for traditional botanical skincare nourishment. Empress Glow Emporium does not make therapeutic claims:
                </p>
                <NafdacCaveat />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
