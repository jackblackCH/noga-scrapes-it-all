import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
export const dynamic = 'force-dynamic';
// export const runtime = 'edge';
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    const searchParams = url.searchParams;
    const listingUrl = url.searchParams.get('url') || '';

    const newUrl = `${listingUrl}&f_C=${searchParams.get('f_C')}&geoId=${searchParams.get(
      'geoId'
    )}&origin=${searchParams.get('origin')}&originToLandingJobPostings=${searchParams.get(
      'originToLandingJobPostings'
    )}`;

    console.log('New URL:', newUrl);

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

    const apiKey = process.env.SCRAPER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Scraper API key not configured' }, { status: 500 });
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      url: newUrl,
      premium: 'true',
      render: 'true',
    });
    const response = await fetch(`https://api.scraperapi.com/?${params}`);
    const data = await response.text();

    // Extract job list container using DOM
    const dom = new JSDOM(data);
    const jobListContainer = dom.window.document.querySelector('.jobs-search__results-list');
    const jobListHtml = jobListContainer ? jobListContainer.innerHTML : '';

    return NextResponse.json({ data: jobListHtml });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
