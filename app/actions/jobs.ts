'use server';

import { Job } from '@/app/types/job';

export async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/jobs`, {
      next: {
        revalidate: 60,
      },
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
