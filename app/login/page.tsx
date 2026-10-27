'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
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
        throw new Error(data.error || 'Failed to sign in. Please verify your credentials.');
      }

      const destination = data.redirectUrl || '/account';
      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#faf6f0]">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <Link href="/" className="inline-block group">
          <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] text-[#131010] uppercase group-hover:text-[#2d5508] transition-colors">
            Empress Glow
          </span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-[#7b7366] mt-1">
            Botanical Emporium
          </span>
        </Link>
      </div>

      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-none border border-[#e5dcd0] shadow-sm">
        {/* Header */}
        <div className="text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#2d5508] block">
            Member Access
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-serif text-[#131010]">
            Sign In
          </h1>
          <p className="mt-2 font-mono text-xs text-[#7b7366]">
            Access your order history, delivery addresses, and personal botanical care.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-mono p-4 rounded-none">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#131010] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@example.com"
              className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] font-mono text-xs text-[#131010] bg-white"
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
              className="w-full px-4 py-3 rounded-none border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] font-mono text-xs text-[#131010] bg-white"
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
            <label htmlFor="remember-me" className="ml-2 block font-mono text-xs text-[#7b7366] cursor-pointer">
              Remember me on this browser
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#131010] hover:bg-[#2d5508] text-white font-mono text-xs uppercase tracking-[0.2em] py-4 px-4 rounded-none transition-colors disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? 'Signing In...' : 'Sign In to Account'}
          </button>
        </form>

        {/* Divider / Social Login */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5dcd0]" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-[0.2em]">
            <span className="bg-white px-3 text-[#7b7366]">Or continue with</span>
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

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#e5dcd0] text-center space-y-3">
          <p className="font-mono text-xs text-[#7b7366]">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-[#2d5508] font-semibold hover:underline">
              Create an Account
            </Link>
          </p>

          <div className="pt-2 border-t border-[#f0eae1]">
            <Link
              href="/admin/login"
              className="font-mono text-[11px] text-[#7b7366] hover:text-[#131010] hover:underline"
            >
              Are you store staff or management? Access Admin Portal →
            </Link>
          </div>
        </div>
      </div>

      {/* Return to store */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="font-mono text-xs text-[#7b7366] hover:text-[#131010] transition-colors inline-flex items-center gap-1.5"
        >
          <span>←</span> Back to Store
        </Link>
      </div>
    </div>
  );
}
