import { NextResponse } from 'next/server';

import Airtable, { FieldSet, Record } from 'airtable';

interface AirtableFields extends FieldSet {
  Company?: string;
  Slug?: string;
  Employer?: string;
  Priority?: number;
  Checked?: string;
  JBoard?: string;
  JobListing1?: string;
  JobListing2?: string;
  Status?: string;
  Issue?: string;
  Notes?: string;
  URL?: string;
}

export interface TransformedCompany {
  name: string;
  slug: string;
  priority: number;
  date: string;
  employer: string;
  jboard: string;
  jobListing1: string;
  jobListing2: string;
  status: string;
  issue: string;
  notes: string;
  url: string;
}

// function createSlug(name: string): string {
//   return name
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, ''); // Removed .replace(/\.$/, '') since replace(/^-+|-+$/g, '') already handles dashes at start/end
// }

function transformCompany(company: AirtableFields): TransformedCompany {
  const name = company.Company?.trim() || '';
  return {
    name,
    priority: company.Priority || 0,
    slug: company.Slug || '',
    date: company.Checked || 'NEW',
    employer: company.Employer || '',
    jboard: company.JBoard || '',
    jobListing1: company.JobListing1 || '',
    jobListing2: company.JobListing2 || '',
    status: company.Status || '',
    issue: company.Issue || '',
    notes: company.Notes || '',
    url: company.URL || '',
  };
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
    const airtableResponse = await base('jobs')
      .select({
        sort: [
          { field: 'Company', direction: 'asc' }, // Secondary sort by company name
        ],
      })
      .all();

    const companies = airtableResponse
      .map((record: Record<AirtableFields>) => ({
        Company: record.fields.Company,
        Slug: record.fields.Slug,
        Employer: record.fields.Employer,
        Priority: record.fields.Priority,
        Checked: record.fields.Checked,
        JBoard: record.fields.JBoard,
        JobListing1: record.fields.JobListing1,
        JobListing2: record.fields.JobListing2,
        Status: record.fields.Status,
        Issue: record.fields.Issue,
        Notes: record.fields.Notes,
        URL: record.fields.URL,
      }))
      .map(transformCompany)
      .sort((a, b) => {
        // Handle empty values
        if (!a.priority && !b.priority) return 0;
        if (!a.priority) return 1; // Move empty values to end
        if (!b.priority) return -1; // Move empty values to end

        // Sort numerically with 0 first
        if (a.priority === 0) return -1;
        if (b.priority === 0) return 1;
        return a.priority - b.priority;
      });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error loading companies:', error);
    return NextResponse.json({ error: 'Failed to load companies' }, { status: 500 });
  }
}
