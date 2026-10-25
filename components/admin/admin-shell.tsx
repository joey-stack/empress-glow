'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { isPrelaunch } from '@/lib/phase';
import { AdminCommandPalette } from './admin-command-palette';
import { AdminAiSidekick } from './admin-ai-sidekick';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<{
    name: string;
    email: string;
    role: string;
    title: string;
  }>({
    name: 'Mary Asuquo',
    email: 'mary@empressglowemporium.com',
    role: 'super_admin',
    title: 'Founder & Master Formulator',
  });

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch authenticated staff member profile
  useEffect(() => {
    if (pathname === '/admin/login') return;
    fetch('/api/admin/staff')
      .then((res) => res.json())
      .then((data) => {
        if (data.currentActor) {
          setCurrentStaff({
            name: data.currentActor.name || 'Mary Asuquo',
            email: data.currentActor.email || 'mary@empressglowemporium.com',
            role: data.currentActor.role || 'super_admin',
            title: data.currentActor.title || 'Founder & Master Formulator',
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch {
      window.location.href = '/admin/login';
    }
  };

  // If on admin login page, render children directly without admin shell wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

interface AdminNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  external?: boolean;
}

interface AdminNavGroup {
  group: string;
  items: AdminNavItem[];
}

  const navItems: AdminNavGroup[] = [
    {
      group: 'Store Management',
      items: [
        {
          label: 'Dashboard',
          href: '/admin',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
        {
          label: 'Orders',
          href: '/admin/orders',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          ),
        },
        {
          label: 'Products',
          href: '/admin/products',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          ),
          badge: 'Catalog',
        },
        {
          label: 'Inventory',
          href: '/admin/inventory',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
          badge: 'Matrix',
        },
        {
          label: 'Customers',
          href: '/admin/customers',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      group: 'Analytics & Intelligence',
      items: [
        {
          label: 'Reports & Compliance',
          href: '/admin/reports',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          badge: 'Audited',
        },
        {
          label: 'Workflow Automation',
          href: '/admin/automation',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          badge: 'Rules',
        },
      ],
    },
    {
      group: 'Marketing & Audience',
      items: [
        {
          label: 'Waitlist Circle',
          href: '/admin/subscribers',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          label: 'Popups & Banners',
          href: '/admin/popups',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          ),
        },
      ],
    },
    {
      group: 'Storefront Content',
      items: [
        {
          label: 'Story & Rituals CMS',
          href: '/admin/content',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          ),
        },
        {
          label: 'Botanical Journal',
          href: '/admin/blog',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          ),
        },
        {
          label: 'Reviews Moderation',
          href: '/admin/reviews',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ),
        },
      ],
    },
    {
      group: 'Settings & Compliance',
      items: [
        {
          label: 'Settings & Policies',
          href: '/admin/settings',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          label: 'Staff & Roles',
          href: '/admin/staff',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
          badge: 'RBAC',
        },
        {
          label: 'Activity & Audit Log',
          href: '/admin/audit-logs',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      group: 'Sales Channels',
      items: [
        {
          label: 'Online Store',
          href: '/',
          external: true,
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f1e8] text-[#131010] flex font-sans">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 1. Left Shopify-Style Brand Obsidian Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#131010] text-[#f7f1e8] border-r border-[#262220] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Authentic Brand Header in Sidebar */}
        <div className="h-20 px-5 border-b border-[#262220] flex items-center justify-between">
          <Link href="/admin" className="flex flex-col gap-1 group">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-32">
                <Image
                  src="/images/logo.png"
                  alt="Empress Glow Emporium"
                  fill
                  className="object-contain brightness-0 invert"
                  priority
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#5a8210] animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#a89e90]">
                {isPrelaunch ? 'Phase 1: Pre-Launch' : 'Phase 2: Live Store'}
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-[#a89e90] hover:text-white border border-[#262220] hover:border-[#5a8210] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[#7b7366] font-medium">
                {group.group}
              </div>
              <nav className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : !item.external && pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center justify-between px-3 py-2 text-xs transition-all border-l-2 ${
                        isActive
                          ? 'bg-[#1e1b18] text-[#f7f1e8] border-[#5a8210] font-medium'
                          : 'text-[#a89e90] hover:text-[#f7f1e8] hover:bg-[#1c1917] border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`transition-colors ${
                            isActive ? 'text-[#5a8210]' : 'text-[#7b7366] group-hover:text-[#5a8210]'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="tracking-tight">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 border border-[#2d5508] bg-[#2d5508]/20 text-[#a3d95b]">
                          {item.badge}
                        </span>
                      )}

                      {item.external && (
                        <svg
                          className="w-3.5 h-3.5 text-[#7b7366] group-hover:text-[#5a8210] transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Store Profile — Active Staff Member with Logout */}
        <div className="p-3 border-t border-[#262220] bg-[#0d0c0c] space-y-2">
          <Link
            href="/admin/staff"
            className="p-2.5 bg-[#171514] hover:bg-[#1f1c1a] border border-[#262220] hover:border-[#5a8210] flex items-center justify-between transition-colors group block"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 shrink-0 bg-[#2d5508] border border-[#5a8210] flex items-center justify-center font-mono font-bold text-xs text-[#f7f1e8]">
                {currentStaff.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="leading-tight truncate">
                <div className="text-xs font-medium text-[#f7f1e8] group-hover:text-[#a3d95b] transition-colors truncate">
                  {currentStaff.name}
                </div>
                <div className="font-mono text-[9px] text-[#a89e90] truncate">
                  {currentStaff.title}
                </div>
              </div>
            </div>
            <span
              className={`w-2 h-2 shrink-0 ml-1 ${
                isPrelaunch ? 'bg-amber-400' : 'bg-[#5a8210]'
              }`}
              title={isPrelaunch ? 'Pre-launch Active' : 'Live Store Active'}
            />
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 border border-white/10 hover:border-red-500/50 bg-[#141211] hover:bg-red-950/20 text-[#a89e90] hover:text-red-400 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Workspace (Right of Sidebar) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Sticky Shopify Top Header with Brand Details */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#e5dcd0] px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#131010] border border-[#e5dcd0] hover:bg-[#faf6f0]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Global Search Bar (Triggers Command Palette) */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="relative w-full text-left group"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7b7366] group-hover:text-[#131010] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="w-full pl-9 pr-14 py-2 text-xs bg-[#faf6f0] hover:bg-[#f5ede2] border border-[#e5dcd0] group-hover:border-[#2d5508] transition-colors text-[#7b7366] flex items-center justify-between cursor-pointer">
                <span className="truncate">Search formulations, orders, clients, commands...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-[#7b7366] bg-white border border-[#e5dcd0]">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Mode Badge */}
            <span className="hidden md:inline-flex items-center gap-2 border border-[#e5dcd0] bg-[#faf6f0] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#131010]">
              <span
                className={`w-1.5 h-1.5 ${
                  isPrelaunch ? 'bg-amber-500' : 'bg-[#5a8210]'
                }`}
              />
              {isPrelaunch ? 'Pre-Launch Active' : 'Live Store Active'}
            </span>

            {/* View Live Store Button */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] px-3.5 py-2 border border-[#e5dcd0] hover:border-[#131010] bg-white hover:bg-[#faf6f0] text-[#131010] transition-colors"
            >
              <span>View Store</span>
              <svg className="w-3.5 h-3.5 text-[#5a8210]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>

            {/* Quick Primary Action: Add Product */}
            <Link
              href="/admin/products?tab=new"
              className="inline-flex items-center gap-1.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] px-4 py-2 border border-[#131010] hover:border-[#2d5508] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#5a8210]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Product</span>
            </Link>

            {/* Header Sign Out Action */}
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign out of Admin Control Center"
              className="inline-flex items-center justify-center p-2 border border-[#e5dcd0] hover:border-red-500/50 bg-white hover:bg-red-50 text-[#7b7366] hover:text-red-600 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#e5dcd0] bg-white py-4 px-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>Empress Glow Emporium &bull; Store Administration Suite</div>
          <div>NAFDAC, NDPA &amp; FCCPC Compliant &bull; Abuja HQ, Nigeria</div>
        </footer>
      </div>

      {/* Global Shopify-Style Command Palette (Cmd+K / Ctrl+K) */}
      <AdminCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Global Empress AI Copilot Drawer & Floating Trigger (Ctrl+J / Cmd+J) */}
      <AdminAiSidekick />
    </div>
  );
}
