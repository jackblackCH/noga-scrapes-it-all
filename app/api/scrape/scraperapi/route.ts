import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
// export const runtime = 'edge';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingUrl = searchParams.get('url');

    if (!listingUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Pre-check if page is accessible
    const pageCheck = await fetch(listingUrl, {
      method: 'GET',
    });

    if (pageCheck.status === 404 || pageCheck.status === 500) {
      return NextResponse.json(
        {
          error: `Page returned ${pageCheck.status}. Most likely it does not exist anymore`,
        },
        { status: pageCheck.status }
      );
    }

    const apiKey = process.env.SCRAPER_API_KEY || 'e705ef698d2e619bdcaada419adae9eb';
    if (!apiKey) {
      return NextResponse.json({ error: 'Scraper API key not configured' }, { status: 500 });
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      url: listingUrl,
    });

    const response = await fetch(`https://api.scraperapi.com/?${params}`);
    const data = await response.text();

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
