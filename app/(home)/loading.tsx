import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="relative">
          <div className="h-48 w-full bg-gray-200 animate-pulse" />
          <div className="max-w-6xl mx-auto relative px-4 py-16 text-center">
            <div className="h-8 w-96 mx-auto bg-gray-200 animate-pulse mb-4" />
            <div className="h-6 w-80 mx-auto bg-gray-200 animate-pulse" />
            <div className="mx-auto mt-8 max-w-3xl rounded-lg bg-white p-4 shadow-lg">
              <div className="flex flex-col gap-4 md:flex-row">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
