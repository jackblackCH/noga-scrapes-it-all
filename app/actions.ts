'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function create() {
  revalidatePath('/');
  revalidatePath('/dashboard/companies/[companyId]', 'page');
}

export async function deleteJob() {
  // Revalidate the companies tag to refresh data in components using fetchCompanies()
  revalidateTag('companies');
  revalidatePath('/dashboard', 'layout');
  // Also revalidate the paths to ensure UI updates everywhere
  revalidatePath('/');
  revalidatePath('/dashboard/companies/[companyId]', 'page');
  revalidatePath('/dashboard', 'layout');
}
