import React from 'react';

export function NafdacCaveat({ className = '' }: { className?: string }) {
  return (
    <div
      role="note"
      className={`border border-[#e5dcd0] bg-[#faf6f0] p-5 text-left text-xs text-[#524b42] leading-relaxed ${className}`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d5508] block mb-1.5 font-semibold">
        Regulatory Transparency Notice
      </span>
      <p className="font-mono text-[11px] leading-relaxed text-[#7b7366]">
        These claims have not been evaluated by NAFDAC. Empress Glow preparations are formulated from traditional West African botanical and fruit extracts and are not intended to diagnose, treat, cure, or prevent any medical disease or skin condition.
      </p>
    </div>
  );
}
