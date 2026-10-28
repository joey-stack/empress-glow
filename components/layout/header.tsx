'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart/cart-context';
import { NotifyMeDrawer } from '@/components/ui/notify-me-drawer';
import { isLive } from '@/lib/phase';

function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.includes('@')) {
    const prefix = email.split('@')[0];
    return prefix.slice(0, 2).toUpperCase();
  }
  return 'EG';
}

export function Header() {
  const pathname = usePathname();
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const { setIsCartOpen, itemCount } = useCart();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/account')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active) {
          setUser(data?.user || null);
        }
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    const checkAuth = () => {
      fetch('/api/account')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setUser(data?.user || null))
        .catch(() => setUser(null));
    };

    window.addEventListener('focus', checkAuth);
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('focus', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#f7f1e8]/95 backdrop-blur-md border-b border-[#e5dcd0] transition-all">
        {/* Orla Skin Reference Minimalist Navigation Bar */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-22 flex items-center justify-between">
          {/* Left: Minimal Menu Button */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuDrawerOpen(true)}
              className="inline-flex items-center gap-2 py-2 text-[#131010] hover:text-[#2d5508] transition-colors focus:outline-none cursor-pointer group"
              aria-label="Open navigation menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="stroke-current group-hover:stroke-[#2d5508] transition-colors"
              >
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              </svg>
              <span className="font-mono text-xs uppercase tracking-[0.22em] font-medium group-hover:text-[#2d5508] transition-colors">
                Menu
              </span>
            </button>
          </div>

          {/* Center: Brand Logo from Assets (Increased Size & Mathematically Centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <Link
              href="/"
              className="flex items-center justify-center focus:outline-none group py-1"
              aria-label="Empress Glow Emporium Home"
            >
              <Image
                src="/images/logo.png"
                alt="Empress Glow Emporium"
                width={220}
                height={75}
                className="h-12 sm:h-15 lg:h-16 w-auto object-contain transition-opacity group-hover:opacity-85"
                priority
              />
            </Link>
          </div>

          {/* Right: Profile Icon & Shopping Bag Cart Icon (Live mode only) vs Prelaunch Waitlist CTA */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isLive ? (
              <>
                {/* User Profile / Account Icon or Initials Avatar */}
                <Link
                  href="/account"
                  prefetch={false}
                  title={user ? `Empress Member Portal (${user.name || user.email})` : 'Sign In / Account Profile'}
                  aria-label={user ? `Account Portal (${user.name || user.email})` : 'Account Profile'}
                  className="p-1 text-[#131010] hover:text-[#2d5508] transition-colors focus:outline-none flex items-center group relative"
                >
                  {user ? (
                    <div className="relative flex items-center justify-center">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2d5508] text-[#f7f1e8] font-mono text-[11px] sm:text-xs font-bold flex items-center justify-center border border-[#1e3b05] shadow-xs group-hover:scale-105 group-hover:bg-[#1e3b05] transition-all">
                        {getInitials(user.name, user.email)}
                      </div>
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#f7f1e8]"
                        title="Active Session"
                      />
                    </div>
                  ) : (
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="stroke-current"
                    >
                      <circle cx="12" cy="8" r="4.25" />
                      <path d="M20 21a8 8 0 10-16 0" strokeLinecap="round" />
                    </svg>
                  )}
                </Link>

                {/* Shopping Bag / Cart Icon */}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Shopping Bag"
                  className="p-2 text-[#131010] hover:text-[#2d5508] transition-colors relative cursor-pointer focus:outline-none"
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="stroke-current"
                  >
                    <path
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="absolute top-1 right-0.5 min-w-[15px] h-[15px] px-1 rounded-none border border-white/20 bg-[#131010] text-[#f7f1e8] text-[9px] font-mono font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setWaitlistOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] py-2 px-3.5 transition-colors cursor-pointer"
              >
                <span>✦</span>
                <span>Waitlist</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Orla-Style Slide-Out Navigation Drawer */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMenuDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-[#f7f1e8] border-r border-[#e5dcd0] h-full shadow-2xl flex flex-col justify-between z-10 p-6 sm:p-10 overflow-y-auto">
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-[#e5dcd0] pb-6 mb-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7b7366]">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="text-[#131010] hover:opacity-60 transition-opacity p-2 -mr-2 cursor-pointer"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Member Status / Quick Access inside Drawer (Live mode only) */}
              {isLive && (
                <div className="mb-6 pb-6 border-b border-[#e5dcd0]">
                  {user ? (
                    <Link
                      href="/account"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="flex items-center gap-3 p-3 bg-white border border-[#e5dcd0] hover:border-[#2d5508] transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#2d5508] text-[#f7f1e8] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#1e3b05] shadow-xs">
                        {getInitials(user.name, user.email)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block">
                          Empress Member
                        </span>
                        <span className="font-serif text-sm font-medium text-[#131010] truncate block group-hover:text-[#2d5508] transition-colors">
                          {user.name || user.email}
                        </span>
                      </div>
                      <span className="text-[#2d5508] text-xs font-mono group-hover:translate-x-0.5 transition-transform">
                        Dashboard →
                      </span>
                    </Link>
                  ) : (
                    <Link
                      href="/account"
                      onClick={() => setMenuDrawerOpen(false)}
                      className="flex items-center justify-between p-3 bg-white border border-[#e5dcd0] hover:border-[#2d5508] text-xs font-mono uppercase tracking-wider text-[#131010] hover:text-[#2d5508] transition-colors group"
                    >
                      <span className="flex items-center gap-2.5">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="stroke-current"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M20 21a8 8 0 10-16 0" />
                        </svg>
                        <span>Sign In / Create Account</span>
                      </span>
                      <span className="text-[#2d5508] group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-6">
                <div>
                  <Link
                    href={isLive ? '/shop' : '/products'}
                    onClick={() => setMenuDrawerOpen(false)}
                    className="block font-serif text-2xl sm:text-3xl font-medium text-[#131010] hover:text-[#2d5508] transition-colors"
                  >
                    {isLive ? 'The Collection' : 'The Products'}
                  </Link>
                  <p className="font-mono text-xs text-[#7b7366] mt-1">
                    {isLive
                      ? 'Browse handcrafted fruit soaps, serums & rituals with live pricing'
                      : 'Signature cold-pressed fruit soaps & botanical care'}
                  </p>
                </div>

                <div className="border-t border-[#e5dcd0] pt-6">
                  <Link
                    href="/rituals"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="block font-serif text-2xl sm:text-3xl font-medium text-[#131010] hover:text-[#2d5508] transition-colors"
                  >
                    Botanical Rituals
                  </Link>
                  <p className="font-mono text-xs text-[#7b7366] mt-1">
                    Morning and evening routines for radiant melanin skin
                  </p>
                </div>

                <div className="border-t border-[#e5dcd0] pt-6">
                  <Link
                    href="/about"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="block font-serif text-2xl sm:text-3xl font-medium text-[#131010] hover:text-[#2d5508] transition-colors"
                  >
                    Our Heritage
                  </Link>
                  <p className="font-mono text-xs text-[#7b7366] mt-1">
                    Meet Mary Asuquo & artisanal Abuja craft
                  </p>
                </div>

                <div className="border-t border-[#e5dcd0] pt-6">
                  <Link
                    href="/faq"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="block font-serif text-2xl sm:text-3xl font-medium text-[#131010] hover:text-[#2d5508] transition-colors"
                  >
                    Questions & Care
                  </Link>
                  <p className="font-mono text-xs text-[#7b7366] mt-1">
                    Ingredients, skin suitability, and prelaunch notifications
                  </p>
                </div>

                <div className="border-t border-[#e5dcd0] pt-6">
                  <Link
                    href="/consultation"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="block font-serif text-2xl sm:text-3xl font-medium text-[#131010] hover:text-[#2d5508] transition-colors"
                  >
                    Direct Consultation
                  </Link>
                  <p className="font-mono text-xs text-[#7b7366] mt-1">
                    One-on-one routine advice on WhatsApp
                  </p>
                </div>
              </nav>
            </div>

            {/* Bottom Actions inside Drawer: Moved Waitlist Button Here + WhatsApp */}
            <div className="pt-8 border-t border-[#e5dcd0] space-y-3">
              {isLive ? (
                <Link
                  href="/shop"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="w-full inline-flex items-center justify-center bg-[#2d5508] hover:bg-[#1e3b05] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.2em] py-3.5 px-6 border border-[#2d5508] transition-colors cursor-pointer text-center"
                >
                  Shop Botanical Collection
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMenuDrawerOpen(false);
                    setWaitlistOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center bg-[#2d5508] hover:bg-[#1e3b05] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.2em] py-3.5 px-6 border border-[#2d5508] transition-colors cursor-pointer"
                >
                  Join Pre-Launch Waitlist
                </button>
              )}

              <a
                href="https://wa.me/2348035650299"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.2em] py-3.5 px-6 border border-[#131010] hover:border-[#2d5508] transition-colors"
              >
                Chat on WhatsApp Care
              </a>

              <div className="flex items-center justify-between text-[11px] text-[#7b7366] font-mono pt-1">
                <span>Abuja, Nigeria</span>
                <span className="font-script text-lg text-[#2d5508]">&ldquo;....Own your spot.&rdquo;</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prelaunch Waitlist Slide-Over Drawer */}
      <NotifyMeDrawer
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </>
  );
}
