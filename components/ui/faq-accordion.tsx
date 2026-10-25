'use client';

import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(idx: number) {
    setOpenIndex(openIndex === idx ? null : idx);
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className="border border-[#e5dcd0] bg-white transition-colors hover:border-[#131010]"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between text-left p-6 sm:p-8 cursor-pointer focus:outline-none"
              aria-expanded={isOpen}
            >
              <div className="space-y-1 pr-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d5508] block">
                  {item.category}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#131010] font-normal">
                  {item.question}
                </h3>
              </div>
              <span className="font-mono text-xl text-[#131010] flex-shrink-0 transition-transform duration-200">
                {isOpen ? '—' : '+'}
              </span>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 border-t border-[#faf6f0] animate-fade-in">
                <p className="text-sm text-[#524b42] leading-relaxed pt-3">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
