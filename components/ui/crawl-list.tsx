'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './button';
import { Job } from '@/app/types/job';
import { parseJobsFromUrlWithMistral } from '@/components/test-runner';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  const handleCrawl = async () => {
    setCrawlState({
      isLoading: true,
      error: undefined,
      jobs: undefined,
    });

    try {
      const response = await fetch(
        `/api/scrape/scrape-jina?url=${encodeURIComponent(jobListing)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const { sourceCode } = await response.json();
      const jobs = await parseJobsFromUrlWithMistral(jobListing, sourceCode, company);

      setCrawlState({
        isLoading: false,
        jobs: jobs,
      });
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

      toast({
        title: result.jobAdded ? 'Success' : 'Note',
        description: result.jobAdded ? 'Job added successfully' : 'Job already exists',
        variant: result.jobAdded ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add job',
        variant: 'destructive',
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
      <TableRow>
        <TableCell className="max-w-[400px]">
          <a
            href={jobListing}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline block truncate"
          >
            {jobListing}
          </a>
        </TableCell>
        <TableCell>
          {crawlState.error && <span className="text-red-500">Error: {crawlState.error}</span>}
          {crawlState.isLoading && <span className="text-yellow-500">Loading...</span>}
          {crawlState.jobs && (
            <span className="text-green-500">Found {crawlState.jobs.length} jobs</span>
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex gap-2 justify-end">
            <Button size="sm" onClick={handleCrawl} disabled={crawlState.isLoading}>
              {crawlState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crawl'}
            </Button>
            {crawlState.jobs && (
              <Button size="sm" variant="outline" onClick={handleAddAllJobs}>
                Add All Jobs
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      {crawlState.jobs && (
        <TableRow>
          <TableCell colSpan={3}>
            <div className="space-y-2">
              {crawlState.jobs.map((job, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <div>
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.location}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddJob(job)}
                    disabled={addingJobs[job.title] || addedJobs[job.title]}
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
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Job Listing URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobListings.map((listing, index) => (
          <JobCrawler
            key={index}
            jobListing={listing}
            company={company}
            companySlug={companySlug}
          />
        ))}
      </TableBody>
    </Table>
  );
}
