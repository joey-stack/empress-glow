import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getProductBySlug,
  getProducts,
  getProductVariants,
  getApprovedReviewsByProductSlug,
} from '@/lib/insforge/queries';
import { NafdacCaveat } from '@/components/ui/nafdac-caveat';
import { VariantSelector } from '@/components/ui/variant-selector';
import { ProductReviews } from '@/components/product/product-reviews';
import { ProductCard } from '@/components/ui/product-card';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductAccordions } from '@/components/product/product-accordions';
import { ProductPrelaunchActions } from '@/components/product/product-prelaunch-actions';
import { isLive, isEmpressGlowBrand } from '@/lib/phase';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found | Empress Glow Emporium' };

  return {
    title: `${product.name} | Empress Glow Emporium`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isEmpress = isEmpressGlowBrand(product.vendor);
  const isProductLive = isLive && !isEmpress;

  const allProducts = await getProducts();
  const rawRelated = allProducts.filter((p) => p.slug !== slug && p.status === 'active').slice(0, 3);
  const relatedProducts = isLive
    ? rawRelated.map((p) => (isEmpressGlowBrand(p.vendor) ? { ...p, price: 0, compare_at_price: undefined } : p))
    : rawRelated.map((p) => ({
        ...p,
        price: 0,
        compare_at_price: undefined,
        cost_per_item: undefined,
      }));

  const whatsappInquiryUrl = `https://wa.me/2348035650299?text=${encodeURIComponent(
    `Hello Mary, I am inquiring about Empress Glow's ${product.name} from the pre-launch catalog.`
  )}`;

  const variants = await getProductVariants(product.id);
  const reviews = await getApprovedReviewsByProductSlug(slug);

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : ['/images/fruity-soap-hero.jpg'];

  return (
    <div className="bg-[#f7f1e8] text-[#131010] min-h-screen">
      {/* 1. Breadcrumbs Strip */}
      <div className="border-b border-[#e5dcd0] bg-[#faf6f0]/70 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7b7366]">
            <Link href="/" className="hover:text-[#131010] transition-colors">
              Home
            </Link>
            <span className="text-[#e5dcd0]">/</span>
            <Link href={isLive ? '/shop' : '/products'} className="hover:text-[#131010] transition-colors">
              Products
            </Link>
            <span className="text-[#e5dcd0]">/</span>
            <span className="text-[#131010] font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* 2. Main PDP 2-Column Split (ORLA Editorial Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Vertical Editorial Image Stack / Carousel */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={galleryImages}
              productName={product.name}
            />
          </div>

          {/* Right Column: Sticky Product Info & Actions */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-7">
            {/* Header: Category & Title */}
            <div className="space-y-3 pb-6 border-b border-[#e5dcd0]">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2d5508]">
                <span className="font-semibold">{product.vendor || 'Empress Glow'}</span>
                <span>•</span>
                <span>{product.category || 'Botanical Care'}</span>
                <span>•</span>
                <span className="bg-[#faf6f0] px-2 py-0.5 border border-[#e5dcd0] text-[#131010]">
                  Handcrafted Abuja
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#131010] leading-[1.15]">
                {product.name}
              </h1>

              <p className="font-script text-2xl sm:text-3xl text-[#2d5508] pt-1">
                &ldquo;....Own your spot.&rdquo;
              </p>
            </div>

            {/* Traditional Use & Botanical Framing Description */}
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-[#524b42] leading-relaxed">
                {product.description}
              </p>

              {/* Three Pillar Badges */}
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px] text-center uppercase tracking-wider text-[#7b7366]">
                <div className="p-2 border border-[#e5dcd0] bg-white">
                  <span className="text-[#2d5508] block text-xs mb-0.5">✦</span>
                  <span>Cold Enzyme</span>
                </div>
                <div className="p-2 border border-[#e5dcd0] bg-white">
                  <span className="text-[#2d5508] block text-xs mb-0.5">✦</span>
                  <span>Zero Hydroquinone</span>
                </div>
                <div className="p-2 border border-[#e5dcd0] bg-white">
                  <span className="text-[#2d5508] block text-xs mb-0.5">✦</span>
                  <span>Melanin First</span>
                </div>
              </div>
            </div>

            {/* Actions: Prelaunch Waitlist for Empress Glow vs Live Checkout for Partner Brands */}
            {isProductLive ? (
              <VariantSelector
                product={product}
                variants={variants}
                whatsappInquiryUrl={whatsappInquiryUrl}
              />
            ) : (
              <ProductPrelaunchActions
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  sku: product.sku,
                }}
                variants={variants.map((v) => ({
                  name: v.name,
                  sku: v.sku,
                }))}
                whatsappInquiryUrl={whatsappInquiryUrl}
              />
            )}

            {/* Mandatory Statutory Regulatory Caveat */}
            <NafdacCaveat />

            {/* Editorial Information Accordions */}
            <ProductAccordions
              ingredients={product.ingredients}
              productName={product.name}
            />
          </div>
        </div>

        {/* 3. Authentic Customer Reviews & Feedback Section */}
        <div className="mt-24 pt-16 border-t border-[#e5dcd0]">
          <div className="space-y-2 mb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#2d5508] block">
              Verified Client Experiences
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#131010]">
              Skin Transformation & Community Reviews
            </h2>
          </div>

          <ProductReviews
            productSlug={product.slug}
            productId={product.id}
            productName={product.name}
            initialReviews={reviews}
            isPrelaunch={!isLive}
          />
        </div>

        {/* 4. Complementary Regimen (Matching ORLA ProductCard Grid) */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#e5dcd0] space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#e5dcd0] gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#2d5508] block mb-1">
                  Complete The Ritual
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#131010]">
                  Complementary Botanical Formulations
                </h2>
              </div>
              <Link
                href={isLive ? '/shop' : '/products'}
                className="font-mono text-xs uppercase tracking-[0.2em] text-[#131010] hover:text-[#2d5508] transition-colors pb-1 inline-flex items-center gap-1.5"
              >
                <span>View Full Collection</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  sitePhase={isLive ? 'live' : 'prelaunch'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
