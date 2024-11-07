import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Company } from '@/app/types/company';

interface CompanySort {
  priority: number;
  date: number;
  name: string;
}

function createSortValues(company: Company | null): CompanySort {
  if (!company) {
    return {
      priority: Number.MAX_SAFE_INTEGER,
      date: 0,
      name: '',
    };
  }

  return {
    priority: parsePriority(company.Priority),
    date: parseDate(company.Checked),
    name: company.Company || '',
  };
}

function parsePriority(priority: string | null | undefined): number {
  if (!priority) return Number.MAX_SAFE_INTEGER;
  const parsed = parseInt(priority);
  return Number.isInteger(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

function parseDate(date: string | null | undefined): number {
  if (!date) return 0;
  const parsed = new Date(date).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function compareCompanies(a: Company | null, b: Company | null): number {
  if (!a) return 1;
  if (!b) return -1;

  const sortA = createSortValues(a);
  const sortB = createSortValues(b);

  if (sortA.priority !== sortB.priority) {
    return sortA.priority - sortB.priority;
  }

  if (sortA.date !== sortB.date) {
    return sortB.date - sortA.date;
  }

  return sortA.name.localeCompare(sortB.name);
}

async function readCompaniesFromCSV(filePath: string): Promise<Company[]> {
  const fileContents = await fs.readFile(filePath, 'utf-8');
  return parse(fileContents, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
  }) as Company[];
}

export interface TransformedCompany {
  name: string;
  email: string;
  date: string;
  subject: string;
  teaser: string;
  raw: Company;
}

function transformCompany(company: Company): TransformedCompany {
  return {
    name: company.Company?.trim() || 'Unknown Company',
    email: company.Company?.toLowerCase().replace(/[.,\s]+/g, '-') || '',
    date: company.Checked || new Date().toLocaleDateString(),
    subject: company.Priority ? `Priority ${company.Priority}` : 'Standard',
    teaser:
      [company.Notes, company.URL, company.Status].filter(Boolean).join(' - ') ||
      'No additional information available',
    raw: company,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const format = searchParams.get('format');

    const csvPath = path.join(process.cwd(), 'app/data/Altprotein - jobs.csv');

    const companies = await readCompaniesFromCSV(csvPath);
    const sortedCompanies = companies.sort(compareCompanies);
    const limitedCompanies = sortedCompanies.slice(0, limit);

    if (format === 'transformed') {
      const transformedCompanies = limitedCompanies
        .filter((company) => company.Company?.trim())
        .map(transformCompany);
      return NextResponse.json(transformedCompanies);
    }

    return NextResponse.json(limitedCompanies);
  } catch (error) {
    console.error('Error loading companies:', error);
    return NextResponse.json({ error: 'Failed to load companies' }, { status: 500 });
  }
}
