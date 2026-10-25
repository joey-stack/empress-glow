import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting map: ip -> timestamps
const contactRateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour

    // Check rate limit: 3 per IP per hour
    const timestamps = (contactRateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
    if (timestamps.length >= 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many contact inquiries from this IP. Please wait a while before sending another message or chat with Mary directly on WhatsApp.',
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Request body is required.' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = body;

    // Validate Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    // Validate Email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.includes('<') || trimmedEmail.includes('>')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email format.' },
        { status: 400 }
      );
    }

    // Validate Message
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please write a message with at least 10 characters.' },
        { status: 400 }
      );
    }

    // Sanitize
    const sanitizedName = name.replace(/[<>]/g, '').trim();
    const sanitizedSubject = subject ? String(subject).replace(/[<>]/g, '').trim() : 'General Inquiry';
    const sanitizedMessage = message.replace(/[<>]/g, '').trim();

    // Increment rate limit timestamp after successful validation
    timestamps.push(now);
    contactRateLimitMap.set(ip, timestamps);

    console.log(
      `[CONTACT INQUIRY] ip=${ip} from="${sanitizedName}" <${trimmedEmail}> subject="${sanitizedSubject}" message="${sanitizedMessage.slice(0, 50)}..."`
    );

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Mary and the Empress Glow team will respond to your message shortly.',
      data: {
        name: sanitizedName,
        email: trimmedEmail,
        subject: sanitizedSubject,
      },
    });
  } catch (error: any) {
    console.error('Contact endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please reach out via WhatsApp for immediate support.' },
      { status: 500 }
    );
  }
}
