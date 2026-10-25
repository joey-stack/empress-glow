import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getProducts } from '@/lib/insforge/queries';
import { isPrelaunch, isEmpressGlowBrand } from '@/lib/phase';
import { ShopCatalog } from '@/components/ui/shop-catalog';

export const metadata: Metadata = {
  title: 'Botanical Skincare Shop | Empress Glow Emporium',
  description: 'Explore handcrafted Nigerian fruit soaps, restorative serums, and barrier-repairing botanical creams.',
};

export default async function ShopPage() {
  // Defense-in-depth: Redirect to home in prelaunch phase
  if (isPrelaunch) {
    redirect('/');
  }

  const allProducts = await getProducts();
  const rawProducts = allProducts.filter((p) => p.status === 'active');
  const products = rawProducts.map((p) =>
    isEmpressGlowBrand(p.vendor) ? { ...p, price: 0, compare_at_price: undefined } : p
  );

  return (
    <div className="bg-[#faf6f0] py-10 lg:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb matching Orla Skin */}
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7b7366]">
          <a href="/" className="hover:text-[#131010] transition-colors">Home</a>
          <span>/</span>
          <span className="text-[#131010]">Shop All Products</span>
        </div>

        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#131010]">
            Shop All Products
          </h1>
          <p className="text-sm sm:text-base text-[#524b42] leading-relaxed">
            Explore our complete edit of thoughtful skincare essentials, handcrafted in Abuja and formulated at biological skin pH using genuine Nigerian fruits, cold-pressed oils, and plant extracts.
          </p>
        </div>

        {/* Catalog */}
        <ShopCatalog products={products} />
      </div>
    </div>
  );
}
