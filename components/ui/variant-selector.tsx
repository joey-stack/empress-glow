'use client';

import React, { useState } from 'react';
import type { Product, ProductVariant } from '@/lib/insforge/queries';
import { useCart } from '@/lib/cart/cart-context';

interface VariantSelectorProps {
  product: Product;
  variants: ProductVariant[];
  whatsappInquiryUrl: string;
}

export function VariantSelector({ product, variants, whatsappInquiryUrl }: VariantSelectorProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    variants[0] || {
      id: 'default',
      product_id: product.id,
      name: 'Standard',
      price: product.price || 3000,
      stock: product.stock,
      sku: 'EG-STD',
      sort_order: 1,
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      quantity,
      image: product.images?.[0] || '/images/fruity-soap-hero.jpg',
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(selectedVariant.price * quantity);

  return (
    <div className="p-6 sm:p-8 bg-white rounded-none border border-[#e5dcd0] space-y-6">
      {/* Price Header */}
      <div className="flex items-baseline justify-between pb-5 border-b border-[#e5dcd0]">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7b7366] block mb-1">
            Price • VAT Exempt
          </span>
          <span className="font-serif text-3xl sm:text-4xl font-normal text-[#131010]">
            {formattedPrice}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-none bg-[#5a8210]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#2d5508]">
            In Stock ({selectedVariant.stock})
          </span>
        </div>
      </div>

      {/* Variant Selector — Sharp Architectural Rectangles */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <label className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[#131010]">
            Select Formulation Size:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {variants.map((variant) => {
              const isSelected = selectedVariant.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-3 rounded-none font-mono text-xs border transition-colors text-center flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'border-[#2d5508] bg-[#f7f5f0] text-[#2d5508] font-bold'
                      : 'border-[#e5dcd0] bg-white text-[#524b42] hover:border-[#131010] hover:text-[#131010]'
                  }`}
                >
                  <span className="uppercase tracking-wider">{variant.name}</span>
                  <span className="text-[11px] font-normal text-[#7b7366]">
                    ₦{variant.price.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart — Sharp Architectural Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex items-stretch gap-3">
          <div className="flex items-center border border-[#e5dcd0] rounded-none bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-10 h-12 rounded-none bg-white text-[#131010] font-mono text-base disabled:opacity-30 hover:bg-[#faf6f0] transition-colors"
            >
              −
            </button>
            <span className="w-10 text-center font-mono text-xs font-semibold text-[#131010]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              disabled={quantity >= 10}
              className="w-10 h-12 rounded-none bg-white text-[#131010] font-mono text-base disabled:opacity-30 hover:bg-[#faf6f0] transition-colors"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-6 bg-[#2d5508] hover:bg-[#5a8210] text-white font-mono text-xs uppercase tracking-[0.2em] rounded-none transition-colors duration-200 font-medium flex items-center justify-center gap-2"
          >
            {addedNotice ? (
              <span>✓ Added to Bag</span>
            ) : (
              <span>Add to Bag • {formattedPrice}</span>
            )}
          </button>
        </div>

        {/* Secondary WhatsApp Inquire — Sharp Border */}
        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center border border-[#131010] text-[#131010] hover:bg-[#131010] hover:text-[#f7f1e8] bg-white transition-colors duration-200 font-mono text-xs uppercase tracking-[0.18em] py-3.5 px-4 rounded-none text-center"
        >
          Inquire on WhatsApp →
        </a>
      </div>

      <div className="pt-2 border-t border-[#e5dcd0] flex items-center justify-between font-mono text-[10px] text-[#7b7366] uppercase tracking-wider">
        <span>Complimentary Abuja delivery over ₦25,000</span>
        <span>FCCPC 7-Day Guarantee</span>
      </div>
    </div>
  );
}
