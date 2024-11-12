'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { Job } from '@/app/types/job';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type Filters = {
  searchTerm: string;
  category: string;
  postedAt: string;
  location: string;
  radius: string;
  remoteOnly: boolean;
  sortBy: string;
};

const JobCard: React.FC<{ job: Job }> = React.memo(({ job }) => (
  <Link href={`/companies/${job.companySlug}/jobs/${job.slug}`}>
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded mr-4 bg-emerald-700" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">
              {job.company} • {job.location}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {job?.tags?.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-200 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500 flex items-center whitespace-nowrap">
            <Clock className="w-4 h-4 mr-1" />
            {job.dateUpdated
              ? formatDistanceToNow(new Date(job.dateUpdated), { addSuffix: true })
              : 'more than 24 hours ago'}
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
));

JobCard.displayName = 'JobCard';

const FilterSidebar: React.FC<{
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string | boolean) => void;
}> = React.memo(({ filters, onFilterChange }) => (
  <Card className="p-4 sticky top-4">
    <h2 className="text-lg font-semibold mb-4">Filter</h2>
    <div className="space-y-4">
      <div>
        <label htmlFor="search-term" className="block text-sm font-medium text-gray-700">
          Skill, company, role...
        </label>
        <Input
          id="search-term"
          type="text"
          placeholder="e.g. Product Manager"
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange('category', value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Job function..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Business Development">Business Development</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="posted-at" className="block text-sm font-medium text-gray-700">
          Posted At
        </label>
        <Select
          value={filters.postedAt}
          onValueChange={(value) => onFilterChange('postedAt', value)}
        >
          <SelectTrigger id="posted-at">
            <SelectValue placeholder="Any time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any time</SelectItem>
            <SelectItem value="1d">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <Input
          id="location"
          type="text"
          placeholder="e.g. London"
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="radius" className="block text-sm font-medium text-gray-700">
          Radius
        </label>
        <Select value={filters.radius} onValueChange={(value) => onFilterChange('radius', value)}>
          <SelectTrigger id="radius">
            <SelectValue placeholder="within 25 km" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">within 25 km</SelectItem>
            <SelectItem value="50">within 50 km</SelectItem>
            <SelectItem value="100">within 100 km</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center">
        <Checkbox
          id="remote"
          checked={filters.remoteOnly}
          onCheckedChange={(checked) => onFilterChange('remoteOnly', checked as boolean)}
        />
        <label htmlFor="remote" className="ml-2 text-sm text-gray-700">
          Only remote jobs
        </label>
      </div>
      <div>
        <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700">
          Sort By
        </label>
        <Select value={filters.sortBy} onValueChange={(value) => onFilterChange('sortBy', value)}>
          <SelectTrigger id="sort-by">
            <SelectValue placeholder="Relevance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="salary">Salary</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </Card>
));

FilterSidebar.displayName = 'FilterSidebar';

export default function JobBoard() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    category: 'all',
    postedAt: 'any',
    location: '',
    radius: '',
    remoteOnly: false,
    sortBy: 'relevance',
  });

  const handleFilterChange = useCallback((key: keyof Filters, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchMatch =
        job.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        false ||
        job.company?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        false ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(filters.searchTerm.toLowerCase())
        ) ||
        false;
      const categoryMatch =
        filters.category === 'all' || job.tags?.includes(filters.category) || false;
      const locationMatch =
        !filters.location ||
        job.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
        false;
      const remoteMatch =
        !filters.remoteOnly || job.type?.toLowerCase().includes('remote') || false;
      return searchMatch && categoryMatch && locationMatch && remoteMatch;
    });
  }, [filters, jobs]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/companies/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data);
        setIsLoading(false);
      } catch (error) {
        console.error('JobsWithFilter: Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 space-y-4">
          {filteredJobs.map((job, index) => (
            <JobCard key={job.title + '-' + index} job={job} />
          ))}
          {filteredJobs.length === 0 && <div>No jobs available</div>}
        </div>
        <div className="lg:w-1/4">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </div>
    </>
  );
}
