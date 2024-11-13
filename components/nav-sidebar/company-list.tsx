'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { FiltersSection } from './filters-section';
import { TransformedCompany } from '@/app/api/companies/route';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
export function CompanyList({ companies }: { companies: TransformedCompany[] }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showLinkedInOnly, setShowLinkedInOnly] = React.useState(false);
  const [showRecentlyUpdated, setShowRecentlyUpdated] = React.useState(false);

  const filteredCompanies = React.useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLinkedIn = !showLinkedInOnly || Boolean(company.jobListingLinkedIn);
      const matchesRecent =
        !showRecentlyUpdated ||
        (company.jobsUpdated &&
          new Date(company.jobsUpdated) >= new Date(Date.now() - 24 * 60 * 60 * 1000));

      return matchesSearch && matchesLinkedIn && matchesRecent;
    });
  }, [companies, searchQuery, showLinkedInOnly, showRecentlyUpdated]);

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex overflow-hidden">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Companies</div>
        </div>
        <FiltersSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showLinkedInOnly={showLinkedInOnly}
          setShowLinkedInOnly={setShowLinkedInOnly}
          showRecentlyUpdated={showRecentlyUpdated}
          setShowRecentlyUpdated={setShowRecentlyUpdated}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0 pt-0">
          <SidebarGroupContent>
            {filteredCompanies.map((company, index) => {
              const isActive = pathname === `/dashboard/companies/${company.slug}`;
              return (
                <Link
                  href={`/dashboard/companies/${company.slug}`}
                  key={company.slug + index}
                  className={`flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    isActive ? 'bg-primary text-white hover:!bg-primary/95 hover:text-white' : ''
                  }`}
                >
                  <div className="flex flex-col w-full gap-3">
                    <div className="flex w-full gap-2 leading-none items-center">
                      {company.logo ? (
                        <div className="size-8 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={company.logo.url}
                            alt={`${company.name} logo`}
                            className="w-full h-full object-cover rounded-full"
                            width={32}
                            height={32}
                          />
                        </div>
                      ) : (
                        <div className="size-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                          <span
                            className={`text-xs flex h-full w-full items-center leading-none justify-center ${
                              isActive ? 'text-gray-800' : 'text-gray-500'
                            }`}
                          >
                            {company.name
                              .split(' ')
                              .map((word) => word.charAt(0))
                              .join('')}
                          </span>
                        </div>
                      )}
                      <span className="font-bold truncate">{company.name}</span>
                    </div>
                    <div className="flex items-center text-xs gap-2">
                      <span>
                        {company.jobsCount} {company.jobsCount === 1 ? 'Job' : 'Jobs'}
                      </span>
                      <span className="ml-auto text-xs">
                        Updated:{' '}
                        {company.jobsUpdated
                          ? formatDistanceToNow(new Date(company.jobsUpdated), {
                              addSuffix: false,
                            })
                          : 'Never'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
