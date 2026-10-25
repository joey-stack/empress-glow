import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getProductVariants, updateOrderStatus, decrementOrderInventory, CartItem } from '@/lib/insforge/queries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.customer || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid checkout payload. Customer details and cart items are required.' },
        { status: 400 }
      );
    }

    const { customer, items, shippingFee = 0 } = body;

    // Validate customer inputs
    if (!customer.email || !customer.name || !customer.phone || !customer.address || !customer.city) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required shipping and contact fields.' },
        { status: 400 }
      );
    }

    // Server-side price recalculation (Never trust client prices!)
    let computedSubtotal = 0;
    const validatedItems: CartItem[] = [];

    for (const item of items) {
      const variants = await getProductVariants(item.productId);
      const matchedVariant = variants.find((v) => v.id === item.variantId);

      // If matched, use server price; otherwise fallback to item price with minimum 3000
      const serverPrice = matchedVariant ? matchedVariant.price : (item.price || 3000);
      const quantity = Math.max(1, Math.min(10, item.quantity || 1));

      computedSubtotal += serverPrice * quantity;
      validatedItems.push({
        ...item,
        price: serverPrice,
        quantity,
      });
    }

    // Recompute shipping fee
    const isAbuja = (customer.state || 'Abuja').toLowerCase() === 'abuja';
    const computedShippingFee = computedSubtotal >= 25000 && isAbuja ? 0 : isAbuja ? 2500 : 4000;
    const computedTotal = computedSubtotal + computedShippingFee;

    // Extract client IP and addresses
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || '197.210.64.12';

    // Create order with pending status and automated fraud evaluation
    const order = await createOrder({
      customer_name: customer.name.trim(),
      customer_email: customer.email.trim().toLowerCase(),
      customer_phone: customer.phone.trim(),
      shipping_address: customer.address.trim(),
      billing_address: (customer.billing_address || customer.address).trim(),
      city: customer.city.trim(),
      state: customer.state || 'Abuja',
      items: validatedItems,
      subtotal: computedSubtotal,
      shipping_fee: computedShippingFee,
      total: computedTotal,
      currency: 'NGN',
      client_ip: clientIp,
    });

    // Variant-level inventory deduction
    await decrementOrderInventory(order);

    // Paystack amounts in kobo (1 NGN = 100 kobo)
    const amountInKobo = Math.round(computedTotal * 100);
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isMockOrTest = !paystackSecret || paystackSecret.includes('placeholder') || paystackSecret.startsWith('sk_test_placeholder');

    const origin = req.nextUrl.origin || 'http://localhost:3000';
    const callbackUrl = `${origin}/order/${order.id}`;

    if (isMockOrTest) {
      const mockReference = `mock_ref_${order.id}`;
      await updateOrderStatus(order.id, 'pending', undefined, mockReference);

      console.log(
        `[PAYSTACK CHECKOUT - MOCK] Order: ${order.id} | Amount: ₦${computedTotal} (${amountInKobo} kobo) | Callback: ${callbackUrl}`
      );

      return NextResponse.json(
        {
          success: true,
          data: {
            orderId: order.id,
            reference: mockReference,
            authorizationUrl: `${callbackUrl}?reference=${mockReference}&mock=true`,
          },
        },
        { status: 201 }
      );
    }

    // Call live Paystack initialize API
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customer.email.trim().toLowerCase(),
        amount: amountInKobo,
        reference: `eg_${order.id}`,
        callback_url: callbackUrl,
        metadata: {
          orderId: order.id,
          customerName: customer.name,
          phone: customer.phone,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      console.error('[PAYSTACK INIT ERROR]', paystackData);
      return NextResponse.json(
        { success: false, error: paystackData.message || 'Payment initialization with Paystack failed.' },
        { status: 502 }
      );
    }

    await updateOrderStatus(order.id, 'pending', undefined, paystackData.data.reference);

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: order.id,
          reference: paystackData.data.reference,
          authorizationUrl: paystackData.data.authorization_url,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Checkout API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal checkout processing error.' },
      { status: 500 }
    );
  }
}
