export interface Job {
  title: string | null;
  company: string | null;
  location: string | null;
  experience: string | null;
  skills: string[] | null;
  salary: string | null;
  type: string | null;
  description: string | null;
  url: string | null;
  jobsUpdated: string | null;
  dateUpdated: string | null;
  tags: string[] | null;
}

export interface JobExtractionResult {
  jobs: Job[];
  error?: string;
}
