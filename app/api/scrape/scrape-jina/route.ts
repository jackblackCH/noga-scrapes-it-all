import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const inputUrl = searchParams.get('url');

    if (!inputUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    const encodedUrl = encodeURIComponent(inputUrl)
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/'/g, '%27')
      .replace(/!/g, '%21')
      .replace(/\*/g, '%2A')
      .replace(/~/g, '%7E')
      .replace(/\+/g, '%20');
    const jinaUrl = `https://r.jina.ai/${encodedUrl}`;

    const response = await fetch(jinaUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer jina_c3d7737e925143e2908b8af33553178a3kA7-4j9ux9p7-fBxkZDRkbMbsme`,
        'X-Return-Format': 'markdown',
        'X-With-Iframe': 'true',
      },
    });
    const sourceCode = await response.text();

    // console.log('------------SOURCE CODE JINA AI MARKDOWN---------------');
    // console.log(sourceCode);
    // console.log('--------------------------------------');

    if (
      sourceCode.includes('Checking the site connection security') ||
      sourceCode.includes('Cloudflare')
    ) {
      return NextResponse.json({ error: 'Cloudflare Bot Protection' }, { status: 503 });
    }

    if (sourceCode.includes('404 error') || response.status === 404) {
      return NextResponse.json({ error: 'Page not found or empty' }, { status: 404 });
    }

    if (sourceCode.includes('HTTP ERROR 429') || response.status === 429) {
      return NextResponse.json({ error: 'Rate Limiter Linkedin' }, { status: 429 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({
      url: inputUrl,
      sourceCode,
      finalUrl: response.url, // Include the final URL after any redirects
    });
  } catch (error) {
    console.error('Error in Jina scraping:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
