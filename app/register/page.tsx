'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BRAND_SLIDES = [
  {
    tag: 'Private Membership',
    title: 'Begin Your Melanin Skin Wellness Journey',
    description:
      'Unlock exclusive access to fresh cold-pressed enzyme batch reservations, complimentary WhatsApp consultations with Mary Asuquo, and priority dispatch.',
  },
  {
    tag: 'Barrier Care',
    title: 'Handcrafted With Raw Botanical Integrity',
    description:
      'Zero mineral oils, zero harsh bleaches, zero artificial perfumes. Hand-blended botanical recipes tailored specifically to nourish and protect melanin skin.',
  },
  {
    tag: 'Heritage Rituals',
    title: 'Sovereign Botanical Formulations from Calabar',
    description:
      'Rich West African botanicals refined through modern clean cosmetic science. Designed to keep your complexion hydrated, balanced, and radiant.',
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ndpaConsent, setNdpaConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BRAND_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen w-full bg-[#ede5d8] text-[#131010] flex flex-col justify-center items-center p-3 sm:p-6 md:p-8 font-sans selection:bg-[#b88e4e]/20">
      {/* Return to store top bar */}
      <div className="w-full max-w-5xl mb-3 flex items-center justify-between px-2 sm:px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#524b42] hover:text-[#131010] transition-colors group"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          <span>Back to Store</span>
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7b7366]">
          Empress Member Registration
        </span>
      </div>

      {/* Main Container with Bezel Frame */}
      <div className="w-full max-w-5xl bg-[#131010] rounded-[28px] sm:rounded-[34px] p-2 sm:p-3 shadow-2xl border border-[#131010]">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[22px] sm:rounded-[26px] overflow-hidden bg-white">

          {/* ================= LEFT SIDE: Hero Brand Showcase ================= */}
          <div className="lg:col-span-5 bg-[#131010] text-[#f7f1e8] p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden min-h-[420px] lg:min-h-[680px]">
            {/* Ambient Radial Glows */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-[#b88e4e]/30 via-[#2d5508]/20 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-tr from-[#2d5508]/40 via-[#b88e4e]/10 to-transparent blur-3xl pointer-events-none" />

            {/* Top Brand Watermark */}
            <div className="relative z-10 flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-[#1e1b18] border border-[#36312a] flex items-center justify-center text-[#b88e4e] group-hover:border-[#b88e4e] transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C8 6 4 10 4 14a8 8 0 0 0 16 0c0-4-4-8-8-12zm0 18a6 6 0 0 1-6-6c0-2.8 2.6-6 6-9.5 3.4 3.5 6 6.7 6 9.5a6 6 0 0 1-6 6z" />
                    <circle cx="12" cy="14" r="2.5" />
                  </svg>
                </div>
                <span className="font-serif text-sm tracking-[0.2em] uppercase text-[#f7f1e8] group-hover:text-[#b88e4e] transition-colors">
                  Empress Glow
                </span>
              </Link>
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#5a8210] px-2 py-0.5 rounded-full border border-[#2d5508] bg-[#2d5508]/20">
                Join Circle
              </span>
            </div>

            {/* Center Content Carousel */}
            <div className="relative z-10 my-auto py-8">
              {/* Botanical Emblem Tile */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1e1b18] border border-[#36312a] flex items-center justify-center shadow-2xl mx-auto mb-8 relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#b88e4e]/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-[#b88e4e] relative z-10 drop-shadow-md"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8a3 3 0 0 0-3 3c0 2 3 5 3 5s3-3 3-5a3 3 0 0 0-3-3z" />
                </svg>
              </div>

              {/* Slide text with transition */}
              <div className="text-center space-y-3 transition-all duration-500 min-h-[140px] flex flex-col justify-center">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#b88e4e] block">
                  {BRAND_SLIDES[currentSlide].tag}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#f7f1e8] font-normal leading-tight tracking-tight">
                  {BRAND_SLIDES[currentSlide].title}
                </h2>
                <p className="text-xs sm:text-sm text-[#a89e90] max-w-sm mx-auto leading-relaxed">
                  {BRAND_SLIDES[currentSlide].description}
                </p>
              </div>
            </div>

            {/* Bottom: Carousel Pagination Dots & Founder Tagline */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#262220]">
              <div className="flex items-center gap-2">
                {BRAND_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      currentSlide === index
                        ? 'w-6 h-1.5 bg-[#b88e4e]'
                        : 'w-1.5 h-1.5 bg-[#36312a] hover:bg-[#7b7366]'
                    }`}
                  />
                ))}
              </div>
              <p className="font-script text-lg text-[#b88e4e] select-none">
                &ldquo;...Own your spot.&rdquo;
              </p>
            </div>
          </div>

          {/* ================= RIGHT SIDE: Sign Up Form ================= */}
          <div className="lg:col-span-7 bg-white text-[#131010] p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
            {/* Top Bar: Brand Icon & Sign In Switcher */}
            <div className="flex items-center justify-between pb-6">
              <div className="w-9 h-9 rounded-full bg-[#faf6f0] border border-[#e5dcd0] flex items-center justify-center text-[#2d5508] shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8 6 4 10 4 14a8 8 0 0 0 16 0c0-4-4-8-8-12zm0 18a6 6 0 0 1-6-6c0-2.8 2.6-6 6-9.5 3.4 3.5 6 6.7 6 9.5a6 6 0 0 1-6 6z" />
                </svg>
              </div>
              <div className="text-xs font-mono text-[#7b7366]">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[#131010] hover:text-[#2d5508] underline underline-offset-4 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Center Content: Header, Social Auth, Divider, Form */}
            <div className="max-w-md w-full mx-auto my-auto py-2">
              <div className="text-center mb-5">
                <h1 className="text-2xl sm:text-3xl font-serif text-[#131010] font-normal tracking-tight">
                  Join the Empress Family
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-[#7b7366]">
                  Create your profile for personal botanical care &amp; order tracking
                </p>
              </div>

              {/* Social Login: Continue with Google */}
              <div className="space-y-2.5 mb-5">
                <a
                  href="/api/auth/oauth/google"
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#faf6f0] text-[#131010] border border-[#e5dcd0] hover:border-[#131010] py-3 px-4 rounded-xl font-medium text-xs transition-all shadow-xs"
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

              {/* Divider: Or register with email */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e5dcd0]" />
                </div>
                <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-[0.2em]">
                  <span className="bg-white px-3 text-[#7b7366]">Or register with email</span>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-mono p-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Credentials Form */}
              <form className="space-y-3.5" onSubmit={handleSubmit}>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#b88e4e] focus:ring-1 focus:ring-[#b88e4e] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#131010] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amina@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#b88e4e] focus:ring-1 focus:ring-[#b88e4e] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#131010] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#b88e4e] focus:ring-1 focus:ring-[#b88e4e] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        placeholder="minimum 8 characters"
                        className="w-full px-3.5 py-2.5 pr-9 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#b88e4e] focus:ring-1 focus:ring-[#b88e4e] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7b7366] hover:text-[#131010] transition-colors p-1 cursor-pointer"
                      >
                        {showPassword ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                            />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                  <div>
                    <label className="block text-xs font-medium text-[#131010] mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="re-enter password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dcd0] focus:outline-none focus:border-[#b88e4e] focus:ring-1 focus:ring-[#b88e4e] text-xs text-[#131010] bg-white transition-all placeholder:text-[#a89e90]"
                    />
                  </div>
                </div>

                {/* NDPA Consent Checkbox */}
                <div className="flex items-start pt-1">
                  <input
                    id="ndpa-consent"
                    type="checkbox"
                    required
                    checked={ndpaConsent}
                    onChange={(e) => setNdpaConsent(e.target.checked)}
                    className="h-4 w-4 mt-0.5 text-[#b88e4e] focus:ring-[#b88e4e] border-[#e5dcd0] rounded cursor-pointer"
                  />
                  <label htmlFor="ndpa-consent" className="ml-2 block text-[11px] text-[#7b7366] leading-tight cursor-pointer">
                    I agree to the{' '}
                    <Link href="/policies#privacy" className="text-[#131010] underline hover:text-[#b88e4e]">
                      Privacy Policy
                    </Link>{' '}
                    and data processing under Nigeria Data Protection Act (NDPA 2023).
                  </label>
                </div>

                {/* Submit Button: Radiant Empress Warm Amber Gold Gradient */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 bg-gradient-to-r from-[#d4a359] via-[#c8933b] to-[#b88e4e] hover:from-[#c8933b] hover:to-[#a57e3f] text-white font-medium text-xs py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </form>
            </div>

            {/* Bottom Bar: Copyright & Policy Links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#f0eae1] text-[11px] font-mono text-[#7b7366]">
              <span>&copy; 2026 Empress Glow</span>
              <div className="flex items-center gap-4">
                <Link href="/policies#privacy" className="hover:text-[#131010] transition-colors">
                  Privacy Policy
                </Link>
                <span>&bull;</span>
                <a
                  href="https://wa.me/2348035650299"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#131010] transition-colors"
                >
                  Support
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
