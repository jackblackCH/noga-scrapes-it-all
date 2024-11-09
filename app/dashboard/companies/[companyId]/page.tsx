import { TransformedCompany } from '@/app/api/companies/route';
import CrawlList from '@/components/ui/crawl-list';
import { notFound } from 'next/navigation';
import { use } from 'react';

export const revalidate = 10;

async function getCompanyDetails(companyId: string): Promise<TransformedCompany | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`, {
      next: { tags: ['companies'] },
      cache: 'no-store',
    });
    if (!response.ok) return null;

    const companies = (await response.json()) as TransformedCompany[];
    if (!companies) return null;

    const company = companies.find((c: TransformedCompany) => c.slug === companyId);
    if (!company) return null;

    return {
      name: company.name,
      priority: company.priority,
      slug: company.slug,
      employer: company.employer,
      jboard: company.jboard,
      jobListing1: company.jobListing1,
      jobListing2: company.jobListing2,
      status: company.status,
      issue: company.issue,
      notes: company.notes,
      url: company.url,
      jobsFound: company.jobsFound,
      jobsUpdated: company.jobsUpdated,
    };
  } catch (error) {
    console.error('Error loading company details:', error);
    return null;
  }
}

export default function CompanyPage({ params }: { params: { companyId: string } }) {
  const company = use(getCompanyDetails(params.companyId));

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{company.name}</h1>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Details</h2>
          <dl className="grid gap-2 text-sm">
            <div className="grid grid-cols-[100px_1fr] items-center">
              <dt className="font-medium text-muted-foreground">Last checked:</dt>
              <dd>
                {company.jobsUpdated ? new Date(company.jobsUpdated).toLocaleDateString() : 'Never'}
              </dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center">
              <dt className="font-medium text-muted-foreground">Priority:</dt>
              <dd>{company.priority || 'Not set'}</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center">
              <dt className="font-medium text-muted-foreground">Status:</dt>
              <dd>{company.status || 'Not set'}</dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Company Information</h2>
          <dl className="grid gap-2 text-sm">
            <div className="grid grid-cols-[100px_1fr] items-center">
              <dt className="font-medium text-muted-foreground">Employer:</dt>
              <dd>{company.employer || 'Not set'}</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center">
              <dt className="font-medium text-muted-foreground">Job Board:</dt>
              <dd>{company.jboard || 'Not set'}</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center">
              <dt className="font-medium text-muted-foreground">URL:</dt>
              <dd>
                {company.url ? (
                  <a
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {company.url}
                  </a>
                ) : (
                  'Not set'
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Job Listings</h2>
          <dl className="grid gap-2 text-sm">
            <div className="grid grid-cols-[100px_1fr] items-center break-words">
              <dt className="font-medium text-muted-foreground">Listing 1:</dt>
              <dd>
                {company.jobListing1 ? (
                  <a
                    href={company.jobListing1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline truncate"
                  >
                    Link
                  </a>
                ) : (
                  'Not set'
                )}
              </dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center">
              <dt className="font-medium text-muted-foreground">Listing 2:</dt>
              <dd>
                {company.jobListing2 ? (
                  <a
                    href={company.jobListing2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {company.jobListing2.length > 50
                      ? `${company.jobListing2.slice(0, 50)}...`
                      : company.jobListing2}
                  </a>
                ) : (
                  'Not set'
                )}
              </dd>
            </div>
          </dl>
        </div>

        {company.issue && (
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Issues</h2>
            <p className="text-sm text-muted-foreground">{company.issue}</p>
          </div>
        )}

        {company.notes && (
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Notes</h2>
            <p className="text-sm text-muted-foreground">{company.notes}</p>
          </div>
        )}

        <div className="mt-8">
          <CrawlList
            jobListings={[company.jobListing1, company.jobListing2].filter(Boolean)}
            company={company.name}
            companySlug={params.companyId}
            jobsFound={company.jobsFound}
          />
        </div>
      </div>
    </div>
  );
}
