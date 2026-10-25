import { NextResponse } from 'next/server';
import { getApprovedReviewsByProductSlug, createReview } from '@/lib/insforge/queries';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Product slug is required' }, { status: 400 });
  }

  const reviews = await getApprovedReviewsByProductSlug(slug);

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 5.0;

  const distribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return NextResponse.json({
    reviews,
    summary: {
      total: totalReviews,
      average: avgRating,
      distribution,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, product_slug, user_name, user_email, rating, title, comment } = body;

    if (!product_id || !product_slug) {
      return NextResponse.json({ error: 'Product identification required.' }, { status: 400 });
    }

    if (!user_name || user_name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }

    if (!user_email || !user_email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5 stars.' }, { status: 400 });
    }

    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: 'Please enter a brief headline title for your review.' }, { status: 400 });
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json({ error: 'Please write at least 10 characters describing your experience.' }, { status: 400 });
    }

    const newReview = await createReview({
      product_id,
      product_slug,
      user_name: user_name.trim(),
      user_email: user_email.toLowerCase().trim(),
      rating: numRating,
      title: title.trim(),
      comment: comment.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your verified review has been submitted to Empress Glow moderators for review.',
        reviewId: newReview.id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Review submission failed' }, { status: 500 });
  }
}
