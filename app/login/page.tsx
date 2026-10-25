'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CustomerPreset {
  name: string;
  email: string;
  note: string;
}

const DEMO_CUSTOMERS: CustomerPreset[] = [
  {
    name: 'Amina Bello',
    email: 'amina.bello@example.com',
    note: 'Returning VIP Customer (Abuja FCT)',
  },
  {
    name: 'Chidinma Okafor',
    email: 'chidinma.okafor@example.com',
    note: 'Active Subscriber (Lagos)',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillCustomerPreset = (customerEmail: string) => {
    setEmail(customerEmail);
    setPassword('password123');
    setError(null);
  };

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
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#faf6f0]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-none border border-[#e5dcd0] shadow-sm">
        {/* Header */}
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

        {/* 1-Click Customer Demo Pills */}
        <div className="bg-[#faf6f0] border border-[#e5dcd0] p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#2d5508] font-bold">
              1-Click Demo Profiles
            </span>
            <span className="font-mono text-[9px] text-[#7b7366]">
              Instant Autofill
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_CUSTOMERS.map((cust) => (
              <button
                key={cust.email}
                type="button"
                onClick={() => fillCustomerPreset(cust.email)}
                className={`text-left p-2 border font-mono text-xs transition-colors ${
                  email === cust.email
                    ? 'border-[#2d5508] bg-white text-[#2d5508] font-semibold'
                    : 'border-[#e5dcd0] bg-white hover:border-[#2d5508] text-[#131010]'
                }`}
              >
                <div className="truncate font-medium">{cust.name}</div>
                <div className="text-[9px] text-[#7b7366] truncate">{cust.note}</div>
              </button>
            ))}
          </div>
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
              placeholder="e.g. amina.bello@example.com"
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
    </div>
  );
}
