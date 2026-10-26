'use client';

import React, { useState, useEffect } from 'react';

interface NotifyMeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productSlug?: string;
  productName?: string;
}

export function NotifyMeDrawer({
  isOpen,
  onClose,
  productSlug = 'empress-glow-fruity-soap',
  productName = 'Empress Glow Fruity Soap',
}: NotifyMeDrawerProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto">
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          className="w-screen max-w-md bg-[#f7f1e8] border-l border-[#e5dcd0] text-[#131010] flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out p-6 sm:p-10 overflow-y-auto"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between border-b border-[#e5dcd0] pb-6 mb-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#7b7366]">
                Prelaunch Waitlist
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-[#131010] hover:opacity-60 transition-opacity p-2 -mr-2"
                aria-label="Close drawer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {success ? (
              <div className="py-8 space-y-6">
                <div className="w-12 h-12 rounded-none border border-[#2d5508] bg-[#2d5508]/5 text-[#2d5508] flex items-center justify-center font-mono text-lg">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 id="drawer-title" className="font-serif text-3xl font-medium text-[#131010] leading-snug">
                    You are on the reservation list.
                  </h3>
                  <p className="text-sm text-[#7b7366] leading-relaxed pt-2">
                    We will dispatch a private priority notice and launch allocation for{' '}
                    <span className="text-[#131010] font-medium">{productName}</span> directly to{' '}
                    <span className="font-mono text-xs">{email}</span>.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#e5dcd0] space-y-3">
                  <a
                    href="https://wa.me/2348035650299"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center border border-[#131010] bg-[#131010] text-[#f7f1e8] hover:bg-[#2d5508] hover:border-[#2d5508] transition-colors py-3.5 px-6 font-mono text-xs uppercase tracking-[0.18em]"
                  >
                    Chat With Mary on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      onClose();
                    }}
                    className="w-full inline-flex items-center justify-center border border-[#e5dcd0] bg-transparent text-[#131010] hover:bg-[#faf6f0] transition-colors py-3 px-6 font-mono text-xs uppercase tracking-[0.18em]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 bg-[#faf6f0] border border-[#e5dcd0] text-[#2d5508] inline-block">
                    Limited Artisan Allocation
                  </span>
                  <h3 id="drawer-title" className="font-serif text-3xl text-[#131010] leading-tight pt-1">
                    Reserve Priority Notification
                  </h3>
                  <p className="text-sm text-[#7b7366] leading-relaxed pt-1">
                    Receive direct notification the moment{' '}
                    <span className="text-[#131010] font-medium">{productName}</span> becomes available for batch dispatch in Nigeria.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-800 text-xs font-mono border border-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-[#7b7366] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Mary Asuquo"
                      className="w-full px-4 py-3 border border-[#e5dcd0] bg-[#ffffff] focus:outline-none focus:border-[#131010] text-sm text-[#131010] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.15em] text-[#7b7366] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@empressglow.com"
                      className="w-full px-4 py-3 border border-[#e5dcd0] bg-[#ffffff] focus:outline-none focus:border-[#131010] text-sm text-[#131010] transition-colors"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] py-4 px-6 font-mono text-xs uppercase tracking-[0.2em] font-medium transition-colors border border-[#131010] hover:border-[#2d5508] disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Registering...' : 'Notify Me When Available'}
                    </button>
                  </div>
                </form>

                <div className="pt-6 border-t border-[#e5dcd0]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#7b7366] mb-3">
                    Prefer direct one-on-one consultation?
                  </p>
                  <a
                    href="https://wa.me/2348035650299"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-[#2d5508] hover:underline"
                  >
                    <span>Connect on WhatsApp</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-8 border-t border-[#e5dcd0] text-[11px] text-[#7b7366] font-mono">
            Zero spam. NDPA compliant. Unsubscribe at any time.
          </div>
        </aside>
      </div>
    </div>
  );
}
