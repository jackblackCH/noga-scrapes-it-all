import { NextResponse } from 'next/server';
import Airtable, { FieldSet, Record } from 'airtable';

interface AirtableFields extends FieldSet {
  Company?: string;
  JobsUpdated?: string;
  Status?: string;
  Logo?: string;
  Slug?: string;
}

interface Company {
  id: string;
  name: string;
  lastUpdated: string;
  status: string;
  logo?: string;
  slug: string;
}

function transformCompany(record: Record<AirtableFields>): Company {
  return {
    id: record.id,
    name: record.fields.Company?.trim() || '',
    lastUpdated: record.fields.JobsUpdated || '',
    status: record.fields.Status || 'inactive',
    logo: record.fields.Logo,
    slug: record.fields.Slug || '',
  };
}

export async function GET() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      throw new Error('Airtable API key not configured');
    }

    const airtable = new Airtable({ apiKey });
    const base = airtable.base('appQ3lzHc7ziRcWeq');

    const airtableResponse = await base('jobs')
      .select({
        sort: [{ field: 'JobsUpdated', direction: 'desc' }],
        maxRecords: 10,
      })
      .all();

    const companies = airtableResponse.map(transformCompany);

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error loading recent companies:', error);
    return NextResponse.json({ error: 'Failed to load recent companies' }, { status: 500 });
  }
}
