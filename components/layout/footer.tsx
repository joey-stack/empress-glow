'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { isLive } from '@/lib/phase';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, product_slug: 'general-newsletter' }),
      });
      if (!res.ok) throw new Error('Subscription failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <footer className="bg-[#131010] text-[#f7f1e8] border-t border-[#262220] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        {/* Top Newsletter / Inner Circle Strip (Orla Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-16 border-b border-[#262220]">
          <div className="lg:col-span-6 space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a8210] block">
              Direct Communication
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#f7f1e8] font-normal leading-tight">
              Join the Private Reservation Circle
            </h3>
            <p className="text-sm text-[#a89e90] max-w-md font-normal leading-relaxed">
              Receive private dispatch notifications for new cold-pressed batches, botanical formulation journals, and priority allocations.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@empressglow.com"
                className="flex-1 bg-[#1e1b18] border border-[#36312a] px-4 py-3.5 text-sm text-[#f7f1e8] placeholder-[#7b7366] font-mono focus:outline-none focus:border-[#5a8210] transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#f7f1e8] hover:bg-[#5a8210] text-[#131010] hover:text-white font-mono text-xs uppercase tracking-[0.2em] font-medium py-3.5 px-7 transition-colors cursor-pointer border border-[#f7f1e8] hover:border-[#5a8210] disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining...' : status === 'success' ? 'Enrolled ✓' : 'Subscribe'}
              </button>
            </form>
            {status === 'success' && (
              <p className="font-mono text-xs text-[#5a8210] mt-2">
                Welcome to the reservation circle.
              </p>
            )}
            {status === 'error' && (
              <p className="font-mono text-xs text-red-400 mt-2">
                Unable to subscribe. Please try again.
              </p>
            )}
          </div>
        </div>

        {/* 4-Column Navigation & Brand Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 pb-16 border-b border-[#262220]">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.1em] uppercase block text-[#f7f1e8]">
              Empress Glow
            </span>
            <p className="text-xs text-[#a89e90] leading-relaxed max-w-sm">
              Artisan Nigerian botanical skincare formulations handcrafted with fresh fruit enzymes to gently nourish melanin skin barrier wellness. Hand-poured in Abuja.
            </p>
            <p className="font-script text-2xl text-[#5a8210] pt-1">
              &ldquo;....Own your spot.&rdquo;
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a8210]">
              Collection
            </h4>
            <ul className="space-y-3 font-mono text-xs text-[#a89e90]">
              <li>
                <Link href={isLive ? '/shop' : '/products'} className="hover:text-[#f7f1e8] transition-colors">
                  {isLive ? 'Shop Collection' : 'All Products'}
                </Link>
              </li>
              {isLive && (
                <li>
                  <Link href="/account" className="hover:text-[#f7f1e8] transition-colors">
                    Customer Account
                  </Link>
                </li>
              )}
              <li>
                <Link href="/rituals" className="hover:text-[#f7f1e8] transition-colors">
                  Botanical Rituals
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#f7f1e8] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#f7f1e8] transition-colors">
                  Questions & FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#f7f1e8] transition-colors">
                  Skincare Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Consultation */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a8210]">
              Direct Care
            </h4>
            <ul className="space-y-3 font-mono text-xs text-[#a89e90]">
              <li>
                <a
                  href="https://wa.me/2348035650299"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f7f1e8] transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-[#5a8210]" />
                  <span>WhatsApp Consultation</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/c/2348035650299"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f7f1e8] transition-colors"
                >
                  WhatsApp Product Catalog
                </a>
              </li>
              <li>
                <a
                  href="mailto:orders@empressglowemporium.com"
                  className="hover:text-[#f7f1e8] transition-colors"
                >
                  orders@empressglowemporium.com
                </a>
              </li>
              <li className="text-[#7b7366] pt-1">
                Abuja, Nigeria • Founded 2021
              </li>
            </ul>
          </div>

          {/* Policy & Compliance */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a8210]">
              Regulatory & Policy
            </h4>
            <ul className="space-y-3 font-mono text-xs text-[#a89e90]">
              <li>
                <Link href="/policies#refunds" className="hover:text-[#f7f1e8] transition-colors">
                  FCCPC Refund Policy (7 Days)
                </Link>
              </li>
              <li>
                <Link href="/policies#shipping" className="hover:text-[#f7f1e8] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/policies#privacy" className="hover:text-[#f7f1e8] transition-colors">
                  Privacy Policy (NDPA 2023)
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('empress_cookie_consent');
                    window.location.reload();
                  }}
                  className="text-left text-[#7b7366] hover:text-[#f7f1e8] transition-colors cursor-pointer"
                >
                  Cookie Settings
                </button>
              </li>
              <li>
                <Link href="/unsubscribe" className="text-[#7b7366] hover:text-[#f7f1e8] transition-colors">
                  Opt Out / Unsubscribe
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers & NAFDAC Caveat */}
        <div className="space-y-4 text-[11px] font-mono text-[#7b7366]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p>© 2026 Empress Glow Emporium. All rights reserved. CAC Registered. VAT Exempt.</p>
            <p>DPO: dpo@empressglowemporium.com</p>
          </div>
          <p className="border-t border-[#262220] pt-4 leading-relaxed text-[#7b7366]">
            NAFDAC Notice: These formulations are prepared using traditional West African botanical extracts. These claims have not been evaluated by NAFDAC to diagnose, cure, treat, or prevent any condition.
          </p>
        </div>
      </div>
    </footer>
  );
}
