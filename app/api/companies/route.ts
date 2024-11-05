import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET(request: Request) {
  try {
    // Get limit from URL params, default to 20 if not specified
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get the absolute path to the CSV file
    const csvPath = path.join(
      process.cwd(),
      "app/data/jobs-spreadsheet-export-11-5-24.csv"
    );

    // Read the CSV file
    const fileContents = await fs.readFile(csvPath, "utf-8");

    // Parse the CSV data
    const records = parse(fileContents, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
    });

    // Limit the number of records returned
    const limitedRecords = records.slice(0, limit);

    return NextResponse.json(limitedRecords);
  } catch (error) {
    console.error("Error loading companies:", error);
    return NextResponse.json(
      { error: "Failed to load companies" },
      { status: 500 }
    );
  }
}
