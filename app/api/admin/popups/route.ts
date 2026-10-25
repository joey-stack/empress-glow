import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getMarketingPopups,
  createMarketingPopup,
  updateMarketingPopup,
  deleteMarketingPopup,
} from '@/lib/insforge/queries';

export async function GET() {
  const popups = await getMarketingPopups();
  return NextResponse.json({ popups });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      headline,
      body: popupBody,
      image_url,
      cta_text,
      cta_link,
      trigger_type,
      trigger_value,
      is_active,
    } = body;

    if (!name || !headline || !cta_text || !cta_link) {
      return NextResponse.json(
        { error: 'Name, headline, CTA text, and CTA link are required' },
        { status: 400 }
      );
    }

    const newPopup = await createMarketingPopup({
      name,
      headline,
      body: popupBody || '',
      image_url,
      cta_text,
      cta_link,
      trigger_type: trigger_type || 'time_delay',
      trigger_value: Number(trigger_value) || 5,
      is_active: Boolean(is_active),
    });

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, popup: newPopup }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create popup' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Popup ID required' }, { status: 400 });
    }

    const updated = await updateMarketingPopup(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Popup not found' }, { status: 404 });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, popup: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update popup' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Popup ID required' }, { status: 400 });
  }

  const deleted = await deleteMarketingPopup(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Popup not found' }, { status: 404 });
  }

  revalidatePath('/', 'layout');

  return NextResponse.json({ success: true, message: 'Popup removed successfully' });
}
