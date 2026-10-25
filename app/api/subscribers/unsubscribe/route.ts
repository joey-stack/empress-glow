import { NextRequest, NextResponse } from 'next/server';
import { removeSubscriber } from '@/lib/insforge/queries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.email || typeof body.email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email address is required to opt out.' },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    const removed = await removeSubscriber(email);

    console.log(`[SUBSCRIBER OPT-OUT] email=${email} removed=${removed}`);

    return NextResponse.json({
      success: true,
      message: 'You have been successfully removed from Empress Glow notification lists.',
      email,
    });
  } catch (error: any) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
