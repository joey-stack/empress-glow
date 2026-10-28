'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/insforge/queries';
import { useCart } from '@/lib/cart/cart-context';
import { NotifyMeDrawer } from '@/components/ui/notify-me-drawer';
import { isEmpressGlowBrand } from '@/lib/phase';

export interface ProductCardProps {
  product: Product;
  sitePhase?: 'prelaunch' | 'live';
  badge?: string;
  subtitle?: string;
  priority?: boolean;
}

export function ProductCard({
  product,
  sitePhase = (process.env.NEXT_PUBLIC_SITE_PHASE as 'prelaunch' | 'live') || 'prelaunch',
  badge,
  subtitle,
  priority = false,
}: ProductCardProps) {
  const isHero = product.slug === 'empress-glow-fruity-soap';
  const isEmpress = isEmpressGlowBrand(product.vendor);
  const isLiveProduct = sitePhase === 'live';
  const effectiveBadge = badge || (isHero ? 'Hero Formulation' : product.status === 'draft' ? 'Archive' : undefined);
  const productImage = product.images?.[0] || '/images/fruity-soap-hero.jpg';
  const displaySubtitle =
    subtitle ||
    (product.category
      ? `${product.category.charAt(0).toUpperCase() + product.category.slice(1)} Formulation`
      : 'Botanical Formulation');

  const { addItem, setIsCartOpen } = useCart();
  const [notifyDrawerOpen, setNotifyDrawerOpen] = useState(false);

  const handleAddToBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiveProduct) {
      try {
        addItem({
          productId: product.id,
          variantId: product.id,
          name: product.name,
          variantName: isHero ? 'Standard Size' : 'Standard',
          price: product.price || 0,
          quantity: 1,
          image: productImage,
        });
        setIsCartOpen(true);
      } catch (err) {
        console.warn('Cart error', err);
      }
    } else {
      setNotifyDrawerOpen(true);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col w-full transition-all duration-300">
        <Link
          href={`/product/${product.slug}`}
          className="flex flex-col w-full cursor-pointer"
        >
          {/* Edge-to-Edge 4:5 Vertical Image Frame with Zero Border Radius (Exact ORLA Reference) */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-none bg-[#f5efe6]">
            <Image
              src={productImage}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Crisp Top-Left Editorial Tag (ORLA Reference Style) */}
            {effectiveBadge && (
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] font-medium px-3 py-1.5 bg-white text-[#131010] rounded-none shadow-xs">
                  {effectiveBadge}
                </span>
              </div>
            )}

            {/* On-Hover Slide-Up Action Bar */}
            <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden">
              <button
                type="button"
                onClick={handleAddToBasket}
                className="w-full bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] py-3.5 px-4 text-center flex items-center justify-center gap-2 transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer shadow-lg"
              >
                {isLiveProduct ? (
                  <>
                    <span className="text-sm font-light">+</span>
                    <span>Add To Shopping Basket</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">✦</span>
                    <span>Reserve On Waitlist</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Clean Editorial Typographic Hierarchy Below Image */}
          <div className="pt-3.5 flex flex-col space-y-1">
            {/* Line 1: Bold Uppercase Product Name */}
            <h3 className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#131010] group-hover:text-[#2d5508] transition-colors leading-snug">
              {product.name}
            </h3>

            {/* Line 2: Descriptor / Subtitle */}
            <p className="font-sans text-xs text-[#7b7366] font-normal capitalize">
              {displaySubtitle}
            </p>

            {/* Line 3: Price (Live Partner Brands) or Action (Prelaunch / Empress Glow) */}
            {isLiveProduct ? (
              <div className="font-sans text-xs sm:text-sm font-medium text-[#131010] pt-0.5 flex items-baseline gap-1.5">
                {isHero && <span className="font-mono text-[10px] text-[#7b7366] uppercase tracking-wider">From</span>}
                <span>₦{(product.price || 0).toLocaleString()}</span>
                {product.compare_at_price && product.compare_at_price > (product.price || 0) && (
                  <span className="font-mono text-[11px] text-[#9c9589] line-through">
                    ₦{product.compare_at_price.toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <div className="font-sans text-xs font-medium text-[#2d5508] uppercase tracking-wider pt-0.5 group-hover:underline inline-flex items-center gap-1">
                <span>Notify Me When Available</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Slide-out waitlist reservation drawer when clicked in prelaunch */}
      <NotifyMeDrawer
        isOpen={notifyDrawerOpen}
        onClose={() => setNotifyDrawerOpen(false)}
        productSlug={product.slug}
        productName={product.name}
      />
    </>
  );
}
