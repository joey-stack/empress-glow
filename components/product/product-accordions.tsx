'use client';

import React, { useState } from 'react';

interface ProductAccordionsProps {
  ingredients?: string[];
  productName: string;
}

export function ProductAccordions({ ingredients = [], productName }: ProductAccordionsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    ingredients: true, // open first section by default
    ritual: false,
    craftsmanship: false,
    shipping_returns: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const defaultIngredients =
    ingredients && ingredients.length > 0
      ? ingredients
      : [
          'Carica Papaya (Wild Papaya Fruit Enzymes)',
          'Musa Paradisiacum (Plantain & Banana Ash Extract)',
          'Cucumis Sativus (Fresh Cucumber Juice)',
          'Persea Americana (Cold-Pressed Avocado Lipid)',
          'Wild African Forest Berries Extract',
          'Pure Distilled Rainwater Infusion',
          'Natural Botanical Essential Oils',
        ];

  return (
    <div className="border-t border-[#e5dcd0] divide-y divide-[#e5dcd0]">
      {/* 1. Botanical Ingredients & Actives */}
      <div className="py-4.5">
        <button
          type="button"
          onClick={() => toggleSection('ingredients')}
          className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-hidden"
          aria-expanded={openSections.ingredients}
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] font-medium text-[#131010] group-hover:text-[#2d5508] transition-colors">
            Botanical Ingredients & Actives
          </span>
          <span className="font-mono text-base text-[#131010] group-hover:text-[#2d5508] transition-transform duration-200">
            {openSections.ingredients ? '−' : '+'}
          </span>
        </button>

        {openSections.ingredients && (
          <div className="pt-3.5 space-y-3 text-xs text-[#524b42] leading-relaxed animate-fadeIn">
            <p>
              Cold-pressed with fresh fruit enzymes and unrefined plant lipids traditionally revered for skin replenishment, softening, and clarifying melanin skin tone:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              {defaultIngredients.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#faf6f0] p-2 border border-[#e5dcd0]/60">
                  <span className="text-[#2d5508] font-bold">✦</span>
                  <span className="text-[#131010]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-mono text-[10px] text-[#7b7366] pt-1">
              *Formulated without hydroquinone, synthetic bleaching agents, sulfates, or parabens.
            </p>
          </div>
        )}
      </div>

      {/* 2. Melanin Barrier Application Ritual */}
      <div className="py-4.5">
        <button
          type="button"
          onClick={() => toggleSection('ritual')}
          className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-hidden"
          aria-expanded={openSections.ritual}
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] font-medium text-[#131010] group-hover:text-[#2d5508] transition-colors">
            Melanin Barrier Application Ritual
          </span>
          <span className="font-mono text-base text-[#131010] group-hover:text-[#2d5508] transition-transform duration-200">
            {openSections.ritual ? '−' : '+'}
          </span>
        </button>

        {openSections.ritual && (
          <div className="pt-3.5 space-y-3 text-xs text-[#524b42] leading-relaxed animate-fadeIn">
            <div className="space-y-2">
              <p>
                <strong>Daily Morning & Evening Ritual:</strong> Wet skin thoroughly with lukewarm water. Scoop a small portion of the whipped gel into damp palms or a soft sponge and create a dense, fragrant botanical foam.
              </p>
              <p>
                <strong>The 60-Second Enzyme Window:</strong> Gently massage across face, neck, or body in upward circular motions for 60 seconds without scrubbing. Let the natural fruit enzymes dissolve daily buildup gently while nourishing your lipid barrier. Rinse clean.
              </p>
              <p>
                <strong>For Knuckles & Darker Areas:</strong> Apply directly with fingertips and let rest for 90 seconds before rinsing. Follow with Empress Glow Restorative Serum or pure botanical oil while skin is still damp.
              </p>
            </div>
            <div className="bg-[#faf6f0] p-3 border border-[#e5dcd0] font-mono text-[11px] text-[#2d5508]">
              Traditional botanical practice: consistency over aggression. Never scrub irritated or inflamed skin.
            </div>
          </div>
        )}
      </div>

      {/* 3. Artisanal Nigerian Craftsmanship */}
      <div className="py-4.5">
        <button
          type="button"
          onClick={() => toggleSection('craftsmanship')}
          className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-hidden"
          aria-expanded={openSections.craftsmanship}
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] font-medium text-[#131010] group-hover:text-[#2d5508] transition-colors">
            Artisanal Nigerian Heritage & Standards
          </span>
          <span className="font-mono text-base text-[#131010] group-hover:text-[#2d5508] transition-transform duration-200">
            {openSections.craftsmanship ? '−' : '+'}
          </span>
        </button>

        {openSections.craftsmanship && (
          <div className="pt-3.5 space-y-2.5 text-xs text-[#524b42] leading-relaxed animate-fadeIn">
            <p>
              Each jar of {productName} is hand-batched in small artisanal runs founded by Mary Asuquo in Abuja, Nigeria, using ethically harvested agricultural botanicals sourced directly from Nigerian growers.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="border border-[#e5dcd0] p-2.5 bg-white">
                <span className="text-[#2d5508] block font-semibold mb-0.5">Cold Processed</span>
                <span className="text-[#7b7366] text-[10px]">Active enzymes preserved without heat degradation</span>
              </div>
              <div className="border border-[#e5dcd0] p-2.5 bg-white">
                <span className="text-[#2d5508] block font-semibold mb-0.5">Cruelty-Free</span>
                <span className="text-[#7b7366] text-[10px]">Zero animal testing; verified skin harmony</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Shipping & Returns (FCCPC Compliant) */}
      <div className="py-4.5">
        <button
          type="button"
          onClick={() => toggleSection('shipping_returns')}
          className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-hidden"
          aria-expanded={openSections.shipping_returns}
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] font-medium text-[#131010] group-hover:text-[#2d5508] transition-colors">
            Dispatch, Delivery & FCCPC Returns
          </span>
          <span className="font-mono text-base text-[#131010] group-hover:text-[#2d5508] transition-transform duration-200">
            {openSections.shipping_returns ? '−' : '+'}
          </span>
        </button>

        {openSections.shipping_returns && (
          <div className="pt-3.5 space-y-3 text-xs text-[#524b42] leading-relaxed animate-fadeIn">
            <p>
              <strong>Nationwide Dispatch:</strong> Orders are dispatched from our Abuja center via verified courier partners across Abuja (same/next day), Lagos (1-2 days), and interstate nationwide (2-4 days).
            </p>
            <div className="p-3 bg-[#faf6f0] border border-[#e5dcd0] space-y-1">
              <span className="font-mono text-[11px] font-semibold text-[#131010] block uppercase tracking-wider">
                FCCPC Statutory Defective Refund Guarantee:
              </span>
              <p className="text-[11px] text-[#524b42]">
                Refunds only for defective products within 7 days of delivery. Contact us via WhatsApp to initiate a return.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
