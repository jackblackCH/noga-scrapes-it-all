import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { Job } from '@/app/types/job';
import { generateJobSlug } from '@/lib/utils';

interface AddJobRequest {
  companyId: string;
  company: string;
  job: Job;
  dateUpdated: string;
}

export const revalidate = 10; // Cache for 10 seconds

export async function GET() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      throw new Error('Airtable API key not configured');
    }

    const airtable = new Airtable({
      apiKey: apiKey,
    });

    const base = airtable.base('appQ3lzHc7ziRcWeq');
    const records = await base('Companies')
      .select({
        sort: [{ field: 'JobsUpdated', direction: 'desc' }],
      })
      .all();

    const allJobs: Job[] = [];

    records.forEach((record) => {
      const jobsFoundJSON = record.get('JobsFoundJSON') as string;
      const companyLogo = record.get('Logo') as Airtable.Attachment[];
      const companySlug = record.get('Slug') as string;

      if (jobsFoundJSON) {
        try {
          const jobs = JSON.parse(jobsFoundJSON.trim()) as Job[];
          const jobsWithLogo = jobs.map((job) => {
            // Ensure the job has a valid slug
            const slug = job.slug || generateJobSlug(job.title, record.get('Company') as string);

            return {
              ...job,
              company: record.get('Company') as string,
              companyLogoUrl: companyLogo && companyLogo[0] ? companyLogo[0].url : '',
              companySlug: companySlug,
              dateUpdated: record.get('JobsUpdated') as string,
              slug: slug,
            };
          });
          allJobs.push(...jobsWithLogo);
        } catch (error) {
          console.error(
            `api/companies/jobs/route.ts: Error parsing jobs JSON: ${record.get(
              'Company'
            )} ${error}`
          );
        }
      }
    });

    // // Sort by dateUpdated in descending order (most recent first)
    // const sortedJobs = allJobs.sort((a, b) => {
    //   const dateA = new Date(a.dateUpdated || 0).getTime();
    //   const dateB = new Date(b.dateUpdated || 0).getTime();
    //   return dateB - dateA;
    // });

    return NextResponse.json(allJobs);
  } catch (error) {
    console.error('Error getting jobs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      throw new Error('Airtable API key not configured');
    }

    const { companyId, job, dateUpdated } = (await request.json()) as AddJobRequest;

    // Generate slug from title and company
    const baseSlug = generateJobSlug(job.title, job.company);

    // Add slug and companySlug to job object
    const jobWithSlug = {
      ...job,
      slug: baseSlug,
      dateUpdated,
      companySlug: companyId,
    };

    const airtable = new Airtable({
      apiKey: apiKey,
    });

    const base = airtable.base('appQ3lzHc7ziRcWeq');

    // First, find the company record to get existing jobs
    const records = await base('Companies')
      .select({
        filterByFormula: `{Slug} = '${companyId}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (!records || records.length === 0) {
      throw new Error('Company not found');
    }

    const record = records[0];
    const existingJobs = JSON.parse((record.get('JobsFoundJSON') as string) || '[]') as Job[];

    // Update existing job or add new job
    const existingJobIndex = existingJobs.findIndex(
      (existingJob) => existingJob.title === job.title
    );

    if (existingJobIndex === -1) {
      // Add new job
      existingJobs.push(jobWithSlug);
    } else {
      // Update existing job with new data and ensure it has a slug
      existingJobs[existingJobIndex] = {
        ...existingJobs[existingJobIndex],
        ...jobWithSlug,
        slug: existingJobs[existingJobIndex].slug || jobWithSlug.slug,
      };
    }

    // Update the company record with the new jobs array
    await base('Companies').update([
      {
        id: record.id,
        fields: {
          JobsFoundJSON: JSON.stringify(existingJobs),
          JobsUpdated: dateUpdated,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      jobsCount: existingJobs.length,
      jobAdded: existingJobIndex === -1,
    });
  } catch (error) {
    console.error('Error adding job:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add job' },
      { status: 500 }
    );
  }
}
