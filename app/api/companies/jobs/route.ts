import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { Job } from '@/app/types/job';

interface AddJobRequest {
  companyId: string;
  job: Job;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      throw new Error('Airtable API key not configured');
    }

    const { companyId, job } = (await request.json()) as AddJobRequest;

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
    const jobExists = existingJobs.some((existingJob) => existingJob.url === job.url);
    if (!jobExists) {
      existingJobs.push(job);
    }

    // Update the company record with the new jobs array
    await base('jobs').update([
      {
        id: record.id,
        fields: {
          JobsFoundJSON: JSON.stringify(existingJobs),
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
