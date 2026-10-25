import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  updateOrderStatus,
  getOrderByReference,
  getOrderById,
  isWebhookEventProcessed,
  recordWebhookEvent,
} from '@/lib/insforge/queries';

export async function POST(req: NextRequest) {
  try {
    // Read RAW body for cryptographic signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder';

    // Verify HMAC-SHA512 signature
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

    if (signature !== hash) {
      console.warn('[PAYSTACK WEBHOOK] Invalid HMAC-SHA512 signature attempt.');
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature.' },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;
    const eventId = String(data?.id || data?.reference || `${event}_${Date.now()}`);

    // Idempotency check: prevent duplicate event processing
    if (await isWebhookEventProcessed(eventId)) {
      console.log(`[PAYSTACK WEBHOOK] Event ${eventId} already processed. Acknowledging.`);
      return NextResponse.json({ received: true, note: 'idempotent_duplicate' }, { status: 200 });
    }

    // Record event as processed
    await recordWebhookEvent(eventId);

    if (event === 'charge.success') {
      const reference = data.reference;
      const orderId = data.metadata?.orderId;
      const paidAt = data.paid_at || new Date().toISOString();

      let order = null;
      if (orderId) {
        order = await getOrderById(orderId);
      }
      if (!order && reference) {
        order = await getOrderByReference(reference);
      }

      if (order) {
        await updateOrderStatus(order.id, 'paid', paidAt, reference);
        console.log(`[PAYSTACK WEBHOOK] Order ${order.id} marked as PAID. Reference: ${reference}`);
      } else {
        console.warn(`[PAYSTACK WEBHOOK] charge.success received but matching order not found for ref ${reference}`);
      }
    } else if (event === 'refund.processed') {
      const transactionRef = data.transaction_reference;
      const refundId = String(data.id || data.refund_id);
      if (transactionRef) {
        const order = await getOrderByReference(transactionRef);
        if (order && order.refunds) {
          const refundItem = order.refunds.find(
            (r) => r.paystack_refund_id === refundId || r.paystack_reference === transactionRef
          );
          if (refundItem) {
            refundItem.paystack_status = 'processed';
            refundItem.processed_at = new Date().toISOString();
            console.log(`[PAYSTACK WEBHOOK] Refund ${refundId} for order ${order.id} marked as PROCESSED.`);
          }
        }
      }
    } else if (event === 'refund.failed') {
      const transactionRef = data.transaction_reference;
      const refundId = String(data.id || data.refund_id);
      if (transactionRef) {
        const order = await getOrderByReference(transactionRef);
        if (order && order.refunds) {
          const refundItem = order.refunds.find(
            (r) => r.paystack_refund_id === refundId || r.paystack_reference === transactionRef
          );
          if (refundItem) {
            refundItem.paystack_status = 'failed';
            console.warn(`[PAYSTACK WEBHOOK] Refund ${refundId} for order ${order.id} marked as FAILED.`);
          }
        }
      }
    }

    // Acknowledge receipt to Paystack immediately with HTTP 200
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error('[PAYSTACK WEBHOOK ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Webhook processing failure.' },
      { status: 500 }
    );
  }
}
