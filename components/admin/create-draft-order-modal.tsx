'use client';

import React, { useState } from 'react';
import type { Product, UserProfile, Order } from '@/lib/insforge/queries';

interface DraftOrderItem {
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
}

interface CreateDraftOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableProducts?: Product[];
  registeredCustomers?: UserProfile[];
  onOrderCreated: (order: Order) => void;
}

export function CreateDraftOrderModal({
  isOpen,
  onClose,
  availableProducts = [],
  registeredCustomers = [],
  onOrderCreated,
}: CreateDraftOrderModalProps) {
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Abuja');
  const [state, setState] = useState('Abuja FCT');

  // Consultation Line Items
  const [items, setItems] = useState<DraftOrderItem[]>([
    {
      productId: availableProducts[0]?.id || 'p1',
      variantId: 'hero-soap-small',
      name: availableProducts[0]?.name || 'Empress Glow Fruity Soap',
      variantName: 'Small (150g)',
      price: 3000,
      quantity: 1,
    },
  ]);

  // Pricing adjustments
  const [shippingFee, setShippingFee] = useState<number>(2500);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Status & Success state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);

  if (!isOpen) return null;

  // Handle Quick Fill Customer
  const handleSelectCustomer = (customerId: string) => {
    const found = registeredCustomers.find((c) => c.id === customerId);
    if (found) {
      setCustomerName(found.name);
      setCustomerEmail(found.email);
      setCustomerPhone(found.phone);
    }
  };

  // Add Item Line
  const handleAddItem = () => {
    const defaultProduct = availableProducts[0];
    setItems((prev) => [
      ...prev,
      {
        productId: defaultProduct?.id || 'p1',
        variantId: 'custom-item',
        name: defaultProduct?.name || 'Empress Glow Fruity Soap',
        variantName: 'Medium (300g)',
        price: 7000,
        quantity: 1,
      },
    ]);
  };

  // Remove Item Line
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Update Item Line
  const handleUpdateItem = (index: number, updates: Partial<DraftOrderItem>) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...updates } : item))
    );
  };

  // Subtotal & Total calculations
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const totalPayable = Math.max(0, subtotal + shippingFee - discount);

  // Form Submit
  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/orders/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: shippingAddress,
            city,
            state,
          },
          items,
          shipping_fee: shippingFee,
          discount,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize draft order with Paystack');
      }

      setCreatedOrder(data.order);
      onOrderCreated(data.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  // Copy Payment Link to Clipboard
  const handleCopyLink = () => {
    if (!createdOrder?.payment_link_url) return;
    navigator.clipboard.writeText(createdOrder.payment_link_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Mark as Paid Manually (Offline Bank Transfer)
  const handleMarkPaid = async () => {
    if (!createdOrder) return;
    setMarkingPaid(true);

    try {
      const res = await fetch('/api/admin/orders/draft', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: createdOrder.id,
          action: 'mark_paid',
          notes: 'Reconciled via offline WhatsApp direct bank transfer',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reconcile order');
      }

      setCreatedOrder(data.order);
      onOrderCreated(data.order);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setMarkingPaid(false);
    }
  };

  // Format WhatsApp message
  const formatWhatsAppUrl = () => {
    if (!createdOrder) return '#';
    const cleanPhone = createdOrder.customer_phone.replace(/\D/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '234' + cleanPhone.substring(1) : cleanPhone;
    const itemList = createdOrder.items
      .map((i) => `• ${i.name} (${i.variantName}) × ${i.quantity}`)
      .join('\n');

    const message = `Hello ${createdOrder.customer_name},\n\nYour bespoke Empress Glow order (#${createdOrder.id.substring(
      0,
      8
    )}) is confirmed and reserved!\n\n${itemList}\n\nDelivery to: ${createdOrder.shipping_address}, ${
      createdOrder.city
    }\nTotal Amount: ₦${createdOrder.total.toLocaleString(
      'en-NG'
    )}\n\nTo complete payment via Paystack:\n${createdOrder.payment_link_url}\n\nThank you for choosing Empress Glow! ✨`;

    return `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Create Draft Order"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#e5dcd0] max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto rounded-none shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e5dcd0] pb-4">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#5a8210] block mb-1">
              Offline &amp; WhatsApp Sales &bull; Paystack Naira
            </span>
            <h3 className="font-serif text-2xl text-[#131010] font-normal">
              {createdOrder ? 'Draft Order Created' : 'Create Draft Order'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#7b7366] hover:text-[#131010] font-mono text-sm border border-[#e5dcd0] px-2.5 py-1"
          >
            ✕
          </button>
        </div>

        {/* Success Dispatch State */}
        {createdOrder ? (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 bg-[#2d5508]/10 border border-[#2d5508]/30 flex items-start gap-3">
              <span className="text-xl">✅</span>
              <div>
                <h4 className="font-serif text-base text-[#2d5508] font-medium">
                  Order #{createdOrder.id.substring(0, 8)} Generated Successfully
                </h4>
                <p className="text-xs text-[#524b42] mt-0.5">
                  Reserved for <strong>{createdOrder.customer_name}</strong> (Total: ₦{createdOrder.total.toLocaleString('en-NG')})
                </p>
              </div>
            </div>

            {/* Generated Payment Link Display */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                Paystack Payment Link
              </label>
              <div className="flex items-stretch border border-[#e5dcd0] bg-[#faf8f5]">
                <input
                  type="text"
                  readOnly
                  value={createdOrder.payment_link_url || ''}
                  className="flex-1 px-3 py-2 text-xs font-mono text-[#131010] bg-transparent outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 font-mono text-xs uppercase tracking-wider bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] transition-colors"
                >
                  {copied ? 'Copied! ✓' : 'Copy Link'}
                </button>
              </div>
              <p className="text-[11px] text-[#7b7366]">
                Client can open this link on their mobile phone to settle securely via Paystack Debit Card, Bank Transfer, or USSD.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#e5dcd0] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={formatWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2d5508] hover:bg-[#1e3b05] text-[#f7f1e8] py-3 px-4 font-mono text-xs uppercase tracking-[0.18em] transition-colors border border-[#2d5508]"
                >
                  <span>Dispatch via WhatsApp ↗</span>
                </a>

                <button
                  type="button"
                  onClick={handleMarkPaid}
                  disabled={markingPaid || createdOrder.status === 'paid'}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] py-3 px-4 font-mono text-xs uppercase tracking-[0.18em] transition-colors border border-[#131010] disabled:opacity-50"
                >
                  {createdOrder.status === 'paid'
                    ? 'Payment Settled ✓'
                    : markingPaid
                    ? 'Reconciling...'
                    : 'Mark Settled (Bank Transfer)'}
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-mono uppercase tracking-wider text-[#7b7366] hover:text-[#131010] hover:bg-[#faf6f0] border border-[#e5dcd0]"
              >
                Close &amp; Return to Orders Queue
              </button>
            </div>
          </div>
        ) : (
          /* Create Form */
          <form onSubmit={handleCreateDraft} className="space-y-6">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 font-mono">
                {errorMessage}
              </div>
            )}

            {/* 1. Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                  1. Client Coordinates
                </h4>
                {registeredCustomers.length > 0 && (
                  <select
                    onChange={(e) => handleSelectCustomer(e.target.value)}
                    className="text-[11px] font-mono border border-[#e5dcd0] px-2 py-1 bg-[#faf8f5] text-[#131010] outline-none"
                  >
                    <option value="">Quick-fill registered client...</option>
                    {registeredCustomers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone || c.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#7b7366] mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Zainab Ibrahim"
                    className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] outline-none text-[#131010]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#7b7366] mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 08035650299"
                    className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] outline-none text-[#131010]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-mono text-[#7b7366] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="zainab@example.com"
                    className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] outline-none text-[#131010]"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-mono text-[#7b7366] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] outline-none text-[#131010]"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-mono text-[#7b7366] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] outline-none text-[#131010]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#7b7366] mb-1">
                  Delivery Address / Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="e.g. Plot 412, Gana Street, Maitama, Abuja"
                  className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] outline-none text-[#131010]"
                />
              </div>
            </div>

            {/* 2. Formulation Line Items */}
            <div className="space-y-3 pt-2 border-t border-[#e5dcd0]">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                  2. Formulation Line Items
                </h4>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-mono uppercase tracking-wider text-[#2d5508] hover:underline"
                >
                  + Add Line Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#faf8f5] border border-[#e5dcd0] grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-12 sm:col-span-5">
                      <label className="block text-[10px] font-mono text-[#7b7366] mb-0.5">
                        Formulation
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(idx, { name: e.target.value })}
                        className="w-full px-2 py-1.5 text-xs border border-[#e5dcd0] bg-white text-[#131010]"
                      />
                    </div>

                    <div className="col-span-5 sm:col-span-3">
                      <label className="block text-[10px] font-mono text-[#7b7366] mb-0.5">
                        Variant / Size
                      </label>
                      <select
                        value={item.variantName}
                        onChange={(e) => {
                          const vName = e.target.value;
                          let vPrice = item.price;
                          if (vName.includes('Small')) vPrice = 3000;
                          else if (vName.includes('Medium')) vPrice = 7000;
                          else if (vName.includes('Large')) vPrice = 11000;
                          else if (vName.includes('XL') || vName.includes('1kg')) vPrice = 16000;
                          handleUpdateItem(idx, { variantName: vName, price: vPrice });
                        }}
                        className="w-full px-2 py-1.5 text-xs border border-[#e5dcd0] bg-white text-[#131010]"
                      >
                        <option value="Small (150g)">Small (150g) - ₦3,000</option>
                        <option value="Medium (300g)">Medium (300g) - ₦7,000</option>
                        <option value="Large (500g)">Large (500g) - ₦11,000</option>
                        <option value="XL (1kg)">XL (1kg) - ₦16,000</option>
                        <option value="Custom Size">Custom Consultation Size</option>
                      </select>
                    </div>

                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-[10px] font-mono text-[#7b7366] mb-0.5">
                        Price (₦)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) =>
                          handleUpdateItem(idx, { price: Number(e.target.value) || 0 })
                        }
                        className="w-full px-2 py-1.5 text-xs font-mono border border-[#e5dcd0] bg-white text-[#131010]"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[10px] font-mono text-[#7b7366] mb-0.5">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(idx, { quantity: Number(e.target.value) || 1 })
                        }
                        className="w-full px-2 py-1.5 text-xs font-mono border border-[#e5dcd0] bg-white text-[#131010]"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1 text-right pt-4">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-600 hover:text-red-800 font-mono text-xs p-1"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Pricing Adjustments */}
            <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0] space-y-3">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366]">
                3. Courier Shipping &amp; VIP Consultation Discount
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-mono text-[#7b7366] mb-1">
                    Courier Delivery Fee (₦)
                  </label>
                  <select
                    value={shippingFee}
                    onChange={(e) => setShippingFee(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-[#e5dcd0] bg-white text-[#131010] outline-none"
                  >
                    <option value={2500}>Abuja Standard Courier (₦2,500)</option>
                    <option value={4000}>Interstate Nigerian Courier (₦4,000)</option>
                    <option value={0}>Free VIP Consultation Delivery (₦0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#7b7366] mb-1">
                    VIP Consultation Discount (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-1.5 text-xs font-mono border border-[#e5dcd0] bg-white text-[#131010] outline-none"
                  />
                </div>
              </div>

              {/* Order Financial Summary */}
              <div className="pt-3 border-t border-[#e5dcd0] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#7b7366]">
                  <span>Subtotal:</span>
                  <span>₦{subtotal.toLocaleString('en-NG')}</span>
                </div>
                <div className="flex justify-between text-[#7b7366]">
                  <span>Shipping:</span>
                  <span>+₦{shippingFee.toLocaleString('en-NG')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#2d5508]">
                    <span>Discount:</span>
                    <span>-₦{discount.toLocaleString('en-NG')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#e5dcd0] text-sm font-bold text-[#131010]">
                  <span>Total Payable:</span>
                  <span className="text-[#2d5508]">₦{totalPayable.toLocaleString('en-NG')}</span>
                </div>
              </div>
            </div>

            {/* 4. Mary's Consultation Notes */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] mb-1">
                4. WhatsApp Consultation Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Consulted Mary on sensitive melanin skin. Prescribed 2x daily lather for barrier repair."
                className="w-full px-3 py-2 text-xs border border-[#e5dcd0] bg-[#faf8f5] focus:bg-white focus:border-[#2d5508] outline-none text-[#131010]"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5dcd0]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#7b7366] hover:bg-[#faf6f0] border border-[#e5dcd0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || items.length === 0}
                className="px-6 py-2.5 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] font-mono text-xs uppercase tracking-[0.18em] border border-[#131010] hover:border-[#2d5508] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Generating Paystack Link...' : 'Create Draft & Generate Paystack Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
