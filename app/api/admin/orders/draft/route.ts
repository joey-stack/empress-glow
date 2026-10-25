import { NextRequest, NextResponse } from 'next/server';
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  Order,
  CartItem,
} from '@/lib/insforge/queries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.customer || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please specify customer details and at least one formulation item.' },
        { status: 400 }
      );
    }

    const { customer, items, shipping_fee = 2500, discount = 0, notes = '' } = body;

    if (!customer.name || !customer.email || !customer.phone) {
      return NextResponse.json(
        { success: false, error: 'Customer Name, Email, and WhatsApp Phone are required.' },
        { status: 400 }
      );
    }

    // Server-side compute subtotal
    let subtotal = 0;
    const validatedItems: CartItem[] = items.map((item: any) => {
      const price = Number(item.price) || 3000;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      subtotal += price * quantity;
      return {
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        variantName: item.variantName || 'Standard',
        price,
        quantity,
      };
    });

    const parsedShippingFee = Math.max(0, Number(shipping_fee) || 0);
    const parsedDiscount = Math.max(0, Number(discount) || 0);
    const total = Math.max(0, subtotal + parsedShippingFee - parsedDiscount);

    // Create Order with is_draft: true
    const order = await createOrder({
      customer_name: customer.name.trim(),
      customer_email: customer.email.trim().toLowerCase(),
      customer_phone: customer.phone.trim(),
      shipping_address: (customer.address || 'Abuja Delivery').trim(),
      city: (customer.city || 'Abuja').trim(),
      state: customer.state || 'Abuja FCT',
      items: validatedItems,
      subtotal,
      shipping_fee: parsedShippingFee,
      total,
      currency: 'NGN',
    });

    // Mark as draft with notes and discount
    order.is_draft = true;
    order.notes = notes.trim();
    order.discount = parsedDiscount;

    // Initialize Paystack payment link
    const origin = req.nextUrl.origin || 'http://localhost:3000';
    const callbackUrl = `${origin}/order/${order.id}`;
    const amountInKobo = Math.round(total * 100);
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isMock = !paystackSecret || paystackSecret.includes('placeholder') || paystackSecret.startsWith('sk_test_placeholder');

    if (isMock) {
      const mockRef = `draft_ref_${order.id}`;
      const mockLink = `${origin}/order/${order.id}?reference=${mockRef}&mock=true`;
      order.paystack_reference = mockRef;
      order.payment_link_url = mockLink;

      return NextResponse.json({
        success: true,
        order,
        paymentLinkUrl: mockLink,
      });
    }

    // Call live Paystack transaction initialize
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customer.email.trim().toLowerCase(),
        amount: amountInKobo,
        reference: `draft_${order.id}`,
        callback_url: callbackUrl,
        metadata: {
          orderId: order.id,
          isDraft: true,
          customerName: customer.name,
          phone: customer.phone,
          notes: order.notes,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      // Fallback to internal payment link if Paystack API fails
      const fallbackLink = `${origin}/order/${order.id}?pay=pending`;
      order.payment_link_url = fallbackLink;
      return NextResponse.json({
        success: true,
        order,
        paymentLinkUrl: fallbackLink,
        warning: paystackData.message || 'Paystack initialize note: using direct link',
      });
    }

    order.paystack_reference = paystackData.data.reference;
    order.payment_link_url = paystackData.data.authorization_url;

    return NextResponse.json({
      success: true,
      order,
      paymentLinkUrl: paystackData.data.authorization_url,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create draft order' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await getOrderById(body.id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (body.action === 'mark_paid') {
      await updateOrderStatus(order.id, 'paid', new Date().toISOString(), body.reference || `manual_${Date.now()}`);
      order.tracking_notes = body.notes || 'Manually reconciled via WhatsApp offline bank transfer';
      return NextResponse.json({ success: true, order });
    }

    if (body.action === 'cancel') {
      await updateOrderStatus(order.id, 'cancelled');
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update draft order' },
      { status: 500 }
    );
  }
}
