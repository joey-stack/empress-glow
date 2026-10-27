'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/cart-context';

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Abuja',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Autofill customer profile & default address if authenticated
  React.useEffect(() => {
    fetch('/api/account')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setIsAuthenticated(true);
          const defaultAddr = data.addresses?.find((a: any) => a.is_default) || data.addresses?.[0];
          setFormData((prev) => ({
            ...prev,
            name: data.user.name || prev.name,
            email: data.user.email || prev.email,
            phone: data.user.phone || prev.phone,
            address: defaultAddr?.street || prev.address,
            city: defaultAddr?.city || prev.city,
            state: defaultAddr?.state || prev.state,
          }));
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  // Shipping calculation
  const isAbuja = formData.state.toLowerCase() === 'abuja';
  const freeShipping = isAbuja && subtotal >= 25000;
  const shippingFee = items.length === 0 ? 0 : freeShipping ? 0 : isAbuja ? 2500 : 4000;
  const total = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your basket is empty. Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items,
          shippingFee,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        setErrorMessage(result.error || 'Failed to initialize payment with Paystack.');
        setIsSubmitting(false);
        return;
      }

      // Clear cart upon successful order creation
      clearCart();

      // Redirect to Paystack or Order confirmation page
      if (result.data.authorizationUrl) {
        window.location.href = result.data.authorizationUrl;
      } else {
        router.push(`/order/${result.data.orderId}`);
      }
    } catch (err: any) {
      console.error('Checkout submit error:', err);
      setErrorMessage('A network error occurred while connecting to payment gateway.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-none border border-[#e5dcd0] p-12 text-center max-w-xl mx-auto space-y-4 shadow-none">
        <span className="text-5xl block">🌿</span>
        <h2 className="font-serif text-2xl font-bold text-[#131010]">
          Your Shopping Basket is Empty
        </h2>
        <p className="text-xs text-[#7b7366]">
          Please select your preferred handcrafted formulations before proceeding to checkout.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-[#2d5508] text-white text-xs font-semibold rounded-none shadow-none hover:bg-[#1e3b05] transition-all"
          >
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Shipping & Contact Details */}
      <div className="lg:col-span-7 bg-white rounded-none border border-[#e5dcd0] p-6 sm:p-8 shadow-none space-y-6">
        <div>
          <h2 className="font-serif text-2xl text-[#131010] font-normal">
            Delivery & Contact Information
          </h2>
          <p className="text-xs text-[#7b7366] mt-1">
            Orders are fulfilled from our botanical studio in Abuja and dispatched via tracked courier.
          </p>
        </div>

        {!isAuthenticated && (
          <div className="bg-[#faf8f5] border border-[#e5dcd0] p-3 text-xs text-[#7b7366] flex items-center justify-between">
            <span>Already have an Empress account?</span>
            <Link
              href="/login?redirect=/checkout"
              className="text-[#2d5508] font-semibold hover:underline"
            >
              Sign In to autofill saved address →
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-none text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#524f46] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Amaka Adebayo"
                className="w-full px-4 py-2.5 text-xs rounded-none border border-[#e5dcd0] text-[#131010] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5508]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#524f46] mb-1.5">
                Phone Number (WhatsApp preferred) *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +234 803 123 4567"
                className="w-full px-4 py-2.5 text-xs rounded-none border border-[#e5dcd0] text-[#131010] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5508]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#524f46] mb-1.5">
              Email Address (For receipt & dispatch tracking) *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. amaka@example.com"
              className="w-full px-4 py-2.5 text-xs rounded-none border border-[#e5dcd0] text-[#131010] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5508]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#524f46] mb-1.5">
              Street Delivery Address *
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
              className="w-full px-4 py-2.5 text-xs rounded-none border border-[#e5dcd0] text-[#131010] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5508]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#524f46] mb-1.5">
                City / Town *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Lekki / Ikeja"
                className="w-full px-4 py-2.5 text-xs rounded-none border border-[#e5dcd0] text-[#131010] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5508]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#524f46] mb-1.5">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-xs rounded-none border border-[#e5dcd0] text-[#131010] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5508]"
              >
                <option value="Abuja">FCT Abuja</option>
                <option value="Lagos">Lagos State</option>
                <option value="Rivers">Rivers (Port Harcourt)</option>
                <option value="Oyo">Oyo (Ibadan)</option>
                <option value="Ogun">Ogun State</option>
                <option value="Kano">Kano State</option>
                <option value="Enugu">Enugu State</option>
                <option value="Delta">Delta State</option>
                <option value="Other">Other Nigerian State</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#524f46] mb-1.5">
              Special Delivery Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Call before arrival, leave with security"
              className="w-full px-4 py-2 text-xs rounded-none border border-[#e5dcd0] text-[#131010] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5508]"
            />
          </div>
        </div>
      </div>

      {/* Order Review & Paystack Initiation */}
      <div className="lg:col-span-5 bg-white rounded-none border border-[#e5dcd0] p-6 sm:p-8 shadow-none space-y-6">
        <h3 className="font-serif text-xl text-[#131010] font-normal pb-4 border-b border-[#e5dcd0]">
          Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
        </h3>

        {/* Itemized Mini List */}
        <div className="divide-y divide-[#f0ede6] max-h-60 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.variantId} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex-1 min-w-0 pr-2">
                <span className="font-semibold text-[#131010] block truncate">
                  {item.name}
                </span>
                <span className="text-[11px] text-[#7b7366]">
                  Size: {item.variantName} × {item.quantity}
                </span>
              </div>
              <span className="font-semibold text-[#131010]">
                ₦{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Totals Breakdown */}
        <div className="space-y-2 pt-2 border-t border-[#e5dcd0] text-xs">
          <div className="flex justify-between text-[#524f46]">
            <span>Items Subtotal</span>
            <span className="font-semibold text-[#131010]">₦{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-[#524f46]">
            <span>Delivery Fee ({isAbuja ? 'Abuja' : 'Nationwide'})</span>
            <span>
              {shippingFee === 0 ? (
                <span className="text-[#2d5508] font-bold">FREE</span>
              ) : (
                `₦${shippingFee.toLocaleString()}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-[#524f46]">
            <span>Value Added Tax (VAT)</span>
            <span className="text-[#2d5508] font-semibold">Exempt (0%)</span>
          </div>

          <div className="pt-3 border-t border-[#f0ede6] flex justify-between text-sm">
            <span className="font-bold text-[#131010]">Final Payable Amount</span>
            <span className="font-serif text-2xl font-bold text-[#2d5508]">
              ₦{total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Statutory Disclosures (Digital Economy Bill & FCCPC) */}
        <div className="p-4 bg-[#fdfaf4] border border-[#f0e8d5] rounded-none text-[11px] space-y-2 text-[#7b7366]">
          <p className="font-semibold text-[#853f29] uppercase tracking-wider text-[10px]">
            Statutory Price Disclosure & Consumer Rights
          </p>
          <p className="leading-relaxed">
            In accordance with <strong>Section 39 of the Nigeria Digital Economy Bill</strong>, full price disclosure is made prior to transaction initiation. No hidden courier surcharges or unstated levies apply.
          </p>
          <p className="leading-relaxed">
            <strong>FCCPC Refund Guarantee</strong>: Refunds only for defective products within 7 days of delivery. Contact us via WhatsApp to initiate a return.
          </p>
        </div>

        {/* Payment CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#09A5DB] hover:bg-[#078cbd] disabled:opacity-50 text-white text-xs font-semibold rounded-none shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          {isSubmitting ? (
            <span>Connecting to Paystack...</span>
          ) : (
            <span>Pay with Paystack • ₦{total.toLocaleString()}</span>
          )}
        </button>

        <p className="text-[10px] text-center text-[#7b7366]">
          🔒 256-bit SSL encrypted • Card, Bank Transfer, USSD, Apple Pay via Paystack
        </p>
      </div>
    </form>
  );
}
