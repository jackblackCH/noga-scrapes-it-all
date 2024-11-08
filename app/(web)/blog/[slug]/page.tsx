import { Suspense } from 'react';
import { blogPosts } from '../BlogGrid';
import Markdown from 'react-markdown';

async function MarkdownContent({ url }: { url: string }) {
  const markdown = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
    headers: {
      Authorization: `Bearer jina_c3d7737e925143e2908b8af33553178a3kA7-4j9ux9p7-fBxkZDRkbMbsme`,
      'X-Return-Format': 'markdown',
      'X-Remove-Selector': 'header, .modal, footer, h1',
    },
    next: {
      revalidate: 300, // Cache for 5 minutes
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch markdown content');
    return res.text();
  });
  // Remove any title that starts with "Title: " from the markdown
  const cleanedMarkdown = markdown.replace(/^Title: .*\n/m, '').replace(/- AltProteinCareers/g, '');

  return (
    <Markdown
      components={{
        h1: ({ ...props }) => <h2 className="text-3xl font-bold mb-6" {...props} />,
        h2: ({ ...props }) => <h3 className="text-2xl font-semibold mb-4" {...props} />,
        h3: ({ ...props }) => <h4 className="text-xl font-medium mb-3" {...props} />,
        p: ({ ...props }) => <p className="text-gray-700 mb-4 leading-relaxed" {...props} />,
        ul: ({ ...props }) => <ul className="mb-4 space-y-2" {...props} />,
        ol: ({ ...props }) => <ol className="mb-4 space-y-2" {...props} />,
        li: ({ ...props }) => <li className="text-gray-700" {...props} />,
        em: ({ ...props }) => <i className="text-red-600 font-medium" {...props} />,
        strong: ({ ...props }) => <strong className="font-bold" {...props} />,
        blockquote: ({ ...props }) => (
          <blockquote className="border-l-4 border-gray-200 pl-4 my-4 italic" {...props} />
        ),
        a: ({ ...props }) => (
          <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
        ),
      }}
    >
      {cleanedMarkdown}
    </Markdown>
  );
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const blogPost = blogPosts.find((post) => post.slug === params.slug);

  if (!blogPost) {
    return <div>Blog post not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        }
      >
        <MarkdownContent url={blogPost.originalUrl} />
      </Suspense>
    </div>
  );
}
