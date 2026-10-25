'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface CommunityReviewItem {
  id: string;
  type: 'before_after' | 'whatsapp_image' | 'text_quote' | 'video';
  quote: string;
  authorName: string;
  authorLocation: string;
  avatarSrc?: string;
  beforeImageSrc?: string;
  afterImageSrc?: string;
  whatsappImageSrc?: string;
  videoSrc?: string;
  posterSrc?: string;
  tag?: string;
}

const COMMUNITY_ITEMS: CommunityReviewItem[] = [
  {
    id: 'comm-1',
    type: 'before_after',
    quote: 'See eehh Mary this your soap de always do magic for my skin. After heat no de allow me rub cream ooo. I just take that picture before I order the soap and I\'m not disappointed 💃💃',
    authorName: 'Verified Client',
    authorLocation: 'Abuja, Nigeria',
    avatarSrc: '/images/reviews/hd-after-knuckles.jpg',
    beforeImageSrc: '/images/reviews/hd-before-knuckles.jpg',
    afterImageSrc: '/images/reviews/hd-after-knuckles.jpg',
    whatsappImageSrc: '/images/reviews/whatsapp-chat-beforeafter.jpg',
    tag: 'Knuckles & Barrier Care',
  },
  {
    id: 'comm-1b',
    type: 'whatsapp_image',
    quote: 'Like no cream oo. I just take that picture before I order the soap and I\'m not disappointed 💃💃. See eeh Mary this your soap de always do magic for my skin.',
    authorName: 'Verified Client',
    authorLocation: 'Abuja, Nigeria',
    whatsappImageSrc: '/images/reviews/whatsapp-chat-beforeafter.jpg',
    tag: 'Authentic WhatsApp Evidence',
  },
  {
    id: 'comm-2',
    type: 'whatsapp_image',
    quote: 'I just recalled ur soap could do the moisturizing magic, eliminating everything. That time I used the soAp I recall it was not there again... U have to send me something to start using o.',
    authorName: 'Returning Client',
    authorLocation: 'Lagos, Nigeria',
    whatsappImageSrc: '/images/reviews/whatsapp-chat-knuckles.jpg',
    tag: 'Moisturizing Magic',
  },
  {
    id: 'comm-3',
    type: 'text_quote',
    quote: 'My skin has never felt this balanced. Empress Glow is gentle enough for every morning, but still leaves my skin feeling completely clean, replenished, and refreshed. It has quickly become a staple in my routine.',
    authorName: 'Amara Williams, 26',
    authorLocation: 'Abuja, Nigeria',
    avatarSrc: '/images/mary-1.png',
    tag: 'Daily Melanin Wellness',
  },
  {
    id: 'comm-4',
    type: 'video',
    quote: 'The way this fruit enzyme soap lathers without stripping my skin barrier is unbelievable. Zero dryness.',
    authorName: 'Chioma E.',
    authorLocation: 'Abuja, Nigeria',
    avatarSrc: '/images/ugc-model-poster.jpg',
    videoSrc: '/videos/ugc-model-1.mp4',
    posterSrc: '/images/ugc-model-poster.jpg',
    tag: 'Morning Ritual',
  },
  {
    id: 'comm-5',
    type: 'whatsapp_image',
    quote: 'Good morning sis. Today is my mum\'s birthday, so I gave her the soap, e sweet am 😄 Thank you for making this possible.',
    authorName: 'Verified Client',
    authorLocation: 'Port Harcourt, Nigeria',
    whatsappImageSrc: '/images/reviews/whatsapp-chat-mum.jpg',
    tag: 'Gift of Pure Care',
  },
  {
    id: 'comm-6',
    type: 'whatsapp_image',
    quote: 'Have you started using the soap yet? Yesso. I like it ooo, it feels so gentle on my face.',
    authorName: 'Verified Client',
    authorLocation: 'Abuja, Nigeria',
    whatsappImageSrc: '/images/reviews/whatsapp-chat-gentle.jpg',
    tag: 'Facial Enzyme Cleanse',
  },
];

export function CommunityCarousel() {
  const [hoveredBeforeAfter, setHoveredBeforeAfter] = useState(false);
  const [selectedLightbox, setSelectedLightbox] = useState<string | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-[#f7f1e8] border-b border-[#e5dcd0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        {/* Header strictly matching ORLA preview_5.png */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#e5dcd0] pb-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#131010] tracking-tight">
            From The Community
          </h2>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#7b7366]">
            Real Client Feedback • WhatsApp Verified
          </span>
        </div>
      </div>

      {/* Infinite Smooth Auto-Sliding Marquee Carousel without Navigation Buttons */}
      <div className="relative w-full overflow-hidden">
        <div className="animate-community-scroll gap-6 px-4">
          {/* Double array for seamless infinite marquee loop */}
          {[...COMMUNITY_ITEMS, ...COMMUNITY_ITEMS].map((item, index) => {
            return (
              <div
                key={`${item.id}-${index}`}
                className="w-[320px] sm:w-[380px] h-[520px] flex-shrink-0 bg-white border border-[#e5dcd0] rounded-none overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#131010] shadow-xs select-none"
              >
                {/* 1. INTERACTIVE BEFORE & AFTER CARD */}
                {item.type === 'before_after' && (
                  <div
                    className="relative w-full h-full flex flex-col justify-between bg-[#131010] cursor-pointer"
                    onMouseEnter={() => setHoveredBeforeAfter(true)}
                    onMouseLeave={() => setHoveredBeforeAfter(false)}
                    onClick={() => setHoveredBeforeAfter((prev) => !prev)}
                  >
                    {/* Visual Container */}
                    <div className="relative w-full h-[320px] overflow-hidden bg-black">
                      {/* Before Image */}
                      <Image
                        src={item.beforeImageSrc || ''}
                        alt="Before hand care"
                        fill
                        sizes="400px"
                        className={`object-cover object-center transition-opacity duration-500 ${
                          hoveredBeforeAfter ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                        }`}
                      />
                      {/* After Image */}
                      <Image
                        src={item.afterImageSrc || ''}
                        alt="After hand care"
                        fill
                        sizes="400px"
                        className={`object-cover object-center transition-opacity duration-500 ${
                          hoveredBeforeAfter ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                        }`}
                      />

                      {/* State Pill Badge */}
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 text-white font-medium backdrop-blur-md transition-colors ${
                            hoveredBeforeAfter ? 'bg-[#2d5508]' : 'bg-[#131010]/80 border border-white/20'
                          }`}
                        >
                          {hoveredBeforeAfter ? 'After • Restored Barrier' : 'Before Formulation'}
                        </span>
                      </div>

                      {/* Hover Hint Overlay */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] px-2 py-0.5 bg-black/60 text-[#f7f1e8]/90 backdrop-blur-xs">
                          {hoveredBeforeAfter ? 'Hovering After' : 'Hover to view After'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Editorial Content */}
                    <div className="p-6 bg-[#131010] text-[#f7f1e8] flex-1 flex flex-col justify-between border-t border-white/10">
                      <p className="text-xs text-[#f7f1e8]/90 font-light leading-relaxed line-clamp-3 italic">
                        &ldquo;{item.quote}&rdquo;
                      </p>

                      {item.whatsappImageSrc && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLightbox(item.whatsappImageSrc || null);
                          }}
                          className="mt-2 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#5a8210] hover:text-[#f7f1e8] transition-colors underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Original WhatsApp Chat Evidence</span>
                          <span>↗</span>
                        </button>
                      )}

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[11px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-[#2d5508] text-white flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </div>
                          <div>
                            <span className="block font-medium text-white">{item.authorName}</span>
                            <span className="text-[#a89e90] text-[10px]">{item.authorLocation}</span>
                          </div>
                        </div>
                        <span className="text-[#5a8210] uppercase text-[9px] tracking-widest font-semibold">
                          Verified Result
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. WHATSAPP CHAT SCREENSHOT CARD */}
                {item.type === 'whatsapp_image' && (
                  <div
                    className="relative w-full h-full flex flex-col justify-between bg-[#faf8f5] cursor-pointer group/img"
                    onClick={() => item.whatsappImageSrc && setSelectedLightbox(item.whatsappImageSrc)}
                  >
                    {/* Visual Screenshot Header Container */}
                    <div className="relative w-full h-[320px] bg-[#eae5dd] overflow-hidden border-b border-[#e5dcd0]">
                      <Image
                        src={item.whatsappImageSrc || ''}
                        alt="WhatsApp Customer Review Screenshot"
                        fill
                        sizes="400px"
                        className="object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-[#131010] text-[#f7f1e8]">
                          {item.tag}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 font-mono text-[9px] text-[#131010]/80 bg-white/90 backdrop-blur-xs px-2 py-0.5">
                        Tap to zoom
                      </div>
                    </div>

                    {/* Bottom Quote & Attribution */}
                    <div className="p-6 flex-1 flex flex-col justify-between bg-[#ffffff]">
                      <p className="text-xs text-[#131010] font-normal leading-relaxed line-clamp-3">
                        &ldquo;{item.quote}&rdquo;
                      </p>

                      <div className="pt-4 border-t border-[#e5dcd0] flex items-center justify-between font-mono text-[11px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px] font-bold">
                            WA
                          </div>
                          <div>
                            <span className="block font-semibold text-[#131010]">{item.authorName}</span>
                            <span className="text-[#7b7366] text-[10px]">{item.authorLocation}</span>
                          </div>
                        </div>
                        <span className="text-[#2d5508] text-[9px] uppercase tracking-widest font-bold">
                          Client Chat
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. ORLA TEXT-ONLY QUOTE CARD */}
                {item.type === 'text_quote' && (
                  <div className="w-full h-full p-8 bg-[#f5efe6] flex flex-col justify-between">
                    <div className="space-y-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d5508] block font-semibold">
                        {item.tag}
                      </span>
                      <p className="font-serif text-base sm:text-lg text-[#131010] leading-relaxed font-normal">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#e5dcd0] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden relative border border-[#e5dcd0]">
                        <Image
                          src={item.avatarSrc || '/images/mary-1.png'}
                          alt={item.authorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-sans text-xs font-semibold text-[#131010] block">
                          {item.authorName}
                        </span>
                        <span className="font-mono text-[10px] text-[#7b7366]">
                          {item.authorLocation}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. CINEMATIC RITUAL VIDEO CARD */}
                {item.type === 'video' && (
                  <div className="relative w-full h-full bg-[#131010] flex flex-col justify-between overflow-hidden">
                    <div className="relative w-full h-full">
                      <video
                        src={item.videoSrc}
                        poster={item.posterSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                      <div className="absolute top-4 left-4">
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 bg-black/60 text-white backdrop-blur-xs border border-white/10">
                          {item.tag}
                        </span>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                        <p className="text-xs text-[#f7f1e8]/90 leading-snug line-clamp-2 italic font-sans">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                        <div className="pt-2 border-t border-white/15 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <span className="block font-medium text-white">{item.authorName}</span>
                            <span className="text-[#f7f1e8]/70 text-[10px]">{item.authorLocation}</span>
                          </div>
                          <span className="text-[#5a8210] uppercase text-[9px] tracking-widest font-semibold">
                            Melanin Ritual
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Regulatory Caveat Notice at Base (NAFDAC compliance) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <p className="font-mono text-[10px] text-[#7b7366] text-center leading-relaxed">
          Authentic, unsolicited client feedback shared via WhatsApp with master formulator Mary Asuquo. Individual skin responses vary. These botanical statements have not been evaluated by NAFDAC.
        </p>
      </div>

      {/* Lightbox Zoom Modal for WhatsApp Screenshot Proof */}
      {selectedLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedLightbox(null)}
        >
          <div
            className="relative max-w-md w-full max-h-[90vh] bg-white border border-white/20 p-2 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedLightbox(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center font-mono text-sm hover:bg-black transition-colors"
            >
              ✕
            </button>
            <div className="relative w-full h-[70vh] sm:h-[75vh]">
              <Image
                src={selectedLightbox}
                alt="Full WhatsApp Screenshot Proof"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-3 text-center border-t border-[#e5dcd0] font-mono text-[11px] text-[#7b7366]">
              Verified WhatsApp Client Discussion • Empress Glow Emporium
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
