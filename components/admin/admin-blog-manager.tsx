'use client';

import React, { useState } from 'react';
import { BlogPost } from '@/lib/insforge/queries';

interface AdminBlogManagerProps {
  initialPosts: BlogPost[];
}

export function AdminBlogManager({ initialPosts }: AdminBlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Ingredients');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('/images/blog-papaya.jpg');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleStartCreate = () => {
    setSelectedPost(null);
    setIsCreating(true);
    setTitle('');
    setSlug('');
    setCategory('Ingredients');
    setExcerpt('');
    setContent('');
    setFeaturedImage('/images/blog-papaya.jpg');
    setStatus('draft');
    setSeoTitle('');
    setSeoDescription('');
    setMessage(null);
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsCreating(false);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setFeaturedImage(post.featured_image);
    setStatus(post.status as 'draft' | 'published');
    setSeoTitle(post.seo_title || post.title);
    setSeoDescription(post.seo_description || post.excerpt);
    setMessage(null);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isCreating) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (isCreating) {
        const res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug,
            category,
            excerpt,
            content,
            featured_image: featuredImage,
            status,
            seo_title: seoTitle,
            seo_description: seoDescription,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create article');

        setPosts((prev) => [data.post, ...prev]);
        setSelectedPost(data.post);
        setIsCreating(false);
        setMessage('Article created successfully and added to journal.');
      } else if (selectedPost) {
        const res = await fetch('/api/admin/blog', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedPost.id,
            title,
            slug,
            category,
            excerpt,
            content,
            featured_image: featuredImage,
            status,
            seo_title: seoTitle,
            seo_description: seoDescription,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update article');

        setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? data.post : p)));
        setSelectedPost(data.post);
        setMessage('Article updated and cache revalidated.');
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal article?')) return;

    try {
      const res = await fetch(`/api/admin/blog?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete article');

      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (selectedPost?.id === id) {
        setSelectedPost(null);
      }
      setMessage('Article deleted.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 border border-[#e5dcd0] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
            Storefront Content &bull; Botanical Journal
          </span>
          <h1 className="font-serif text-2xl font-normal text-[#131010] tracking-tight">
            The Botanical Journal CMS
          </h1>
          <p className="text-xs text-[#7b7366] mt-1 max-w-2xl leading-relaxed">
            Author and publish educational skincare guides, herbal formulation profiles, and SEO articles.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] px-4 py-2.5 border border-[#131010] hover:border-[#2d5508] transition-colors"
        >
          + New Journal Article
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Article List */}
        <div className="lg:col-span-1 bg-white border border-[#e5dcd0] p-4 space-y-3">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] px-2 py-1 border-b border-[#e5dcd0]">
            Articles ({posts.length})
          </h2>

          <div className="space-y-2">
            {posts.map((post) => {
              const isSelected = selectedPost?.id === post.id;
              return (
                <div
                  key={post.id}
                  onClick={() => handleSelectPost(post)}
                  className={`p-3.5 transition cursor-pointer flex flex-col justify-between space-y-2 border ${
                    isSelected
                      ? 'bg-[#131010] text-[#f7f1e8] border-[#131010]'
                      : 'hover:bg-[#faf8f5] text-[#131010] border-[#e5dcd0] bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xs font-medium leading-snug line-clamp-2">{post.title}</h3>
                    <span
                      className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 border flex-shrink-0 ${
                        post.status === 'published'
                          ? 'bg-[#2d5508]/20 text-[#a3d95b] border-[#2d5508]'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center font-mono text-[9px] opacity-75">
                    <span className="capitalize">{post.category}</span>
                    <span>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'Draft'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Article Editor */}
        <div className="lg:col-span-2 bg-white border border-[#e5dcd0] p-6 sm:p-8 space-y-5">
          {isCreating || selectedPost ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-[#e5dcd0]">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5a8210]">
                  {isCreating ? 'Draft New Article' : `Editing: ${selectedPost?.title}`}
                </span>
                {!isCreating && selectedPost && (
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedPost.id)}
                    className="font-mono text-[10px] uppercase tracking-wider text-red-600 hover:text-red-800"
                  >
                    Delete Article
                  </button>
                )}
              </div>

              {message && (
                <div
                  className={`p-3 border font-mono text-xs ${
                    message.startsWith('Error')
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Natural Care for Melanin Skin"
                    className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="natural-care-melanin-skin"
                    className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] font-mono text-[#131010] outline-none"
                  />
                </div>
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none"
                  >
                    <option value="Ingredients">Ingredients</option>
                    <option value="Rituals">Rituals</option>
                    <option value="Melanin Care">Melanin Care</option>
                    <option value="Skin Health">Skin Health</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none font-semibold"
                  >
                    <option value="draft">Draft (Saved Privately)</option>
                    <option value="published">Published (Visible in Journal)</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                  Excerpt Summary (1-2 sentences)
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summary teaser for cards and search engine results..."
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] text-[#131010] outline-none placeholder:text-[#7b7366]"
                />
              </div>

              {/* Content Markdown */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                  Article Body (Markdown Supported)
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="### Section Heading&#10;&#10;Write educational botanical skincare formulation insights here..."
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] font-mono text-xs text-[#131010] outline-none leading-relaxed placeholder:text-[#7b7366]"
                />
              </div>

              {/* SEO Inputs */}
              <div className="bg-[#faf8f5] p-4 border border-[#e5dcd0] space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d5508] font-semibold">
                  SEO &amp; Search Engine Metadata
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[9px] uppercase text-[#7b7366] mb-1">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Title tag for Google results"
                      className="w-full px-3 py-1.5 text-xs border border-[#e5dcd0] bg-white text-[#131010] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase text-[#7b7366] mb-1">
                      SEO Meta Description
                    </label>
                    <input
                      type="text"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Meta description for search engines"
                      className="w-full px-3 py-1.5 text-xs border border-[#e5dcd0] bg-white text-[#131010] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#e5dcd0]">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] px-6 py-2.5 border border-[#131010] hover:border-[#2d5508] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : status === 'published' ? 'Publish Article' : 'Save Draft'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-16 text-center text-[#7b7366] font-mono text-xs space-y-2">
              <span className="text-3xl block">📖</span>
              <p>Select an article from the left, or click &ldquo;+ New Journal Article&rdquo; to draft fresh content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
