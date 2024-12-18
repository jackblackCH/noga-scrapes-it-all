import { TransformedCompany } from '@/app/api/companies/route';
import CrawlList from '@/components/ui/crawl-list';
import { notFound } from 'next/navigation';
import ExistingJobsTable from './ExistingJobsTable';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function getCompanyDetails(companyId: string): Promise<TransformedCompany | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`); // if page chang is slow on click. Add no cache here.
    if (!response.ok) return null;

    const companies = (await response.json()) as TransformedCompany[];
    if (!companies) return null;

    const company = companies.find((c: TransformedCompany) => c.slug === companyId);
    if (!company) return null;

    return {
      name: company.name,
      logo: company.logo,
      priority: company.priority,
      slug: company.slug,
      employer: company.employer,
      jboard: company.jboard,
      jobListing1: company.jobListing1,
      jobListing2: company.jobListing2,
      jobListingLinkedIn: company.jobListingLinkedIn,
      status: company.status,
      issue: company.issue,
      notes: company.notes,
      url: company.url,
      jobsFound: company.jobsFound,
      jobsUpdated: company.jobsUpdated,
      jobsCount: company.jobsCount,
    };
  } catch (error) {
    console.error('Error loading company details:', error);
    return null;
  }
}

export default async function CompanyPage({ params }: { params: { companyId: string } }) {
  const company = await getCompanyDetails(params.companyId);

  if (!company) {
    notFound();
  }

  return (
    <main className="p-4">
      <header className="mb-4">
        <div className="flex items-center gap-4">
          {company.logo ? (
            <div className="relative h-12 w-12 rounded-full border border-gray-200 bg-white overflow-hidden">
              <Image
                src={company.logo.url}
                alt={`${company.name} logo`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary/5" />
          )}
          <h1 className="text-3xl font-bold">{company.name}</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Status Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Status Overview</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600 text-sm">Last checked</dt>
              <dd>
                {company.jobsUpdated ? new Date(company.jobsUpdated).toLocaleDateString() : 'Never'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600 text-sm">Priority</dt>
              <dd>{company.priority || 'Not set'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600 text-sm">Status</dt>
              <dd>{company.status || 'Not set'}</dd>
            </div>
          </dl>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600 text-sm">Employer</dt>
              <dd>{company.employer || 'Not set'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-600 text-sm">JBoard</dt>
              <dd>
                {company.jboard ? (
                  <a
                    href={company.jboard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 hover:underline"
                  >
                    {new URL(company.jboard).hostname}
                  </a>
                ) : (
                  'Not set'
                )}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="font-medium text-gray-600 text-sm">URL</dt>
              <dd>
                {company.url ? (
                  <a
                    href={company.url}
                    title={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary truncate hover:text-primary/80 hover:underline"
                  >
                    {company.url.length > 33 ? company.url.slice(0, 33) + '...' : company.url}
                  </a>
                ) : (
                  'Not set'
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Issues and Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          {company.issue && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Issues</h2>
              <p className="text-gray-600 text-sm">{company.issue}</p>
            </div>
          )}
          {company.notes && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Notes</h2>
              <p className="text-gray-600 text-sm">{company.notes}</p>
            </div>
          )}
          {!company.issue && !company.notes && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Issues & Notes</h2>
              <p className="text-gray-600 text-sm">No issues or notes</p>
            </div>
          )}
        </div>
      </div>

      {/* Existing Jobs */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Jobs</h2>
        <ExistingJobsTable jobs={company.jobsFound} />
      </section>

      {/* Crawl List */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Job Importer</h2>

        <CrawlList
          jobListings={[
            company.jobListing1,
            company.jobListing2,
            company.jobListingLinkedIn,
          ].filter(Boolean)}
          company={company.name}
          companySlug={params.companyId}
        />
      </section>
    </main>
  );
}
