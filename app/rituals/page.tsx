import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { NafdacCaveat } from '@/components/ui/nafdac-caveat';

export const metadata: Metadata = {
  title: 'Botanical Skincare Rituals | Empress Glow Emporium',
  description:
    'Discover traditional West African botanical skincare rituals designed to honor and nourish melanin skin barrier wellness morning and evening.',
};

export default function RitualsPage() {
  const rituals = [
    {
      time: 'Morning Ritual',
      title: 'Awaken & Shield',
      objective: 'Gentle enzymatic renewal and atmospheric barrier protection for all-day radiance.',
      steps: [
        {
          number: '01',
          name: 'Fruit Enzyme Cleanse',
          product: 'Empress Glow Fruity Soap',
          instruction:
            'Lather a small portion of the fruity soap between wet palms until a rich, dense cream forms. Gently massage across face and neck in circular motions for 45–60 seconds, allowing bioactive papaya enzymes to dissolve morning buildup without stripping natural oils.',
        },
        {
          number: '02',
          name: 'Cellular Hydration',
          product: 'Botanical Hydrating Essence',
          instruction:
            'Press fresh cucumber and botanical floral water into damp skin. Pat gently with fingertips to flood melanin skin cells with deep humectants before applying lipid layers.',
        },
        {
          number: '03',
          name: 'Barrier Seal & Mineral Guard',
          product: 'Protective Day Cream & Mineral SPF',
          instruction:
            'Seal hydration with a lightweight plant-lipid emulsion and finish with broad-spectrum mineral protection to prevent hyperpigmentation caused by tropical sun exposure.',
        },
      ],
    },
    {
      time: 'Evening Ritual',
      title: 'Restore & Replenish',
      objective: 'Deep cellular calm, environmental detoxification, and nocturnal lipid barrier rebuilding.',
      steps: [
        {
          number: '01',
          name: 'Deep Cleansing & Reset',
          product: 'Empress Glow Fruity Soap',
          instruction:
            'Wash away daily particulate matter, sweat, and sunscreen using lukewarm water. Rinse thoroughly with soft water, patting dry with a clean linen cloth without rubbing.',
        },
        {
          number: '02',
          name: 'Enzyme Treatment',
          product: 'Restorative Fruit Serum',
          instruction:
            'Apply 3–4 drops of cold-pressed papaya and avocado seed extract. Let absorb for 2 minutes to assist natural overnight skin renewal and textural refinement.',
        },
        {
          number: '03',
          name: 'Overnight Barrier Comfort',
          product: 'Rich Botanical Night Balm',
          instruction:
            'Warm a pea-sized amount between clean hands and gently press over high points of cheekbones and dry areas to lock in restorative moisture through the night.',
        },
      ],
    },
    {
      time: 'Weekly Ritual',
      title: 'The Weekend Polish',
      objective: 'A gentle 5-minute traditional fruit enzyme mask for enhanced luminosity.',
      steps: [
        {
          number: '01',
          name: 'Warm Towel Compress',
          product: 'Pure Warm Compress',
          instruction:
            'Steam face briefly with a warm, damp towel for 1–2 minutes to soften the stratum corneum and prepare pores for enzyme activity.',
        },
        {
          number: '02',
          name: 'Enzyme Mask Application',
          product: 'Empress Glow Fruity Soap Lather',
          instruction:
            'Build a thick, velvety foam and leave on face as a mild botanical enzyme mask for exactly 2–3 minutes. Rinse with cool water to reveal clean, radiant skin.',
        },
        {
          number: '03',
          name: 'Intensive Nourishment',
          product: 'Pure Botanical Elixir',
          instruction:
            'Generously apply botanical lipids and rest, allowing the skin to breathe in natural, unadulterated plant goodness.',
        },
      ],
    },
  ];

  return (
    <div className="bg-[#f7f1e8] min-h-screen text-[#131010]">
      {/* Header */}
      <section className="border-b border-[#e5dcd0] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7b7366]">
            <Link href="/" className="hover:text-[#131010] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#131010]">Rituals</span>
          </div>

          <div className="max-w-3xl space-y-3 pt-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
              Melanin Barrier Care • Daily Regimens
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#131010] leading-tight">
              Skincare Rituals for Lasting Radiance
            </h1>
            <p className="text-sm sm:text-base text-[#524b42] leading-relaxed max-w-2xl pt-1">
              Skincare is not an aggressive routine—it is a patient, restorative ritual. Our daily methods harmonize traditional African fruit enzyme extraction with the biology of melanin-rich skin.
            </p>
          </div>
        </div>
      </section>

      {/* Rituals Detailed Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
        {rituals.map((ritual, idx) => (
          <div
            key={idx}
            className="border border-[#e5dcd0] bg-white p-6 sm:p-12 space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#e5dcd0] pb-6 gap-4">
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508]">
                  {ritual.time}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#131010]">
                  {ritual.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#7b7366] max-w-md font-mono">
                {ritual.objective}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ritual.steps.map((step) => (
                <div key={step.number} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e5dcd0] pb-2">
                    <span className="font-mono text-xs font-semibold text-[#2d5508]">
                      Step {step.number}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-[#7b7366]">
                      {step.product}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-[#131010]">
                    {step.name}
                  </h3>
                  <p className="text-xs text-[#524b42] leading-relaxed pt-1">
                    {step.instruction}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-[#e5dcd0] pt-8">
          <NafdacCaveat />
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="bg-[#131010] text-[#f7f1e8] py-16 px-4 sm:px-6 text-center border-t border-[#262220]">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a8210] block">
            Custom Consultation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#f7f1e8]">
            Need a Personalized Routine?
          </h2>
          <p className="text-xs sm:text-sm text-[#a89e90] max-w-xl mx-auto leading-relaxed">
            Every skin barrier is unique. Talk to Mary Asuquo directly on WhatsApp to calibrate these rituals to your exact sensitivity and lifestyle.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/2348035650299"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f7f1e8] hover:bg-[#5a8210] text-[#131010] hover:text-white py-3.5 px-7 font-mono text-xs uppercase tracking-[0.2em] font-medium transition-colors"
            >
              <span>Chat with Mary on WhatsApp</span>
              <span>→</span>
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center border border-[#36312a] text-[#f7f1e8] hover:border-[#f7f1e8] py-3.5 px-7 font-mono text-xs uppercase tracking-[0.2em] transition-colors"
            >
              View All Formulations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
