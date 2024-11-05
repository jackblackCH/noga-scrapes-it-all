import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <a className="mr-6" href="/">
          <Logo />
        </a>
        <nav className="flex flex-1 items-center justify-center gap-4 text-sm">
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="#"
          >
            NOW IN EUROPE
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/jobs"
          >
            Search Jobs
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/blog"
          >
            Resources
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/podcast"
          >
            Podcast
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/interview-prep"
          >
            Interview Prep
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="/about"
          >
            About
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="https://www.altproteinpartners.com/"
            target="_blank"
          >
            For Employers
          </a>
        </nav>
        <Button className="ml-auto bg-emerald-700 hover:bg-emerald-800">
          Post a job
        </Button>
      </div>
    </header>
  );
}

export default function WebLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <Header />

      <div className="container mx-auto p-4">{children}</div>
    </section>
  );
}
