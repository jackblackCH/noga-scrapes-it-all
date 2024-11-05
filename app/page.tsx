import { JobBoard } from "@/components/job-board";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <a className="mr-6" href="#">
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
            href="#"
          >
            Search Jobs
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="#"
          >
            Resources
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="#"
          >
            Podcast
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="#"
          >
            Interview Prep
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="#"
          >
            About
          </a>
          <a
            className="text-foreground/60 transition-colors hover:text-foreground"
            href="#"
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

export default function Home() {
  return (
    <div>
      <Header />
      <JobBoard />
    </div>
  );
}
