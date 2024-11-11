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
import { formatDistanceToNow } from 'date-fns';
import { usePathname } from 'next/navigation';

// Define the Company type to match the structure we need
interface Company {
  name: string;
  slug: string;
  date: string;
  subject: string;
  teaser: string;
  jobsUpdated: string;
  jobsCount: number;
  jobListingLinkedIn?: string;
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`);

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
  const [showLinkedInOnly, setShowLinkedInOnly] = React.useState(false);
  const [showRecentlyUpdated, setShowRecentlyUpdated] = React.useState(false);
  const { setOpen } = useSidebar();
  const pathname = usePathname();

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
    return companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLinkedIn = !showLinkedInOnly || Boolean(company.jobListingLinkedIn);
      const matchesRecent =
        !showRecentlyUpdated ||
        (company.jobsUpdated &&
          new Date(company.jobsUpdated) >= new Date(Date.now() - 24 * 60 * 60 * 1000)); // Within last 24 hours

      return matchesSearch && matchesLinkedIn && matchesRecent;
    });
  }, [companies, searchQuery, showLinkedInOnly, showRecentlyUpdated]);

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
          </div>
          <SidebarInput
            placeholder="Type to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-sm">
              <Switch
                className="shadow-none"
                checked={showLinkedInOnly}
                onCheckedChange={setShowLinkedInOnly}
              />
              <span>LinkedIn Jobs</span>
            </Label>
            <Label className="flex items-center gap-2 text-sm">
              <Switch
                className="shadow-none"
                checked={showRecentlyUpdated}
                onCheckedChange={setShowRecentlyUpdated}
              />
              <span>Updated in last 24h</span>
            </Label>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0 pt-0">
            <SidebarGroupContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                filteredCompanies?.map((company, index) => {
                  const isActive = pathname === `/dashboard/companies/${company.slug}`;
                  return (
                    <Link
                      href={`/dashboard/companies/${company.slug}`}
                      key={company.slug + index}
                      className={`flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        isActive ? 'bg-primary text-white hover:bg-primary/95 hover:text-white' : ''
                      }`}
                    >
                      <div className="flex flex-col w-full gap-2">
                        <div className="flex w-full gap-2 leading-none items-center justify-between">
                          <span className="font-bold truncate">{company.name}</span>{' '}
                          <span className="ml-auto text-xs">
                            Updated:{' '}
                            {company.jobsUpdated
                              ? formatDistanceToNow(new Date(company.jobsUpdated), {
                                  addSuffix: false,
                                })
                              : 'Never'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>
                            {company.jobsCount} {company.jobsCount === 1 ? 'Job' : 'Jobs'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
