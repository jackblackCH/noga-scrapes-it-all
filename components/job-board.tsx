"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Beaker,
  BarChart3,
} from "lucide-react";

const jobsData = [
  {
    id: 1,
    title: "Senior Process Engineer (Fermentation)",
    company: "Adams Foods",
    location: "United Kingdom",
    logo: "https://placehold.co/48",
    postedAgo: "1w ago",
    tags: ["Bioprocess", "Food Science", "Manufacturing", "Europe"],
  },
  {
    id: 2,
    title: "Research Scientist - Plant-Based Proteins",
    company: "GreenEats Inc.",
    location: "Netherlands",
    logo: "https://placehold.co/48",
    postedAgo: "3d ago",
    tags: ["R&D", "Food Science", "Protein Chemistry", "Europe"],
  },
  {
    id: 3,
    title: "Marketing Manager - Alternative Meats",
    company: "Future Foods Co.",
    location: "Germany",
    logo: "https://placehold.co/48",
    postedAgo: "5d ago",
    tags: ["Marketing", "Brand Management", "Food Industry", "Europe"],
  },
  {
    id: 4,
    title: "Quality Assurance Specialist",
    company: "PurePro Labs",
    location: "France",
    logo: "https://placehold.co/48",
    postedAgo: "2w ago",
    tags: ["Quality Control", "Food Safety", "Regulatory Compliance", "Europe"],
  },
  {
    id: 5,
    title: "Supply Chain Analyst - Sustainable Sourcing",
    company: "EcoNutrition",
    location: "Spain",
    logo: "https://placehold.co/48",
    postedAgo: "4d ago",
    tags: ["Supply Chain", "Sustainability", "Data Analysis", "Europe"],
  },
];

function JobList() {
  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl font-bold">Latest Jobs</h2>
      <div className="mt-6 space-y-4">
        {jobsData.map((job) => (
          <Card key={job.id} className="p-4">
            <div className="flex items-start gap-4">
              {job.logo && (
                <Image
                  loading="lazy"
                  alt={`${job.company} logo`}
                  className="h-12 w-12 rounded-full object-cover"
                  src={job.logo}
                  width={48}
                  height={48}
                  unoptimized
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {job.postedAgo}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Button key={tag} variant="outline" size="sm">
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function JobBoard() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0">
            <Image
              alt="Forest aerial view"
              className="h-full w-full object-cover"
              src="/bg.png"
              priority
              width={1200}
              height={48}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="container mx-auto relative px-4 py-16 text-center">
            <h1 className="text-4xl font-bold md:text-4xl text-white">
              Do something that matters.
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Make an impact. Find a job with meaning in the alternative protein
              industry.
            </p>
            <div className="mx-auto mt-8 max-w-3xl rounded-lg bg-white p-4 shadow-lg">
              <form className="flex flex-col gap-4 md:flex-row">
                <Input
                  className="flex-1"
                  placeholder="Skill, company, role..."
                />
                <Select>
                  <SelectTrigger className="w-full md:w-[200px] text-gray-500">
                    <SelectValue placeholder="Job function..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="flex-1" placeholder="Location" />
                <Button className="bg-emerald-700 hover:bg-emerald-800">
                  Search
                </Button>
              </form>
              <div className="mt-2 flex items-center gap-2">
                <Checkbox id="remote" />
                <label className="text-sm text-gray-600" htmlFor="remote">
                  Only remote jobs
                </label>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-12">
          <div className="relative">
            <div className="flex gap-4 overflow-hidden">
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Card className="flex-1 p-6 text-center">
                <Briefcase className="mx-auto h-8 w-8" />
                <h3 className="mt-4 font-medium">Executive-level roles</h3>
                <p className="mt-2 text-sm text-muted-foreground">15 jobs</p>
              </Card>
              <Card className="flex-1 p-6 text-center">
                <GraduationCap className="mx-auto h-8 w-8" />
                <h3 className="mt-4 font-medium">Good for Recent Grads</h3>
                <p className="mt-2 text-sm text-muted-foreground">73 jobs</p>
              </Card>
              <Card className="flex-1 p-6 text-center">
                <Beaker className="mx-auto h-8 w-8" />
                <h3 className="mt-4 font-medium">Food Science</h3>
                <p className="mt-2 text-sm text-muted-foreground">56 jobs</p>
              </Card>
              <Card className="flex-1 p-6 text-center">
                <BarChart3 className="mx-auto h-8 w-8" />
                <h3 className="mt-4 font-medium">Marketing & Sales</h3>
                <p className="mt-2 text-sm text-muted-foreground">162 jobs</p>
              </Card>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <JobList />
      </main>
    </div>
  );
}
