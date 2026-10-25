'use client';

import React, { useState } from 'react';
import { Review } from '@/lib/insforge/queries';

interface ProductReviewsProps {
  productSlug: string;
  productId: string;
  productName: string;
  initialReviews: Review[];
  isPrelaunch: boolean;
}

export function ProductReviews({
  productSlug,
  productId,
  productName,
  initialReviews,
  isPrelaunch,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
      : 5.0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          product_slug: productSlug,
          user_name: userName,
          user_email: userEmail,
          rating,
          title,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      setSubmitMessage(
        'Thank you! Your verified review has been submitted to Empress Glow moderators for review.'
      );
      setShowForm(false);
      setTitle('');
      setComment('');
    } catch (err: any) {
      setSubmitMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-[#e5dcd0]">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 pb-6 border-b border-[#e5dcd0]">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
            Customer Testimonials
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#131010]">
            Verified Customer Reviews
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-[#2d5508] text-sm">
              {'★'.repeat(Math.round(avgRating))}
              {'☆'.repeat(5 - Math.round(avgRating))}
            </div>
            <span className="font-mono text-xs font-semibold text-[#131010]">{avgRating} / 5</span>
            <span className="font-mono text-xs text-[#7b7366]">
              ({totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {/* Phase 1 vs Phase 2 Button */}
        {isPrelaunch ? (
          <div className="font-mono text-xs text-[#2d5508] bg-[#f7f5f0] px-4 py-2.5 rounded-none border border-[#e5dcd0]">
            Customer reviews activate in Phase 2 on launch
          </div>
        ) : (
          <button
            onClick={() => setShowForm(!showForm)}
            className="font-mono text-xs uppercase tracking-[0.18em] px-5 py-3 border border-[#131010] bg-[#131010] text-white hover:bg-[#2d5508] hover:border-[#2d5508] transition-colors rounded-none"
          >
            {showForm ? 'Cancel Review' : 'Write a Customer Review'}
          </button>
        )}
      </div>

      {submitMessage && (
        <div
          className={`p-4 rounded-none text-xs font-mono mb-6 border ${
            submitMessage.startsWith('Error')
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-[#f7f5f0] text-[#2d5508] border-[#e5dcd0]'
          }`}
        >
          {submitMessage}
        </div>
      )}

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-none border border-[#e5dcd0] space-y-4 mb-10 max-w-2xl"
        >
          <h3 className="font-serif text-lg font-normal text-[#131010]">
            Review {productName}
          </h3>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
              Your Star Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition ${
                    star <= rating ? 'text-[#2d5508]' : 'text-[#e5dcd0]'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Chioma N."
                className="w-full px-3 py-2.5 font-mono text-xs rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508]"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="e.g. chioma@example.com"
                className="w-full px-3 py-2.5 font-mono text-xs rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
              Review Headline Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The papaya enzyme is transformative!"
              className="w-full px-3 py-2.5 font-mono text-xs rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#7b7366] mb-1">
              Your Detailed Experience
            </label>
            <textarea
              rows={3}
              required
              minLength={10}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share how the natural botanicals felt on your skin..."
              className="w-full px-3 py-2.5 font-mono text-xs rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#2d5508] hover:bg-[#5a8210] text-white font-mono text-xs uppercase tracking-[0.18em] px-6 py-3 rounded-none transition shadow-none disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit for Moderation'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-none border border-[#e5dcd0]">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2d5508] block mb-2">Empress Archive</span>
          <p className="font-serif text-lg text-[#131010]">No published reviews yet</p>
          <p className="font-mono text-xs text-[#7b7366] mt-1">
            Be the first to experience and review this handcrafted botanical formulation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 sm:p-7 rounded-none border border-[#e5dcd0] flex flex-col justify-between space-y-4 hover:border-[#131010] transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#2d5508] text-xs">
                    {'★'.repeat(rev.rating)}
                    {'☆'.repeat(5 - rev.rating)}
                  </div>
                  <span className="font-mono text-[10px] text-[#7b7366]">
                    {new Date(rev.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h4 className="font-serif font-normal text-base text-[#131010] leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h4>

                <p className="text-xs text-[#524b42] leading-relaxed line-clamp-4">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-[#f0ece4] flex items-center justify-between font-mono text-xs">
                <span className="text-[#131010] font-medium">{rev.user_name}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#2d5508] bg-[#f7f5f0] border border-[#e5dcd0] px-2 py-0.5 rounded-none">
                  Verified Client
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
