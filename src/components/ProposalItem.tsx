
import React from 'react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, Clock, Users, Link, ExternalLink, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Resource {
  name: string;
  url: string;
}

interface ProposalItemProps {
  company: string;
  logo: React.ReactNode;
  role: string;
  location?: string;
  salary?: string;
  timeAgo: string;
  additionalInfo?: string;
  description?: string;
  deliverables?: string[];
  notes?: string;
  timeline?: string;
  budget?: string;
  stakeholders?: string[];
  resources?: Resource[];
  className?: string;
  overviewNote?: string;
}

const ProposalItem: React.FC<ProposalItemProps> = ({
  company,
  logo,
  role,
  location,
  salary,
  timeAgo,
  additionalInfo,
  description,
  deliverables,
  notes,
  timeline,
  budget,
  stakeholders,
  resources,
  className,
  overviewNote
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeBullet, setActiveBullet] = React.useState<number | null>(null);

  const getPriorityColor = (priority?: string) => {
    if (!priority) return "bg-gray-200 text-gray-700";
    
    switch (priority.toLowerCase()) {
      case 'critical':
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case 'high':
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
      case 'medium':
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case 'low':
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const renderDeliverable = (deliverable: string, index: number) => {
    const trimmedDeliverable = deliverable.trim();
    
    const numberMatch = trimmedDeliverable.match(/^(\d+(\.\d+)*)(\s+)(.*)$/);
    
    if (!numberMatch) {
      return (
        <li key={index} className="text-sm text-muted-foreground mb-4">
          {trimmedDeliverable}
        </li>
      );
    }
    
    const [_, numberPart, __, ___, textPart] = numberMatch;
    
    const segments = numberPart.split('.');
    
    let indentClass = '';
    let styleClass = '';
    
    // Set styling based on hierarchy level
    if (numberPart.endsWith('.0')) {
      // Main header (1.0, 2.0, etc.)
      indentClass = "";
      styleClass = "font-semibold text-foreground";
    } else if (segments.length === 2 && segments[1] !== '0') {
      // First-level bullet (1.1, 1.2, 2.1, etc.)
      indentClass = "ml-6";
      styleClass = "text-slate-700 dark:text-slate-300";
    } else if (segments.length === 3) {
      // Second-level bullet (1.1.1, 1.1.2, etc.)
      indentClass = "ml-12";
      styleClass = "text-slate-600 dark:text-slate-400";
    } else {
      // Any other level
      const dotCount = (numberPart.match(/\./g) || []).length;
      indentClass = `ml-${dotCount * 6}`;
      styleClass = "text-slate-500 dark:text-slate-500";
    }
    
    const isActive = activeBullet === index;
    
    return (
      <li 
        key={index} 
        className={`flex items-start text-sm ${indentClass} ${styleClass} transition-all duration-200 mb-5 hover:translate-x-1`}
        onMouseEnter={() => setActiveBullet(index)}
        onMouseLeave={() => setActiveBullet(null)}
      >
        <div className={`flex items-start gap-2 transition-all duration-200 ${isActive ? 'scale-102' : ''}`}>
          <span className={`inline-flex items-center justify-center min-w-[24px] h-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-md px-1.5 mr-2 transition-colors duration-200 ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground' : ''}`}>
            {numberPart}
          </span>
          <span className={`transition-all duration-200 ${isActive ? 'text-primary dark:text-primary-foreground' : ''}`}>{textPart}</span>
        </div>
      </li>
    );
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className={cn("proposal-item group animate-slide-in-left border border-border p-6 rounded-lg bg-white hover:shadow-md transition-all duration-300 dark:bg-gray-900", className)}
    >
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 flex items-center justify-center rounded-md bg-white border border-gray-100 cursor-pointer hover:scale-105 transition-transform dark:bg-gray-800 dark:border-gray-700">
          {logo}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{company}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{role}</p>
              {additionalInfo && (
                <p className="text-muted-foreground text-sm">{additionalInfo}</p>
              )}
            </div>
            <div className="flex gap-4 items-center">
              {location && (
                <span className={`text-sm px-3 py-1 rounded-full ${getPriorityColor(location)}`}>
                  {location}
                </span>
              )}
              {salary && (
                <span className="text-sm font-medium">{salary}</span>
              )}
              <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </span>
              
              <CollapsibleTrigger asChild>
                <button className="rounded-full h-6 w-6 inline-flex items-center justify-center text-sm transition-transform duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  <span className="sr-only">Toggle details</span>
                </button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
      </div>
      
      <CollapsibleContent className="mt-6 space-y-6 bg-gray-50 p-5 rounded-md dark:bg-gray-800/50 animate-accordion-down">
        {deliverables && deliverables.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-5">Requirements</h4>
            <ScrollArea className="max-h-[500px] pr-4">
              <ul className="space-y-1">
                {deliverables.map((item, index) => renderDeliverable(item, index))}
              </ul>
            </ScrollArea>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {stakeholders && stakeholders.length > 0 && (
            <div className="hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md p-3 transition-colors duration-200">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                Sign-Off Stakeholders
              </h4>
              <ul className="space-y-2">
                {stakeholders.map((stakeholder, index) => (
                  <li key={index} className="text-sm text-muted-foreground hover:translate-x-1 transition-transform duration-200">
                    • {stakeholder}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {resources && resources.length > 0 && (
            <div className="hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md p-3 transition-colors duration-200">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
                <Link className="h-4 w-4 text-muted-foreground" />
                Quick Links
              </h4>
              <ul className="space-y-2">
                {resources.map((resource, index) => (
                  <li key={index} className="hover:translate-x-1 transition-transform duration-200">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      • {resource.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border animate-fade-in">
          {notes && (
            <span className="text-xs flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">Note:</span> {notes}
            </span>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ProposalItem;
