'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NotifyMeDrawer } from './notify-me-drawer';
import { isLive, isEmpressGlowBrand } from '@/lib/phase';

interface NotifyMeButtonProps {
  productSlug?: string;
  productName?: string;
  vendor?: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'pill';
  navigateToProduct?: boolean;
}

export function NotifyMeButton({
  productSlug = 'empress-glow-fruity-soap',
  productName = 'Empress Glow Fruity Soap',
  vendor = 'Empress Glow',
  className = '',
  variant = 'primary',
  navigateToProduct = false,
}: NotifyMeButtonProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const baseStyles =
    'inline-flex items-center justify-center font-mono text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-200 cursor-pointer min-h-[52px] h-[52px] py-4 px-6 sm:px-7 text-center box-border';

  let variantStyles = 'bg-[#131010] text-[#f7f1e8] hover:bg-[#2d5508] border border-[#131010] hover:border-[#2d5508]';
  if (variant === 'outline') {
    variantStyles = 'border border-[#131010] text-[#131010] bg-transparent hover:bg-[#131010] hover:text-[#f7f1e8]';
  } else if (variant === 'pill') {
    variantStyles = 'bg-[#131010] text-[#f7f1e8] hover:bg-[#2d5508] border border-[#131010] hover:border-[#2d5508] rounded-none text-[11px]';
  }

  // If navigateToProduct is set, navigate directly to product page
  if (navigateToProduct) {
    return (
      <Link
        href={productSlug ? `/product/${productSlug}` : '/products'}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        <span>Notify Me When Available</span>
      </Link>
    );
  }

  // Empress Glow products remain in prelaunch Notify Me mode; partner brands link to order
  const isEmpress = isEmpressGlowBrand(vendor);
  if (isLive && !isEmpress) {
    return (
      <Link
        href={productSlug ? `/product/${productSlug}` : '/shop'}
        className={`${baseStyles} bg-[#2d5508] text-white hover:bg-[#5a8210] border border-[#2d5508] hover:border-[#5a8210] ${className}`}
      >
        <span>Order Formulation</span>
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        <span>Notify Me When Available</span>
      </button>

      <NotifyMeDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productSlug={productSlug}
        productName={productName}
      />
    </>
  );
}

