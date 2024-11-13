import { notFound } from 'next/navigation';
import Image from 'next/image';
import { JobCard } from '@/components/ui/job-card';
import { Job } from '@/app/types/job';
// import { Suspense } from 'react';
// import JobList from '@/components/job-list';

async function getCompany(companyId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}`, {
      cache: 'no-cache',
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

export default async function CompanyPage({ params }: { params: { companyId: string } }) {
  const company = await getCompany(params.companyId);

  if (!company) {
    notFound();
  }

  return (
    <div className="">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="relative h-32 w-32 rounded-lg border border-gray-200 bg-white overflow-hidden">
              {company.logo ? (
                <Image
                  src={company.logo.url}
                  alt={`${company.name} logo`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-primary/5" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <p className="mt-2 text-lg text-gray-600">{company.location}</p>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-primary hover:text-primary/90"
                >
                  Visit website
                </a>
              )}
            </div>
          </div>

          {company.description && (
            <div className="mt-8 prose max-w-none text-gray-600">{company.description}</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Open Positions</h2>

          <div className="space-y-4">
            {company?.jobs?.map((job: Job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
