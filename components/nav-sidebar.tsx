import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Command, Building } from 'lucide-react';
import React from 'react';
import { NavUser } from './nav-user';
import Link from 'next/link';
import { CompanyList } from './nav-sidebar/company-list';

const initialData = {
  user: {
    name: 'Noga',
    email: 'noga@altproteincareers.com',
    avatar: '/avatars/noga.jpeg',
  },
  navMain: [
    {
      title: 'Companies',
      url: '/dashboard',
      icon: Building,
      isActive: true,
    },
  ],
};

async function getCompanies() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`, {
    next: {
      revalidate: 1,
      tags: ['companies'],
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }

  return response.json();
}

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const companies = await getCompanies();

  return (
    <Sidebar collapsible="icon" className="[&>[data-sidebar=sidebar]]:flex-row" {...props}>
      <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-800 text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Altprotein Careers</span>
                    <span className="truncate text-xs">Altprotein</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarFooter>
          <NavUser user={initialData.user} />
        </SidebarFooter>
      </Sidebar>
      {/* @ts-expect-error Async Server Component */}
      <CompanyList companies={companies} pathname={props.pathname} />
    </Sidebar>
  );
}
