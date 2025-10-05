import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateJobSlug(title: string, company: string): string {
  return slugify(`${title}-${company}`, {
    lower: true,
    strict: true,
    trim: true,
  });
}
