import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '@/app/types/job';

export const dynamic = 'force-dynamic';

async function getJobBySlug(companyId: string, slug: string): Promise<Job | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/jobs/${slug}`
    );

    if (!response.ok) return null;

    const job = await response.json();

    if (!job) return null;

    return job;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export default async function CompanyJobPage({
  params,
}: {
  params: { companyId: string; slug: string };
}) {
  const job = await getJobBySlug(params.companyId, params.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {job.company && <div>{job.company}</div>}
          {job.location && <div>{job.location}</div>}
          {job.dateUpdated && (
            <div>Posted {formatDistanceToNow(new Date(job.dateUpdated), { addSuffix: true })}</div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {job.description && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <div className="prose max-w-none">{job.description}</div>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
              <ul className="list-disc pl-5">
                {job.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            {job.type && (
              <div>
                <dt className="font-medium">Job Type</dt>
                <dd className="text-gray-600">{job.type}</dd>
              </div>
            )}
            {job.salary && (
              <div>
                <dt className="font-medium">Salary</dt>
                <dd className="text-gray-600">{job.salary}</dd>
              </div>
            )}
            {job.experience && (
              <div>
                <dt className="font-medium">Experience</dt>
                <dd className="text-gray-600">{job.experience}</dd>
              </div>
            )}
          </div>

          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-primary text-white text-center py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors"
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
