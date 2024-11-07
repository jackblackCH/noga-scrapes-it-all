import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingUrl = searchParams.get("url");

    if (!listingUrl) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Pre-check if page is accessible
    const pageCheck = await fetch(listingUrl, {
      method: "GET",
    });

    if (pageCheck.status === 404 || pageCheck.status === 500) {
      return NextResponse.json(
        {
          error: `Page returned ${pageCheck.status}. Most likeley it does not exist anymore`,
        },
        { status: pageCheck.status }
      );
    }

    const scrapingUrl = "https://api.scrapingant.com/v2/extract";
    const params = new URLSearchParams({
      // proxy_country: "DE",
      url: listingUrl,
      "x-api-key": "44d8bd1bf8e843a6a128f228ceb04660",
      extract_properties:
        "jobPostings(title, description, href, company, location, salary, type, experience, tags, sourceUrl, postedDate)",
    });

    const response = await fetch(`${scrapingUrl}?${params}`, {
      method: "GET",
      headers: {
        useQueryString: "true",
      },
    });

    const data = await response.text();
    // const credits = response.headers.get("Ant-credits-cost");

    console.log(data);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     // Example processing of POST data
//     const response = {
//       received: body,
//       status: "success",
//       timestamp: new Date().toISOString(),
//     };

//     return NextResponse.json(response);
//   } catch (_error) {
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
