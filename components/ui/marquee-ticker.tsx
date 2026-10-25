import React from 'react';

interface MarqueeTickerProps {
  items?: string[];
  className?: string;
}

const DEFAULT_ITEMS = [
  'Cold-Pressed Botanical Enzymes',
  'Handcrafted in Abuja, Nigeria',
  'Formulated for Melanin Skin Barrier',
  'Zero Synthetic Bleaches or Hydroquinone',
  'Artisanal Small-Batch Integrity',
  'One-on-One WhatsApp Skin Consultation',
];

export function MarqueeTicker({
  items = DEFAULT_ITEMS,
  className = '',
}: MarqueeTickerProps) {
  return (
    <div
      className={`relative w-full overflow-hidden border-y border-[#e5dcd0] bg-[#faf6f0] py-3 select-none ${className}`}
      aria-hidden="true"
    >
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* Render twice for continuous loop */}
        {[...items, ...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.25em] text-[#131010]">
            <span>{item}</span>
            <span className="text-[#2d5508] text-xs">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
