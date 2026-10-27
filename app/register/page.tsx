'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ndpaConsent, setNdpaConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!ndpaConsent) {
      setError('You must affirmatively agree to the Terms & Privacy Policy (NDPA 2023) to continue.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          ndpaConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      router.push('/account');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#faf6f0]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-none border border-[#e5dcd0]">
        <div className="text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
            Join The Empress Family
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-serif text-[#131010]">
            Create Empress Account
          </h1>
          <p className="mt-2 font-mono text-xs text-[#7b7366]">
            Create your personal customer profile for saved addresses, order tracking, and tailored botanical rituals.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-mono p-4 rounded-none">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Adanna Okonjo"
              className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] font-mono text-xs text-[#131010]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. adanna@example.com"
              className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] font-mono text-xs text-[#131010]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1">
              Phone Number (WhatsApp Preferred)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 801 234 5678"
              className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] font-mono text-xs text-[#131010]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] font-mono text-xs text-[#131010]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1">
                Confirm
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] font-mono text-xs text-[#131010]"
              />
            </div>
          </div>

          {/* NDPA 2023 Explicit Affirmative Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start font-mono text-xs text-[#7b7366] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={ndpaConsent}
                onChange={(e) => setNdpaConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-[#2d5508] focus:ring-[#2d5508] border-[#e5dcd0] rounded-none"
              />
              <span className="ml-2.5 leading-relaxed text-[11px]">
                I affirmatively agree to the{' '}
                <Link href="/policies#terms" target="_blank" className="text-[#2d5508] underline hover:text-[#5a8210]">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/policies#privacy" target="_blank" className="text-[#2d5508] underline hover:text-[#5a8210]">
                  Privacy Policy
                </Link>
                , and consent to the processing of my contact details in accordance with the{' '}
                <strong>Nigeria Data Protection Act (NDPA) 2023</strong>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#131010] hover:bg-[#2d5508] text-white font-mono text-xs uppercase tracking-[0.2em] py-4 px-4 rounded-none transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Empress Account'}
          </button>
        </form>

        {/* Divider / Social Registration */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5dcd0]" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-[0.2em]">
            <span className="bg-white px-3 text-[#7b7366]">Or sign up with</span>
          </div>
        </div>

        <a
          href="/api/auth/oauth/google"
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] hover:border-[#131010] py-3.5 px-4 font-mono text-xs uppercase tracking-wider transition-all shadow-sm"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </a>

        <div className="pt-4 border-t border-[#e5dcd0] text-center">
          <p className="font-mono text-xs text-[#7b7366]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#2d5508] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
