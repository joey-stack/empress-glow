import { NextResponse } from 'next/server';
import {
  getOrderById,
  updateOrderFraudVerification,
  createAuditLog,
} from '@/lib/insforge/queries';
import { requireAdminPermission } from '@/lib/auth/admin-guard';

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminPermission('manage_orders', req);
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json().catch(() => null);
    if (!body || !body.orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId is required.' },
        { status: 400 }
      );
    }

    const { orderId, verified = true, notes } = body;

    const existingOrder = await getOrderById(orderId);
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found.' },
        { status: 404 }
      );
    }

    const operatorName = authCheck.actor?.name || 'Admin Compliance Officer';
    const updatedOrder = await updateOrderFraudVerification(orderId, {
      verified: Boolean(verified),
      operator: operatorName,
      notes: notes || 'Verified order legitimacy and client contact via operator review.',
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Failed to update fraud verification state.' },
        { status: 500 }
      );
    }

    // Record immutable audit trail log
    await createAuditLog({
      actor: authCheck.actor,
      action: verified ? 'order.fraud_cleared' : 'order.fraud_flagged',
      category: 'orders',
      target_type: 'order',
      target_id: orderId,
      summary: verified
        ? `Operator ${operatorName} verified and cleared fraud alert for order ${orderId}`
        : `Operator ${operatorName} flagged order ${orderId} for high fraud risk`,
      details: {
        orderId,
        previous_risk_level: existingOrder.fraud_analysis?.risk_level,
        previous_score: existingOrder.fraud_analysis?.risk_score,
        new_risk_level: updatedOrder.fraud_analysis?.risk_level,
        new_score: updatedOrder.fraud_analysis?.risk_score,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('Failed to process fraud verification:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
