import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { StoreChrome } from '@/components/layout/store-chrome';

export const metadata: Metadata = {
  title: 'Empress Glow Emporium | Natural Goodness. Radiant You.',
  description:
    'Handcrafted Nigerian botanical skincare and pure fruit enzyme formulations. Restoring melanin radiance, hydration, and skin barrier health naturally.',
  keywords: [
    'natural skincare nigeria',
    'fruity soap abuja',
    'botanical skincare',
    'mary asuquo',
    'empress glow emporium',
    'melanin skincare',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#f7f1e8] text-[#131010]">
        <Suspense fallback={null}>
          <StoreChrome>{children}</StoreChrome>
        </Suspense>
      </body>
    </html>
  );
}
