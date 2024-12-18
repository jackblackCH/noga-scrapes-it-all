export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Application Status</h3>
          <div className="mt-4 h-[200px] w-full">
            <div className="flex h-full flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Applied</span>
                <div className="h-2 w-3/4 rounded bg-blue-100">
                  <div className="h-full w-[65%] rounded bg-blue-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Interview</span>
                <div className="h-2 w-3/4 rounded bg-green-100">
                  <div className="h-full w-[40%] rounded bg-green-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rejected</span>
                <div className="h-2 w-3/4 rounded bg-red-100">
                  <div className="h-full w-[25%] rounded bg-red-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Offer</span>
                <div className="h-2 w-3/4 rounded bg-purple-100">
                  <div className="h-full w-[15%] rounded bg-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Company Size Distribution</h3>
          <div className="mt-4 h-[200px] w-full">
            <div className="flex h-full items-end justify-between gap-2">
              <div className="flex w-full flex-col items-center gap-2">
                <div className="h-[60%] w-8 rounded bg-blue-500" />
                <span className="text-xs text-muted-foreground">Startup</span>
              </div>
              <div className="flex w-full flex-col items-center gap-2">
                <div className="h-[80%] w-8 rounded bg-blue-500" />
                <span className="text-xs text-muted-foreground">SMB</span>
              </div>
              <div className="flex w-full flex-col items-center gap-2">
                <div className="h-[100%] w-8 rounded bg-blue-500" />
                <span className="text-xs text-muted-foreground">Enterprise</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Response Time</h3>
          <div className="mt-4 h-[200px] w-full">
            <div className="relative h-full w-full">
              <div className="absolute bottom-0 left-0 h-[30%] w-full rounded-t bg-green-500 opacity-20" />
              <div className="absolute bottom-[30%] left-0 h-[40%] w-full rounded-t bg-yellow-500 opacity-20" />
              <div className="absolute bottom-[70%] left-0 h-[30%] w-full rounded-t bg-red-500 opacity-20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">72h</span>
                <span className="text-sm text-muted-foreground">Average Response</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <h3 className="font-semibold">Recent Activity</h3>
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={`test-${i}`} className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm">New application submitted</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
