import React, { Suspense } from 'react';
import { getProducts, getProductVariants } from '@/lib/insforge/queries';
import { AdminProductsManager } from '@/components/admin/admin-products-manager';

export default async function AdminProductsPage() {
  const products = await getProducts();
  const productsWithVariants = await Promise.all(
    products.map(async (p) => {
      const variants = await getProductVariants(p.id);
      return {
        ...p,
        variants,
      };
    })
  );

  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-[#7b7366]">Loading product catalog...</div>}>
      <AdminProductsManager initialProducts={productsWithVariants} />
    </Suspense>
  );
}
