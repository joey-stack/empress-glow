import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/insforge/queries';

export const metadata: Metadata = {
  title: 'The Skincare Journal — Botanical Care & Rituals | Empress Glow Emporium',
  description:
    'Explore botanical skincare guides, fruit enzyme formulation spotlights, barrier repair routines, and melanin-first care advice from Empress Glow Emporium.',
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  const categories = ['All Articles', 'Ingredients', 'Rituals', 'Melanin Care'];

  return (
    <div className="bg-[#faf8f5] py-12 lg:py-20 text-[#131010]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-[#7b7366] mb-10 font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#131010] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#131010]">Skincare Journal</span>
        </nav>

        {/* 1. Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#2d5508] block mb-2">
            Nourish Your Knowledge
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#131010] mb-4">
            The Skincare Journal
          </h1>
          <p className="text-base sm:text-lg text-[#7b7366] leading-relaxed font-sans">
            Educational routines, Nigerian botanical spotlights, and melanin skin barrier care written with care and scientific honesty.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className={`px-4 py-1.5 rounded-none text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                  idx === 0
                    ? 'bg-[#131010] text-white'
                    : 'bg-white border border-[#e5dcd0] text-[#524f46] hover:border-[#2d5508] hover:text-[#2d5508]'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Featured Post Spotlight */}
        {featuredPost && (
          <div className="mb-20">
            <div className="bg-white rounded-none border border-[#e5dcd0] overflow-hidden shadow-none hover:border-[#2d5508]/40 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
              <div className="lg:col-span-5 aspect-[4/3] rounded-none bg-gradient-to-tr from-[#2d5508]/15 to-[#5a8210]/15 border border-[#e5dcd0] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                <span className="text-6xl mb-3">🌿</span>
                <span className="font-serif text-xl text-[#131010] font-semibold">Botanical Enzyme Spotlight</span>
                <span className="text-xs text-[#7b7366] uppercase tracking-wider mt-1">Carica Papaya & Avocado</span>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between py-2">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-none bg-[#f0f5ea] text-[#2d5508] text-xs font-semibold uppercase tracking-wider">
                      Featured • {featuredPost.category}
                    </span>
                    <span className="text-xs text-[#7b7366]">
                      {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-xs text-[#7b7366]">• 4 min read</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#131010] font-normal mb-4 leading-snug">
                    <Link href={`/blog/${featuredPost.slug}`} className="hover:text-[#2d5508] transition-colors">
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-sm sm:text-base text-[#7b7366] leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2d5508] hover:text-[#1e3b05] transition-colors"
                  >
                    Read Full Article →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Articles Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#131010] font-normal">
              Latest Skincare Insights
            </h2>
            <span className="text-xs text-[#7b7366]">Showing {posts.length} articles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-none border border-[#e5dcd0] overflow-hidden shadow-none hover:border-[#2d5508]/40 transition-all flex flex-col justify-between"
              >
                <div className="p-6 sm:p-8">
                  <div className="aspect-[16/9] rounded-none bg-gradient-to-tr from-[#faf8f5] to-[#f1ebe1] border border-[#e5dcd0] flex items-center justify-center mb-6 text-3xl">
                    {post.category === 'Rituals' ? '✨' : post.category === 'Melanin Care' ? '☀️' : '🍃'}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-none bg-[#f1ebe1] text-[#2d5508] text-[11px] font-semibold uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-[#7b7366]">• 4 min read</span>
                  </div>

                  <h3 className="font-serif text-xl text-[#131010] font-normal mb-3 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-[#2d5508] transition-colors">
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#7b7366] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="p-6 sm:p-8 pt-0 border-t border-[#f4f2ee] mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#7b7366]">
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-semibold text-[#2d5508] hover:underline"
                  >
                    Read Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 4. Journal Newsletter Capture Box */}
        <div className="bg-[#131010] text-white rounded-none p-8 sm:p-12 lg:p-16 text-center shadow-none relative overflow-hidden">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#5a8210] block mb-2">
              Stay Inspired & Informed
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal mb-4">
              Join The Empress Glow Journal List
            </h2>
            <p className="text-sm text-[#e5dcd0] leading-relaxed mb-8">
              Receive weekly traditional botanical recipes, melanin care routines, and first notice when handcrafted batches open for ordering.
            </p>

            <form
              action="/api/subscribers"
              method="POST"
              className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-none bg-white/10 border border-white/20 text-white placeholder-[#7b7366] text-sm focus:outline-none focus:ring-2 focus:ring-[#5a8210] flex-1"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#2d5508] hover:bg-[#1e3b05] text-white font-semibold text-sm rounded-none transition-all shadow-none whitespace-nowrap"
              >
                Join Journal List
              </button>
            </form>
            <p className="text-[11px] text-[#7b7366] mt-4">
              Zero spam. Unsubscribe at any time. Protected in accordance with the Nigerian Data Protection Act (NDPA).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
