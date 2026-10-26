import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlogPosts, getBlogPostBySlug, SEED_HERO_PRODUCT } from '@/lib/insforge/queries';
import { NafdacCaveat } from '@/components/ui/nafdac-caveat';
import { NotifyMeButton } from '@/components/ui/notify-me-button';
import { isLive } from '@/lib/phase';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: 'Article Not Found | Empress Glow Emporium',
    };
  }

  return {
    title: `${post.title} — Skincare Journal | Empress Glow Emporium`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const shareText = encodeURIComponent(`${post.title} — Empress Glow Skincare Journal`);
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <div className="bg-[#faf8f5] py-12 lg:py-20 text-[#131010]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-[#7b7366] mb-10 font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#131010] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#131010] transition-colors">
            Skincare Journal
          </Link>
          <span>/</span>
          <span className="text-[#131010] truncate max-w-xs">{post.title}</span>
        </nav>

        {/* 1. Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-none bg-[#f1ebe1] text-[#2d5508] text-xs font-semibold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-[#7b7366]">
              {new Date(post.published_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="text-xs text-[#7b7366]">• 4 min read</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#131010] mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[#7b7366] leading-relaxed font-sans pb-6 border-b border-[#e5dcd0]">
            {post.excerpt}
          </p>

          {/* Author Byline */}
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#2d5508] text-white flex items-center justify-center font-serif font-bold text-sm">
                MA
              </div>
              <div>
                <span className="font-semibold text-xs text-[#131010] block">Mary Asuquo</span>
                <span className="text-[11px] text-[#7b7366]">Biochemist, Founder & Formulator</span>
              </div>
            </div>

            {/* Share Trigger */}
            <div className="flex items-center gap-2">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-none bg-[#2d5508]/10 text-[#2d5508] hover:bg-[#2d5508]/20 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
              >
                Share on WhatsApp
              </a>
            </div>
          </div>
        </header>

        {/* 2. Featured Image / Visual Banner */}
        <div className="mb-12 aspect-[16/9] rounded-none bg-gradient-to-tr from-[#2d5508]/10 via-[#5a8210]/10 to-[#2d5508]/5 border border-[#e5dcd0] flex flex-col items-center justify-center p-8 text-center">
          <span className="text-6xl mb-3">🌿</span>
          <span className="font-serif text-xl sm:text-2xl text-[#131010] font-normal">
            Empress Glow Skincare Journal
          </span>
          <span className="text-xs text-[#7b7366] uppercase tracking-wider mt-1">
            Handcrafted African Botanical Wisdom
          </span>
        </div>

        {/* 3. Article Content Body */}
        <div className="bg-white rounded-none border border-[#e5dcd0] p-8 sm:p-12 mb-16 shadow-none">
          <div className="space-y-6 text-[#4a473f] text-base leading-relaxed font-sans">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h2
                    key={idx}
                    className="font-serif text-2xl sm:text-3xl text-[#131010] font-normal pt-6 pb-2 border-b border-[#faf8f5]"
                  >
                    {paragraph.replace('### ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ')) {
                return (
                  <div key={idx} className="pl-4 border-l-2 border-[#2d5508] py-1 text-sm sm:text-base font-medium text-[#131010]">
                    {paragraph}
                  </div>
                );
              }
              return (
                <p key={idx} className="text-[#7b7366]">
                  {paragraph}
                </p>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-[#e5dcd0]">
            <NafdacCaveat />
          </div>
        </div>

        {/* 4. Contextual Product Recommendation Card (Pre-launch Mode) */}
        <div className="bg-[#f0f5ea]/60 rounded-none border border-[#e5dcd0] p-8 sm:p-10 mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
            Recommended Botanical Care
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
            <div className="sm:col-span-8">
              <h3 className="font-serif text-2xl text-[#131010] font-normal mb-2">
                {SEED_HERO_PRODUCT.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#7b7366] leading-relaxed mb-4">
                {SEED_HERO_PRODUCT.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {SEED_HERO_PRODUCT.ingredients.slice(0, 4).map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-none bg-white border border-[#e5dcd0] text-[11px] text-[#2d5508] font-medium"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="sm:col-span-4 flex flex-col gap-3">
              {isLive ? (
                <Link
                  href={`/product/${SEED_HERO_PRODUCT.slug}`}
                  className="w-full py-3 px-4 text-center rounded-none bg-[#2d5508] text-white text-xs font-semibold hover:bg-[#5a8210] transition-all shadow-none block"
                >
                  Order Formulation (From ₦3,000)
                </Link>
              ) : (
                <NotifyMeButton productSlug={SEED_HERO_PRODUCT.slug} className="w-full text-center" />
              )}
              <a
                href="https://wa.me/2348035650299"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 text-center rounded-none bg-white border border-[#e5dcd0] text-[#131010] text-xs font-semibold hover:bg-[#faf8f5] transition-all"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* 5. Author Bio Box */}
        <div className="bg-white rounded-none border border-[#e5dcd0] p-8 sm:p-10 mb-16 shadow-none flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-20 h-20 rounded-none bg-gradient-to-tr from-[#2d5508] to-[#5a8210] p-1 flex-shrink-0">
            <div className="w-full h-full rounded-none bg-[#faf8f5] flex items-center justify-center font-serif text-2xl font-bold text-[#2d5508]">
              MA
            </div>
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#131010] font-normal mb-1">
              About Mary Asuquo
            </h3>
            <p className="text-xs text-[#7b7366] uppercase tracking-wider mb-2">
              Biochemist & Founder • Abuja, Nigeria
            </p>
            <p className="text-xs sm:text-sm text-[#7b7366] leading-relaxed">
              Mary Asuquo began formulating during her second year at university, applying her background in biochemistry to engineer natural bioactive recipes for young women battling acne, hyperpigmentation, and blackheads. She founded Empress Glow Emporium to provide gentle, science-backed botanical care honoring melanin skin.
            </p>
          </div>
        </div>

        {/* 6. Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mb-16">
            <h3 className="font-serif text-2xl text-[#131010] font-normal mb-6">
              Continue Reading
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <article
                  key={related.id}
                  className="bg-white rounded-none border border-[#e5dcd0] p-6 hover:border-[#2d5508]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-[#2d5508] uppercase tracking-wider block mb-2">
                      {related.category}
                    </span>
                    <h4 className="font-serif text-base text-[#131010] font-normal mb-2 leading-snug">
                      <Link href={`/blog/${related.slug}`} className="hover:text-[#2d5508] transition-colors">
                        {related.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-[#7b7366] leading-relaxed line-clamp-2 mb-4">
                      {related.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${related.slug}`}
                    className="text-xs font-semibold text-[#2d5508] hover:underline"
                  >
                    Read Story →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#524f46] hover:text-[#2d5508] transition-colors"
          >
            ← Back to All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
