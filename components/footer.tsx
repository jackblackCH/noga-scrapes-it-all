'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full text-sm">
      <div className="w-full bg-[#FFD84D] p-4">
        <div className="flex max-w-screen-md mx-auto flex-col gap-2 items-center md:flex-row md:gap-4">
          <div className="flex items-center gap-2">
            <span>Get a</span>
            <Select defaultValue="daily">
              <SelectTrigger className="w-[100px] bg-white">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-4 items-center md:flex-row">
              <span className="text-center sm:text-left">
                email of all new jobs in this category
              </span>
              <div className="flex flex-1 items-center gap-2">
                <Input className="flex-1 bg-white" placeholder="Enter email address" type="email" />
                <Button className="bg-[#1B4332] text-white hover:bg-[#1B4332]/90">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#1C1F1E] py-4 text-white">
        <div className="max-w-screen-md mx-auto flex flex-col items-center justify-center gap-4 px-4 text-sm sm:flex-row">
          <div className="flex items-center gap-2">
            <Link href="/community" className="hover:underline">
              Join the Community
            </Link>
            <span>•</span>
            <Link href="/linkedin" className="hover:underline">
              LinkedIn
            </Link>
          </div>
          <div className="text-center">© 2024 AltProteinCareers</div>
        </div>
      </div>
    </footer>
  );
}
