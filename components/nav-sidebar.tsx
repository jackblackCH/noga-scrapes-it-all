'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  useSidebar,
  SidebarFooter,
  SidebarInput,
} from '@/components/ui/sidebar';
import { Command, Building, Loader2 } from 'lucide-react';
import React from 'react';
import { NavUser } from './nav-user';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import Link from 'next/link';

// Define the Company type to match the structure we need
interface Company {
  name: string;
  slug: string;
  date: string;
  subject: string;
  teaser: string;
}

// Initial sample data
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
  companies: [] as Company[], // Type the companies array
};

async function fetchCompanies() {
  const response = await fetch('/api/companies?format=transformed', {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }

  return response.json();
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(initialData.navMain[0]);
  const [companies, setCompanies] = React.useState<Company[]>(initialData.companies);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const { setOpen } = useSidebar();

  React.useEffect(() => {
    async function loadCompanies() {
      try {
        setIsLoading(true);
        const companies = await fetchCompanies();
        setCompanies(companies);
      } catch (error) {
        console.error('Failed to load companies:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCompanies();
  }, []);

  const filteredCompanies = React.useMemo(() => {
    return companies.filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companies, searchQuery]);

  return (
    <Sidebar collapsible="icon" className="[&>[data-sidebar=sidebar]]:flex-row" {...props}>
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
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
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        setOpen(true);
                      }}
                      isActive={activeItem.title === item.title}
                      className={
                        activeItem.title === item.title
                          ? '!bg-primary !text-sidebar-primary-foreground'
                          : ''
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={initialData.user} />
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex overflow-hidden">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">{activeItem.title}</div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Updated</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput
            placeholder="Type to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0 pt-0">
            <SidebarGroupContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                filteredCompanies?.map((company, index) => (
                  <Link
                    href={`/dashboard/companies/${company.slug}`}
                    key={company.slug + index}
                    className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <div className="flex w-full items-center gap-2">
                      <span>{company.name}</span>{' '}
                      <span className="ml-auto text-xs">Last checked: {company.date}</span>
                    </div>
                  </Link>
                ))
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
