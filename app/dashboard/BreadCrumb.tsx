'use client';

import { usePathname } from 'next/navigation';

export default function BreadCrumb() {
  const pathname = usePathname();
  const companyId = pathname.split('/').pop();

  return <div>{companyId}</div>;
}
