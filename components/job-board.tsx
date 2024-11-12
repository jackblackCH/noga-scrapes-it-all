import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Beaker,
  BarChart3,
} from 'lucide-react';

import { Suspense } from 'react';
import JobList from './job-list';

export async function JobBoard() {
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
          <div className="max-w-6xl mx-auto relative px-4 py-16 text-center">
            <h1 className="text-4xl font-bold md:text-4xl text-white">
              Do something that matters.
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Make an impact. Find a job with meaning in the alternative protein industry.
            </p>
            <div className="mx-auto mt-8 max-w-3xl rounded-lg bg-white p-4 shadow-lg">
              <form className="flex flex-col gap-4 md:flex-row">
                <Input className="flex-1" placeholder="Skill, company, role..." />
                <Select>
                  <SelectTrigger className="w-full text-base md:w-[200px] text-gray-500">
                    <SelectValue placeholder="Job function..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="flex-1" placeholder="Location" />
                <Button className="bg-emerald-700 hover:bg-emerald-800">Search</Button>
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
        <section className="max-w-6xl mx-auto px-4 py-12">
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
        <section className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">Latest Jobs</h2>
          <Suspense
            fallback={
              <div className="rounded-lg border bg-card p-6">
                <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
              </div>
            }
          >
            <JobList />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
