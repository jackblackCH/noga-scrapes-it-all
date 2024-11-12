import { NextResponse } from 'next/server';
import Airtable, { FieldSet } from 'airtable';

export const dynamic = 'force-dynamic';

interface AirtableFields extends FieldSet {
  Name?: string;
  Image?: string;
  Active?: boolean;
  Featured?: boolean;
}

interface TransformCategory {
  name: string;
  image: string;
  active: boolean;
  featured: boolean;
}

function transformCategory(category: AirtableFields): TransformCategory {
  return {
    name: category.Name || '',
    image: category.Image || '',
    active: category.Active || false,
    featured: category.Featured || false,
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

    const records = await base('Categories').select().all();
    const categories = records.map((record) => transformCategory(record.fields));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
