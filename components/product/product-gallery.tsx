'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const displayImages =
    images && images.length > 0
      ? images
      : ['/images/fruity-soap-hero.jpg'];

  const getVisualLabel = (idx: number) => {
    switch (idx) {
      case 0:
        return 'Editorial Presentation';
      case 1:
        return 'Botanical Formulation';
      case 2:
        return 'Artisanal Jar Lineup';
      case 3:
        return 'Texture & Application';
      default:
        return `Visual 0${idx + 1}`;
    }
  };

  return (
    <>
      {/* Desktop Gallery: Vertical Editorial Scroll Stack (ORLA Luxury Pattern) */}
      <div className="hidden lg:flex flex-col space-y-8">
        {displayImages.map((imgSrc, idx) => (
          <div
            key={idx}
            onClick={() => setLightboxImage(imgSrc)}
            className="group relative aspect-[4/5] w-full overflow-hidden bg-[#f5efe6] border border-[#e5dcd0] cursor-zoom-in transition-all duration-300 hover:border-[#131010]"
          >
            <Image
              src={imgSrc}
              alt={`${productName} - ${getVisualLabel(idx)}`}
              fill
              priority={idx === 0}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />

            {/* Editorial Tag Pill */}
            <div className="absolute top-4 left-4 z-10">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] font-medium px-3 py-1.5 bg-white/90 backdrop-blur-xs text-[#131010] border border-[#e5dcd0]">
                {getVisualLabel(idx)}
              </span>
            </div>

            {/* Subtle Zoom Hint */}
            <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 bg-[#131010] text-[#f7f1e8]">
                Click to Expand ⤢
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile & Tablet Gallery: Fluid Interactive Swipe/Carousel */}
      <div className="lg:hidden flex flex-col space-y-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f5efe6] border border-[#e5dcd0]">
          <Image
            src={displayImages[activeMobileIndex]}
            alt={`${productName} visual ${activeMobileIndex + 1}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center w-full h-full"
            onClick={() => setLightboxImage(displayImages[activeMobileIndex])}
          />

          {/* Top Label */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-medium px-2.5 py-1 bg-white/95 text-[#131010] border border-[#e5dcd0]">
              {getVisualLabel(activeMobileIndex)}
            </span>
          </div>

          {/* Bottom Index Counter */}
          <div className="absolute bottom-3.5 right-3.5 z-10 font-mono text-[10px] tracking-wider px-2.5 py-1 bg-[#131010]/80 text-[#f7f1e8] backdrop-blur-xs">
            {activeMobileIndex + 1} / {displayImages.length}
          </div>

          {/* Left / Right Nav Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveMobileIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/90 border border-[#e5dcd0] text-[#131010] text-sm cursor-pointer shadow-xs"
                aria-label="Previous Image"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveMobileIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/90 border border-[#e5dcd0] text-[#131010] text-sm cursor-pointer shadow-xs"
                aria-label="Next Image"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Indicator Strip */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {displayImages.map((thumb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveMobileIndex(idx)}
                className={`relative aspect-[4/5] border overflow-hidden transition-all cursor-pointer ${
                  activeMobileIndex === idx
                    ? 'border-[#131010] ring-1 ring-[#131010]'
                    : 'border-[#e5dcd0] opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={thumb}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover object-center"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-[#131010]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-2 right-2 text-white font-mono text-sm uppercase tracking-widest bg-[#131010] border border-[#7b7366] px-3 py-1 cursor-pointer hover:border-white transition-colors z-50"
            >
              ✕ Close
            </button>
            <div className="relative w-full h-full max-h-[82vh]">
              <Image
                src={lightboxImage}
                alt={productName}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#e5dcd0] pt-4 text-center">
              {productName} • Editorial High-Definition View
            </p>
          </div>
        </div>
      )}
    </>
  );
}
