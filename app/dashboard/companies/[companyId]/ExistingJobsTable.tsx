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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs?.map((job, index) => (
          <TableRow key={job.title + index}>
            <TableCell>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center gap-1"
              >
                {job.title}
                <ExternalLink className="h-4 w-4" />
              </a>
            </TableCell>
            <TableCell>{job.location}</TableCell>
            <TableCell>{formatDate(job.dateUpdated)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-700"
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
            <TableCell colSpan={4} className="text-gray-500">
              No jobs found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
