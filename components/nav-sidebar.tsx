"use client";
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
} from "@/components/ui/sidebar";
import { Command, Building, Loader2 } from "lucide-react";
import React from "react";
import { NavUser } from "./nav-user";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import Link from "next/link";

// Define the CSV row type based on the actual CSV structure
interface CSVRow {
  Company: string;
  "Employer/Aggregator": string;
  Priority: string;
  Checked: string;
  JBoard: string;
  "Job Listing (1)": string;
  "Job Listing (2)": string;
  Status: string;
  Issue: string;
  "Search term alt protein": string;
  "Additional data / notes": string;
  "Company's general website": string;
}

// Define the Company type to match the structure we need
interface Company {
  email: string;
  name: string;
  date: string;
  subject: string;
  teaser: string;
}

// Initial sample data
const initialData = {
  user: {
    name: "Noga",
    email: "noga@altproteincareers.com",
    avatar: "/avatars/noga.jpeg",
  },
  navMain: [
    {
      title: "Companies",
      url: "#",
      icon: Building,
      isActive: true,
    },
  ],
  companies: [] as Company[], // Type the companies array
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(initialData.navMain[0]);
  const [companies, setCompanies] = React.useState<Company[]>(
    initialData.companies
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const { setOpen } = useSidebar();

  React.useEffect(() => {
    async function loadCompanies() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/companies?limit=50");
        const csvData = (await response.json()) as CSVRow[];

        const mappedCompanies: Company[] = csvData
          .filter((row) => row["Company"]?.trim())
          .map((row: CSVRow) => ({
            email: row["Company"]?.toLowerCase().replace(/\s+/g, "-") || "",
            name: row["Company"]?.trim() || "Unknown Company",
            date: row["Checked"] || new Date().toLocaleDateString(),
            subject: row["Priority"]
              ? `Priority ${row["Priority"]}`
              : "Standard",
            teaser:
              [
                row["Additional data / notes"],
                row["Company's general website"],
                row["Status"],
              ]
                .filter(Boolean)
                .join(" - ") || "No additional information available",
          }));

        console.log(mappedCompanies);
        setCompanies(mappedCompanies);
      } catch (error) {
        console.error("Failed to load companies:", error);
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
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Altprotein Careers
                    </span>
                    <span className="truncate text-xs">Altprotein</span>
                  </div>
                </a>
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
                        const shuffledCompanies = [...companies].sort(
                          () => Math.random() - 0.5
                        );
                        setCompanies(
                          shuffledCompanies.slice(
                            0,
                            Math.max(5, Math.floor(Math.random() * 10) + 1)
                          )
                        );
                        setOpen(true);
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
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

      <Sidebar
        collapsible="none"
        className="hidden flex-1 md:flex overflow-hidden"
      >
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
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
                    href={`/dashboard/companies/${company.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    key={company.name + index}
                    className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <div className="flex w-full items-center gap-2">
                      <span>{company.name}</span>{" "}
                      <span className="ml-auto text-xs">
                        Last checked: {company.date}
                      </span>
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
