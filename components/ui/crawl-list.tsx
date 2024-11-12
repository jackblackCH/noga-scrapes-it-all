'use client';

import { useState } from 'react';
import { Loader2, ScanSearch } from 'lucide-react';
import { Button } from './button';
import { Job } from '@/app/types/job';
import { parseJobsFromUrlWithMistral } from '@/components/test-runner';
import { toast } from 'sonner';
import { create } from '@/app/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CrawlState {
  isLoading: boolean;
  error?: string;
  jobs?: Job[];
}

function JobCrawler({
  jobListing,
  company,
  companySlug,
}: {
  jobListing: string;
  company: string;
  companySlug: string;
}) {
  const [crawlState, setCrawlState] = useState<CrawlState>({
    isLoading: false,
    jobs: undefined,
    error: undefined,
  });
  const [addingJobs, setAddingJobs] = useState<{ [key: string]: boolean }>({});
  const [addedJobs, setAddedJobs] = useState<{ [key: string]: boolean }>({});

  const parseWithJina = async (url: string) => {
    try {
      const response = await fetch(`/api/scrape/scrape-jina?url=${url}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch from Jina:', error);
      throw new Error('Failed to fetch data from Jina API');
    }
  };

  const parseWithScraperApi = async (url: string) => {
    const response = await fetch(`/api/scrape/scraperapi?url=${url}`);
    const data = await response.json();
    return data.data;
  };

  const handleCrawl = async () => {
    setCrawlState({
      isLoading: true,
      error: undefined,
      jobs: undefined,
    });

    const isLinkedIn = jobListing.includes('linkedin.com');
    let hasEntries = false;
    let response;

    if (isLinkedIn) {
      response = await parseWithScraperApi(jobListing);
      if (response.length > 0) {
        hasEntries = true;
      }
    } else {
      response = await parseWithJina(jobListing);
      if (response.sourceCode.length > 0) {
        hasEntries = true;
        response = response.sourceCode;
      }
    }

    try {
      if (hasEntries) {
        const sourceCodeString = response;
        const jobs = await parseJobsFromUrlWithMistral(jobListing, sourceCodeString, company);
        setCrawlState({
          isLoading: false,
          jobs: jobs,
        });
      } else {
        setCrawlState({
          isLoading: false,
          error: 'No jobs found',
        });
      }
    } catch (error) {
      setCrawlState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
      });
    }
  };

  const handleAddJob = async (job: Job) => {
    setAddingJobs((prev) => ({ ...prev, [job.title]: true }));
    try {
      const response = await fetch(`/api/companies/${companySlug}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job,
          dateUpdated: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add job');
      }

      const result = await response.json();
      create();

      if (result.jobAdded) {
        setAddedJobs((prev) => ({ ...prev, [job.title]: true }));
      }

      toast(result.jobAdded ? 'Success' : 'Note', {
        description: result.jobAdded ? 'Job added successfully' : 'Job already exists',
      });
    } catch (error) {
      toast('Error', {
        description: error instanceof Error ? error.message : 'Failed to add job',
      });
    } finally {
      setAddingJobs((prev) => ({ ...prev, [job.title]: false }));
    }
  };

  const handleAddAllJobs = async () => {
    if (!crawlState.jobs) return;

    for (const job of crawlState.jobs) {
      await handleAddJob(job);
    }
  };

  return (
    <>
      <TableRow className="transition-colors bg-slate-50/50 hover:bg-slate-50">
        <TableCell className="max-w-[400px] py-4 px-6">
          <a
            href={jobListing}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 hover:underline block truncate"
          >
            {jobListing}
          </a>
        </TableCell>
        <TableCell className="py-4 px-6">
          {crawlState.error && (
            <span className="text-rose-500 font-medium">Error: {crawlState.error}</span>
          )}
          {crawlState.isLoading && <span className="text-amber-500 font-medium">Loading...</span>}
          {crawlState.jobs && (
            <span className="text-emerald-600 font-medium">
              Found {crawlState.jobs.length} jobs
            </span>
          )}
        </TableCell>
        <TableCell className="text-right py-4 px-6">
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              onClick={handleCrawl}
              disabled={crawlState.isLoading}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {crawlState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crawl'}
            </Button>
            {crawlState.jobs && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddAllJobs}
                className="rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Add All Jobs
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      {crawlState.jobs && (
        <TableRow>
          <TableCell colSpan={3} className="py-8 text-center text-gray-500 bg-gray-50">
            <div className="space-y-2 p-2">
              {crawlState.jobs.map((job, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors"
                >
                  <div>
                    <div className="font-medium text-slate-900">{job.title}</div>
                    <div className="text-sm text-slate-600">{job.location}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddJob(job)}
                    disabled={addingJobs[job.title] || addedJobs[job.title]}
                    className={`${
                      addedJobs[job.title]
                        ? 'rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'rounded-full bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {addingJobs[job.title] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : addedJobs[job.title] ? (
                      'Added'
                    ) : (
                      'Add Job'
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function CrawlList({
  jobListings,
  company,
  companySlug,
}: {
  jobListings: string[];
  company: string;
  companySlug: string;
}) {
  return (
    <Table className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
      <TableHeader>
        <TableRow className="bg-slate-50 border-b border-slate-200">
          <TableHead className="py-4 px-6 text-sm font-semibold text-slate-700">
            Job Listing URL
          </TableHead>
          <TableHead className="py-4 px-6 text-sm font-semibold text-slate-700">Status</TableHead>
          <TableHead className="py-4 px-6 text-sm font-semibold text-slate-700 text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobListings.length > 0 ? (
          jobListings.map((listing, index) => (
            <JobCrawler
              key={index}
              jobListing={listing}
              company={company}
              companySlug={companySlug}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="py-8 text-center text-gray-500 bg-gray-50">
              <div className="flex flex-col items-center gap-2">
                <ScanSearch className="h-8 w-8 text-gray-400" />
                <span>No job listings imported yet</span>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
