import React from 'react';
import {
  getProducts,
  getAllVariants,
  getInventoryAdjustments,
} from '@/lib/insforge/queries';
import { AdminInventoryManager } from '@/components/admin/admin-inventory-manager';

export const metadata = {
  title: 'Inventory & Stock Matrix | Empress Glow Emporium Admin',
};

export default async function AdminInventoryPage() {
  const products = await getProducts();
  const allVariants = await getAllVariants();
  const adjustments = await getInventoryAdjustments();

  let totalStockUnits = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalRetailValuation = 0;
  let totalCostValuation = 0;

  const inventoryMatrix = products.map((product) => {
    const productVariants = allVariants.filter((v) => v.product_id === product.id);

    const computedStock =
      productVariants.length > 0
        ? productVariants.reduce((sum, v) => sum + v.stock, 0)
        : product.stock;

    totalStockUnits += computedStock;

    const costPerItem = product.cost_per_item || Math.round(product.price * 0.4);
    totalRetailValuation += product.price * computedStock;
    totalCostValuation += costPerItem * computedStock;

    if (computedStock === 0) {
      outOfStockCount++;
    } else if (computedStock <= 10) {
      lowStockCount++;
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      vendor: product.vendor || 'Empress Glow',
      image: product.images[0] || '/images/fruity-soap-hero.jpg',
      price: product.price,
      cost_per_item: costPerItem,
      total_stock: computedStock,
      status: product.status,
      variants: productVariants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
        status: (v.stock === 0 ? 'out_of_stock' : v.stock <= 4 ? 'critical' : v.stock <= 10 ? 'low' : 'healthy') as any,
      })),
      overall_status: (computedStock === 0 ? 'out_of_stock' : computedStock <= 10 ? 'low' : 'healthy') as any,
    };
  });

  return (
    <AdminInventoryManager
      initialInventory={inventoryMatrix}
      initialAdjustments={adjustments}
      initialKpis={{
        total_units: totalStockUnits,
        low_stock_items: lowStockCount,
        out_of_stock_items: outOfStockCount,
        retail_valuation: totalRetailValuation,
        cost_valuation: totalCostValuation,
      }}
    />
  );
}
