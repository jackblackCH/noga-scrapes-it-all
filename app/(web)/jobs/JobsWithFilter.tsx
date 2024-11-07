'use client';

import React, { useState, useMemo, useCallback } from 'react';
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

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  salary: string;
  type: string;
  description: string;
  url: string;
  logo: string;
  tags: string[];
  postedAt: string;
};

type Filters = {
  searchTerm: string;
  category: string;
  postedAt: string;
  location: string;
  radius: string;
  remoteOnly: boolean;
  sortBy: string;
};

const jobsData: Job[] = [
  {
    id: 1,
    title: 'Account Manager (Europe)',
    company: 'Novonesis',
    location: 'Lyngby, Denmark',
    experience: 'Mid-level',
    skills: ['Account Management', 'Business Development'],
    salary: '$60,000 - $80,000',
    type: 'Full-time',
    description: 'We are seeking an experienced Account Manager to join our European team...',
    url: '#',
    logo: '/placeholder.svg?height=40&width=40',
    tags: ['Account Management', 'Business Development', 'Europe'],
    postedAt: '4h ago',
  },
  {
    id: 2,
    title: 'Third Party Cyber Risk Manager',
    company: 'Novonesis',
    location: 'Kuala Lumpur, Malaysia',
    experience: 'Senior',
    skills: ['Cyber Security', 'Risk Management'],
    salary: '$80,000 - $100,000',
    type: 'Full-time',
    description:
      'Join our team as a Third Party Cyber Risk Manager to oversee and mitigate risks...',
    url: '#',
    logo: '/placeholder.svg?height=40&width=40',
    tags: ['Cyber Security', 'Risk Management'],
    postedAt: '13h ago',
  },
  {
    id: 3,
    title: 'Senior Risk Manager',
    company: 'Novonesis',
    location: 'Kuala Lumpur, Malaysia',
    experience: 'Senior',
    skills: ['Risk Management', 'Financial Analysis'],
    salary: '$90,000 - $120,000',
    type: 'Full-time',
    description:
      "We're looking for a Senior Risk Manager to lead our risk assessment and mitigation strategies...",
    url: '#',
    logo: '/placeholder.svg?height=40&width=40',
    tags: ['Senior / Director level', 'Risk Management'],
    postedAt: '13h ago',
  },
  {
    id: 4,
    title: 'Senior Industry Technology Specialist',
    company: 'Novonesis',
    location: 'Bangalore, India',
    experience: 'Senior',
    skills: ['Industry 4.0', 'IoT', 'Data Analytics'],
    salary: '$70,000 - $100,000',
    type: 'Full-time',
    description:
      'Join us as a Senior Industry Technology Specialist to drive technological innovation...',
    url: '#',
    logo: '/placeholder.svg?height=40&width=40',
    tags: ['Technology', 'Senior / Director level'],
    postedAt: '13h ago',
  },
  {
    id: 5,
    title: 'Production Coordinator, Production Scheduling',
    company: 'Novonesis',
    location: 'Kalundborg, Denmark',
    experience: 'Mid-level',
    skills: ['Production Planning', 'Supply Chain Management'],
    salary: '$50,000 - $70,000',
    type: 'Full-time',
    description:
      'We are seeking a Production Coordinator to optimize our production scheduling in Kalundborg...',
    url: '#',
    logo: '/placeholder.svg?height=40&width=40',
    tags: ['Manufacturing', 'Logistics', 'Europe'],
    postedAt: '13h ago',
  },
];

const JobCard: React.FC<{ job: Job }> = React.memo(({ job }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex items-start">
        <div className="w-12 h-12 rounded mr-4 bg-emerald-700" />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p className="text-gray-600">
            {job.company} • {job.location}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-200 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-500 flex items-center whitespace-nowrap">
          <Clock className="w-4 h-4 mr-1" />
          {job.postedAt}
        </div>
      </div>
    </CardContent>
  </Card>
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
          placeholder="e.g. engineer"
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
    return jobsData.filter((job) => {
      const searchMatch =
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      const categoryMatch = filters.category === 'all' || job.tags.includes(filters.category);
      const locationMatch =
        !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
      const remoteMatch = !filters.remoteOnly || job.type.toLowerCase().includes('remote');
      return searchMatch && categoryMatch && locationMatch && remoteMatch;
    });
  }, [filters]);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 space-y-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <div className="lg:w-1/4">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </div>
    </>
  );
}
