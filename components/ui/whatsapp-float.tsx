'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      aria-label="WhatsApp Skincare Consultation"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end"
    >
      {/* Orla Style Floating Popover Card */}
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[360px] bg-[#f7f1e8] border border-[#e5dcd0] shadow-2xl p-0 animate-fade-in overflow-hidden">
          {/* Card Header */}
          <div className="bg-[#131010] text-[#f7f1e8] p-5 flex items-center justify-between border-b border-[#262220]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 overflow-hidden rounded-none border border-white/20 bg-white/10 flex-shrink-0">
                <Image
                  src="/images/mary-founder.jpg?v=2"
                  alt="Mary Asuquo"
                  fill
                  sizes="40px"
                  className="object-cover"
                  style={{ objectPosition: 'center 25%' }}
                />
              </div>
              <div>
                <h4 className="font-serif text-sm font-medium tracking-wide">
                  Mary Asuquo
                </h4>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#5a8210]">
                  <span className="w-1.5 h-1.5 bg-[#5a8210] animate-pulse" />
                  <span>Online • Founder Care</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#f7f1e8]/70 hover:text-white p-1 text-base leading-none cursor-pointer"
              aria-label="Close consultation card"
            >
              ✕
            </button>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4 text-xs text-[#524b42]">
            <div className="bg-white p-4 border border-[#e5dcd0] space-y-2">
              <p className="leading-relaxed font-normal text-[#131010]">
                Welcome to Empress Glow. ✨
              </p>
              <p className="leading-relaxed text-[#7b7366]">
                Have questions about our cold-pressed fruit enzymes, sensitive melanin skin routines, or prelaunch reservation dispatch?
              </p>
              <p className="font-script text-lg text-[#2d5508] pt-1">
                &ldquo;....Own your spot.&rdquo;
              </p>
            </div>

            {/* Direct WhatsApp Action Buttons */}
            <div className="space-y-2 pt-1 font-mono text-xs uppercase tracking-[0.15em]">
              <a
                href="https://wa.me/2348035650299"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] py-3.5 px-4 transition-colors border border-[#131010] hover:border-[#2d5508]"
              >
                <span>Chat on WhatsApp</span>
                <span>→</span>
              </a>

              <a
                href="https://wa.me/c/2348035650299"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 border border-[#e5dcd0] bg-white text-[#131010] hover:bg-[#faf6f0] py-3 px-4 transition-colors"
              >
                <span>Browse WhatsApp Catalog</span>
              </a>
            </div>

            <p className="font-mono text-[10px] text-[#7b7366] text-center pt-1">
              Direct line: 08035650299 • Abuja, Nigeria
            </p>
          </div>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle WhatsApp Skincare Consultation"
        className="flex items-center gap-2.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] px-4 py-3 shadow-xl transition-colors border border-[#262220] cursor-pointer"
      >
        <span className="w-1.5 h-1.5 bg-[#5a8210] animate-pulse" />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
          WhatsApp Care
        </span>
      </button>
    </aside>
  );
}
