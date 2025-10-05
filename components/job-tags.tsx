import * as React from 'react';
import { Suspense } from 'react';
import { JobTagsClient } from './job-tags-client';

type Category = {
  name: string;
  image: string;
  active: boolean;
  featured: boolean;
};

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}

export async function JobTags() {
  const categories = await getCategories().catch(() => []);

  return (
    <Suspense fallback={<div className="w-full h-32 animate-pulse bg-muted rounded-lg" />}>
      <JobTagsClient categories={categories} />
    </Suspense>
  );
}
