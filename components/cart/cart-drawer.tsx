'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart/cart-context';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 25000;
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel — Sharp Architectural Edges */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#e5dcd0] shadow-2xl flex flex-col justify-between rounded-none animate-slideInRight">
          {/* Header */}
          <div className="p-6 border-b border-[#e5dcd0] flex items-center justify-between bg-[#faf6f0]">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-normal text-[#131010]">
                Your Bag
              </span>
              <span className="px-2 py-0.5 rounded-none border border-[#e5dcd0] bg-white text-[#2d5508] font-mono text-xs">
                [{itemCount}]
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-black/5 text-[#131010] font-mono text-xs uppercase tracking-wider transition-colors"
              aria-label="Close cart"
            >
              [Close]
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-[#f7f5f0] p-4 border-b border-[#e5dcd0] font-mono text-xs space-y-2">
            <div className="flex justify-between text-[#524b42]">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#2d5508]">₦{remainingForFreeShipping.toLocaleString()}</strong> for Free Abuja Delivery
                </span>
              ) : (
                <span className="text-[#2d5508] font-semibold flex items-center gap-1">
                  <span>✓</span> Free Abuja Delivery Unlocked
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

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#f0ece4]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2d5508] block">
                  Empress Archive
                </span>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-[#131010]">
                    Your bag is empty
                  </h3>
                  <p className="font-mono text-xs text-[#7b7366] max-w-xs">
                    Handcrafted botanical preparations made in small fresh batches in Abuja.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-[#131010] hover:bg-[#2d5508] text-white font-mono text-xs uppercase tracking-[0.2em] rounded-none transition-colors"
                >
                  Explore Collection →
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variantId} className="py-5 flex gap-4 items-center">
                  {/* Thumbnail Image */}
                  <div className="relative w-18 h-18 aspect-square rounded-none bg-[#f8f3ec] border border-[#e5dcd0] overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || '/images/fruity-soap-hero.jpg'}
                      alt={item.name}
                      fill
                      sizes="72px"
                      className="object-contain p-1.5"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="font-serif text-sm font-normal text-[#131010] truncate">
                      {item.name}
                    </h4>
                    <span className="font-mono text-[11px] text-[#7b7366] block">
                      Size: {item.variantName}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#131010] block pt-1">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Stepper & Remove */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-[#e5dcd0] rounded-none bg-white">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-7 h-7 rounded-none bg-white font-mono text-xs text-[#131010] hover:bg-[#faf6f0] transition-colors"
                      >
                        −
                      </button>
                      <span className="w-7 text-center font-mono text-xs font-semibold text-[#131010]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-7 h-7 rounded-none bg-white font-mono text-xs text-[#131010] hover:bg-[#faf6f0] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="font-mono text-[10px] text-[#7b7366] hover:text-[#131010] uppercase tracking-wider underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#e5dcd0] bg-[#faf6f0] space-y-4 rounded-none">
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#7b7366]">
                  <span>Subtotal • VAT Exempt</span>
                  <span className="font-semibold text-[#131010]">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7b7366]">
                  <span>Estimated Shipping</span>
                  <span className="italic">Calculated at checkout</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-4 bg-[#2d5508] hover:bg-[#5a8210] text-white font-mono text-xs font-medium rounded-none transition-colors flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
                >
                  <span>Checkout Now • ₦{subtotal.toLocaleString()}</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 bg-white border border-[#131010] text-[#131010] hover:bg-[#131010] hover:text-white font-mono text-xs uppercase tracking-[0.18em] rounded-none transition-colors flex items-center justify-center"
                >
                  View Full Cart & Summary
                </Link>
              </div>

              <p className="font-mono text-[10px] text-[#7b7366] text-center pt-1">
                FCCPC 7-Day Defective Product Return Guarantee
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
