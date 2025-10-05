import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '@/app/types/job';
import ReactMarkdown from 'react-markdown';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/jobs`);
    const jobs = await response.json();

    return jobs.map((job: Job) => ({
      companyId: job.companySlug,
      slug: job.slug,
    }));
  } catch {
    // Error handled by returning empty array
    return [];
  }
}

async function getJobBySlug(companyId: string, slug: string): Promise<Job | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/jobs/${slug}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) return null;

    const job = await response.json();

    if (!job) return null;

    return job;
  } catch {
    // Error handled by returning null
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
    return <div>Job not found</div>;
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-start gap-6">
          {job.companyLogoUrl ? (
            <Image
              alt={`${job.company} logo`}
              className="h-16 w-16 rounded-full object-cover"
              src={job.companyLogoUrl}
              width={64}
              height={64}
              unoptimized
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200" />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-gray-500">
              {job.company && (
                <div className="bg-primary/5 px-3 py-1 rounded-full flex items-center gap-2">
                  {job.company}
                </div>
              )}
              {job.location && (
                <div className="bg-primary/5 px-3 py-1 rounded-full flex items-center gap-2">
                  {job.location}
                </div>
              )}
              {job.jobsUpdated && (
                <div className="bg-primary/5 px-3 py-1 rounded-full flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Posted{' '}
                  {job.jobsUpdated
                    ? formatDistanceToNow(new Date(job.jobsUpdated), { addSuffix: true })
                    : 'recently'}
                </div>
              )}
            </div>
            {job.tags && job.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <Link href={`/jobs?category=${encodeURIComponent(tag)}`} key={tag}>
                    <Button className="rounded-full" variant="outline" size="sm">
                      {tag}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {job.description && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="prose prose-github max-w-none text-gray-600 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="pb-2 border-b border-gray-200 text-2xl font-semibold mt-8 mb-4">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="pb-2 border-b border-gray-200 text-xl font-semibold mt-8 mb-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold mt-6 mb-4">{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-base font-semibold mt-6 mb-4">{children}</h4>
                    ),
                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    code: ({ children }) => (
                      <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-200">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-200 px-4 py-2 bg-gray-50 font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-200 px-4 py-2">{children}</td>
                    ),
                  }}
                >
                  {job.description}
                </ReactMarkdown>
              </div>
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
