
import React from 'react';
import { cn } from '@/lib/utils';
import { Sun, Moon, Link, Settings, Workflow } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/useTheme';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={cn("w-16 bg-background border-r border-border flex flex-col items-center py-8 h-screen sticky top-0", className)}>
      <div className="flex flex-col items-center gap-8 h-full">
        <div className="flex flex-col gap-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={cn("sidebar-item", theme === 'light' ? "active" : "")}
                  onClick={() => toggleTheme('light')}
                >
                  <Sun className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Light Mode</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={cn("sidebar-item", theme === 'dark' ? "active" : "")}
                  onClick={() => toggleTheme('dark')}
                >
                  <Moon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Dark Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="mt-auto flex flex-col gap-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  href="https://app.maze.co/projects/340229102" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="sidebar-item"
                >
                  <Workflow className="w-5 h-5" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Maze Workspace</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  href="https://certification.adobe.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="sidebar-item"
                >
                  <Link className="w-5 h-5" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Adobe Certification Portal</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="sidebar-item">
                  <Settings className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
