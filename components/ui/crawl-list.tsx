'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './button';
import { Job } from '@/app/types/job';
import { parseJobsFromUrlWithMistral } from '@/components/test-runner';

interface CrawlState {
  isLoading: boolean;
  error?: string;
  jobs?: Job[];
}

export default function CrawlList({
  jobListings,
  company,
}: {
  jobListings: string[];
  company: string;
}) {
  const [crawlStates, setCrawlStates] = useState<Record<string, CrawlState>>({});

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
        console.log('Cloudflare error, trying ScraperAPI');
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

      console.log('sourceCode', sourceCode);
      if (!sourceCode) {
        console.log('Failed to get source code from any source');
        throw new Error('Failed to get source code from any source');
      }

      const jobs = await extractJobs(url, sourceCode, company.trim());

      updateCrawlState(url, { isLoading: false, jobs });
    } catch (error) {
      updateCrawlState(url, {
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-medium">Job Listings</h2>
        {Object.values(crawlStates).some((state) => state.jobs) && (
          <span className="text-sm text-muted-foreground">
            (
            {Object.values(crawlStates).reduce(
              (total, state) => total + (state.jobs?.length || 0),
              0
            )}{' '}
            jobs found)
          </span>
        )}
      </div>
      <ul className="grid gap-4">
        {jobListings.map((listing, index) => (
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
                    <h3 className="font-semibold mb-2">{job.title}</h3>
                    <div className="text-muted-foreground">
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
                            className="text-primary hover:underline"
                          >
                            {job.url}
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
  );
}
