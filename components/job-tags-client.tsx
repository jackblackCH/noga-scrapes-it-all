'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
type Category = {
  name: string;
  image: string;
  active: boolean;
  featured: boolean;
};

interface JobTagsClientProps {
  categories: Category[];
}

export function JobTagsClient({ categories }: JobTagsClientProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handlePrevCard = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / (window.innerWidth >= 640 ? 4 : 2);
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleNextCard = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / (window.innerWidth >= 640 ? 4 : 2);
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (!scrollContainerRef.current) return;

    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Get all categories with wrapping
  const displayCategories = [...categories, ...categories.slice(0, 3)];

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 px-10 overflow-x-auto 
          scroll-smooth scrollbar-hide
          snap-x snap-mandatory
          transition-transform duration-300 ease-out
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          scrollSnapType: 'x mandatory',
          scrollPadding: '0 1rem',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {displayCategories.map((tag, index) => (
          <Card
            key={`${tag.name}-${index}`}
            className={`snap-start shrink-0 w-[calc(50%-8px)] sm:w-[calc(25%-12px)] p-4 text-center 
              scroll-margin-4
              transition-all duration-300 ease-in-out hover:shadow-lg
              ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            <Image
              className="inline-block pointer-events-none aspect-square object-contain transform transition-transform duration-300 group-hover:scale-105"
              src={tag.image}
              alt={tag.name}
              width={56}
              height={56}
            />
            <h3 className="mt-4 mb-1 font-medium">{tag.name}</h3>
            <Link
              href={`/jobs?category=${tag.name}`}
              className="mt-2 text-sm text-muted-foreground hover:underline cursor-pointer transition-colors duration-200"
            >
              View jobs
            </Link>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 opacity-80 hover:opacity-100"
        onClick={handlePrevCard}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 opacity-80 hover:opacity-100"
        onClick={handleNextCard}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
