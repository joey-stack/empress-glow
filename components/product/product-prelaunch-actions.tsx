'use client';

import React, { useState } from 'react';
import type { Product, ProductVariant } from '@/lib/insforge/queries';
import { NotifyMeDrawer } from '@/components/ui/notify-me-drawer';

interface ProductPrelaunchActionsProps {
  product: { id: string; name: string; slug: string; sku?: string };
  variants: { name: string; sku: string }[];
  whatsappInquiryUrl: string;
}

export function ProductPrelaunchActions({
  product,
  variants,
  whatsappInquiryUrl,
}: ProductPrelaunchActionsProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isHero = product.slug === 'empress-glow-fruity-soap';

  // Sizing lineup guidance
  const displaySizes =
    isHero || variants.length > 1
      ? variants.map((v) => ({
          name: v.name,
          sku: v.sku,
        }))
      : [
          { name: 'Standard Jar', sku: product.sku || 'EG-STD' },
        ];

  return (
    <>
      <div className="border border-[#e5dcd0] bg-white p-6 sm:p-8 space-y-6">
        {/* Status Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e5dcd0] font-mono text-xs uppercase tracking-wider">
          <span className="text-[#7b7366]">Waitlist Status</span>
          <span className="text-[#2d5508] font-medium flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5a8210] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2d5508]" />
            </span>
            Prelaunch Reservation Open
          </span>
        </div>

        {/* Informative Sizing Guidance (Zero Prices) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em]">
            <span className="text-[#7b7366]">Upcoming Formulation Sizes:</span>
            <span className="text-[#2d5508] font-medium">Available at Launch</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
            {displaySizes.map((size, idx) => (
              <div
                key={idx}
                className="border border-[#e5dcd0] py-2.5 px-1.5 bg-[#faf6f0] flex flex-col items-center justify-center space-y-0.5"
              >
                <span className="font-semibold text-[#131010] text-[11px] truncate w-full">
                  {size.name}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#7b7366]">
                  Artisanal Batch
                </span>
              </div>
            ))}
          </div>

          <p className="font-mono text-[10px] text-[#7b7366] text-center pt-0.5">
            Prices and direct ordering activate upon official launch.
          </p>
        </div>

        {/* Primary Prelaunch Conversion Actions */}
        <div className="space-y-3 pt-2">
          {/* Notify Me Slide-over Trigger */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="w-full bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.2em] py-4 px-6 text-center flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <span>✦</span>
            <span>Notify Me When Available</span>
          </button>

          {/* Direct WhatsApp Consultation */}
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center border border-[#131010] bg-transparent text-[#131010] hover:bg-[#131010] hover:text-[#f7f1e8] transition-colors py-4 px-6 font-mono text-xs uppercase tracking-[0.18em]"
          >
            Enquire with Mary on WhatsApp ↗
          </a>
        </div>

        {/* Prelaunch Guarantee / Dispatch Queue */}
        <div className="pt-2 border-t border-[#e5dcd0]/60 space-y-1.5 text-center">
          <p className="font-mono text-[11px] text-[#2d5508] font-medium uppercase tracking-wider">
            First Batch Priority
          </p>
          <p className="text-xs text-[#7b7366] leading-relaxed">
            Subscribers receive private 24-hour early access before public release.
          </p>
        </div>
      </div>

      {/* Slide-out waitlist reservation drawer */}
      <NotifyMeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        productSlug={product.slug}
        productName={product.name}
      />
    </>
  );
}
