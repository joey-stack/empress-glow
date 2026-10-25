import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isPrelaunch } from '@/lib/phase';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export const metadata: Metadata = {
  title: 'Secure Checkout | Empress Glow Emporium',
  description: 'Complete your Nigerian botanical skincare purchase with secure Paystack payments.',
};

export default function CheckoutPage() {
  if (isPrelaunch) {
    redirect('/');
  }

  return (
    <div className="bg-[#faf9f7] py-12 lg:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#2d5508] block mb-1">
            Secure Payment
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#131010] font-normal">
            Checkout & Order Dispatch
          </h1>
        </div>

        <CheckoutForm />
      </div>
    </div>
  );
}
