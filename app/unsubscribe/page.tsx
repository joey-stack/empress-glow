import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { UnsubscribeForm } from '@/components/ui/unsubscribe-form';

export const metadata: Metadata = {
  title: 'Unsubscribe | Empress Glow Emporium',
  description: 'Manage your email notification preferences and commercial opt-out settings under NDPA 2023.',
};

export default function UnsubscribePage() {
  return (
    <div className="min-h-[70vh] bg-[#f7f1e8] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="bg-white rounded-none border border-[#e5dcd0] p-8 sm:p-12 shadow-none max-w-lg mx-auto w-full">
        <div className="text-center space-y-2 mb-6">
          <span className="w-10 h-10 rounded-none border border-[#2d5508]/30 bg-[#2d5508]/10 text-[#2d5508] flex items-center justify-center mx-auto text-base font-bold font-mono">
            ✉
          </span>
          <h1 className="font-serif text-2xl text-[#131010]">
            Manage Email Preferences
          </h1>
          <p className="text-xs text-[#7b7366] leading-relaxed">
            We respect your privacy under the Nigeria Data Protection Act (NDPA 2023). Enter your email below to opt out of pre-launch announcements.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-8 text-xs font-mono text-[#7b7366]">
              Loading preference form...
            </div>
          }
        >
          <UnsubscribeForm />
        </Suspense>

        <div className="mt-6 pt-6 border-t border-[#e5dcd0] text-[11px] text-[#7b7366] text-center leading-relaxed font-mono">
          Need further data assistance? Contact our Data Protection Officer at{' '}
          <a href="mailto:dpo@empressglowemporium.com" className="text-[#2d5508] underline font-medium">
            dpo@empressglowemporium.com
          </a>
          .
        </div>
      </div>
    </div>
  );
}
