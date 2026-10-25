'use client';

import React, { useState, useEffect } from 'react';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('empress_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(
      'empress_cookie_consent',
      JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      })
    );
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(
      'empress_cookie_consent',
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent"
      className="fixed bottom-4 left-4 right-4 md:left-8 md:max-w-xl z-50 p-6 bg-white border border-[#131010] rounded-none shadow-2xl text-[#131010]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d5508] block mb-1">
            NDPA 2023 Consent
          </span>
          <h4 className="font-serif font-normal text-lg text-[#131010] mb-1">
            Privacy & Cookie Preferences
          </h4>
          <p className="font-mono text-xs text-[#524b42] leading-relaxed mb-4">
            Under Nigeria&apos;s Data Protection Act (NDPA 2023), we request your consent to use analytics cookies to refine your shopping ritual. Essential cookies are required for shopping basket operations.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAccept}
              className="bg-[#2d5508] hover:bg-[#5a8210] text-white font-mono text-xs uppercase tracking-[0.16em] px-4 py-2.5 rounded-none transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="border border-[#131010] hover:bg-[#131010] hover:text-white text-[#131010] font-mono text-xs uppercase tracking-[0.16em] px-4 py-2.5 rounded-none transition-colors"
            >
              Essential Only
            </button>
            <a
              href="/policies#privacy"
              className="font-mono text-[11px] text-[#7b7366] hover:text-[#131010] underline ml-2"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
