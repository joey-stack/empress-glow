'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/insforge/queries';
import { ProductCard } from '@/components/ui/product-card';

interface ShopCatalogProps {
  products: Product[];
}

export function ShopCatalog({ products }: ShopCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const categories = useMemo(() => {
    const uniqueRaw = Array.from(
      new Set(
        products
          .map((p) => (p.category ? p.category.trim().toLowerCase() : ''))
          .filter(Boolean)
      )
    );
    return [
      { id: 'all', label: 'All Products' },
      ...uniqueRaw.map((cat) => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (product.category && product.category.trim().toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.price || 3000) - (b.price || 3000));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.price || 3000) - (a.price || 3000));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-12">
      {/* Category Pills & Search Bar (Sharp Architectural Aesthetics per Orla Skin) */}
      <div className="space-y-6 pb-6 border-b border-[#e5dcd0]">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-none font-mono text-[11px] uppercase tracking-[0.16em] whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'bg-[#131010] text-white border-[#131010]'
                    : 'bg-white text-[#7b7366] border-[#e5dcd0] hover:border-[#131010] hover:text-[#131010]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search botanical formulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 font-mono text-xs rounded-none border border-[#e5dcd0] bg-white text-[#131010] placeholder:text-[#9c9589] focus:outline-none focus:border-[#2d5508] transition-colors"
            />
            <span className="absolute left-3 top-3 text-xs text-[#9c9589]">
              ⌕
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 font-mono text-xs text-[#7b7366] hover:text-[#131010]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 font-mono text-xs rounded-none border border-[#e5dcd0] bg-white text-[#131010] focus:outline-none focus:border-[#2d5508] transition-colors cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid — Crisp sharp cards matching Orla Skin */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-none border border-[#e5dcd0] p-8 space-y-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2d5508] block">
            Botanical Archive
          </span>
          <h3 className="font-serif text-2xl text-[#131010]">
            No Formulations Found
          </h3>
          <p className="font-mono text-xs text-[#7b7366]">
            Try adjusting your search criteria or resetting filters to view all products.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em] px-5 py-2.5 bg-[#131010] text-white hover:bg-[#2d5508] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sitePhase={(process.env.NEXT_PUBLIC_SITE_PHASE as any) || 'prelaunch'}
            />
          ))}
        </div>
      )}

      {/* WhatsApp Consultation Box — Sharp Editorial Styling */}
      <div className="border border-[#e5dcd0] bg-white rounded-none p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block font-semibold">
            Personalized Skin Diagnostic
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#131010]">
            Unsure Which Formulation Fits Your Skin?
          </h3>
          <p className="text-xs sm:text-sm text-[#524b42] leading-relaxed">
            Chat directly with Mary Asuquo on WhatsApp for a tailored regimen matching your skin tone, Abuja climate defense, and barrier needs.
          </p>
        </div>

        <a
          href="https://wa.me/2348035650299?text=Hello%20Mary,%20I%20would%20like%20a%20skincare%20consultation%20from%20the%20shop%20catalog."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-[0.2em] bg-[#2d5508] hover:bg-[#5a8210] text-white py-4 px-8 rounded-none transition-colors whitespace-nowrap"
        >
          Inquire on WhatsApp →
        </a>
      </div>
    </div>
  );
}
