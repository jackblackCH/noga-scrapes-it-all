import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import { Job } from '@/app/types/job';

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string; slug: string } }
) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      throw new Error('Airtable API key not configured');
    }

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
    const jobs = JSON.parse((record.get('JobsFoundJSON') as string) || '[]') as Job[];
    const job = jobs.find((j) => j.slug === params.slug);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch job' },
      { status: 500 }
    );
  }
}
