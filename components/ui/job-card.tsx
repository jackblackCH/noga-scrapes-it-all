import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import Image from 'next/image';
import { Button } from './button';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '@/app/types/job';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {job.companyLogoUrl ? (
          <Image
            loading="lazy"
            alt={`${job.title} logo`}
            className="h-12 w-12 rounded-full object-cover"
            src={job.companyLogoUrl}
            width={48}
            height={48}
            unoptimized
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200" />
        )}
        <div className="flex-1">
          <div className="flex flex-1 items-start justify-between">
            <div className="grid grid-cols-1 gap-1">
              <h3 className="font-medium text-lg">
                <Link href={`/companies/${job.companySlug}/jobs/${job.slug}`}>{job.title}</Link>
              </h3>
              <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                <Link href={`/companies/${job.companySlug}`} className="hover:underline">
                  {job.company}
                </Link>
                {job.location && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{job.location}</span>
                  </>
                )}
                {job.salary && job.salary !== 'not-found' && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{job.salary}</span>
                  </>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.tags?.slice(0, 3).map((tag) => (
                  <Link href={`/jobs?category=${encodeURIComponent(tag)}`} key={tag}>
                    <Button className="rounded-full h-6 px-2 text-xs" variant="outline" size="sm">
                      {tag}
                    </Button>
                  </Link>
                ))}
                {job.tags && job.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{job.tags.length - 3} more</span>
                )}
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground items-center flex whitespace-nowrap">
              <Clock className="inline-block w-4 h-4 mr-1.5" />
              {job.jobsUpdated
                ? formatDistanceToNow(new Date(job.jobsUpdated), { addSuffix: true })
                : ''}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
