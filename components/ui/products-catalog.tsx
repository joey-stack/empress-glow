'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ui/product-card';
import { NafdacCaveat } from '@/components/ui/nafdac-caveat';
import type { Product } from '@/lib/insforge/queries';

import { isLive } from '@/lib/phase';

interface ProductsCatalogProps {
  products: Product[];
}

export function ProductsCatalog({ products }: ProductsCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive dynamic category tabs directly from the live catalog
  const categories = useMemo(() => {
    const raw = Array.from(
      new Set(
        products
          .map((p) => (p.category ? p.category.trim() : ''))
          .filter(Boolean)
      )
    );
    return [
      'All',
      ...raw.map((c) => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((product) => {
      const prodCat = product.category ? product.category.trim().toLowerCase() : '';
      return prodCat === selectedCategory.toLowerCase();
    });
  }, [products, selectedCategory]);

  return (
    <div className="space-y-12">
      {/* Category Filter Tabs (Orla Style) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5dcd0] pb-6">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`font-mono text-xs uppercase tracking-[0.18em] px-4 py-2.5 transition-colors cursor-pointer border ${
                isActive
                  ? 'bg-[#131010] text-[#f7f1e8] border-[#131010]'
                  : 'bg-transparent text-[#131010] border-[#e5dcd0] hover:border-[#131010]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid (ORLA Borderless Editorial Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            sitePhase={isLive ? 'live' : 'prelaunch'}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 border border-[#e5dcd0] bg-white p-8">
          <p className="font-serif text-xl text-[#131010]">
            No formulations currently categorized under {selectedCategory}.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-[#2d5508] underline underline-offset-4"
          >
            Reset filter to All
          </button>
        </div>
      )}

      {/* Regulatory NAFDAC Caveat */}
      <div className="pt-8 border-t border-[#e5dcd0]">
        <NafdacCaveat />
      </div>
    </div>
  );
}
