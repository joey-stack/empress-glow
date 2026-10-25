import { getBlogPosts } from '@/lib/insforge/queries';
import { AdminBlogManager } from '@/components/admin/admin-blog-manager';

export const instant = false;

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      <AdminBlogManager initialPosts={posts} />
    </div>
  );
}
