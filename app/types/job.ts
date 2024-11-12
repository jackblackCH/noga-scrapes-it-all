export interface Job {
  title: string;
  company: string;
  companyLogoUrl: string | null;
  companySlug: string;
  location: string | null;
  experience: string | null;
  skills: string[] | null;
  salary: string | null;
  type: string | null;
  description: string | null;
  url: string;
  jobsUpdated: string | null;
  dateUpdated: string | null;
  tags: string[] | null;
  slug: string;
}

export interface JobExtractionResult {
  jobs: Job[];
  error?: string;
}
