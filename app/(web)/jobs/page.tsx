import { getJobs } from '@/app/actions/jobs';
import JobsWithFilter from './JobsWithFilter';

export const dynamic = 'force-dynamic'; // TODO:  Check how not to do this.

export default async function Jobs() {
  const jobs = await getJobs();

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
      <JobsWithFilter initialJobs={jobs} />
    </>
  );
}
