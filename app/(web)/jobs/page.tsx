import { getJobs } from '@/app/actions/jobs';
import { getCategories } from '@/app/actions/categories';
import JobsWithFilter from './JobsWithFilter';
import { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
export const dynamic = 'force-dynamic'; // TODO: Check how not to do this.

export default async function Jobs() {
  const [jobs, categories] = await Promise.all([getJobs(), getCategories()]);

  return (
    <>
      <NuqsAdapter>
        <Suspense>
          <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
          <JobsWithFilter initialJobs={jobs} categories={categories} />
        </Suspense>
      </NuqsAdapter>
    </>
  );
}
