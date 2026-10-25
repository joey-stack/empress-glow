'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface QuickProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  vendor: string;
  category: string;
  image: string | null;
}

interface QuickOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  status: string;
  created_at: string;
}

interface QuickCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface QuickPage {
  label: string;
  href: string;
  group: string;
  icon: string;
}

interface QuickAction {
  label: string;
  href: string;
  icon: string;
  description: string;
}

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminCommandPalette({ isOpen, onClose }: AdminCommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [data, setData] = useState<{
    pages: QuickPage[];
    actions: QuickAction[];
    products: QuickProduct[];
    orders: QuickOrder[];
    customers: QuickCustomer[];
  }>({
    pages: [],
    actions: [],
    products: [],
    orders: [],
    customers: [],
  });

  // Fetch results when query changes or when palette opens
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
      return;
    }

    // Auto-focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      fetch(`/api/admin/quick-search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((resData) => {
          if (isMounted) {
            setData({
              pages: resData.pages || [],
              actions: resData.actions || [],
              products: resData.products || [],
              orders: resData.orders || [],
              customers: resData.customers || [],
            });
            setSelectedIndex(0);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, query]);

  // Flatten items for keyboard navigation
  const flatItems = useMemo(() => {
    const list: Array<{
      type: 'action' | 'product' | 'order' | 'customer' | 'page';
      id: string;
      label: string;
      subtext?: string;
      href: string;
      icon: string;
      badge?: string;
    }> = [];

    // 1. Actions
    data.actions.forEach((a, i) => {
      list.push({
        type: 'action',
        id: `action-${i}`,
        label: a.label,
        subtext: a.description,
        href: a.href,
        icon: a.icon,
      });
    });

    // 2. Products
    data.products.forEach((p) => {
      list.push({
        type: 'product',
        id: `prod-${p.id}`,
        label: p.name,
        subtext: `${p.vendor} • ₦${p.price.toLocaleString('en-NG')} • Stock: ${p.stock}`,
        href: `/admin/products?edit=${p.id}`,
        icon: '🌿',
        badge: p.stock < 10 ? 'Low Stock' : undefined,
      });
    });

    // 3. Orders
    data.orders.forEach((o) => {
      list.push({
        type: 'order',
        id: `order-${o.id}`,
        label: `Order #${o.id} — ${o.customer_name}`,
        subtext: `₦${o.total.toLocaleString('en-NG')} • ${o.customer_phone || o.customer_email}`,
        href: `/admin/orders?id=${o.id}`,
        icon: '📦',
        badge: o.status.toUpperCase(),
      });
    });

    // 4. Customers
    data.customers.forEach((c) => {
      list.push({
        type: 'customer',
        id: `cust-${c.id}`,
        label: c.name,
        subtext: `${c.email} • ${c.phone}`,
        href: `/admin/customers?search=${encodeURIComponent(c.email)}`,
        icon: '👤',
      });
    });

    // 5. Pages
    data.pages.forEach((p, i) => {
      list.push({
        type: 'page',
        id: `page-${i}`,
        label: p.label,
        subtext: p.group,
        href: p.href,
        icon: p.icon,
      });
    });

    return list;
  }, [data]);

  // Handle action execution
  const executeItem = (item: (typeof flatItems)[0]) => {
    onClose();
    if (item.href.startsWith('http')) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.href);
    }
  };

  // Keyboard navigation handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (flatItems.length > 0 ? (prev + 1) % flatItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (flatItems.length > 0 ? (prev - 1 + flatItems.length) % flatItems.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          executeItem(flatItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex]);

  // Keep selected element scrolled into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector('[data-selected="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admin Command Palette"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-[#e5dcd0] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] rounded-none animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e5dcd0] bg-white gap-3">
          <span className="text-[#7b7366] text-sm">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, formulation, order #, or customer name..."
            className="flex-1 bg-transparent text-[#131010] placeholder:text-[#7b7366] text-sm outline-none font-normal"
          />
          {loading && (
            <span className="w-4 h-4 border-2 border-[#2d5508] border-t-transparent animate-spin" />
          )}
          <kbd className="font-mono text-[10px] text-[#7b7366] border border-[#e5dcd0] px-1.5 py-0.5 bg-[#faf8f5] uppercase">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto divide-y divide-[#e5dcd0] overscroll-contain"
        >
          {flatItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#7b7366] font-mono">
              {loading ? 'Searching catalog and records...' : `No matching results found for "${query}"`}
            </div>
          ) : (
            <div className="py-2">
              {flatItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    data-selected={isSelected}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'bg-[#131010] text-[#f7f1e8]'
                        : 'hover:bg-[#faf6f0] text-[#131010]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-base flex-shrink-0 w-6 text-center">
                        {item.icon}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-medium truncate flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span
                              className={`font-mono text-[9px] uppercase px-1.5 py-0.2 border ${
                                isSelected
                                  ? 'border-white/30 bg-white/10 text-white'
                                  : 'border-[#2d5508]/30 bg-[#2d5508]/10 text-[#2d5508]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtext && (
                          <div
                            className={`text-[11px] truncate ${
                              isSelected ? 'text-[#a89e90]' : 'text-[#7b7366]'
                            }`}
                          >
                            {item.subtext}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      <span
                        className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${
                          isSelected
                            ? 'border-white/20 text-white/70'
                            : 'border-[#e5dcd0] text-[#7b7366] bg-[#faf8f5]'
                        }`}
                      >
                        {item.type}
                      </span>
                      {isSelected && (
                        <span className="font-mono text-[10px] text-[#5a8210]">
                          ↵
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="px-4 py-2.5 border-t border-[#e5dcd0] bg-[#faf8f5] flex items-center justify-between text-[11px] font-mono text-[#7b7366]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="border border-[#e5dcd0] px-1 bg-white text-[#131010]">↑</kbd>
              <kbd className="border border-[#e5dcd0] px-1 bg-white text-[#131010]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="border border-[#e5dcd0] px-1 bg-white text-[#131010]">↵</kbd>
              <span>to select</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[10px] uppercase tracking-wider">
            <span>Shopify-Style Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}
