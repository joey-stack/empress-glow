'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const urlEmail = searchParams?.get('email');
    if (urlEmail) {
      setEmail(urlEmail);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/subscribers/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setErrorMessage(data.error || 'Failed to process opt-out request.');
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 bg-[#2d5508]/10 text-[#2d5508] border border-[#2d5508]/30 rounded-none flex items-center justify-center mx-auto text-2xl font-bold font-mono">
          ✓
        </div>
        <h2 className="font-serif text-xl text-[#131010]">
          Opt-Out Confirmed
        </h2>
        <p className="text-xs text-[#7b7366] leading-relaxed">
          <strong className="text-[#131010]">{email}</strong> has been successfully unsubscribed from all Empress Glow priority product announcements and launch notifications.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] text-xs font-mono uppercase tracking-[0.18em] rounded-none transition-colors border border-[#131010] hover:border-[#2d5508]"
          >
            Return to Storefront →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleUnsubscribe} className="space-y-5">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-none text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-[#7b7366] mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. yourname@example.com"
          className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] text-xs text-[#131010] bg-[#faf8f5] focus:bg-white focus:outline-none focus:border-[#2d5508] transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 bg-[#131010] hover:bg-[#2d5508] disabled:opacity-50 text-[#f7f1e8] text-xs font-mono uppercase tracking-[0.18em] rounded-none transition-colors border border-[#131010] hover:border-[#2d5508]"
      >
        {status === 'loading' ? 'Processing...' : 'Confirm Unsubscribe'}
      </button>
    </form>
  );
}
