import { NextResponse } from 'next/server';
import {
  getProducts,
  getAllVariants,
  getInventoryAdjustments,
  adjustVariantStock,
  adjustProductStock,
  createAuditLog,
  InventoryAdjustmentReason,
} from '@/lib/insforge/queries';
import { requireAdminPermission } from '@/lib/auth/admin-guard';

export async function GET(req: Request) {
  try {
    const products = await getProducts();
    const allVariants = await getAllVariants();
    const adjustments = await getInventoryAdjustments();

    // Enrich products with their variants and stock health
    let totalStockUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalRetailValuation = 0;
    let totalCostValuation = 0;

    const inventoryMatrix = products.map((product) => {
      const productVariants = allVariants.filter((v) => v.product_id === product.id);
      
      const computedStock = productVariants.length > 0
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
          status: v.stock === 0 ? 'out_of_stock' : v.stock <= 4 ? 'critical' : v.stock <= 10 ? 'low' : 'healthy',
        })),
        overall_status: computedStock === 0 ? 'out_of_stock' : computedStock <= 10 ? 'low' : 'healthy',
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        inventory: inventoryMatrix,
        adjustments: adjustments.slice(0, 50),
        kpis: {
          total_units: totalStockUnits,
          low_stock_items: lowStockCount,
          out_of_stock_items: outOfStockCount,
          retail_valuation: totalRetailValuation,
          cost_valuation: totalCostValuation,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch inventory matrix' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminPermission('manage_inventory', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Batch inventory payload must contain an items array.' },
        { status: 400 }
      );
    }

    const { items, batch_reference = 'Batch Intake' } = body;
    const results = [];

    for (const item of items) {
      const { variantId, productId, changeAmount, reason = 'received_shipment', note } = item;
      const numChange = Number(changeAmount);

      if (isNaN(numChange) || numChange === 0) continue;

      if (variantId) {
        const res = await adjustVariantStock({
          variantId,
          changeAmount: numChange,
          reason: reason as InventoryAdjustmentReason,
          note: note || `Batch Reorder Intake: ${batch_reference}`,
          actor: authCheck.actor,
        });
        if (res) results.push(res);
      } else if (productId) {
        const res = await adjustProductStock({
          productId,
          changeAmount: numChange,
          reason: reason as InventoryAdjustmentReason,
          note: note || `Batch Reorder Intake: ${batch_reference}`,
          actor: authCheck.actor,
        });
        if (res) results.push(res);
      }
    }

    // Audit log
    await createAuditLog({
      actor: authCheck.actor,
      action: 'inventory.batch_received',
      category: 'catalog',
      target_type: 'inventory',
      target_id: `batch_${Date.now()}`,
      summary: `Received batch production inventory: ${results.length} items adjusted (${batch_reference})`,
      details: {
        batch_reference,
        adjusted_count: results.length,
        items,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        adjusted_count: results.length,
        results,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process batch inventory intake' },
      { status: 500 }
    );
  }
}
