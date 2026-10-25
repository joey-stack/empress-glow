import { getAllReviews } from '@/lib/insforge/queries';
import { AdminReviewsModerator } from '@/components/admin/admin-reviews-moderator';

export const instant = false;

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div className="space-y-6">
      <AdminReviewsModerator initialReviews={reviews} />
    </div>
  );
}
