'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloat } from '@/components/ui/whatsapp-float';
import { CookieConsent } from '@/components/ui/cookie-consent';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { CartProvider } from '@/lib/cart/cart-context';

export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAdmin || isAuthPage) {
    return (
      <div className={`w-full ${isAuthPage ? 'h-screen overflow-hidden bg-white' : 'min-h-screen bg-[#f6f6f7]'} text-[#1a1a1a]`}>
        {children}
      </div>
    );
  }

  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <CookieConsent />
      <CartDrawer />
    </CartProvider>
  );
}
