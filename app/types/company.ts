import { Job } from "./job";

export interface Company {
  Company: string;
  Priority: string;
  Checked: string;
  URL?: string;
  Notes?: string;
  Status?: string;
  Category?: string;
  jobs?: Job[];
}

export type SortableCompanyFields = keyof Pick<
  Company,
  "Priority" | "Checked" | "Company"
>;
