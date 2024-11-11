'use client';

import { usePathname } from 'next/navigation';
import { SidebarMenuButton } from '../ui/sidebar';

export interface SidebarItem {
  title: string;
  icon: React.ReactNode;
}

export default function SidebarItem({ title, icon }: SidebarItem) {
  const pathname = usePathname();
  const isActive = pathname.includes(title.toLowerCase());
  return (
    <div>
      <SidebarMenuButton
        tooltip={{
          children: title,
          hidden: false,
        }}
        isActive={isActive}
        className={isActive ? '!bg-primary !text-sidebar-primary-foreground' : ''}
      >
        {icon}
        <span>{title}</span>
      </SidebarMenuButton>
    </div>
  );
}
