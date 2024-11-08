import { format } from 'date-fns';
import { ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
  originalUrl: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "We've Expanded to Europe!✈️",
    excerpt:
      "We're thrilled to announce that we've expanded our job board and recruiting services to Europe! Search all Europe-based jobs 🌍",
    date: '2024-10-01',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-07%20at%2015.37.02-e76eja9XwJrd0xJ0iStIbTn72WHxYJ.jpeg',
    slug: 'expanded-to-europe',
    originalUrl: 'https://altproteincareers.com/blog/Now-in-Europe',
  },
  {
    id: 2,
    title: 'Join the Community',
    excerpt:
      'Join the Alt Protein Careers community. Add yourself to our database of professionals and our recruiting team will out to you directly...',
    date: '2024-09-28',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-07%20at%2015.37.02-e76eja9XwJrd0xJ0iStIbTn72WHxYJ.jpeg',
    slug: 'join-community',
    originalUrl: 'https://altproteincareers.com/blog/Join-the-Community',
  },
  {
    id: 3,
    title: 'Recommended Reads',
    excerpt:
      "We've carefully selected this list of books, each one read and vetted by our team, to help you sharpen your skills in the alternative protein...",
    date: '2024-08-17',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-07%20at%2015.37.02-e76eja9XwJrd0xJ0iStIbTn72WHxYJ.jpeg',
    slug: 'recommended-reads',
    originalUrl: 'https://altproteincareers.com/blog/Recommended-Reads',
  },
  {
    id: 4,
    title: 'Where to Start – Your Roadmap to a Career in Alternative Proteins',
    excerpt:
      "Changing your career path can be intimidating – especially when you're eyeing a move into a dynamic industry like alternative proteins. But...",
    date: '2024-07-01',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-07%20at%2015.37.02-e76eja9XwJrd0xJ0iStIbTn72WHxYJ.jpeg',
    slug: 'career-roadmap',
    originalUrl: 'https://altproteincareers.com/blog/Where-to-Start',
  },
  {
    id: 5,
    title: 'Our messed up meat industry',
    excerpt:
      'Shimoi Kaira is in her first year of high school in Toronto. As a fellow at Alt-Protein Careers, she is excited to be working on reshaping public...',
    date: '2024-05-16',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-07%20at%2015.37.02-e76eja9XwJrd0xJ0iStIbTn72WHxYJ.jpeg',
    slug: 'meat-industry',
    originalUrl: 'https://altproteincareers.com/blog/Our-messed-up-meat-industry',
  },
  {
    id: 6,
    title: 'Resume Templates',
    excerpt:
      'Download one of these resume templates optimized for the alt protein industry for a head start on consistent formatting and...',
    date: '2024-04-18',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-07%20at%2015.37.02-e76eja9XwJrd0xJ0iStIbTn72WHxYJ.jpeg',
    slug: 'resume-templates',
    originalUrl: 'https://altproteincareers.com/blog/Resume-Templates',
  },
  {
    id: 7,
    title: 'Is 2024 the Year of "Climate-Quitting"?',
    excerpt:
      'Is 2024 the Year of "Climate-Quitting"? Job Seekers Prioritize Impact Over Traditional Perks: Alt Protein Careers launches career...',
    date: '2024-03-12',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-07%20at%2015.37.02-e76eja9XwJrd0xJ0iStIbTn72WHxYJ.jpeg',
    slug: 'climate-quitting',
    originalUrl: 'https://altproteincareers.com/blog/Is-2024-the-Year-of-Climate-Quitting',
  },
  {
    id: 8,
    title: 'Podcast Launch & Other News🎤',
    excerpt:
      "We're excited to announce the public launch today of our podcast series, Alt Protein Careers with Sam Fisher! This limited-series podcast...",
    date: '2024-03-12',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-07%20at%2015.37.02-e76eja9XwJrd0xJ0iStIbTn72WHxYJ.jpeg',
    slug: 'podcast-launch',
    originalUrl: 'https://altproteincareers.com/blog/Podcast-Launch',
  },
  {
    id: 9,
    title: 'Why Food Matters in Taking Climate Action',
    excerpt:
      'Food production is bad for the planet. Especially animal agriculture.&nbsp; Nearly one-third of global greenhouse gas emissions...',
    date: '2024-03-06',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-11-07%20at%2015.37.02-e76eja9XwJrd0xJ0iStIbTn72WHxYJ.jpeg',
    slug: 'food-climate-action',
    originalUrl: 'https://altproteincareers.com/blog/Why-Food-Matters-in-Taking-Climate-Action',
  },
];

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="flex flex-col overflow-hidden group bg-white shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={post.image}
          width={250}
          height={250}
          alt={`Cover image for ${post.title}`}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader className="flex-1">
        <h2 className="text-xl font-semibold leading-tight mb-2 text-gray-800">{post.title}</h2>
        <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
      </CardHeader>
      <CardContent className="flex items-center text-sm text-gray-500">
        <Clock className="w-4 h-4 mr-1" />
        {format(new Date(post.date), 'MMMM d')}
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          className="p-0 h-auto font-semibold text-emerald-700 hover:text-emerald-800"
          asChild
        >
          <a href={`/blog/${post.slug}`} className="flex items-center">
            Read more
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function BlogGrid() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
