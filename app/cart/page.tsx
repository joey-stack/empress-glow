import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isPrelaunch } from '@/lib/phase';
import { CartView } from '@/components/cart/cart-view';

export const metadata: Metadata = {
  title: 'Shopping Basket | Empress Glow Emporium',
  description: 'Review your selected botanical formulations, update sizes, and proceed to secure checkout.',
};

export default function CartPage() {
  if (isPrelaunch) {
    redirect('/');
  }

  return (
    <div className="bg-[#faf9f7] py-12 lg:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#2d5508] block mb-1">
            Order Review
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#131010] font-normal">
            Your Shopping Basket
          </h1>
        </div>

        <CartView />
      </div>
    </div>
  );
}
