
import React from 'react';
import { cn } from '@/lib/utils';
import { Sun, Moon, FileText, Settings, LayoutGrid } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn("w-16 bg-white border-r border-border flex flex-col items-center py-8", className)}>
      <div className="flex flex-col items-center gap-8 h-full">
        <div className="flex flex-col gap-6">
          <button className="sidebar-item active">
            <Sun className="w-5 h-5" />
          </button>
          <button className="sidebar-item">
            <Moon className="w-5 h-5" />
          </button>
          <button className="sidebar-item">
            <FileText className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-auto flex flex-col gap-6">
          <button className="sidebar-item">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button className="sidebar-item">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
