'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart/cart-context';

export function CartView() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

  const FREE_SHIPPING_THRESHOLD = 25000;
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-none border border-[#e5dcd0] p-12 sm:p-20 text-center max-w-2xl mx-auto space-y-5">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2d5508] block">
          Empress Archive
        </span>
        <h2 className="font-serif text-3xl font-normal text-[#131010]">
          Your Shopping Basket is Empty
        </h2>
        <p className="text-sm text-[#524b42] max-w-md mx-auto leading-relaxed">
          Looks like you haven&apos;t added any handcrafted Nigerian botanical formulas yet. Explore our fresh fruit soaps, active serums, and barrier moisturizers.
        </p>
        <div className="pt-4">
          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-[#131010] hover:bg-[#2d5508] text-white font-mono text-xs uppercase tracking-[0.2em] rounded-none transition-colors"
          >
            Explore Botanical Catalog →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Items Table */}
      <div className="lg:col-span-8 bg-white rounded-none border border-[#e5dcd0] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#e5dcd0]">
          <h2 className="font-serif text-2xl text-[#131010] font-normal">
            Items in Basket ({itemCount})
          </h2>
          <button
            onClick={clearCart}
            className="font-mono text-xs text-[#7b7366] hover:text-[#131010] transition-colors underline uppercase tracking-wider"
          >
            Clear Basket
          </button>
        </div>

        {/* Free Shipping Alert */}
        <div className="bg-[#f7f5f0] p-4 rounded-none border border-[#e5dcd0] font-mono text-xs space-y-2">
          <div className="flex justify-between text-[#524b42]">
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <strong className="text-[#2d5508]">₦{remainingForFreeShipping.toLocaleString()}</strong> more to qualify for Free Abuja Delivery
              </span>
            ) : (
              <span className="text-[#2d5508] font-bold flex items-center gap-1.5">
                <span>✓</span> Free Abuja Delivery Unlocked!
              </span>
            )}
            <span className="text-[#2d5508]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-[#e5dcd0] h-1 rounded-none overflow-hidden">
            <div
              className="bg-[#2d5508] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Item Rows */}
        <div className="divide-y divide-[#f0ece4]">
          {items.map((item) => (
            <div key={item.variantId} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-none bg-[#f8f3ec] border border-[#e5dcd0] overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || '/images/fruity-soap-hero.jpg'}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-serif text-base font-normal text-[#131010]">
                    {item.name}
                  </h3>
                  <span className="font-mono text-xs text-[#7b7366] block">
                    Size: {item.variantName}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#131010] mt-1 block">
                    ₦{item.price.toLocaleString()} each
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#e5dcd0] rounded-none bg-white">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-8 h-8 rounded-none bg-white font-mono text-xs text-[#131010] hover:bg-[#faf6f0] transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-mono text-xs font-semibold text-[#131010]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="w-8 h-8 rounded-none bg-white font-mono text-xs text-[#131010] hover:bg-[#faf6f0] transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-serif text-lg font-normal text-[#131010] block">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="font-mono text-[10px] text-[#7b7366] hover:text-[#131010] uppercase tracking-wider underline mt-0.5"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Box */}
      <div className="lg:col-span-4 bg-white rounded-none border border-[#e5dcd0] p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl text-[#131010] font-normal pb-4 border-b border-[#e5dcd0]">
          Order Summary
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between text-[#524b42]">
            <span>Items Subtotal</span>
            <span className="font-semibold text-[#131010]">₦{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-[#524b42]">
            <span>Estimated Delivery</span>
            <span className="italic text-[#7b7366]">Calculated at checkout</span>
          </div>

          <div className="flex justify-between text-[#524b42]">
            <span>Value Added Tax (VAT)</span>
            <span className="text-[#2d5508] font-semibold">Exempt (0%)</span>
          </div>

          <div className="pt-3 border-t border-[#e5dcd0] flex justify-between text-sm">
            <span className="font-mono text-xs uppercase tracking-wider text-[#131010]">Total (Pre-Shipping)</span>
            <span className="font-serif text-xl font-normal text-[#2d5508]">
              ₦{subtotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/checkout"
            className="w-full py-4 bg-[#2d5508] hover:bg-[#5a8210] text-white font-mono text-xs uppercase tracking-[0.2em] rounded-none transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout →</span>
          </Link>

          <Link
            href="/shop"
            className="w-full py-3 bg-white border border-[#131010] text-[#131010] hover:bg-[#131010] hover:text-white font-mono text-xs uppercase tracking-[0.18em] rounded-none transition-colors flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="pt-4 border-t border-[#e5dcd0] space-y-2 font-mono text-[11px] text-[#7b7366]">
          <p className="flex items-center gap-2">
            <span className="text-[#2d5508]">✓</span> 7-Day Defective Product Return Guarantee (FCCPC)
          </p>
          <p className="flex items-center gap-2">
            <span className="text-[#2d5508]">✓</span> Secure Naira Checkout via Paystack
          </p>
          <p className="flex items-center gap-2">
            <span className="text-[#2d5508]">✓</span> Handcrafted Fresh in Abuja, Nigeria
          </p>
        </div>
      </div>
    </div>
  );
}
