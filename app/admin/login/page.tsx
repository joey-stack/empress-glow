'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DemoStaffOption {
  name: string;
  role: string;
  email: string;
  title: string;
  badge: string;
  color: string;
}

const DEMO_STAFF_USERS: DemoStaffOption[] = [
  {
    name: 'Mary Asuquo',
    role: 'super_admin',
    title: 'Founder & Master Formulator',
    email: 'mary@empressglowemporium.com',
    badge: 'Super Admin',
    color: '#2d5508',
  },
  {
    name: 'Amina Bello',
    role: 'inventory_manager',
    title: 'Botanical Inventory & Workshop Lead',
    email: 'amina.ops@empressglowemporium.com',
    badge: 'Inventory Lead',
    color: '#0d766e',
  },
  {
    name: 'Chukwudi Eze',
    role: 'support_staff',
    title: 'Client Care & WhatsApp Lead',
    email: 'chukwudi.care@empressglowemporium.com',
    badge: 'Client Care',
    color: '#7c3aed',
  },
  {
    name: 'Regulatory Guild',
    role: 'read_only',
    title: 'NAFDAC & NDPA Compliance Inspector',
    email: 'compliance@empressglowemporium.com',
    badge: 'Compliance',
    color: '#b45309',
  },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STAFF_INSFORGE_CREDENTIALS: Record<string, string> = {
    'mary@empressglowemporium.com': 'empress_master_2026',
    'amina.ops@empressglowemporium.com': 'empress_ops_2026',
    'chukwudi.care@empressglowemporium.com': 'empress_care_2026',
    'compliance@empressglowemporium.com': 'empress_audit_2026',
  };

  const fillCredentials = (staffEmail: string) => {
    setEmail(staffEmail);
    setPassword(STAFF_INSFORGE_CREDENTIALS[staffEmail] || 'empress_master_2026');
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
        throw new Error(data.error || 'Failed to authenticate administrative staff');
      }

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        router.push('/admin');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify staff credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#131010] text-[#f7f1e8] selection:bg-[#2d5508] selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#2d5508] flex items-center justify-center font-mono font-bold text-xs text-[#f7f1e8] tracking-widest">
            EG
          </div>
          <span className="font-serif text-base tracking-wide text-white group-hover:text-[#a3d95b] transition-colors">
            Empress Glow Emporium
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a89e90] hover:text-[#f7f1e8] transition-colors hidden sm:inline-block"
          >
            ← Back to Storefront
          </Link>
          <span className="border border-white/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#a3d95b] bg-[#2d5508]/20">
            Secure Staff Gateway
          </span>
        </div>
      </header>

      {/* Main Login Viewport */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg space-y-8">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a3d95b] block">
              Store Administration Suite
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
              Control Center Sign-In
            </h1>
            <p className="font-mono text-xs text-[#a89e90] max-w-md mx-auto">
              Role-governed administrative portal for catalog engineering, inventory operations, and customer fulfillment.
            </p>
          </div>

          {/* Quick Demo Pill Presets */}
          <div className="bg-[#1a1715] border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a3d95b] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a3d95b] animate-pulse" />
                InsForge Authenticated Staff Accounts
              </span>
              <span className="font-mono text-[9px] text-[#7b7366]">
                Native InsForge BaaS Auth
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_STAFF_USERS.map((staff) => (
                <button
                  key={staff.email}
                  type="button"
                  onClick={() => fillCredentials(staff.email)}
                  className={`text-left p-2.5 border transition-all text-xs font-mono flex flex-col justify-between ${
                    email === staff.email
                      ? 'border-[#a3d95b] bg-[#2d5508]/30'
                      : 'border-white/10 hover:border-white/30 bg-[#141211]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-[#f7f1e8] truncate">{staff.name}</span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-mono border"
                      style={{
                        borderColor: staff.color,
                        color: staff.color === '#2d5508' ? '#a3d95b' : '#f7f1e8',
                        backgroundColor: `${staff.color}20`,
                      }}
                    >
                      {staff.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#a89e90] truncate">{staff.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono rounded-none">
              <div className="font-bold uppercase tracking-wider mb-1">Authentication Error</div>
              <div>{error}</div>
            </div>
          )}

          {/* Sign-in Form */}
          <form onSubmit={handleSubmit} className="bg-[#171514] border border-white/10 p-6 sm:p-8 space-y-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#a89e90] mb-2">
                Staff Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mary@empressglowemporium.com"
                className="w-full px-4 py-3 bg-[#0d0c0c] border border-white/15 focus:border-[#a3d95b] focus:outline-none text-[#f7f1e8] font-mono text-xs transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#a89e90]">
                  Master Access Password
                </label>
                <span className="font-mono text-[10px] text-[#7b7366]">
                  Demo: <code className="text-[#a3d95b]">empress2026</code>
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-[#0d0c0c] border border-white/15 focus:border-[#a3d95b] focus:outline-none text-[#f7f1e8] font-mono text-xs transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[#a89e90]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-none bg-[#0d0c0c] border-white/20 text-[#2d5508] focus:ring-0"
                />
                <span>Remember this terminal</span>
              </label>

              <span className="font-mono text-[10px] text-[#7b7366]">
                HMAC Signed Cookies
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-[#2d5508] hover:bg-[#3d700b] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.22em] font-semibold transition-all border border-[#5a8210] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Access Control Center →</span>
              )}
            </button>
          </form>

          {/* Customer Portal Link */}
          <div className="pt-2 text-center space-y-2 border-t border-white/10">
            <p className="font-mono text-xs text-[#7b7366]">
              Looking for your personal customer order history or profile?
            </p>
            <Link
              href="/login"
              className="inline-block font-mono text-xs text-[#a3d95b] hover:underline uppercase tracking-wider"
            >
              Switch to Customer Sign-In →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="border-t border-white/10 px-6 py-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>Empress Glow Emporium &bull; Administrative Systems</div>
        <div>NAFDAC &amp; NDPA Compliant Audit Trail Logging Active</div>
      </footer>
    </div>
  );
}
