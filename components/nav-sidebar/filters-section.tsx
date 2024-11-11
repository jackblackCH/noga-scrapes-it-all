'use client';

import { SidebarInput } from '@/components/ui/sidebar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function FiltersSection({
  searchQuery,
  setSearchQuery,
  showLinkedInOnly,
  setShowLinkedInOnly,
  showRecentlyUpdated,
  setShowRecentlyUpdated,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showLinkedInOnly: boolean;
  setShowLinkedInOnly: (show: boolean) => void;
  showRecentlyUpdated: boolean;
  setShowRecentlyUpdated: (show: boolean) => void;
}) {
  return (
    <>
      <SidebarInput
        placeholder="Type to search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <Label className="flex items-center gap-2 text-sm">
          <Switch
            className="shadow-none"
            checked={showLinkedInOnly}
            onCheckedChange={setShowLinkedInOnly}
          />
          <span>LinkedIn Jobs</span>
        </Label>
        <Label className="flex items-center gap-2 text-sm">
          <Switch
            className="shadow-none"
            checked={showRecentlyUpdated}
            onCheckedChange={setShowRecentlyUpdated}
          />
          <span>Updated in last 24h</span>
        </Label>
      </div>
    </>
  );
}
