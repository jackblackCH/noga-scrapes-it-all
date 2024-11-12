import * as React from 'react';
import { JobTagsClient } from './job-tags-client';

type Category = {
  name: string;
  image: string;
  active: boolean;
  featured: boolean;
};

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}

export async function JobTags() {
  const categories = await getCategories();
  
  return <JobTagsClient categories={categories} />;
}
