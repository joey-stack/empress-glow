import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { NafdacCaveat } from '@/components/ui/nafdac-caveat';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Empress Glow Emporium',
  description:
    'Common questions about Empress Glow handcrafted Nigerian fruit enzyme formulations, melanin skin barrier health, prelaunch waitlist, and WhatsApp consultations.',
};

export default function FaqPage() {
  const faqItems = [
    {
      category: 'Ingredients & Formulation',
      question: 'What makes Empress Glow fruit enzymes different from ordinary soaps?',
      answer:
        'Unlike commercial soaps crafted with harsh detergents or tallow, Empress Glow formulations are handcrafted using real Nigerian fruit enzymes (Carica Papaya, Avocado, Plantain, and tropical berry extracts). These bio-enzymes gently loosen dull, dead surface cells without stripping the protective sebum layer, preserving natural moisture and luminosity.',
    },
    {
      category: 'Skin Biology & Melanin Care',
      question: 'Are these formulations safe and suitable for sensitive melanin-rich skin?',
      answer:
        'Yes. African skin possesses a higher density of melanin and compact stratum corneum, but is uniquely prone to post-inflammatory hyperpigmentation when stripped with aggressive chemicals. Our formulations respect biological skin pH (approx. 5.5) and focus on nourishment rather than irritation.',
    },
    {
      category: 'Ingredient Transparency',
      question: 'Do any of your products contain bleaching agents or hydroquinone?',
      answer:
        'Never. We hold a strict zero-tolerance policy against hydroquinone, steroids, mercury, and synthetic bleaching agents. Our philosophy is founded on natural, authentic skin radiance and long-term barrier health. As Mary Asuquo affirms: "....Own your spot."',
    },
    {
      category: 'Prelaunch & Ordering',
      question: 'How does the Pre-Launch Waitlist work?',
      answer:
        'During our prelaunch phase, batches are handcrafted in limited allocations in Abuja. By entering your email via any "Notify Me When Available" button, you reserve priority dispatch notification the moment your selected size is packaged. You will receive an exclusive launch notification link.',
    },
    {
      category: 'Product Specifications',
      question: 'What sizes are available for the signature Empress Glow Fruity Soap?',
      answer:
        'Our hero Fruity Soap comes in four distinct sizes: Small (150g), Medium (250g), Large (350g), and Extra Large (500g). Each size is hand-poured into our signature artisan jar.',
    },
    {
      category: 'Direct Consultation',
      question: 'How do I arrange a personalized consultation with Mary Asuquo?',
      answer:
        'You can reach Mary directly on WhatsApp via +234 803 565 0299. Mary offers one-on-one routine advice to help you select the ideal complementary regimen for your skin’s specific needs and local climate.',
    },
    {
      category: 'Policies & Returns',
      question: 'What is your refund policy?',
      answer:
        'In strict compliance with the Federal Competition and Consumer Protection Commission (FCCPC), refunds or replacements are provided for defective products reported within 7 days of verified delivery. Please contact us directly on WhatsApp to initiate return verification.',
    },
    {
      category: 'Regulatory Transparency',
      question: 'Has this product been evaluated by NAFDAC?',
      answer:
        'No. These formulations are prepared using traditional West African botanical ingredients. These claims have not been evaluated by NAFDAC to diagnose, cure, treat, or prevent any medical condition.',
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
            <span className="text-[#131010]">FAQ</span>
          </div>

          <div className="max-w-3xl space-y-3 pt-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
              Knowledge & Client Care
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#131010] leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-[#524b42] leading-relaxed max-w-2xl pt-1">
              Everything you need to know about our cold-pressed Nigerian botanical formulations, melanin skin barrier health, prelaunch allocations, and customer care.
            </p>
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
        <FaqAccordion items={faqItems} />

        <div className="pt-8 border-t border-[#e5dcd0]">
          <NafdacCaveat />
        </div>
      </section>

      {/* WhatsApp Help Banner */}
      <section className="bg-[#131010] text-[#f7f1e8] py-16 px-4 sm:px-6 text-center border-t border-[#262220]">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a8210] block">
            Still Have Questions?
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f7f1e8]">
            We're Available on WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-[#a89e90] leading-relaxed">
            Send us a direct message anytime. Mary and the Empress Glow team respond personally to every inquiry.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/2348035650299"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f7f1e8] hover:bg-[#5a8210] text-[#131010] hover:text-white py-3.5 px-7 font-mono text-xs uppercase tracking-[0.2em] font-medium transition-colors"
            >
              <span>Message Us on WhatsApp</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
