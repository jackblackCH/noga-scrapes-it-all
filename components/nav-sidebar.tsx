import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroup,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Command, Building } from 'lucide-react';
import React from 'react';
import { NavUser } from './nav-user';
import Link from 'next/link';
import { CompanyList } from './nav-sidebar/company-list';
import SidebarItem from './nav-sidebar/item';

const initialData = {
  navMain: [
    {
      title: 'Companies',
      url: '/dashboard',
      icon: Building,
      isActive: true,
    },
  ],
};

export const dynamic = 'force-dynamic';

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

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0 ">
              <SidebarMenu>
                {initialData.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarItem title={item.title} icon={<item.icon />} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      <CompanyList companies={companies} />
    </Sidebar>
  );
}
