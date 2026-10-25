import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/ui/contact-form';
import { LocalBusinessSchema } from '@/components/seo/local-business-schema';

export const metadata: Metadata = {
  title: 'Contact Us & Customer Support | Empress Glow Emporium',
  description:
    'Get in touch with Empress Glow Emporium. Reach Mary Asuquo directly on WhatsApp, send us an inquiry, or connect with our customer care and data privacy officers in Abuja.',
};

export default function ContactPage() {
  const contactChannels = [
    {
      title: 'WhatsApp Direct Chat',
      value: '+234 803 565 0299',
      subtitle: 'Primary channel for consultations, inquiries & quick support.',
      href: 'https://wa.me/2348035650299',
      actionText: 'Chat on WhatsApp',
      isPrimary: true,
      badge: 'Fastest Response',
    },
    {
      title: 'WhatsApp Catalog',
      value: 'Official Pre-Launch Showcase',
      subtitle: 'Browse current handcrafted formulations on WhatsApp.',
      href: 'https://wa.me/c/2348035650299',
      actionText: 'View Catalog',
      isPrimary: false,
    },
    {
      title: 'Customer Support Email',
      value: 'orders@empressglowemporium.com',
      subtitle: 'For order inquiries, general questions, and partnership proposals.',
      href: 'mailto:orders@empressglowemporium.com',
      actionText: 'Send Email',
      isPrimary: false,
    },
    {
      title: 'Data Protection Officer (DPO)',
      value: 'dpo@empressglowemporium.com',
      subtitle: 'For NDPA compliance, user rights, data access, or removal requests.',
      href: 'mailto:dpo@empressglowemporium.com',
      actionText: 'Contact DPO',
      isPrimary: false,
    },
  ];

  return (
    <div className="bg-[#f7f1e8] py-12 lg:py-20 text-[#131010]">
      <LocalBusinessSchema />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-[#7b7366] mb-10 font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#131010] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#131010]">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
            We'd Love to Hear From You
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#131010] mb-4">
            Get in Touch with Empress Glow
          </h1>
          <p className="text-sm sm:text-base text-[#7b7366] leading-relaxed">
            Whether you have questions regarding our natural fruit enzymes, custom consultations, or wholesale partnerships, our team in Abuja is ready to assist.
          </p>
        </div>

        {/* Direct Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactChannels.map((channel, idx) => (
            <div
              key={idx}
              className={`rounded-none p-6 border transition-all flex flex-col justify-between ${
                channel.isPrimary
                  ? 'bg-[#131010] text-white border-[#131010] shadow-none'
                  : 'bg-white text-[#131010] border-[#e5dcd0] shadow-none'
              }`}
            >
              <div>
                {channel.badge && (
                  <span className="inline-block px-2.5 py-0.5 rounded-none bg-[#5a8210] text-white text-[10px] font-semibold tracking-wider uppercase mb-3">
                    {channel.badge}
                  </span>
                )}
                <h3 className={`font-serif text-lg font-normal mb-1 ${channel.isPrimary ? 'text-white' : 'text-[#131010]'}`}>
                  {channel.title}
                </h3>
                <p className={`text-xs font-semibold mb-3 ${channel.isPrimary ? 'text-[#5a8210]' : 'text-[#2d5508]'}`}>
                  {channel.value}
                </p>
                <p className={`text-xs leading-relaxed mb-6 ${channel.isPrimary ? 'text-[#e5dcd0]' : 'text-[#7b7366]'}`}>
                  {channel.subtitle}
                </p>
              </div>

              <a
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                  channel.isPrimary
                    ? 'text-[#5a8210] hover:text-white'
                    : 'text-[#2d5508] hover:text-[#1e3b05]'
                }`}
              >
                {channel.actionText} →
              </a>
            </div>
          ))}
        </div>

        {/* Contact Form and Location Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Working Hours & Abuja HQ */}
            <div className="bg-white rounded-none border border-[#e5dcd0] p-6 sm:p-8 shadow-none">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
                Business Information
              </span>
              <h3 className="font-serif text-xl text-[#131010] font-normal mb-4">
                Operating Hours & Location
              </h3>
              <div className="space-y-4 text-xs text-[#7b7366] leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-[#131010] min-w-[100px]">Consultations:</span>
                  <span>Monday – Saturday, 9:00 AM – 6:00 PM WAT</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-[#131010] min-w-[100px]">Inquiries:</span>
                  <span>Replies typically delivered within 24 hours.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-[#131010] min-w-[100px]">Location:</span>
                  <div>
                    <span>Abuja, Nigeria</span>
                    <span className="ml-2 inline-block px-2 py-0.5 rounded-none bg-[#f1ebe1] text-[#7b7366] text-[10px] font-mono">
                      PLACEHOLDER: Physical Studio Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Policies Card */}
            <div className="bg-[#f0f5ea]/50 rounded-none border border-[#e5dcd0] p-6 sm:p-8">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
                Need Help Immediately?
              </span>
              <h3 className="font-serif text-xl text-[#131010] font-normal mb-3">
                Customer Care Disclosures
              </h3>
              <p className="text-xs text-[#7b7366] leading-relaxed mb-4">
                Review our clear return policies and data governance prior to ordering:
              </p>
              <ul className="space-y-2 text-xs font-medium text-[#131010]">
                <li className="flex items-center gap-2">
                  <span className="text-[#2d5508]">✓</span>
                  <span>7-Day Return Guarantee for Defective Deliveries (FCCPC Compliant)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2d5508]">✓</span>
                  <span>NDPA 2023 Regulated Data Protection & Privacy Rights</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2d5508]">✓</span>
                  <span>VAT Exempt under Nigerian Micro-Enterprise Provisions</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-[#e0d7c7]">
                <Link href="/policies" className="text-xs font-semibold text-[#2d5508] hover:underline">
                  View Full Commercial Policies →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
