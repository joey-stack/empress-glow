import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PolicyTabs } from '@/components/ui/policy-tabs';
import { NafdacCaveat } from '@/components/ui/nafdac-caveat';

export const metadata: Metadata = {
  title: 'Commercial Policies & Consumer Protection | Empress Glow Emporium',
  description:
    'Review Empress Glow Emporium commercial policies: FCCPC-compliant 7-day defective returns, NDPA 2023 privacy rights, VAT exemption disclosures, and terms of service.',
};

export default function PoliciesPage() {
  const regulatoryBadges = [
    { title: 'CAC Registered', subtitle: 'Abuja, Nigeria Entity', color: 'text-[#2d5508]' },
    { title: 'FCCPC Compliant', subtitle: '7-Day Return Guarantee', color: 'text-[#2d5508]' },
    { title: 'NDPA 2023 Regulated', subtitle: 'DPO Supervised', color: 'text-[#2d5508]' },
    { title: 'VAT Exempt', subtitle: 'Zero Tax Added', color: 'text-[#2d5508]' },
  ];

  return (
    <div className="bg-[#f7f1e8] py-12 lg:py-20 text-[#131010]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-[#7b7366] mb-10 font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#131010] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#131010]">Commercial Policies</span>
        </nav>

        {/* 1. Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
            Transparency & Trust
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#131010] mb-4">
            Commercial Policies & Legal Rights
          </h1>
          <p className="text-sm sm:text-base text-[#7b7366] leading-relaxed">
            Empress Glow Emporium is committed to ethical trade, full consumer rights protection, and transparent regulatory disclosure under Nigerian law.
          </p>
          <p className="text-xs text-[#7b7366] mt-4 font-mono">
            Last Revised: March 2026 • Governed by the Laws of the Federal Republic of Nigeria
          </p>
        </div>

        {/* 2. Regulatory Badge Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {regulatoryBadges.map((badge, idx) => (
            <div
              key={idx}
              className="bg-white rounded-none border border-[#e5dcd0] p-5 text-center shadow-none"
            >
              <span className={`font-serif text-lg font-semibold block mb-1 ${badge.color}`}>
                {badge.title}
              </span>
              <span className="text-xs text-[#7b7366] uppercase tracking-wider font-medium">
                {badge.subtitle}
              </span>
            </div>
          ))}
        </div>

        {/* 3. Interactive Policy Tabs Viewer */}
        <div className="mb-12">
          <PolicyTabs />
        </div>

        {/* Mandatory Regulatory Caveat */}
        <div className="max-w-3xl mx-auto mb-16">
          <NafdacCaveat className="shadow-none bg-white" />
        </div>

        {/* 4. Direct Legal & Support Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-none border border-[#e5dcd0] p-8 shadow-none">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
              Privacy & Data Rights
            </span>
            <h3 className="font-serif text-xl text-[#131010] font-normal mb-2">
              Data Protection Officer (DPO)
            </h3>
            <p className="text-xs sm:text-sm text-[#7b7366] leading-relaxed mb-6">
              For personal data inquiries, subject access requests, correction, or erasure under the NDPA 2023, contact our monitored DPO inbox:
            </p>
            <a
              href="mailto:dpo@empressglowemporium.com"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#2d5508] hover:underline"
            >
              dpo@empressglowemporium.com →
            </a>
          </div>

          <div className="bg-white rounded-none border border-[#e5dcd0] p-8 shadow-none">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
              Consumer Support
            </span>
            <h3 className="font-serif text-xl text-[#131010] font-normal mb-2">
              Online Dispute Resolution
            </h3>
            <p className="text-xs sm:text-sm text-[#7b7366] leading-relaxed mb-6">
              Experiencing an issue with a delivery or defective product? Connect with our dedicated dispute resolution line on WhatsApp:
            </p>
            <a
              href="https://wa.me/2348035650299"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#2d5508] hover:underline"
            >
              Open WhatsApp Resolution (+234 803 565 0299) →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
