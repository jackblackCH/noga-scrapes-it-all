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
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{job.title}</h1>
        <div className="flex flex-wrap gap-4 text-gray-500">
          {job.company && <div className="bg-primary/5 px-3 py-1 rounded-full">{job.company}</div>}
          {job.location && (
            <div className="bg-primary/5 px-3 py-1 rounded-full">{job.location}</div>
          )}
          {job.dateUpdated && (
            <div className="bg-primary/5 px-3 py-1 rounded-full">
              Posted {formatDistanceToNow(new Date(job.dateUpdated), { addSuffix: true })}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {job.description && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Description</h2>
              <div className="prose max-w-none text-gray-600">{job.description}</div>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Required Skills</h2>
              <ul className="grid gap-2">
                {job.skills.map((skill, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary/20 mr-3" />
                    <span className="text-gray-600">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <dt className="font-medium text-gray-900">Job Type</dt>
                <dd className="text-gray-600 mt-1">{job.type || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Salary</dt>
                <dd className="text-gray-600 mt-1">{job.salary || 'N/A'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Experience</dt>
                <dd className="text-gray-600 mt-1">{job.experience || 'N/A'}</dd>
              </div>
            </div>
          </div>

          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-primary text-white text-center py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors shadow-sm font-medium"
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
