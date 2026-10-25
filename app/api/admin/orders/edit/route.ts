import { NextResponse } from 'next/server';
import {
  getOrderById,
  updateOrderItemsAndTotal,
  createAuditLog,
  CartItem,
} from '@/lib/insforge/queries';
import { requireAdminPermission } from '@/lib/auth/admin-guard';

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminPermission('manage_orders', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json().catch(() => null);
    if (!body || !body.orderId || !Array.isArray(body.items)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: orderId and items array are required.' },
        { status: 400 }
      );
    }

    const { orderId, items, shippingFee, discount, reason } = body;

    const existingOrder = await getOrderById(orderId);
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found.' },
        { status: 404 }
      );
    }

    if (existingOrder.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Cannot modify items on a cancelled order.' },
        { status: 400 }
      );
    }

    // Validate items
    const validatedItems: CartItem[] = items.map((i: any) => ({
      productId: i.productId,
      variantId: i.variantId,
      name: i.name || 'Botanical Item',
      variantName: i.variantName,
      price: Math.max(0, Number(i.price) || 0),
      quantity: Math.max(1, Math.min(50, Number(i.quantity) || 1)),
      image: i.image || '/images/fruity-soap-hero.jpg',
    }));

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'An order must contain at least one line item.' },
        { status: 400 }
      );
    }

    const previousTotal = existingOrder.total;

    const result = await updateOrderItemsAndTotal(orderId, validatedItems, {
      shipping_fee: shippingFee !== undefined ? Number(shippingFee) : undefined,
      discount: discount !== undefined ? Number(discount) : undefined,
      reason: reason || 'Admin order modification',
      actor: authCheck.actor,
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to update order items.' },
        { status: 500 }
      );
    }

    // Record audit log
    await createAuditLog({
      actor: authCheck.actor,
      action: 'order.items_modified',
      category: 'orders',
      target_type: 'order',
      target_id: orderId,
      summary: `Modified line items for Order #${orderId} (₦${previousTotal.toLocaleString('en-NG')} -> ₦${result.order.total.toLocaleString('en-NG')})`,
      details: {
        order_id: orderId,
        previous_total: previousTotal,
        new_total: result.order.total,
        reason: reason || 'Customer request',
        items_count: validatedItems.length,
        changes_summary: result.editRecord.changes_summary,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        order: result.order,
        editRecord: result.editRecord,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to edit order items' },
      { status: 500 }
    );
  }
}
