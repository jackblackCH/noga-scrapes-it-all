import { NextResponse } from 'next/server';
import Airtable, { Attachment } from 'airtable';
import { Job } from '@/app/types/job';

export async function GET(request: Request, { params }: { params: { companyId: string } }) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      throw new Error('Airtable API key not configured');
    }

    const airtable = new Airtable({ apiKey });
    const base = airtable.base('appQ3lzHc7ziRcWeq'); // Using the actual base ID from other files

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
    let jobs: Job[] = [];
    try {
      jobs = JSON.parse((record.get('JobsFoundJSON') as string) || '[]') as Job[];
      jobs.forEach((job) => {
        job.companyLogoUrl = (record.get('Logo') as Attachment[])?.[0]?.url;
        job.companySlug = record.get('Slug') as string;
        job.companyWebsite = record.get('Website') as string;
      });
    } catch (error) {
      console.error('Error parsing jobs JSON:', error);
      // Continue with empty jobs array if parsing fails
    }

    const company = {
      name: record.get('Company'),
      website: record.get('Website'),
      slug: record.get('Slug'),
      employer: record.get('Employer'),
      priority: record.get('Priority'),
      checked: record.get('Checked'),
      jboard: record.get('JBoard'),
      jobListing1: record.get('JobListing1'),
      jobListing2: record.get('JobListing2'),
      jobListingLinkedIn: record.get('JobListingLinkedIn'),
      status: record.get('Status'),
      issue: record.get('Issue'),
      notes: record.get('Notes'),
      url: record.get('URL'),
      jobsUpdated: record.get('JobsUpdated'),
      logo: (record.get('Logo') as Attachment[])?.[0],
    };

    return NextResponse.json({
      ...company,
      jobs,
    });
  } catch (error) {
    console.error('Error fetching company and jobs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch company and jobs' },
      { status: 500 }
    );
  }
}
