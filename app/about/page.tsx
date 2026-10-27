import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { NafdacCaveat } from '@/components/ui/nafdac-caveat';
import { LocalBusinessSchema } from '@/components/seo/local-business-schema';

export const metadata: Metadata = {
  title: 'Our Story & Founder Mary Asuquo | Empress Glow Emporium',
  description:
    'Discover the story of Empress Glow Emporium, founded in Abuja by Mary Asuquo. Handcrafted Nigerian botanical skincare and fruit enzyme formulations designed for radiant melanin skin.',
};

export default function AboutPage() {
  const brandPillars = [
    {
      title: 'Biochemistry-Backed Botanical Formulations',
      description:
        'Rooted in founder Mary Asuquo’s biochemistry training, we harness bioactive enzymes from fresh papaya, avocado oil, plantain, and wild tropical botanicals to gently nourish and renew without harsh synthetics.',
    },
    {
      title: 'Formulated Specially for Melanin Skin',
      description:
        'African skin is naturally rich and sensitive to aggressive stripping. Our formulas prioritize cellular hydration, barrier restoration, and uniform luminosity without bleaching.',
    },
    {
      title: 'Ethical Nigerian Craftsmanship',
      description:
        'Proudly handcrafted in Abuja in artisanal small batches. We source indigenous botanicals sustainably from local growers, ensuring freshness and natural vitality.',
    },
    {
      title: 'Radical Care & Direct Consultation',
      description:
        'Skincare is personal. We never treat clients like order numbers. Every customer is invited to speak directly with Mary on WhatsApp for routine advice tailored to their exact skin type.',
    },
  ];

  const milestones = [
    {
      year: 'University Roots',
      title: 'The Biochemical Inception',
      description:
        'During her second year at university, biochemist Mary Asuquo observed young women continuously battling distressing skin issues—acne, hyperpigmentation, and blackheads. Driven by scientific inquiry and deep empathy, she began researching natural bioactive recipes to safely manage these conditions.',
    },
    {
      year: 'March 20, 2021',
      title: 'The First Handcrafted Batches',
      description:
        'Translating university research and biochemical knowledge of skin physiology into practice, Mary handcrafted the first signature batches of Empress Glow Fruity Soap in glass jars using fresh papaya, avocado, and living bioactive enzymes.',
    },
    {
      year: '2022',
      title: 'The WhatsApp Skin Community',
      description:
        'Word of mouth spread rapidly across Nigerian cities. Mary began holding direct 1-on-1 consultations on WhatsApp, guiding hundreds of women toward restorative, chemical-free rituals tailored to their skin barrier.',
    },
    {
      year: '2023 – 2024',
      title: 'Formulation of Supporting Essentials',
      description:
        'To complement the hero Fruity Soap, Mary engineered supporting botanical formulas: clarifying cleanser, balancing serum, barrier moisturizer, and mineral sunscreen.',
    },
    {
      year: '2026',
      title: 'Digital Expansion & NAFDAC Standardization',
      description:
        'Empress Glow formalizes corporate governance with CAC registration, prepares formulations for NAFDAC certification, and launches its digital prelaunch reservation platform.',
    },
  ];

  return (
    <div className="bg-[#f7f1e8] text-[#131010] min-h-screen">
      <LocalBusinessSchema />

      {/* Header */}
      <section className="border-b border-[#e5dcd0] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7b7366]">
            <Link href="/" className="hover:text-[#131010] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#131010]">Our Heritage</span>
          </div>

          <div className="max-w-3xl space-y-3 pt-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
              Founded March 20, 2021 • Abuja, Nigeria
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#131010] leading-tight">
              "...Own your spot."
            </h1>
            <p className="text-sm sm:text-base text-[#524b42] leading-relaxed max-w-2xl pt-1">
              Handcrafted Nigerian botanical skincare born from pure fruit enzymes, deep African heritage, and a devotion to natural melanin skin radiance.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story Split Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="border border-[#e5dcd0] bg-white grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Founder Image */}
          <div className="lg:col-span-5 relative min-h-[420px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-[#e5dcd0] bg-[#faf6f0]">
            <Image
              src="/images/mary-founder.jpg"
              alt="Mary Asuquo, Biochemist & Founder of Empress Glow Emporium"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center"
            />
            <div className="absolute bottom-6 left-6 bg-[#131010]/90 text-[#f7f1e8] font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 border border-white/10 backdrop-blur-sm">
              Mary Asuquo • Biochemist & Founder
            </div>
          </div>

          {/* Founder Narrative */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6 flex flex-col justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
              Origin & Scientific Purpose
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#131010] font-normal leading-snug">
              Bridging Biochemistry with Pure Botanical Radiance
            </h2>
            <div className="space-y-4 text-sm text-[#524b42] leading-relaxed">
              <p>
                Empress Glow Emporium was conceived during Mary Asuquo's second year at university. As a biochemistry student, Mary watched countless young women around her battling distressing skin challenges—persistent acne, stubborn hyperpigmentation, blackheads, and damaged skin barriers aggravated by harsh commercial bleaching products and peeling soaps.
              </p>
              <p>
                Recognizing the urgent need for safe, restorative care in the Nigerian beauty marketplace, her training in biochemistry pushed her into finding a scientific way to manage these skin conditions using natural bioactive recipes. Rather than stripping or altering melanin skin, she formulated nutrient-rich preparations using fresh cold-pressed African oils and living bio-enzymes from ripe papaya, avocado, banana, and cucumber.
              </p>
              <p>
                On March 20, 2021, that biochemical vision evolved into the handcrafted first batch of Empress Glow Fruity Soap in glass jars—grounded in barrier physiology and formulated to honor every shade of melanin.
              </p>
              <blockquote className="border-l-2 border-[#2d5508] pl-4 py-2 italic text-[#131010] font-serif text-base sm:text-lg my-4 bg-[#faf6f0]">
                "Healthy melanin skin does not come from stripping your barrier with harsh bleaches — it comes from understanding skin biochemistry and feeding it bioactive botanical nourishment."
                <footer className="font-mono text-[11px] text-[#7b7366] uppercase tracking-wider not-italic mt-2">
                  — Mary Asuquo, Biochemist & Founder
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Pillars Grid */}
      <section className="border-y border-[#e5dcd0] bg-[#faf6f0] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
              Our Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#131010]">
              What Empress Glow Stands For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brandPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="border border-[#e5dcd0] bg-white p-8 space-y-4 hover:border-[#131010] transition-colors"
              >
                <span className="font-mono text-xs text-[#2d5508] block">
                  Pillar 0{idx + 1}
                </span>
                <h3 className="font-serif text-2xl text-[#131010]">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#524b42] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
            Our Timeline
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#131010]">
            From Abuja Studio to National Sisterhood
          </h2>
        </div>

        <div className="border-l border-[#e5dcd0] ml-4 sm:ml-12 pl-6 sm:pl-10 space-y-12">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative space-y-2">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3 h-3 rounded-none bg-[#131010] border-2 border-[#f7f1e8]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#2d5508] block">
                {m.year}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#131010]">
                {m.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#524b42] leading-relaxed max-w-2xl">
                {m.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#e5dcd0]">
          <NafdacCaveat />
        </div>
      </section>

      {/* WhatsApp Consultation Footer CTA */}
      <section className="bg-[#131010] text-[#f7f1e8] py-16 px-4 sm:px-6 text-center border-t border-[#262220]">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a8210] block">
            Direct & Personal Support
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#f7f1e8]">
            Find the Right Natural Ritual for Your Skin
          </h2>
          <p className="text-xs sm:text-sm text-[#a89e90] leading-relaxed">
            Have questions about traditional botanical extracts or sensitive skin routines? Connect with Mary directly on WhatsApp for tailored advice.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/2348035650299"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f7f1e8] hover:bg-[#5a8210] text-[#131010] hover:text-white py-3.5 px-7 font-mono text-xs uppercase tracking-[0.2em] font-medium transition-colors"
            >
              <span>Speak with Mary on WhatsApp</span>
              <span>→</span>
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center border border-[#36312a] text-[#f7f1e8] hover:border-[#f7f1e8] py-3.5 px-7 font-mono text-xs uppercase tracking-[0.2em] transition-colors"
            >
              Explore All Formulations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
