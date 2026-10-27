'use client';

import React from 'react';
import Link from 'next/link';

interface CheckoutAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
}

export function CheckoutAuthModal({
  isOpen,
  onClose,
  onContinueAsGuest,
}: CheckoutAuthModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-[#faf8f5] border border-[#e5dcd0] max-w-lg w-full p-6 sm:p-8 rounded-none shadow-2xl relative space-y-6">
        {/* Close Icon */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-[#7b7366] hover:text-[#131010] text-xl font-light w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#2d5508] block">
            Empress Member Portal • Checkout
          </span>
          <h2
            id="checkout-auth-title"
            className="font-serif text-2xl sm:text-3xl font-normal text-[#131010]"
          >
            How would you like to check out?
          </h2>
          <p className="text-xs text-[#7b7366] leading-relaxed max-w-md mx-auto">
            Sign in to use your saved Nigerian delivery addresses and track order dispatches, or proceed quickly as a guest.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            href="/login?redirect=/checkout"
            className="w-full py-3.5 px-6 bg-[#2d5508] hover:bg-[#1f3b05] text-white font-mono text-xs uppercase tracking-[0.2em] rounded-none transition-colors flex items-center justify-center gap-2 border border-[#2d5508] shadow-sm"
          >
            <span>Sign In to Empress Account →</span>
          </Link>

          <button
            type="button"
            onClick={onContinueAsGuest}
            className="w-full py-3.5 px-6 bg-white hover:bg-[#f0ece4] text-[#131010] font-mono text-xs uppercase tracking-[0.18em] rounded-none transition-colors border border-[#131010] flex items-center justify-center"
          >
            <span>Continue as Guest Checkout</span>
          </button>
        </div>

        {/* Member Benefits */}
        <div className="pt-4 border-t border-[#e5dcd0] bg-white p-4 space-y-2 font-mono text-[11px] text-[#524b42]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7b7366]">
            Empress Member Privileges
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[#2d5508] font-bold">✓</span>
            <span>Saved delivery addresses & WhatsApp contact autofilled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#2d5508] font-bold">✓</span>
            <span>Instant order tracking & historical botanical receipts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#2d5508] font-bold">✓</span>
            <span>Priority access to small cold-pressed skincare releases</span>
          </div>
        </div>
      </div>
    </div>
  );
}
