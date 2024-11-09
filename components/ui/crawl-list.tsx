'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './button';
import { Job } from '@/app/types/job';
import { parseJobsFromUrlWithMistral } from '@/components/test-runner';
import { useToast } from '@/hooks/use-toast';

import { create } from '@/app/actions';
interface CrawlState {
  isLoading: boolean;
  error?: string;
  jobs?: Job[];
}

export default function CrawlList({
  jobListings,
  company,
  companySlug,
  jobsFound = [],
}: {
  jobListings: string[];
  company: string;
  companySlug: string;
  jobsFound?: string | Job[];
}) {
  const [crawlStates, setCrawlStates] = useState<Record<string, CrawlState>>({});
  const { toast } = useToast();

  const updateCrawlState = (url: string, state: Partial<CrawlState>) => {
    setCrawlStates((prev) => ({
      ...prev,
      [url]: { ...prev[url], ...state },
    }));
  };

  const getSourceCodeFromJinaApi = async (url: string): Promise<string> => {
    const response = await fetch(`/api/scrape/scrape-jina?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Scraping failed');
    }

    const { sourceCode } = await response.json();
    return sourceCode;
  };

  const getSourceCodeFromScraperApi = async (url: string): Promise<string> => {
    const { data } = await fetch(
      `/api/scrape/scraperapi?url=${encodeURIComponent(url)}&render=true`
    ).then((res) => res.json());

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const careersWrapper = doc.querySelectorAll('.toc-section'); // TODO: make this customizable

    if (!careersWrapper) {
      throw new Error('Could not find careers page content');
    }

    return Array.from(careersWrapper)
      .map((el) => el.innerHTML)
      .join('\n');
  };

  const getSourceCode = async (url: string): Promise<string> => {
    try {
      return await getSourceCodeFromJinaApi(url);
    } catch (error) {
      console.error('Error in getSourceCodeFromJinaApi:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch source code';

      if (errorMessage.includes('Cloudflare')) {
        console.error('Cloudflare error, trying ScraperAPI');
        return await getSourceCodeFromScraperApi(url);
      }
      throw error;
    }
  };

  const extractJobs = async (url: string, sourceCode: string, company: string): Promise<Job[]> => {
    const jobs = await parseJobsFromUrlWithMistral(url, sourceCode, company);

    return jobs.map((job) => ({
      ...job,
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: job.salary || '',
      type: job.type || '',
      url: job.url || '',
      description: job.description || '',
      experience: job.experience || '',
      jobsUpdated: job.jobsUpdated || '',
      dateUpdated: job.dateUpdated || '',
      tags: job.tags || [],
    }));
  };

  const handleCrawl = async (url: string, company: string) => {
    updateCrawlState(url, {
      isLoading: true,
      error: undefined,
      jobs: undefined,
    });

    try {
      const sourceCode = await getSourceCode(url);

      if (!sourceCode) {
        console.error('Failed to get source code from any source');
        throw new Error('Failed to get source code from any source');
      }

      const jobs = await extractJobs(url, sourceCode, company.trim());

      updateCrawlState(url, { isLoading: false, jobs });
      // Reset the cache for the companies API endpoint
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
    } catch (error) {
      updateCrawlState(url, {
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const handleAddJob = async (job: Job) => {
    try {
      const response = await fetch('/api/companies/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: companySlug,
          job,
          dateUpdated: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add job');
      }

      const result = await response.json();

      create();

      toast({
        title: result.jobAdded ? 'Success' : 'Note',
        description: result.jobAdded
          ? 'Job added successfully'
          : 'Job already exists in the database',
        variant: result.jobAdded ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error adding job:', error);
      toast({
        title: 'Error',
        description: 'Failed to add job',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="imported">
        <h3 className="text-lg font-semibold mb-3">Database</h3>
        <div className="space-y-3 text-sm">
          {jobsFound &&
            Array.isArray(jobsFound) &&
            jobsFound.map((job, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{job.title}</h3>
                </div>
                <div className="text-muted-foreground">
                  {job.company && <div>Company: {job.company}</div>}
                  {job.url && (
                    <div>
                      Job detail url:{' '}
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {job.url.length > 50 ? `${job.url.slice(0, 50)}...` : job.url}
                      </a>
                    </div>
                  )}
                  {job.location && <div>Location: {job.location}</div>}
                  {job.salary && <div>Salary: {job.salary}</div>}
                  {job.type && <div>Type: {job.type}</div>}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="crawler">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold">Job Crawler</h2>
          {Object.values(crawlStates).some((state) => state.jobs) && (
            <span className="text-sm text-muted-foreground">
              (
              {(() => {
                const jobCount = Object.values(crawlStates).reduce(
                  (total, state) => total + (state.jobs?.length || 0),
                  0
                );
                return `${jobCount} ${jobCount === 1 ? 'Job' : 'Jobs'} found`;
              })()}
              )
            </span>
          )}
        </div>
        <ul className="grid gap-4">
          {jobListings.filter(Boolean).map((listing, index) => (
            <li key={index} className="border rounded p-4 space-y-4">
              <div className="grid grid-cols-6 items-center gap-4">
                <a
                  href={listing}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary col-span-5 hover:underline truncate"
                >
                  {listing}
                </a>
                <Button
                  className="w-full col-span-1"
                  onClick={() => handleCrawl(listing, company)}
                  disabled={crawlStates[listing]?.isLoading}
                >
                  {crawlStates[listing]?.isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Crawl'
                  )}
                </Button>
              </div>

              {crawlStates[listing]?.error && (
                <div className="text-sm text-red-500 mt-2">Error: {crawlStates[listing].error}</div>
              )}

              {crawlStates[listing]?.jobs && (
                <div className="space-y-3 text-sm">
                  {crawlStates[listing].jobs.map((job, jobIndex) => (
                    <div key={jobIndex} className="border p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddJob(job)}
                          className="ml-2"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="text-muted-foreground break-words">
                        {job.company && <div className="">Company: {job.company}</div>}
                        {job.url && (
                          <div>
                            Job detail url:{' '}
                            <a
                              href={
                                job.url?.startsWith('/')
                                  ? `${new URL(listing).origin}${job.url}`
                                  : job.url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate"
                            >
                              {job.url.length > 50 ? `${job.url.slice(0, 50)}...` : job.url}
                            </a>
                          </div>
                        )}
                        {job.location && <div>Location: {job.location}</div>}
                        {job.salary && <div>Salary: {job.salary}</div>}
                        {job.type && <div>Type: {job.type}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
