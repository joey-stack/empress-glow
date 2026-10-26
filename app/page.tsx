import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NotifyMeButton } from '@/components/ui/notify-me-button';
import { ProductCard } from '@/components/ui/product-card';
import { MarqueeTicker } from '@/components/ui/marquee-ticker';
import { CommunityCarousel } from '@/components/ui/community-carousel';
import { getProducts } from '@/lib/insforge/queries';
import { isLive, isEmpressGlowBrand } from '@/lib/phase';

export default async function HomePage() {
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
  const heroProduct = products.find((p) => p.slug === 'empress-glow-fruity-soap') || products[0];
  const supportingProducts = products.filter((p) => p.id !== heroProduct?.id);

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f1e8] text-[#131010]">
      {/* 1. CINEMATIC FULL-WIDTH VIDEO HERO (Model Face Unobstructed) */}
      <section className="relative w-full min-h-[750px] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#131010]">
        {/* Background Looping Cinematic Video with High-Res Priority Fallback */}
        <div className="absolute inset-0 w-full h-full z-0">
          {/* Priority High-Res Fallback Image for Immediate LCP Paint */}
          <Image
            src="/images/mary-hero-lifestyle.jpg"
            alt="Mary Asuquo holding Empress Glow Fruity Soap"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="w-full h-full object-cover object-center scale-102"
          />
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/mary-hero-lifestyle.jpg"
            className="w-full h-full object-cover object-center scale-102 relative z-[1]"
          >
            <source src="/images/herobgvide.mp4" type="video/mp4" />
          </video>
          {/* Edge Gradients - Center remains completely open & clear for model's face */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-black/55 pointer-events-none z-[2]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-[#131010]/80 pointer-events-none z-[2]" />
        </div>

        {/* Hero Asymmetrical Editorial Content Wrap */}
        <div className="relative z-10 max-w-7xl mx-auto w-full h-full min-h-[750px] lg:min-h-[90vh] px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 flex flex-col justify-between">
          {/* Top Left: Eyebrow & Compact Editorial Headline (Kept tightly to left so model's face is completely clear) */}
          <div className="max-w-xs sm:max-w-sm lg:max-w-md text-left space-y-3 pt-2">
            <div className="inline-flex items-center gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] px-3 py-1 bg-black/45 backdrop-blur-md border border-white/20 text-[#f7f1e8] rounded-none">
              <span className="w-1.5 h-1.5 rounded-none bg-[#5a8210] animate-pulse" />
              <span>Handcrafted in Abuja • Melanin Skin Care</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-normal leading-[1.12] tracking-tight text-white drop-shadow-md">
              The core collection for your everyday routine
            </h1>

            <p className="font-script text-xl sm:text-2xl text-[#5a8210] pt-0.5 drop-shadow-sm">
              &ldquo;....Own your spot.&rdquo;
            </p>
          </div>

          {/* Bottom Right: Subtext Description & CTAs (Positioned above WhatsApp Chat) */}
          <div className="flex justify-end pb-4 sm:pb-8">
            <div className="max-w-md sm:max-w-lg text-left space-y-5 bg-black/40 backdrop-blur-md p-6 sm:p-8 border border-white/15 rounded-none shadow-2xl">
              <p className="text-xs sm:text-sm text-[#f7f1e8] font-sans leading-relaxed font-light">
                Thoughtfully crafted botanical skincare designed for radiant melanin skin. Enriched with fresh Nigerian fruit enzymes, cold-pressed papaya, avocado, and restorative plant lipids. Zero harsh synthetics.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <NotifyMeButton
                  productSlug={heroProduct?.slug}
                  productName={heroProduct?.name}
                  vendor={heroProduct?.vendor}
                  navigateToProduct={true}
                  className="flex-1 min-h-[52px] h-[52px]"
                />
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center border border-white/30 bg-white/10 hover:bg-white hover:text-[#131010] text-[#f7f1e8] transition-colors py-4 px-6 min-h-[52px] h-[52px] font-mono text-xs uppercase tracking-[0.2em] text-center"
                >
                  Explore Formulations
                </Link>
              </div>

              <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-[#f7f1e8]/70 border-t border-white/15">
                <span>Founded by Mary Asuquo • Biochemist</span>
                <span className="text-[#5a8210]">Cold-Pressed Batch 04</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE PILLAR MARQUEE TICKER */}
      <MarqueeTicker />

      {/* 3. CURATED BOTANICAL SHOWCASE (Orla 3-Column Grid - 1 Row) */}
      <section id="products" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 border-t border-[#e5dcd0]">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#e5dcd0] pb-6 gap-4">
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7b7366] block">
              Pure Nigerian Formulations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#131010] font-normal">
              Curated Botanical Collection
            </h2>
          </div>
          <Link
            href={isLive ? '/shop' : '/products'}
            className="font-mono text-xs uppercase tracking-[0.18em] text-[#131010] hover:text-[#2d5508] transition-colors flex items-center gap-2"
          >
            <span>{isLive ? 'Shop All Botanical Formulations' : 'Explore All Formulations'}</span>
            <span>→</span>
          </Link>
        </div>

        {/* Product Cards Grid: Exactly 1 single row of 3 signature formulations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {heroProduct && (
            <ProductCard
              product={heroProduct}
              badge="Hero Formulation"
              sitePhase={isLive ? 'live' : 'prelaunch'}
              priority
            />
          )}
          {supportingProducts.slice(0, 2).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sitePhase={isLive ? 'live' : 'prelaunch'}
            />
          ))}
        </div>
      </section>

      {/* 4. OUR STORY — CINEMATIC FULL-WIDTH FOUNDER BANNER (Orla Skin Reference) */}
      <section className="relative w-full min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex flex-col justify-between overflow-hidden bg-[#131010] border-y border-[#e5dcd0]">
        {/* Background Founder Imagery */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/images/mary-1.png"
            alt="Mary Asuquo, Biochemist & Founder of Empress Glow Emporium"
            fill
            sizes="100vw"
            priority={false}
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
          />
          {/* Cinematic Editorial Overlays for Contrast & Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#131010]/95 via-[#131010]/45 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131010]/70 via-transparent to-[#131010]/70 pointer-events-none" />
        </div>

        {/* Top Floating Badge */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 flex justify-start">
          <div className="inline-flex items-center gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] px-3.5 py-1.5 bg-black/50 backdrop-blur-md border border-white/20 text-[#f7f1e8] rounded-none">
            <span className="w-1.5 h-1.5 rounded-none bg-[#5a8210] animate-pulse" />
            <span>Biochemist-Formulated • Abuja, Nigeria</span>
          </div>
        </div>

        {/* Bottom Split Layout: Short Text on Left Bottom, Heading & Our Story Button on Right Bottom */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Left Bottom: Short narrative text description */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a8210] block">
                The Founder's Journey
              </span>
              <p className="text-sm sm:text-base text-[#f7f1e8]/90 font-light leading-relaxed max-w-xl">
                Started in her second year at university, biochemist Mary Asuquo watched young women continuously battling acne, hyperpigmentation, and blackheads. Driven by scientific inquiry, she formulated bioactive recipes using fresh fruit enzymes and cold-pressed botanical lipids to manage skin concerns and nourish melanin barriers without harsh bleaches.
              </p>
              <p className="font-script text-2xl sm:text-3xl text-[#5a8210] pt-1">
                &ldquo;....Own your spot.&rdquo;
              </p>
            </div>

            {/* Right Bottom: Section Heading and "Our Story" Button */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end space-y-5 text-left lg:text-right">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.15] tracking-tight drop-shadow-md">
                Our Story
              </h2>
              <div className="flex items-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center border border-white/30 bg-white/10 hover:bg-white hover:text-[#131010] text-[#f7f1e8] backdrop-blur-md transition-all py-3.5 px-8 font-mono text-xs uppercase tracking-[0.2em] group"
                >
                  <span>Our Story</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3-STEP BOTANICAL RITUALS STRIP */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7b7366] block">
            The Daily Routine
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#131010] font-normal">
            Three Steps to Natural Radiance
          </h2>
          <p className="text-xs sm:text-sm text-[#524b42]">
            Thoughtfully structured regimens designed to respect your biological skin pH.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-[#e5dcd0] p-8 bg-[#ffffff] space-y-4">
            <span className="font-mono text-xs text-[#2d5508] block">Step 01</span>
            <h3 className="font-serif text-xl text-[#131010]">Enzymatic Cleansing</h3>
            <p className="text-xs text-[#524b42] leading-relaxed">
              Lather the Empress Glow Fruity Soap with lukewarm water. Allow rich bioactive enzymes 60 seconds to gently dissolve buildup.
            </p>
          </div>

          <div className="border border-[#e5dcd0] p-8 bg-[#ffffff] space-y-4">
            <span className="font-mono text-xs text-[#2d5508] block">Step 02</span>
            <h3 className="font-serif text-xl text-[#131010]">Cellular Hydration</h3>
            <p className="text-xs text-[#524b42] leading-relaxed">
              Replenish deep hydration using fresh botanical hydration, replenishing moisture lost to Abuja sun and tropical humidity.
            </p>
          </div>

          <div className="border border-[#e5dcd0] p-8 bg-[#ffffff] space-y-4">
            <span className="font-mono text-xs text-[#2d5508] block">Step 03</span>
            <h3 className="font-serif text-xl text-[#131010]">Barrier Nourishment</h3>
            <p className="text-xs text-[#524b42] leading-relaxed">
              Seal with rich African cold-pressed seed oils to lock in hydration and maintain barrier resilience against environmental stressors.
            </p>
          </div>
        </div>
      </section>

      {/* 6. COMMUNITY FEEDBACK & VERIFIED WHATSAPP PROOF CAROUSEL (Orla Style - Second to Last) */}
      <CommunityCarousel />

      {/* 7. DIRECT WHATSAPP CONSULTATION BANNER */}
      <section className="bg-[#131010] text-[#f7f1e8] py-16 sm:py-20 border-t border-[#262220]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5a8210] block">
            Personal Care Service
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
            Need Guidance on Your Skin Type?
          </h2>
          <p className="text-sm text-[#a89e90] max-w-xl mx-auto leading-relaxed">
            Speak directly with Mary Asuquo on WhatsApp for personal advice tailored to your skin’s unique sensitivities, routine, and climate.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/2348035650299"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f7f1e8] hover:bg-[#5a8210] text-[#131010] hover:text-white py-4 px-8 font-mono text-xs uppercase tracking-[0.2em] font-medium transition-colors"
            >
              <span>Chat with Mary on WhatsApp</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
