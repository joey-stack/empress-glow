import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/insforge/queries';
import { ProductsCatalog } from '@/components/ui/products-catalog';
import { isLive, isEmpressGlowBrand } from '@/lib/phase';

export const metadata: Metadata = {
  title: 'All Botanical Formulations | Empress Glow Emporium',
  description:
    'Explore handcrafted Nigerian botanical fruit soaps, bioactive enzyme formulations, restorative serums, and barrier-repairing creams for radiant melanin skin.',
};

export default async function ProductsPage() {
  const allProducts = await getProducts();
  const rawProducts = allProducts.filter((p) => p.status === 'active');
  const products = isLive
    ? rawProducts.map((p) => (isEmpressGlowBrand(p.vendor) ? { ...p, price: 0, compare_at_price: undefined } : p))
    : rawProducts.map((p) => ({
        ...p,
        price: 0,
        compare_at_price: undefined,
        cost_per_item: undefined,
      }));

  return (
    <div className="bg-[#f7f1e8] min-h-screen text-[#131010]">
      {/* Editorial Header */}
      <section className="border-b border-[#e5dcd0] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7b7366]">
            <Link href="/" className="hover:text-[#131010] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#131010]">All Formulations</span>
          </div>

          <div className="max-w-3xl space-y-3 pt-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
              Handcrafted in Abuja • Melanin Skin Care
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#131010] leading-tight">
              The Botanical Collection
            </h1>
            <p className="text-sm sm:text-base text-[#524b42] leading-relaxed max-w-2xl pt-1">
              Every preparation is formulated with biological West African fruit enzymes and cold-pressed botanical lipids. Zero synthetic bleaching agents. Formulated for everyday melanin wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <ProductsCatalog products={products} />
      </section>

      {/* Direct WhatsApp Consultation Strip */}
      <section className="border-t border-[#e5dcd0] bg-[#faf6f0] py-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7b7366] block">
            Unsure of Your Routine?
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#131010]">
            Speak with Mary Udoh on WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-[#524b42] leading-relaxed">
            Every customer is invited to a direct one-on-one routine discussion before reservation dispatch.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/2348035650299"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] py-3.5 px-7 font-mono text-xs uppercase tracking-[0.18em] transition-colors"
            >
              <span>Consult on WhatsApp</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
