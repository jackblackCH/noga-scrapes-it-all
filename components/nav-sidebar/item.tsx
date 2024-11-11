import { SidebarMenuButton } from '../ui/sidebar';

export interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export default function SidebarItem({ title, icon, isActive }: SidebarItem) {
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
