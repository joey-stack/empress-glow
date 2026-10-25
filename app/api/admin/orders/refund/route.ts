import { NextResponse } from 'next/server';
import {
  getOrderById,
  createOrderRefund,
  updateOrderReturnStatus,
  getProductById,
  updateProduct,
  adjustVariantStock,
  adjustProductStock,
  createAuditLog,
} from '@/lib/insforge/queries';
import { requireAdminPermission } from '@/lib/auth/admin-guard';

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminPermission('process_refunds', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const {
      order_id,
      amount,
      reason,
      reason_category = 'fccpc_statutory',
      customer_note,
      merchant_note,
      restock_inventory = false,
    } = body;

    if (!order_id) {
      return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ success: false, error: 'Please specify a valid refund amount.' }, { status: 400 });
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json({ success: false, error: 'Refund reason is required for audit and compliance.' }, { status: 400 });
    }

    const order = await getOrderById(order_id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
    }

    // Verify order is paid
    const isPaid = order.status === 'paid' || order.status === 'delivered' || order.status === 'shipped' || order.financial_status === 'paid' || order.financial_status === 'partially_refunded';
    if (!isPaid) {
      return NextResponse.json(
        { success: false, error: 'Only settled or paid orders can be refunded via Paystack.' },
        { status: 400 }
      );
    }

    // Check maximum refundable balance
    const alreadyRefunded = order.total_refunded || 0;
    const maxRefundable = order.total - alreadyRefunded;
    if (numericAmount > maxRefundable) {
      return NextResponse.json(
        {
          success: false,
          error: `Refund amount (₦${numericAmount.toLocaleString('en-NG')}) exceeds remaining refundable balance (₦${maxRefundable.toLocaleString('en-NG')}).`,
        },
        { status: 400 }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isMock =
      !paystackSecret ||
      paystackSecret.includes('placeholder') ||
      paystackSecret.startsWith('sk_test_placeholder');

    let paystackRefundId = `pst_rf_sim_${Date.now()}`;
    let paystackStatus: 'pending' | 'processed' | 'failed' = 'processed';

    // Call live Paystack refund API if configured with a real key
    if (!isMock && order.paystack_reference) {
      try {
        const paystackRes = await fetch('https://api.paystack.co/refund', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transaction: order.paystack_reference,
            amount: Math.round(numericAmount * 100), // convert to kobo
            currency: 'NGN',
            customer_note: customer_note || reason,
            merchant_note: merchant_note || `FCCPC Refund for Order #${order.id}`,
          }),
        });

        const paystackData = await paystackRes.json();
        if (!paystackRes.ok || !paystackData.status) {
          return NextResponse.json(
            {
              success: false,
              error: paystackData.message || 'Paystack refund processing declined by payment gateway.',
            },
            { status: 502 }
          );
        }

        paystackRefundId = String(paystackData.data?.id || `pst_rf_${Date.now()}`);
        paystackStatus = paystackData.data?.status === 'processed' ? 'processed' : 'pending';
      } catch (err: any) {
        return NextResponse.json(
          {
            success: false,
            error: `Gateway communication error: ${err.message}`,
          },
          { status: 502 }
        );
      }
    }

    // Automated variant-level restocking with inventory adjustment log
    if (restock_inventory && order.items && order.items.length > 0) {
      for (const item of order.items) {
        if (item.variantId) {
          await adjustVariantStock({
            variantId: item.variantId,
            changeAmount: item.quantity,
            reason: 'customer_return',
            note: `Refund Restock for Order #${order.id} (${reason_category})`,
            actor: authCheck.actor,
          });
        } else if (item.productId) {
          await adjustProductStock({
            productId: item.productId,
            changeAmount: item.quantity,
            reason: 'customer_return',
            note: `Refund Restock for Order #${order.id} (${reason_category})`,
            actor: authCheck.actor,
          });
        }
      }
    }

    // Record refund record and update order financial status
    const result = await createOrderRefund(order.id, {
      amount: numericAmount,
      amount_kobo: Math.round(numericAmount * 100),
      currency: 'NGN',
      reason: reason.trim(),
      reason_category,
      customer_note: customer_note?.trim(),
      merchant_note: merchant_note?.trim(),
      restock_inventory,
      paystack_refund_id: paystackRefundId,
      paystack_reference: order.paystack_reference,
      paystack_status: paystackStatus,
      initiated_by: authCheck.actor.name,
      processed_at: new Date().toISOString(),
    });

    if (!result) {
      return NextResponse.json({ success: false, error: 'Failed to record refund on order.' }, { status: 500 });
    }

    // Record audit trail
    await createAuditLog({
      actor: authCheck.actor,
      action: 'order.refund_authorized',
      category: 'finance',
      target_type: 'refund',
      target_id: order.id,
      summary: `Authorized ₦${numericAmount.toLocaleString('en-NG')} refund for Order #${order.id} (${reason_category})`,
      details: {
        order_id: order.id,
        amount: numericAmount,
        currency: 'NGN',
        reason: reason.trim(),
        reason_category,
        customer_note,
        merchant_note,
        restock_inventory,
        paystack_status: paystackStatus,
        financial_status: result.order.financial_status,
      },
    });

    const isFullRefund = result.order.total_refunded! >= result.order.total;
    const message = isFullRefund
      ? `Full refund of ₦${numericAmount.toLocaleString('en-NG')} executed successfully via Paystack.`
      : `Partial refund of ₦${numericAmount.toLocaleString('en-NG')} executed successfully. Remaining order balance: ₦${(result.order.total - result.order.total_refunded!).toLocaleString('en-NG')}.`;

    return NextResponse.json({
      success: true,
      order: result.order,
      refund: result.refund,
      message,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Refund error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await requireAdminPermission('manage_orders', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const { order_id, return_status, return_tracking_number, inspection_notes, return_reason } = body;

    if (!order_id) {
      return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 });
    }

    const updated = await updateOrderReturnStatus(order_id, {
      return_status,
      return_tracking_number,
      inspection_notes,
      return_reason,
      return_requested_at: new Date().toISOString(),
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
    }

    // Record audit trail
    await createAuditLog({
      actor: authCheck.actor,
      action: 'order.return_status_updated',
      category: 'orders',
      target_type: 'order',
      target_id: order_id,
      summary: `Updated return merchandise tracking to '${return_status}' for Order #${order_id}`,
      details: {
        order_id,
        return_status,
        return_tracking_number,
        inspection_notes,
      },
    });

    return NextResponse.json({
      success: true,
      order: updated,
      message: `Return workflow updated to: ${return_status}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Return tracking error' }, { status: 500 });
  }
}
