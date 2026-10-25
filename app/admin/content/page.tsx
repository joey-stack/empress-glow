import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllContent } from '@/lib/insforge/queries';
import { ContentEditor } from '@/components/admin/content-editor';

export const metadata: Metadata = {
  title: 'Content CMS | Empress Glow Admin',
  description: 'Manage storefront copy, founder story, contact details, and policy notices with placeholder warnings.',
};

export default async function AdminContentPage() {
  const content = await getAllContent();

  return <ContentEditor initialContent={content} />;
}
