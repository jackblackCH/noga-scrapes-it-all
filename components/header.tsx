"use client";

import { Button } from "./ui/button";
import { Menu, ExternalLink, X } from "lucide-react";
import Logo from "./logo";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 items-center px-4 lg:container">
        <Link href="/" className="mr-4">
          <Logo />
        </Link>

        {/* Mobile menu button */}
        <button
          className="ml-auto md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden text-xs lg:text-sm md:flex flex-1 items-center justify-center gap-4">
          <Link
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/europe"
          >
            NOW IN EUROPE
          </Link>
          <Link
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/jobs"
          >
            Search Jobs
          </Link>
          <Link
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/blog"
          >
            Resources
          </Link>
          <Link
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/podcast"
          >
            Podcast
          </Link>
          <Link
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/interview-prep"
          >
            Interview Prep
          </Link>
          <Link
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/about"
          >
            About
          </Link>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground inline-flex items-center gap-1"
            href="https://www.altproteinpartners.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            For Employers
            <ExternalLink className="h-4 w-4" />
          </a>
        </nav>

        {/* Mobile navigation */}
        <div
          className={`fixed z-10 inset-x-0 top-16 bg-background border-b p-4 lg:hidden ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <nav className="flex flex-col space-y-4 text-xs">
            <Link
              className="text-foreground/60 transition-colors hover:text-foreground"
              href="/europe"
              onClick={() => setIsMenuOpen(false)}
            >
              NOW IN EUROPE
            </Link>
            <Link
              className="text-foreground/60 transition-colors hover:text-foreground"
              href="/jobs"
              onClick={() => setIsMenuOpen(false)}
            >
              Search Jobs
            </Link>
            <Link
              className="text-foreground/60 transition-colors hover:text-foreground"
              href="/blog"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              className="text-foreground/60 transition-colors hover:text-foreground"
              href="/podcast"
              onClick={() => setIsMenuOpen(false)}
            >
              Podcast
            </Link>
            <Link
              className="text-foreground/60 transition-colors hover:text-foreground"
              href="/interview-prep"
              onClick={() => setIsMenuOpen(false)}
            >
              Interview Prep
            </Link>
            <Link
              className="text-foreground/60 transition-colors hover:text-foreground"
              href="/about"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <a
              className="text-foreground/60 transition-colors hover:text-foreground inline-flex items-center gap-1"
              href="https://www.altproteinpartners.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              For Employers
              <ExternalLink className="h-4 w-4" />
            </a>
          </nav>
        </div>

        <Link href="/post-a-job" className="hidden md:block ml-auto">
          <Button className="bg-emerald-700 hover:bg-emerald-800">
            Post a job
          </Button>
        </Link>
      </div>
    </header>
  );
}
