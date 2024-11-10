import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import { Job } from '@/app/types/job';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

export async function DELETE(request: NextRequest, { params }: { params: { companyId: string } }) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      throw new Error('Airtable API key not configured');
    }

    const { jobTitle } = await request.json();

    const airtable = new Airtable({ apiKey });
    const base = airtable.base('appQ3lzHc7ziRcWeq');

    // Find the company record
    const records = await base('Companies')
      .select({
        filterByFormula: `{Slug} = '${params.companyId}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (!records || records.length === 0) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const record = records[0];
    const existingJobs = JSON.parse((record.get('JobsFoundJSON') as string) || '[]') as Job[];

    // Filter out the job to delete
    const updatedJobs = existingJobs.filter((job) => job.title !== jobTitle);

    // Update the record with the new jobs array
    await base('Companies').update([
      {
        id: record.id,
        fields: {
          JobsFoundJSON: JSON.stringify(updatedJobs),
        },
      },
    ]);

    // Revalidate the company page and dashboard
    revalidatePath(`/dashboard/companies/${params.companyId}`);
    revalidatePath('/dashboard/companies');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete job' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { companyId: string } }) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      throw new Error('Airtable API key not configured');
    }

    const { job, dateUpdated } = await request.json();

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

    const airtable = new Airtable({ apiKey });
    const base = airtable.base('appQ3lzHc7ziRcWeq');

    // Find the company record
    const records = await base('Companies')
      .select({
        filterByFormula: `{Slug} = '${params.companyId}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (!records || records.length === 0) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const record = records[0];
    const existingJobs = JSON.parse((record.get('JobsFoundJSON') as string) || '[]') as Job[];

    // Add the new job if it doesn't exist already (checking by URL)
    const jobExists = existingJobs.some((existingJob) => existingJob.title === job.title);
    if (!jobExists) {
      existingJobs.push(jobWithSlug);
    }

    // Update the record with the new jobs array
    await base('Companies').update([
      {
        id: record.id,
        fields: {
          JobsFoundJSON: JSON.stringify(existingJobs),
          JobsUpdated: dateUpdated,
        },
      },
    ]);

    console.log('Revalidating paths');
    // Update revalidation paths to cover all necessary routes
    revalidatePath(`/dashboard/companies/${params.companyId}`, 'page');
    revalidatePath('/dashboard/companies', 'page');
    revalidatePath(`/companies/${params.companyId}`, 'page');
    revalidatePath('/', 'page');

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
