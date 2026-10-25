'use client';

import React, { useState } from 'react';
import { Review } from '@/lib/insforge/queries';

interface AdminReviewsModeratorProps {
  initialReviews: Review[];
}

export function AdminReviewsModerator({ initialReviews }: AdminReviewsModeratorProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

  const currentList = reviews.filter((r) => r.status === tab);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setLoadingId(id);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update review');

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      setMessage(`Review #${id} status changed to ${newStatus}.`);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;

    setLoadingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete review');

      setReviews((prev) => prev.filter((r) => r.id !== id));
      setMessage(`Review #${id} permanently deleted.`);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 border border-[#e5dcd0] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
            Social Proof &bull; NAFDAC Vetting Queue
          </span>
          <h1 className="font-serif text-2xl font-normal text-[#131010] tracking-tight">
            Review Moderation &amp; Claims Vetting
          </h1>
          <p className="text-xs text-[#7b7366] mt-1 max-w-2xl leading-relaxed">
            Vet customer feedback, approve authentic botanical testimonials, and reject unverified medical or disease-treatment claims per NAFDAC guidelines.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border border-[#e5dcd0] p-1 bg-[#faf8f5]">
          <button
            onClick={() => setTab('pending')}
            className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
              tab === 'pending'
                ? 'bg-[#131010] text-[#f7f1e8] font-medium'
                : 'text-[#7b7366] hover:text-[#131010] hover:bg-white'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="bg-[#2d5508] text-white font-mono text-[9px] px-1.5 py-0.2">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('approved')}
            className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
              tab === 'approved'
                ? 'bg-[#131010] text-[#f7f1e8] font-medium'
                : 'text-[#7b7366] hover:text-[#131010] hover:bg-white'
            }`}
          >
            <span>Approved</span>
            <span className="text-[10px]">({approvedCount})</span>
          </button>

          <button
            onClick={() => setTab('rejected')}
            className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
              tab === 'rejected'
                ? 'bg-[#131010] text-[#f7f1e8] font-medium'
                : 'text-[#7b7366] hover:text-[#131010] hover:bg-white'
            }`}
          >
            <span>Rejected</span>
            <span className="text-[10px]">({rejectedCount})</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 border font-mono text-xs ${
            message.startsWith('Error')
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-[#2d5508]/10 text-[#2d5508] border-[#2d5508]/30'
          }`}
        >
          {message}
        </div>
      )}

      {/* Review Queue Items */}
      {currentList.length === 0 ? (
        <div className="bg-white p-16 text-center border border-[#e5dcd0] space-y-2">
          <span className="text-3xl block">🌿</span>
          <p className="font-mono text-xs uppercase tracking-wider text-[#131010]">
            No {tab} reviews in this queue.
          </p>
          <p className="text-xs text-[#7b7366]">
            {tab === 'pending'
              ? 'All incoming customer testimonials have been vetted.'
              : 'Items will appear here once moved to this status.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 border border-[#e5dcd0] space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-[#e5dcd0]">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#131010] bg-[#faf8f5] border border-[#e5dcd0] px-2 py-0.5">
                    {rev.product_slug}
                  </span>
                  <span className="text-xs text-[#7b7366] font-mono ml-3">ID: #{rev.id.substring(0, 8)}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex text-[#b88e4e] text-sm">
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
              </div>

              <div>
                <h4 className="font-serif font-normal text-base text-[#131010]">
                  &ldquo;{rev.title}&rdquo;
                </h4>
                <p className="text-xs text-[#524b42] mt-2 leading-relaxed bg-[#faf8f5] p-4 border border-[#e5dcd0]">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e5dcd0] flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                <div>
                  <span className="font-medium text-[#131010]">{rev.user_name}</span>
                  <span className="font-mono text-[11px] text-[#7b7366] ml-2">({rev.user_email})</span>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center space-x-2">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'approved')}
                      disabled={loadingId === rev.id}
                      className="bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-[10px] uppercase tracking-wider px-3.5 py-1.5 border border-[#131010] hover:border-[#2d5508] transition-colors disabled:opacity-50"
                    >
                      Approve &amp; Publish
                    </button>
                  )}

                  {rev.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                      disabled={loadingId === rev.id}
                      className="bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(rev.id)}
                    disabled={loadingId === rev.id}
                    className="font-mono text-[10px] uppercase tracking-wider text-red-600 hover:text-red-800 px-2 py-1.5 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
