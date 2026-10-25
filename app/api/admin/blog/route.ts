import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/insforge/queries';

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category,
      status,
      seo_title,
      seo_description,
    } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const cleanSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newPost = await createBlogPost({
      title,
      slug: cleanSlug,
      excerpt: excerpt || '',
      content,
      featured_image: featured_image || '/images/blog-papaya.jpg',
      category: category || 'Ingredients',
      status: status || 'draft',
      seo_title: seo_title || title,
      seo_description: seo_description || excerpt || '',
    });

    revalidatePath('/blog');

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const updated = await updateBlogPost(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    revalidatePath('/blog');
    revalidatePath(`/blog/${updated.slug}`);

    return NextResponse.json({ success: true, post: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
  }

  const deleted = await deleteBlogPost(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  revalidatePath('/blog');

  return NextResponse.json({ success: true, message: 'Article deleted successfully' });
}
