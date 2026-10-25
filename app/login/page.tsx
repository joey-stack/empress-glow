'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
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
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#faf6f0]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-none border border-[#e5dcd0]">
        <div className="text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
            Empress Member Access
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-serif text-[#131010]">
            Sign In to Empress Glow
          </h1>
          <p className="mt-2 font-mono text-xs text-[#7b7366]">
            Access your order history, delivery addresses, and personal botanical care.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-mono p-4 rounded-none">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
            <div className="flex items-center justify-between mb-1">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010]">
                Password
              </label>
              <a
                href="https://wa.me/2348035650299?text=Hello%2C%20I%20need%20assistance%20recovering%20my%20Empress%20Glow%20account%20password"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#2d5508] hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] font-mono text-xs text-[#131010]"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[#2d5508] focus:ring-[#2d5508] border-[#e5dcd0] rounded-none"
            />
            <label htmlFor="remember-me" className="ml-2 block font-mono text-xs text-[#7b7366]">
              Remember me on this browser
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#131010] hover:bg-[#2d5508] text-white font-mono text-xs uppercase tracking-[0.2em] py-4 px-4 rounded-none transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-4 border-t border-[#e5dcd0] text-center space-y-3">
          <p className="font-mono text-xs text-[#7b7366]">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-[#2d5508] font-semibold hover:underline">
              Create an Account
            </Link>
          </p>
          <div className="text-xs text-stone-400">
            Encrypted credentials via secure httpOnly session cookies.
          </div>
        </div>
      </div>
    </div>
  );
}
