'use client';

import React, { useState } from 'react';
import type { Order, Product, CartItem, ProductVariant } from '@/lib/insforge/queries';

interface EditOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  availableProducts: Product[];
  onOrderUpdated: (updatedOrder: Order) => void;
}

export function EditOrderModal({
  order,
  isOpen,
  onClose,
  availableProducts,
  onOrderUpdated,
}: EditOrderModalProps) {
  const [items, setItems] = useState<CartItem[]>(
    order.items.map((i) => ({ ...i }))
  );
  const [shippingFee, setShippingFee] = useState<number>(order.shipping_fee);
  const [discount, setDiscount] = useState<number>(order.discount || 0);
  const [reason, setReason] = useState<string>('Customer WhatsApp request to adjust line items');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New item selector state
  const [selectedProductId, setSelectedProductId] = useState<string>(
    availableProducts[0]?.id || ''
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  if (!isOpen) return null;

  // Selected product variants
  const activeProduct = availableProducts.find((p) => p.id === selectedProductId);
  // Default variant mapping for products if variants not explicitly passed
  const isHero = activeProduct?.slug === 'empress-glow-fruity-soap';
  const heroVariants: ProductVariant[] = [
    { id: 'v1', product_id: activeProduct?.id || '', name: 'Small (150g)', price: 3000, stock: 25, sku: 'EG-FS-S', sort_order: 1 },
    { id: 'v2', product_id: activeProduct?.id || '', name: 'Medium (250g)', price: 7000, stock: 25, sku: 'EG-FS-M', sort_order: 2 },
    { id: 'v3', product_id: activeProduct?.id || '', name: 'Large (350g)', price: 11000, stock: 25, sku: 'EG-FS-L', sort_order: 3 },
    { id: 'v4', product_id: activeProduct?.id || '', name: 'XL (500g)', price: 16000, stock: 25, sku: 'EG-FS-XL', sort_order: 4 },
  ];

  // Financial calculations
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const newTotal = Math.max(0, subtotal + shippingFee - discount);
  const totalDelta = newTotal - order.total;

  const handleQuantityChange = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...items];
    updated[index].quantity = newQty;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      alert('An order must contain at least one line item. To cancel the order completely, use Cancel Order.');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleAddItem = () => {
    if (!activeProduct) return;

    let price = activeProduct.price;
    let variantName = 'Standard';
    let variantId = selectedVariantId;

    if (isHero) {
      const v = heroVariants.find((hv) => hv.id === (selectedVariantId || 'v1'));
      if (v) {
        price = v.price;
        variantName = v.name;
        variantId = v.id;
      }
    }

    // Check if variant already in items
    const existingIndex = items.findIndex(
      (i) => (variantId && i.variantId === variantId) || (!variantId && i.productId === activeProduct.id)
    );

    if (existingIndex !== -1) {
      const updated = [...items];
      updated[existingIndex].quantity += selectedQuantity;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          productId: activeProduct.id,
          variantId: variantId || activeProduct.id,
          name: activeProduct.name,
          variantName,
          price,
          quantity: selectedQuantity,
          image: activeProduct.images[0] || '/images/fruity-soap-hero.jpg',
        },
      ]);
    }

    setSelectedQuantity(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Please keep at least one formulation in the order.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/orders/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          items,
          shippingFee,
          discount,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update order items');
      }

      onOrderUpdated(data.data.order);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error editing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-[#e5dcd0] w-full max-w-2xl max-h-[90vh] flex flex-col p-6 sm:p-8 space-y-6 shadow-2xl rounded-none animate-scale-up">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e5dcd0] pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#2d5508] font-bold block">
              Shopify Admin Parity &bull; Post-Submission Editing
            </span>
            <h3 className="font-serif text-2xl text-[#131010] mt-0.5">
              Edit Order Line Items: #{order.id}
            </h3>
            <span className="font-mono text-xs text-[#7b7366] block">
              Client: {order.customer_name} &bull; Current Total: ₦{order.total.toLocaleString('en-NG')}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7b7366] hover:text-[#131010] font-mono text-lg"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#fee2e2] border border-[#f87171] text-[#991b1b] text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-1 flex-1">
          {/* Current Line Items */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block">
              Current Order Formulations ({items.length})
            </span>

            <div className="border border-[#e5dcd0] divide-y divide-[#e5dcd0]">
              {items.map((item, idx) => (
                <div key={idx} className="p-3 bg-[#faf8f5]/40 flex items-center justify-between gap-4 text-xs">
                  <div className="flex-1">
                    <span className="font-serif font-bold text-[#131010] block">{item.name}</span>
                    <span className="font-mono text-[10px] text-[#7b7366]">
                      {item.variantName || 'Standard'} &bull; ₦{item.price.toLocaleString('en-NG')} each
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                      className="w-6 h-6 border border-[#e5dcd0] bg-white text-[#131010] hover:border-[#131010] font-mono"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                      className="w-6 h-6 border border-[#e5dcd0] bg-white text-[#131010] hover:border-[#131010] font-mono"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right font-mono font-bold text-[#131010]">
                    ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    title="Remove Item"
                    className="text-[#991b1b] hover:text-black font-mono text-sm px-1.5"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Another Formulation */}
          <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0] space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#2d5508] font-bold block">
              + Add Item to this Order
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block mb-1">
                  Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setSelectedVariantId('');
                  }}
                  className="w-full bg-white border border-[#e5dcd0] p-2 text-xs font-mono text-[#131010] outline-none"
                >
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {isHero ? (
                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block mb-1">
                    Variant Size
                  </label>
                  <select
                    value={selectedVariantId || 'v1'}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full bg-white border border-[#e5dcd0] p-2 text-xs font-mono text-[#131010] outline-none"
                  >
                    {heroVariants.map((hv) => (
                      <option key={hv.id} value={hv.id}>
                        {hv.name} — ₦{hv.price.toLocaleString('en-NG')}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block mb-1">
                    Standard Price
                  </label>
                  <div className="bg-white border border-[#e5dcd0] p-2 text-xs font-mono text-[#131010]">
                    ₦{(activeProduct?.price || 0).toLocaleString('en-NG')}
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="w-20">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#7b7366] block mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-[#e5dcd0] p-2 text-xs font-mono text-center text-[#131010] outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex-1 py-2 bg-[#131010] text-[#f7f1e8] hover:bg-[#2d5508] transition-colors font-mono text-xs uppercase tracking-wider"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Shipping Fee, Discount & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block mb-1">
                Shipping Fee (₦)
              </label>
              <input
                type="number"
                min="0"
                value={shippingFee}
                onChange={(e) => setShippingFee(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-white border border-[#e5dcd0] p-2 text-xs font-mono text-[#131010] outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block mb-1">
                Discount / VIP Courtesy (₦)
              </label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-white border border-[#e5dcd0] p-2 text-xs font-mono text-[#131010] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[#7b7366] block mb-1">
              Reason for Order Modification (Logged to Audit Trail)
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer requested size upgrade via WhatsApp before dispatch"
              className="w-full bg-white border border-[#e5dcd0] p-2 text-xs font-sans text-[#131010] outline-none"
            />
          </div>

          {/* Balance Preview Card */}
          <div className="p-4 bg-[#faf8f5] border border-[#e5dcd0] space-y-2 text-xs font-mono">
            <div className="flex justify-between text-[#7b7366]">
              <span>Formulations Subtotal:</span>
              <span>₦{subtotal.toLocaleString('en-NG')}</span>
            </div>
            <div className="flex justify-between text-[#7b7366]">
              <span>Courier Delivery Fee:</span>
              <span>₦{shippingFee.toLocaleString('en-NG')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#2d5508]">
                <span>VIP Courtesy Discount:</span>
                <span>-₦{discount.toLocaleString('en-NG')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-[#131010] border-t border-[#e5dcd0] pt-2">
              <span>New Order Total:</span>
              <span>₦{newTotal.toLocaleString('en-NG')}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#7b7366] italic">
              <span>Adjustment Balance Impact:</span>
              <span className={totalDelta > 0 ? 'text-[#2d5508] font-bold' : totalDelta < 0 ? 'text-[#991b1b] font-bold' : ''}>
                {totalDelta > 0 ? `+₦${totalDelta.toLocaleString('en-NG')} (Higher)` : totalDelta < 0 ? `-₦${Math.abs(totalDelta).toLocaleString('en-NG')} (Lower)` : 'Unchanged'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5dcd0]">
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 border border-[#e5dcd0] text-[#7b7366] hover:text-[#131010] hover:border-[#131010] transition-colors rounded-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="font-mono text-xs uppercase tracking-wider px-6 py-2.5 bg-[#131010] text-[#f7f1e8] hover:bg-[#2d5508] transition-colors rounded-none disabled:opacity-50"
            >
              {isSubmitting ? 'Updating Order...' : 'Confirm Order Edits'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
