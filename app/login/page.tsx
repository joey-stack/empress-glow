'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const BRAND_SLIDES = [
  {
    tag: 'Melanin Radiance',
    title: 'Artisan Nigerian Botanicals for Melanin Skin',
    description:
      'Handcrafted in small cold-pressed batches with fresh papaya enzymes, avocado butter, and pure botanical seed oils to strengthen your skin barrier.',
  },
  {
    tag: 'Enzyme Potency',
    title: 'Fresh Fruit Enzymes & Zero Artificial Fragrance',
    description:
      'Active plant enzymes hand-poured in Abuja. Crafted to gently refine texture, soothe sensitivity, and restore natural skin barrier vitality.',
  },
  {
    tag: 'Founder Heritage',
    title: 'Rooted in Calabar Heritage by Mary Asuquo',
    description:
      'Traditional West African botanical knowledge refined through modern clean formulation science. Sovereign, grounded, serene, and radiant.',
  },
];

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
}

export default function LoginPage({ initialMode = 'signin' }: AuthPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: 'signin' or 'signup'
  const modeParam = searchParams.get('mode') || searchParams.get('tab');
  const [mode, setMode] = useState<'signin' | 'signup'>(
    modeParam === 'signup' || modeParam === 'register' ? 'signup' : initialMode
  );

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ndpaConsent, setNdpaConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-cycle brand showcase on the left
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BRAND_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setError(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', newMode === 'signup' ? '/register' : '/login');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!ndpaConsent) {
      setError('You must agree to the Terms & Privacy Policy (NDPA 2023) to continue.');
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
        throw new Error(data.error || 'Failed to create account.');
      }

      router.push('/account');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-white text-[#131010] font-sans">
      
      {/* ================= LEFT HALF (50% desktop, full height): Hero Brand Showcase ================= */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-[#131010] text-[#f7f1e8] p-10 xl:p-14 flex-col justify-between relative overflow-hidden select-none">
        {/* Ambient Botanical Radial Lighting */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#2d5508]/40 via-[#5a8210]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#2d5508]/50 via-transparent to-transparent blur-3xl pointer-events-none" />

        {/* Top: Return to Store Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#a89e90] hover:text-[#f7f1e8] transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Return to Store</span>
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#5a8210] px-2.5 py-0.5 rounded-full border border-[#2d5508] bg-[#2d5508]/20">
            Botanical BaaS
          </span>
        </div>

        {/* Center: Official Light Logo & Carousel */}
        <div className="relative z-10 my-auto py-4 max-w-md mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/logo-light.png"
              alt="Empress Glow Emporium"
              width={100}
              height={100}
              className="w-20 h-20 object-contain drop-shadow-xl"
              priority
            />
          </div>

          <div className="space-y-3 min-h-[130px] flex flex-col justify-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#5a8210]">
              {BRAND_SLIDES[currentSlide].tag}
            </span>
            <h2 className="font-serif text-2xl xl:text-3xl text-[#f7f1e8] font-normal leading-tight tracking-tight">
              {BRAND_SLIDES[currentSlide].title}
            </h2>
            <p className="text-xs text-[#a89e90] leading-relaxed max-w-sm mx-auto">
              {BRAND_SLIDES[currentSlide].description}
            </p>
          </div>
        </div>

        {/* Bottom: Carousel Dots & Founder Tagline */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#262220]">
          <div className="flex items-center gap-2">
            {BRAND_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === index
                    ? 'w-6 h-1.5 bg-[#5a8210]'
                    : 'w-1.5 h-1.5 bg-[#36312a] hover:bg-[#7b7366]'
                }`}
              />
            ))}
          </div>
          <p className="font-script text-xl text-[#5a8210] select-none">
            &ldquo;...Own your spot.&rdquo;
          </p>
        </div>
      </div>

      {/* ================= RIGHT HALF (50% desktop, full height): Compact Distraction-Free Form ================= */}
      <div className="w-full lg:w-1/2 h-full bg-white text-[#131010] p-6 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between overflow-y-auto lg:overflow-hidden">
        
        {/* Top Row: Official Logo & Segmented Mode Switcher */}
        <div className="flex items-center justify-between pb-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Empress Glow Emporium"
              width={140}
              height={45}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Seamless Mode Toggle Pill */}
          <div className="inline-flex p-1 bg-[#f7f1e8] rounded-full border border-[#e5dcd0]">
            <button
              type="button"
              onClick={() => handleModeChange('signin')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#2d5508] text-white shadow-xs'
                  : 'text-[#7b7366] hover:text-[#131010]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('signup')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#2d5508] text-white shadow-xs'
                  : 'text-[#7b7366] hover:text-[#131010]'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Center Content: Form (Minimal, Fits Within 100vh Without Vertical Scroll) */}
        <div className="max-w-md w-full mx-auto my-auto py-2">
          
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-2xl sm:text-3xl font-serif text-[#131010] font-normal tracking-tight">
              {mode === 'signin' ? 'Welcome back to Empress Glow' : 'Create Empress Account'}
            </h1>
            <p className="mt-1 text-xs text-[#7b7366]">
              {mode === 'signin'
                ? 'Enter your details to access your personal botanical care'
                : 'Join our private circle for fresh batch reservations & tracking'}
            </p>
          </div>

          {/* Social Sign-In: Continue with Google */}
          <div className="mb-4">
            <a
              href="/api/auth/oauth/google"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] hover:border-[#2d5508] py-2.5 px-4 rounded-xl font-medium text-xs transition-all shadow-xs"
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
          </div>

          {/* Minimal Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5dcd0]" />
            </div>
            <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-[0.2em]">
              <span className="bg-white px-3 text-[#7b7366]">or continue with email</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono p-2.5 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* ================= MODE: SIGN IN ================= */}
          {mode === 'signin' && (
            <form className="space-y-3" onSubmit={handleSignIn}>
              <div>
                <label className="block text-xs font-medium text-[#131010] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@empressglow.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] focus:ring-1 focus:ring-[#2d5508] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#131010] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] focus:ring-1 focus:ring-[#2d5508] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b7366] hover:text-[#131010] p-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit: Brand Color Botanical Green (#2d5508) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#2d5508] hover:bg-[#1e3b05] text-white font-mono text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md flex items-center justify-center gap-2 group"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>

              {/* Forgot Password Link */}
              <div className="pt-2 text-center">
                <a
                  href="https://wa.me/2348035650299?text=Hello%2C%20I%20need%20assistance%20recovering%20my%20Empress%20Glow%20account%20password"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#7b7366] hover:text-[#2d5508] hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </form>
          )}

          {/* ================= MODE: SIGN UP ================= */}
          {mode === 'signup' && (
            <form className="space-y-2.5" onSubmit={handleSignUp}>
              <div>
                <label className="block text-xs font-medium text-[#131010] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                  className="w-full px-3 py-2 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] focus:ring-1 focus:ring-[#2d5508] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-[#131010] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@empressglow.com"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] focus:ring-1 focus:ring-[#2d5508] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#131010] mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] focus:ring-1 focus:ring-[#2d5508] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-[#131010] mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="min 8 chars"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] focus:ring-1 focus:ring-[#2d5508] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#131010] mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="re-enter"
                    className="w-full px-3 py-2 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#2d5508] focus:ring-1 focus:ring-[#2d5508] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                  />
                </div>
              </div>

              {/* NDPA Consent Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  id="ndpa-consent-box"
                  type="checkbox"
                  required
                  checked={ndpaConsent}
                  onChange={(e) => setNdpaConsent(e.target.checked)}
                  className="h-3.5 w-3.5 mt-0.5 text-[#2d5508] focus:ring-[#2d5508] border-[#e5dcd0] rounded cursor-pointer"
                />
                <label htmlFor="ndpa-consent-box" className="ml-2 block text-[11px] text-[#7b7366] leading-tight cursor-pointer">
                  I agree to the{' '}
                  <Link href="/policies#privacy" className="text-[#131010] underline hover:text-[#2d5508]">
                    Privacy Policy
                  </Link>{' '}
                  (NDPA 2023).
                </label>
              </div>

              {/* Submit: Brand Color Botanical Green (#2d5508) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#2d5508] hover:bg-[#1e3b05] text-white font-mono text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md flex items-center justify-center gap-2 group"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </form>
          )}

        </div>

        {/* Bottom Row: Footer Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-[#f0eae1] text-[11px] font-mono text-[#7b7366]">
          <span>&copy; 2026 Empress Glow</span>
          <div className="flex items-center gap-3">
            <Link href="/policies#privacy" className="hover:text-[#2d5508] transition-colors">
              Privacy
            </Link>
            <span>&bull;</span>
            <a
              href="https://wa.me/2348035650299"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2d5508] transition-colors"
            >
              Support
            </a>
            <span>&bull;</span>
            <Link href="/admin/login" className="hover:text-[#131010] transition-colors">
              Admin
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
