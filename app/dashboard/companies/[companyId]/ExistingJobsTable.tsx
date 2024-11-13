'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Job } from '@/app/types/job';
import { format } from 'date-fns/format';
import { ExternalLink, Loader2 } from 'lucide-react';
import { deleteJob } from '@/app/actions';
import { toast } from 'sonner';

export default function ExistingJobsTable({ jobs: initialJobs }: { jobs: Job[] | undefined }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [deletingJobs, setDeletingJobs] = useState<{ [key: string]: boolean }>({});

  // Update local state when initialJobs prop changes
  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  const handleDelete = async (jobTitle: string) => {
    setDeletingJobs((prev) => ({ ...prev, [jobTitle]: true }));
    try {
      const companyId = window.location.pathname.split('/').pop();
      const response = await fetch(`/api/companies/${companyId}/jobs`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Update the local state instead of reloading
      setJobs((currentJobs) => currentJobs?.filter((job) => job.title !== jobTitle));
      deleteJob();

      toast('Success', {
        description: () => (
          <>
            Job <b>{jobTitle}</b> deleted successfully
          </>
        ),
      });
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setDeletingJobs((prev) => ({ ...prev, [jobTitle]: false }));
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <Table className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="py-4 px-6 text-sm font-semibold text-gray-900">Title</TableHead>
          <TableHead className="py-4 px-6 text-sm font-semibold text-gray-900">Location</TableHead>
          <TableHead className="py-4 px-6 text-sm font-semibold text-gray-900">Tags</TableHead>
          <TableHead className="py-4 px-6 text-sm font-semibold text-gray-900">
            Last Updated
          </TableHead>
          <TableHead className="py-4 px-6 text-sm font-semibold text-gray-900 text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs?.map((job, index) => (
          <TableRow
            key={job.title + index}
            className="hover:bg-gray-50 transition-colors border-t border-gray-200"
          >
            <TableCell className="py-4 px-6">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center gap-2 font-medium"
              >
                {job.title}
                <ExternalLink className="h-4 w-4 opacity-70" />
              </a>
            </TableCell>
            <TableCell className="py-4 px-6 text-gray-600">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {job.location}
              </span>
            </TableCell>
            <TableCell className="py-4 px-6">
              <div className="flex flex-wrap gap-1">
                {job.tags?.map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="bg-white text-xs rounded-full px-2 py-0.5"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </TableCell>
            <TableCell className="py-4 px-6 text-gray-600">{formatDate(job.dateUpdated)}</TableCell>
            <TableCell className="py-4 px-6 text-right">
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-full px-4"
                onClick={() => handleDelete(job.title)}
                disabled={deletingJobs[job.title]}
              >
                {deletingJobs[job.title] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {(!jobs || jobs.length === 0) && (
          <TableRow>
            <TableCell colSpan={5} className="py-8 text-center text-gray-500 bg-gray-50">
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">📋</span>
                <span>No jobs found</span>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
