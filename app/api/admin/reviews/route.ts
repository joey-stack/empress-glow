import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllReviews, updateReviewStatus, deleteReview } from '@/lib/insforge/queries';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null;

  const reviews = await getAllReviews(statusParam || undefined);
  return NextResponse.json({ reviews });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Review ID and status are required' }, { status: 400 });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid review status' }, { status: 400 });
    }

    const updated = await updateReviewStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Cache Invalidation Rule: Admin approves review -> revalidatePath('/product/[slug]')
    if (status === 'approved') {
      revalidatePath(`/product/${updated.product_slug}`);
      revalidatePath('/shop');
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Review update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
  }

  const deleted = await deleteReview(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Review deleted successfully' });
}
