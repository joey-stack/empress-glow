'use client';

import React, { useState } from 'react';

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productSlug?: string;
  productName?: string;
}

export function NotifyMeModal({
  isOpen,
  onClose,
  productSlug = 'empress-glow-fruity-soap',
  productName = 'Empress Glow Fruity Soap',
}: NotifyMeModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, product_slug: productSlug }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit. Please try again.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#faf8f5] border border-[#e5dcd0] p-6 sm:p-8 text-[#131010]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7b7366] hover:text-[#131010] transition-colors p-2 font-mono text-sm border border-[#e5dcd0] hover:bg-white"
          aria-label="Close modal"
        >
          ✕
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/30 flex items-center justify-center mx-auto text-xl font-mono">
              ✓
            </div>
            <h3 className="text-2xl font-serif text-[#131010]">You&apos;re on the Reservation List</h3>
            <p className="text-[#524b42] text-xs leading-relaxed max-w-sm mx-auto">
              We&apos;ll notify you via private dispatch the moment {productName} is matured and ready for release.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="w-full bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] py-3.5 px-6 font-mono text-xs uppercase tracking-[0.2em] transition-colors border border-[#131010] hover:border-[#2d5508]"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
                Private Reservation Circle
              </span>
              <h3 className="text-2xl font-serif text-[#131010] font-normal leading-tight">
                Priority Batch Allocation
              </h3>
              <p className="text-[#524b42] text-xs mt-1.5 leading-relaxed">
                Reserve your allocation for{' '}
                <span className="font-medium text-[#131010]">{productName}</span>. Zero pre-payment required.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-800 text-xs border border-red-200 font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mary"
                  className="w-full px-3.5 py-2.5 border border-[#e5dcd0] bg-white focus:border-[#2d5508] text-xs text-[#131010] outline-none placeholder:text-[#7b7366]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@empressglow.com"
                  className="w-full px-3.5 py-2.5 border border-[#e5dcd0] bg-white focus:border-[#2d5508] text-xs text-[#131010] outline-none placeholder:text-[#7b7366]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] py-3.5 px-6 font-mono text-xs uppercase tracking-[0.2em] transition-colors border border-[#131010] hover:border-[#2d5508] disabled:opacity-50"
                >
                  {submitting ? 'Adding you...' : 'Notify Me When Available'}
                </button>
              </div>

              <p className="text-center font-mono text-[10px] text-[#7b7366] pt-1">
                NDPA 2023 Compliant &bull; Unsubscribe anytime
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
