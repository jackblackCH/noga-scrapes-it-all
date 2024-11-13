import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { getJobs } from '@/app/actions/jobs';
import Image from 'next/image';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
export default async function JobList() {
  const jobs = await getJobs();

  return (
    <>
      <div className="space-y-4 pb-8">
        {jobs.map((job, index) => (
          <Card key={job.title + '-' + index} className="p-4 hover:shadow-md transition-shadow">
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
                <div className="flex flex-1 items-center justify-between">
                  <div className="grid grid-cols-1 gap-1">
                    <h3 className="font-medium text-lg">
                      <Link href={`/companies/${job.companySlug}/jobs/${job.slug}`}>
                        {job.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <Link href={`/companies/${job.companySlug}`}>{job.company}</Link> •{' '}
                      {job.location}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground items-center flex">
                    <Clock className="inline-block w-4 h-4 mr-1.5" />{' '}
                    {job.dateUpdated
                      ? formatDistanceToNow(new Date(job.dateUpdated), { addSuffix: true })
                      : ''}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job?.tags?.map((tag) => (
                    <Button key={tag} className="rounded-full" variant="outline" size="sm">
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
