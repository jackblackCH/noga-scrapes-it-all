import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Job {
  id: string;
  title: string;
  url: string;
  reference_id: string;
  company: {
    name: string;
    logo: string;
    url: string;
    staff_count_range: Record<string, unknown>;
    headquarter: Record<string, unknown>;
  };
  location: string;
  type: string;
  post_date: string;
  benefits: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    console.log('companyId', companyId);
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.APIHUB_API_KEY;
    if (!apiKey) {
      console.error('APIHub API key not configured');
      return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 });
    }

    const options = { method: 'GET', headers: { 'x-api-key': apiKey } };

    const response = await fetch(
      `https://gateway.getapihub.cloud/api/v2/jobs/search?company_ids=${companyId}`,
      options
    ).catch((error) => {
      console.error('Network error fetching from APIHub:', error);
      throw new Error('Failed to connect to APIHub service');
    });

    console.log('APIHub response status:', response.status);

    if (response.status === 404) {
      return NextResponse.json({ error: 'No jobs found for this company' }, { status: 404 });
    }

    if (response.status === 429) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!response.ok) {
      console.error('APIHub error response:', response.statusText);
      return NextResponse.json(
        { error: `APIHub service error: ${response.statusText}` },
        { status: response.status }
      );
    }

    let data: Job[];
    try {
      const responseData = await response.json();
      console.log('APIHub response data:', responseData);
      data = responseData.data as Job[];
    } catch (error) {
      console.error('Error parsing APIHub response:', error);
      return NextResponse.json({ error: 'Invalid response from APIHub service' }, { status: 500 });
    }

    console.log('APIHub data:', data);

    if (!Array.isArray(data)) {
      console.error('Unexpected response format from APIHub');
      return NextResponse.json(
        { error: 'Invalid response format from APIHub service' },
        { status: 500 }
      );
    }

    return NextResponse.json({ total: data.length, jobs: data });
  } catch (error) {
    console.error('Error in APIHub route:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
