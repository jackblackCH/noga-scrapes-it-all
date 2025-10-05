'use server';

import { Job } from '@/app/types/job';

export async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/jobs`, {
      cache: 'no-store', // Let the API route handle caching
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function getJobBySlug(companyId: string, slug: string): Promise<Job | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/jobs/${slug}`,
      {
        cache: 'no-store', // Always fetch fresh data for individual jobs
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}
