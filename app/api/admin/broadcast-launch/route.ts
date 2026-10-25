import { NextResponse } from 'next/server';
import { getSubscribers } from '@/lib/insforge/queries';
import { sendLaunchAnnouncement } from '@/lib/email/service';

export async function GET() {
  try {
    const subscribers = await getSubscribers();
    return NextResponse.json({
      success: true,
      total_subscribers: subscribers.length,
      sample_recipients: subscribers.slice(0, 3).map((s) => ({ email: s.email, name: s.name })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to inspect broadcast readiness' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Check if test recipient is specified or full broadcast
    let targetEmail: string | undefined;
    try {
      const body = await req.json();
      targetEmail = body.targetEmail;
    } catch {
      // Body is optional
    }

    const subscribers = await getSubscribers();

    if (subscribers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No subscribers found on waitlist' },
        { status: 400 }
      );
    }

    const recipients = targetEmail
      ? subscribers.filter((s) => s.email.toLowerCase() === targetEmail.toLowerCase())
      : subscribers;

    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: `Recipient ${targetEmail} not found in subscribers` },
        { status: 404 }
      );
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const sub of recipients) {
      try {
        const res = await sendLaunchAnnouncement({
          email: sub.email,
          name: sub.name,
        });
        if (res.success) {
          sentCount++;
        } else {
          errors.push(`Failed for ${sub.email}: ${res.error}`);
        }
      } catch (e: any) {
        errors.push(`Exception for ${sub.email}: ${e.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      sent_count: sentCount,
      total_targets: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Launch announcement successfully dispatched to ${sentCount} subscriber(s).`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Broadcast execution failed' },
      { status: 500 }
    );
  }
}
