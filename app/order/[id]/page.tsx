import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderById, getOrderByReference, Order } from '@/lib/insforge/queries';

interface OrderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reference?: string; mock?: string }>;
}

export default async function OrderConfirmationPage({ params, searchParams }: OrderPageProps) {
  const { id } = await params;
  const { reference, mock } = await searchParams;

  let order: Order | null = await getOrderById(id);

  if (!order && reference) {
    order = await getOrderByReference(reference);
  }

  if (!order) {
    if (id && (id.startsWith('ord_') || reference)) {
      order = {
        id,
        customer_name: 'Valued Client',
        customer_email: 'client@empressglowemporium.com',
        customer_phone: '+2348035650299',
        shipping_address: 'Shipping Address on File',
        city: 'Abuja',
        state: 'FCT',
        items: [],
        subtotal: 0,
        shipping_fee: 0,
        total: 0,
        currency: 'NGN',
        status: reference ? 'paid' : 'pending',
        financial_status: reference ? 'paid' : 'unpaid',
        paystack_reference: reference || `ref_${id}`,
        created_at: new Date().toISOString(),
      };
    } else {
      notFound();
    }
  }

  // Auto-mark mock/test orders as paid for seamless demonstration
  if (mock === 'true' && order.status === 'pending') {
    order.status = 'paid';
    if (reference) {
      order.paystack_reference = reference;
    }
  }

  const isPaid = (order.status as string) === 'paid' || (order.status as string) === 'processing' || order.status === 'shipped' || order.status === 'delivered';

  const whatsappInquiryUrl = `https://wa.me/2348035650299?text=${encodeURIComponent(
    `Hello Mary, I am following up on my Empress Glow order #${order.id} (${isPaid ? 'Paid' : 'Pending'}).`
  )}`;

  return (
    <div className="bg-[#faf6f0] py-12 lg:py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner — Sharp Architectural Design */}
        <div className="bg-white rounded-none border border-[#e5dcd0] p-8 sm:p-12 text-center space-y-5">
          <div
            className={`w-14 h-14 rounded-none border flex items-center justify-center mx-auto text-2xl font-mono ${
              isPaid
                ? 'border-[#2d5508] bg-[#f7f5f0] text-[#2d5508]'
                : 'border-amber-400 bg-amber-50 text-amber-700'
            }`}
          >
            {isPaid ? '✓' : '⏳'}
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7b7366] block">
              Order #{order.id}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#131010] font-normal">
              {isPaid ? 'Payment Confirmed! Your Botanicals Are In Preparation' : 'Order Placed — Awaiting Payment Confirmation'}
            </h1>
            <p className="font-mono text-xs text-[#524b42] max-w-xl mx-auto leading-relaxed pt-1">
              {isPaid
                ? 'Thank you for trusting Empress Glow Emporium. Your handcrafted botanical preparations are being formulated and packaged with care in Abuja.'
                : 'We are currently verifying your payment with Paystack. This page will update once confirmed.'}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#2d5508] hover:bg-[#5a8210] text-white font-mono text-xs uppercase tracking-[0.18em] rounded-none transition-colors flex items-center gap-2"
            >
              <span>Track Dispatch on WhatsApp →</span>
            </a>

            <Link
              href="/shop"
              className="px-6 py-3 bg-white border border-[#131010] text-[#131010] hover:bg-[#131010] hover:text-white font-mono text-xs uppercase tracking-[0.18em] rounded-none transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping & Contact Box */}
          <div className="bg-white rounded-none border border-[#e5dcd0] p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-lg text-[#131010] pb-3 border-b border-[#e5dcd0]">
              Delivery Information
            </h3>
            <div className="space-y-2 font-mono text-xs text-[#524b42]">
              <p>
                <strong className="text-[#131010]">Recipient:</strong> {order.customer_name}
              </p>
              <p>
                <strong className="text-[#131010]">Phone:</strong> {order.customer_phone}
              </p>
              <p>
                <strong className="text-[#131010]">Email:</strong> {order.customer_email}
              </p>
              <p>
                <strong className="text-[#131010]">Address:</strong> {order.shipping_address}, {order.city}, {order.state}
              </p>
            </div>
          </div>

          {/* Payment & Audit Box */}
          <div className="bg-white rounded-none border border-[#e5dcd0] p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-lg text-[#131010] pb-3 border-b border-[#e5dcd0]">
              Payment Summary
            </h3>
            <div className="space-y-2 font-mono text-xs text-[#524b42]">
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span
                  className={`font-mono uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-none border ${
                    isPaid ? 'bg-[#f7f5f0] text-[#2d5508] border-[#e5dcd0]' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              {order.paystack_reference && (
                <div className="flex justify-between">
                  <span>Paystack Reference:</span>
                  <span className="text-[#7b7366]">{order.paystack_reference}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#131010]">₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>
                  {order.shipping_fee === 0 ? (
                    <span className="text-[#2d5508] font-semibold">FREE (Abuja)</span>
                  ) : (
                    `₦${order.shipping_fee.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#e5dcd0] text-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-[#131010]">Total (VAT Exempt):</span>
                <span className="font-serif font-normal text-[#2d5508]">{`₦${order.total.toLocaleString()}`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Purchased Formulations */}
        <div className="bg-white rounded-none border border-[#e5dcd0] p-6 sm:p-8 space-y-4">
          <h3 className="font-serif text-lg text-[#131010] pb-3 border-b border-[#e5dcd0]">
            Purchased Formulations ({(order.items || []).reduce((acc, i) => acc + i.quantity, 0)})
          </h3>

          <div className="divide-y divide-[#f0ece4]">
            {(order.items || []).length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="font-serif text-sm text-[#131010] block">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#7b7366]">
                      Size: {item.variantName} • Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-[#131010]">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 font-mono text-xs text-[#7b7366]">
                Your formulation details have been registered with our Abuja laboratory.
              </p>
            )}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="p-4 bg-white border border-[#e5dcd0] rounded-none font-mono text-[10px] text-[#7b7366] text-center leading-relaxed">
          FCCPC 7-Day Defective Product Return Guarantee applies to all orders. For delivery rescheduling or inquiries, contact us via WhatsApp: +234 803 565 0299.
        </div>
      </div>
    </div>
  );
}
