import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { Job } from '@/app/types/job';
import slugify from 'slugify';

interface AddJobRequest {
  companyId: string;
  job: Job;
  dateUpdated: string;
}

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
    const records = await base('jobs').select().all();

    const allJobs: Job[] = [];

    records.forEach((record) => {
      const jobsFoundJSON = record.get('JobsFoundJSON') as string;
      if (jobsFoundJSON) {
        try {
          const jobs = JSON.parse(jobsFoundJSON.trim()) as Job[];
          allJobs.push(...jobs);
        } catch (error) {
          console.error(
            `api/companies/jobs/route.ts: Error parsing jobs JSON: ${record.get(
              'Company'
            )} ${error}`
          );
        }
      }
    });

    // Sort by dateUpdated in descending order (most recent first)
    const sortedJobs = allJobs.sort((a, b) => {
      const dateA = new Date(a.dateUpdated || 0).getTime();
      const dateB = new Date(b.dateUpdated || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(sortedJobs);
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
    const baseSlug = slugify(`${job.title}-${job.company}`, {
      lower: true,
      strict: true,
    });

    // Add slug to job object
    const jobWithSlug = {
      ...job,
      slug: baseSlug,
      dateUpdated,
    };

    const airtable = new Airtable({
      apiKey: apiKey,
    });

    const base = airtable.base('appQ3lzHc7ziRcWeq');

    // First, find the company record to get existing jobs
    const records = await base('jobs')
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

    // Add the new job if it doesn't exist already (checking by URL)
    const jobExists = existingJobs.some((existingJob) => existingJob.title === job.title);
    if (!jobExists) {
      existingJobs.push(jobWithSlug);
    }

    // Update the company record with the new jobs array
    await base('jobs').update([
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
      jobAdded: !jobExists,
    });
  } catch (error) {
    console.error('Error adding job:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add job' },
      { status: 500 }
    );
  }
}
