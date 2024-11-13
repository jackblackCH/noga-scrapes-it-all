'use client';

import React, { useMemo } from 'react';
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
import { useQueryState } from 'nuqs';

import { Job } from '@/app/types/job';

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
                <Link
                  href={`/jobs?category=${encodeURIComponent(tag)}`}
                  key={index}
                  className="px-2 py-1 bg-gray-200 text-sm rounded-full hover:bg-gray-300 transition-colors"
                >
                  {tag}
                </Link>
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

interface FilterSidebarProps {
  filters: {
    searchTerm: string;
    category: string;
    postedAt: string;
    location: string;
    radius: string;
    remoteOnly: boolean;
    sortBy: string;
  };
  onFilterChange: (key: string, value: string | boolean) => void;
  categories: { name: string }[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = React.memo(
  ({ filters, onFilterChange, categories }) => (
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
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
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
  )
);

FilterSidebar.displayName = 'FilterSidebar';

interface JobsWithFilterProps {
  initialJobs: Job[];
  categories: { name: string }[];
}

export default function JobsWithFilter({ initialJobs, categories }: JobsWithFilterProps) {
  const [searchTerm, setSearchTerm] = useQueryState('search');
  const [category, setCategory] = useQueryState('category', { defaultValue: 'all' });
  const [postedAt, setPostedAt] = useQueryState('posted', { defaultValue: 'any' });
  const [location, setLocation] = useQueryState('location');
  const [radius, setRadius] = useQueryState('radius');
  const [remoteOnly, setRemoteOnly] = useQueryState('remote', {
    parse: (value) => value === 'true',
    serialize: (value) => value.toString(),
  });
  const [sortBy, setSortBy] = useQueryState('sort', { defaultValue: 'relevance' });

  const filters = {
    searchTerm: searchTerm || '',
    category,
    postedAt,
    location: location || '',
    radius: radius || '',
    remoteOnly: remoteOnly || false,
    sortBy,
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    switch (key) {
      case 'searchTerm':
        setSearchTerm(value as string);
        break;
      case 'category':
        setCategory(value as string);
        break;
      case 'postedAt':
        setPostedAt(value as string);
        break;
      case 'location':
        setLocation(value as string);
        break;
      case 'radius':
        setRadius(value as string);
        break;
      case 'remoteOnly':
        setRemoteOnly(value as boolean);
        break;
      case 'sortBy':
        setSortBy(value as string);
        break;
    }
  };

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const searchMatch =
        !searchTerm ||
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const categoryMatch = category === 'all' || job.tags?.includes(category);
      const locationMatch =
        !location || job.location?.toLowerCase().includes(location.toLowerCase());
      const remoteMatch = !remoteOnly || job.type?.toLowerCase().includes('remote');
      return searchMatch && categoryMatch && locationMatch && remoteMatch;
    });
  }, [searchTerm, category, location, remoteOnly, initialJobs]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-3/4 space-y-4">
        {filteredJobs.map((job, index) => (
          <JobCard key={job.title + '-' + index} job={job} />
        ))}
        {filteredJobs.length === 0 && <div>No jobs available</div>}
      </div>
      <div className="lg:w-1/4">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
        />
      </div>
    </div>
  );
}
