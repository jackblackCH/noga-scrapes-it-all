import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { notFound } from "next/navigation";

interface CompanyDetails {
  name: string;
  priority: string;
  status: string;
  checked: string;
  jobListings: string[];
  website: string;
  notes: string;
}

interface CompanyRecord {
  Company: string;
  Priority: string;
  Status: string;
  Checked: string;
  "Job Listing (1)": string;
  "Job Listing (2)": string;
  "Company's general website": string;
  "Additional data / notes": string;
}

async function getCompanyDetails(
  companyId: string
): Promise<CompanyDetails | null> {
  try {
    const csvPath = path.join(
      process.cwd(),
      "app/data/jobs-spreadsheet-export-11-5-24.csv"
    );

    const fileContents = await fs.readFile(csvPath, "utf-8");
    const records = parse(fileContents, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
    });

    const company = records.find(
      (row: CompanyRecord) =>
        row["Company"]?.toLowerCase().replace(/\s+/g, "-") === companyId
    );

    if (!company) return null;

    return {
      name: company["Company"],
      priority: company["Priority"],
      status: company["Status"],
      checked: company["Checked"],
      jobListings: [
        company["Job Listing (1)"],
        company["Job Listing (2)"],
      ].filter(Boolean),
      website: company["Company's general website"],
      notes: company["Additional data / notes"],
    };
  } catch (error) {
    console.error("Error loading company details:", error);
    return null;
  }
}

export default async function CompanyPage({
  params,
}: {
  params: { companyId: string };
}) {
  const company = await getCompanyDetails(params.companyId);

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{company.name}</h1>
        <div className="text-sm text-muted-foreground">
          Last checked: {company.checked}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <h2 className="text-lg font-medium">Details</h2>
          <dl className="grid gap-2 text-sm">
            <div className="grid grid-cols-[100px_1fr] items-center">
              <dt className="font-medium text-muted-foreground">Priority:</dt>
              <dd>{company.priority || "Not set"}</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center">
              <dt className="font-medium text-muted-foreground">Status:</dt>
              <dd>{company.status || "Not set"}</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center">
              <dt className="font-medium text-muted-foreground">Website:</dt>
              <dd>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {company.website}
                  </a>
                ) : (
                  "Not available"
                )}
              </dd>
            </div>
          </dl>
        </div>

        {company.jobListings.length > 0 && (
          <div className="grid gap-2">
            <h2 className="text-lg font-medium">Job Listings</h2>
            <ul className="grid gap-2 text-sm">
              {company.jobListings.map((listing, index) => (
                <li key={index}>
                  <a
                    href={listing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {listing}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {company.notes && (
          <div className="grid gap-2">
            <h2 className="text-lg font-medium">Notes</h2>
            <p className="text-sm text-muted-foreground">{company.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
