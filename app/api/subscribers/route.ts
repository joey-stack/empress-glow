import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/insforge/queries';
import { sendNotifyMeConfirmation } from '@/lib/email/service';

// In-memory rate limiting map: ip -> timestamps
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour

    // Check rate limit: 5 per IP per hour
    const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
    if (timestamps.length >= 5) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a while before subscribing again.' },
        { status: 429 }
      );
    }
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    const body = await req.json().catch(() => null);
    if (!body || !body.email || typeof body.email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    // Strict email validation preventing script tags / dangerous characters
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.includes('<') || email.includes('>')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email format.' },
        { status: 400 }
      );
    }

    const name = body.name ? String(body.name).replace(/[<>]/g, '').trim() : null;
    const productSlug = body.product_slug ? String(body.product_slug).replace(/[<>]/g, '').trim() : 'general';

    // Persist to waitlist subscribers store
    const subscriber = await addSubscriber(email, name, productSlug);

    // Dispatch automated confirmation email
    const emailResult = await sendNotifyMeConfirmation({
      email,
      name,
      productSlug,
    });

    // Log the subscriber capture & email status
    console.log(
      `[SUBSCRIBER CAPTURE] email=${email} name=${name || 'anonymous'} product=${productSlug} emailSent=${emailResult.success}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "You're on the list. We'll email you the moment it's available.",
        data: {
          id: subscriber.id,
          email,
          productSlug,
          emailSent: emailResult.success,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Subscriber error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
