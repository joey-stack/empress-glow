import { NextResponse } from 'next/server';
import {
  adjustVariantStock,
  adjustProductStock,
  createAuditLog,
  InventoryAdjustmentReason,
} from '@/lib/insforge/queries';
import { requireAdminPermission } from '@/lib/auth/admin-guard';

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminPermission('manage_inventory', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { variantId, productId, changeAmount, reason, note, operation = 'adjust' } = body;

    const numChange = Number(changeAmount);
    if (isNaN(numChange)) {
      return NextResponse.json(
        { success: false, error: 'Change amount must be a valid number' },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { success: false, error: 'An adjustment reason code is required for FCCPC compliance.' },
        { status: 400 }
      );
    }

    let result = null;

    if (variantId) {
      result = await adjustVariantStock({
        variantId,
        changeAmount: numChange,
        reason: reason as InventoryAdjustmentReason,
        note: note || undefined,
        actor: authCheck.actor,
      });

      if (!result) {
        return NextResponse.json(
          { success: false, error: 'Variant not found' },
          { status: 404 }
        );
      }

      // Record audit trail
      await createAuditLog({
        actor: authCheck.actor,
        action: 'inventory.variant_adjusted',
        category: 'catalog',
        target_type: 'inventory',
        target_id: variantId,
        summary: `Adjusted stock for ${result.adjustment.product_name} (${result.adjustment.variant_name}): ${numChange > 0 ? '+' : ''}${numChange} units (New: ${result.variant.stock})`,
        details: {
          variant_id: variantId,
          sku: result.variant.sku,
          change: numChange,
          previous_stock: result.adjustment.previous_stock,
          new_stock: result.variant.stock,
          reason,
          note,
        },
      });

      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    if (productId) {
      result = await adjustProductStock({
        productId,
        changeAmount: numChange,
        reason: reason as InventoryAdjustmentReason,
        note: note || undefined,
        actor: authCheck.actor,
      });

      if (!result) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      await createAuditLog({
        actor: authCheck.actor,
        action: 'inventory.product_adjusted',
        category: 'catalog',
        target_type: 'product',
        target_id: productId,
        summary: `Adjusted total stock for ${result.product.name}: ${numChange > 0 ? '+' : ''}${numChange} units (New: ${result.product.stock})`,
        details: {
          product_id: productId,
          change: numChange,
          previous_stock: result.adjustment.previous_stock,
          new_stock: result.product.stock,
          reason,
          note,
        },
      });

      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Either variantId or productId must be provided.' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to adjust inventory' },
      { status: 500 }
    );
  }
}
