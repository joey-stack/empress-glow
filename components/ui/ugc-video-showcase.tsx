'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface UgcVideoItem {
  id: string;
  videoSrc: string;
  posterSrc: string;
  modelName: string;
  handle: string;
  quote: string;
  routine: string;
}

const UGC_ITEMS: UgcVideoItem[] = [
  {
    id: 'ugc-1',
    videoSrc: '/videos/ugc-model-1.mp4',
    posterSrc: '/images/ugc-model-poster.jpg',
    modelName: 'Chioma E.',
    handle: '@chioma.glows',
    quote: 'The way this fruit enzyme soap lathers without stripping my skin barrier is unbelievable. Zero dryness.',
    routine: 'Morning Enzymatic Cleanse',
  },
  {
    id: 'ugc-2',
    videoSrc: '/videos/ugc-model-2.mp4',
    posterSrc: '/images/cinematic-hero-poster.jpg',
    modelName: 'Mary A.',
    handle: '@mary.asuquo',
    quote: 'Real papaya and avocado enzymes. Handcrafted to nurture melanin skin tone rather than alter it.',
    routine: 'Founder Daily Method',
  },
  {
    id: 'ugc-3',
    videoSrc: '/videos/ugc-model-3.mp4',
    posterSrc: '/images/ugc-model-poster.jpg',
    modelName: 'Adaeze K.',
    handle: '@adaeze_skin',
    quote: '60 seconds of gentle circular massage and my face feels hydrated, calm, and naturally radiant.',
    routine: 'Evening Reset Ritual',
  },
];

export function UgcVideoShowcase() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
      {/* Section Header (Orla Style) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#e5dcd0] pb-6 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508]">
            <span className="w-1.5 h-1.5 bg-[#5a8210] animate-pulse" />
            <span>Everyday Rituals in Motion</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#131010] font-normal">
            Real Skin. Authentic Melanin Radiance.
          </h2>
        </div>
        <p className="font-mono text-xs text-[#7b7366] max-w-md">
          Watch our community experience cold-pressed fruit enzyme care in their everyday skincare routines.
        </p>
      </div>

      {/* UGC Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {UGC_ITEMS.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white border border-[#e5dcd0] overflow-hidden flex flex-col justify-between group hover:border-[#131010] transition-colors shadow-xs"
            >
              {/* 9:16 Video Player Container */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#131010]">
                <video
                  src={item.videoSrc}
                  poster={item.posterSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131010]/85 via-transparent to-black/20 pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 bg-[#131010]/80 text-[#f7f1e8] backdrop-blur-xs border border-white/10">
                    {item.routine}
                  </span>
                </div>

                {/* Bottom Overlay Info on Video */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-medium">{item.modelName}</span>
                    <span className="font-mono text-[10px] text-[#f7f1e8]/70">{item.handle}</span>
                  </div>
                  <p className="text-xs text-[#f7f1e8]/90 leading-snug line-clamp-2 italic font-sans pt-1">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Bottom Card Strip */}
              <div className="p-5 border-t border-[#e5dcd0] bg-[#faf6f0] flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#2d5508]">
                  Fruity Soap Routine
                </span>
                <span className="font-mono text-[11px] text-[#7b7366]">
                  Verified Client Care
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
