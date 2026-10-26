import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { NafdacCaveat } from '@/components/ui/nafdac-caveat';

export const metadata: Metadata = {
  title: 'Skincare Consultation with Mary Asuquo | Empress Glow Emporium',
  description:
    'Book a 1-on-1 personalized Nigerian botanical skincare consultation directly on WhatsApp with founder and biochemist Mary Asuquo (₦5,000 fee). Nourishing melanin-first routines.',
};

export default function ConsultationPage() {
  const steps = [
    {
      number: '01',
      title: 'Direct WhatsApp Connection',
      description:
        'Initiate a 1-on-1 chat directly with founder Mary Asuquo. No automated chatbots, no call centers — just authentic, knowledgeable skincare guidance.',
      action: 'wa.me/2348035650299',
    },
    {
      number: '02',
      title: 'Skin Analysis & Barrier Review',
      description:
        'Share your current routine, skincare concerns, and environmental exposure in the Nigerian climate. Mary evaluates your skin barrier health and sensitivities.',
      action: 'Natural Lighting Assessment',
    },
    {
      number: '03',
      title: 'Tailored Botanical Ritual',
      description:
        'Receive a custom step-by-step regimen formulated with pure fruit enzymes, nourishing African plant oils, and gentle barrier-restorative botanicals.',
      action: 'Tailored Regimen Plan',
    },
  ];

  const concerns = [
    {
      name: 'Melanin Hyperpigmentation & Spot Balancing',
      description:
        'Gentle botanical brightening using Carica Papaya enzymes and plantain extracts that work in harmony with your natural melanin without bleach or steroids.',
      botanical: 'Papaya Enzymes & Fruit Acids',
    },
    {
      name: 'Compromised Skin Barrier & Chronic Dryness',
      description:
        'Deep restorative cellular lipid replacement using cold-pressed Persea Americana (Avocado) oil and moisture-locking African botanicals.',
      botanical: 'Cold-Pressed Avocado Oil',
    },
    {
      name: 'Blemish Prone & Sensitive Reactive Skin',
      description:
        'Calming, anti-inflammatory support formulated with cooling cucumber juice and soothing botanical oils to balance oil production without flaking.',
      botanical: 'Cucumber Juice & Calendula',
    },
    {
      name: 'African Climate & Sun Defense',
      description:
        'Protecting vulnerable melanin cells against intense tropical UV radiation and urban humidity while leaving zero chalky white cast.',
      botanical: 'Zinc Oxide & Antioxidant Berries',
    },
  ];

  const faqs = [
    {
      question: 'What is the fee for a 1-on-1 skincare consultation with Mary?',
      answer:
        'One-on-one personalized consultations are ₦5,000. Mary conducts an in-depth review of your skin barrier, daily routine, climate exposure, and issues like acne, hyperpigmentation, or blackheads, providing a dedicated, biochemist-formulated routine tailored directly to you.',
    },
    {
      question: 'How quickly does Mary respond?',
      answer:
        'Consultations run Monday through Saturday, 9:00 AM to 6:00 PM WAT. Inquiries sent during business hours are typically answered within 1 to 2 hours.',
    },
    {
      question: 'What information should I provide during my consultation?',
      answer:
        'Clear, unedited photos of your face in natural daylight (makeup-free), a list of products you currently apply morning and night, and any skin sensitivities or allergies.',
    },
    {
      question: 'Can I browse available formulations before chatting?',
      answer:
        'Absolutely. You can explore our pre-launch showcase here on the website or view our verified WhatsApp Catalog at https://wa.me/c/2348035650299.',
    },
  ];

  const encodedWhatsAppUrl = `https://wa.me/2348035650299?text=${encodeURIComponent(
    'Hello Mary, I would like to book a 1-on-1 skincare consultation (₦5,000).'
  )}`;

  return (
    <div className="bg-[#faf8f5] py-12 lg:py-20 text-[#131010]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-[#7b7366] mb-10 font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#131010] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#131010]">Skincare Consultation</span>
        </nav>

        {/* 1. Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#f0f5ea] text-[#2d5508] text-xs font-semibold tracking-wider uppercase mb-6">
            <span>🌿 1-on-1 Expert Advisory • ₦5,000 Consultation Fee</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#131010] mb-6 leading-tight">
            Your Skin Journey Begins with an Expert
          </h1>
          <p className="text-base sm:text-lg text-[#7b7366] leading-relaxed font-sans mb-8">
            Stop guessing with harsh chemicals. Speak directly with Empress Glow founder and biochemist Mary Asuquo on WhatsApp for honest, science-backed botanical guidance crafted specifically for your skin (₦5,000 consultation fee).
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={encodedWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#2d5508] hover:bg-[#1e3b05] text-white font-medium text-sm rounded-none transition-all shadow-none flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              Book Consultation (₦5,000)
            </a>
            <a
              href="https://wa.me/c/2348035650299"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#faf8f5] text-[#131010] border border-[#e5dcd0] font-medium text-sm rounded-none transition-all shadow-none flex items-center justify-center gap-2"
            >
              Browse WhatsApp Catalog →
            </a>
          </div>
          <p className="text-xs text-[#7b7366] mt-4">
            Available Monday – Saturday, 9:00 AM – 6:00 PM West Africa Time (WAT)
          </p>
        </div>

        {/* 2. How Consultation Works */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
              The Consultation Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#131010] font-normal">
              How Your Consultation Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-none border border-[#e5dcd0] p-8 shadow-none flex flex-col justify-between relative overflow-hidden"
              >
                <div className="text-5xl font-serif text-[#2d5508]/20 font-bold mb-4">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#131010] font-normal mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#7b7366] text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e5dcd0] text-xs font-semibold text-[#7b7366]">
                  {step.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Common Concerns Handled */}
        <div className="bg-white rounded-none border border-[#e5dcd0] p-8 sm:p-12 lg:p-16 mb-20 shadow-none">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
              Personalized Solutions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#131010] font-normal">
              Melanin Skin Concerns We Specialize In
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {concerns.map((concern, idx) => (
              <div key={idx} className="p-6 rounded-none bg-[#faf8f5] border border-[#e5dcd0]">
                <h3 className="font-serif text-lg text-[#131010] font-normal mb-2">
                  {concern.name}
                </h3>
                <p className="text-sm text-[#7b7366] leading-relaxed mb-4">
                  {concern.description}
                </p>
                <div className="inline-block px-3 py-1 bg-white rounded-none border border-[#e5dcd0] text-xs text-[#2d5508] font-medium">
                  {concern.botanical}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
              Everything You Need to Know
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#131010] font-normal">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-none border border-[#e5dcd0] p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
              >
                <summary className="flex items-center justify-between font-serif text-lg text-[#131010] select-none">
                  <span>{faq.question}</span>
                  <span className="ml-4 flex-shrink-0 text-[#2d5508] group-open:rotate-180 transition-transform">
                    ↓
                  </span>
                </summary>
                <p className="text-sm text-[#7b7366] leading-relaxed mt-4 pt-4 border-t border-[#e5dcd0]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* 5. NAFDAC Disclaimer */}
        <div className="max-w-3xl mx-auto mb-16">
          <NafdacCaveat />
        </div>

        {/* 6. Closing CTA Banner */}
        <div className="bg-gradient-to-br from-[#131010] to-[#3a352c] rounded-none text-white p-8 sm:p-12 lg:p-16 text-center shadow-none">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal mb-6">
            Ready to Glow Naturally?
          </h2>
          <p className="text-sm sm:text-base text-[#e5dcd0] max-w-2xl mx-auto leading-relaxed mb-8">
            Take the first step toward genuine, healthy African skin radiance. Send a direct WhatsApp greeting to Mary today.
          </p>

          <a
            href={encodedWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2d5508] hover:bg-[#1e3b05] text-white font-semibold text-sm rounded-none transition-all shadow-none"
          >
            Chat with Mary on WhatsApp Now
          </a>
        </div>
      </div>
    </div>
  );
}
