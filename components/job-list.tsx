import { getJobs as getAllJobs } from '@/app/actions/jobs';
import { JobCard } from '@/components/ui/job-card';

export default async function JobList() {
  const jobs = await getAllJobs();

  return (
    <div className="space-y-4 pb-8">
      {jobs.map((job, index) => (
        <JobCard key={job.title + '-' + index} job={job} />
      ))}
    </div>
  );
}
