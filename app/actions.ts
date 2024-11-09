'use server';

import { revalidatePath } from 'next/cache';

export async function create() {
  // revalidatePath('/');
  revalidatePath('/dashboard/companies/[companyId]', 'page');
}
