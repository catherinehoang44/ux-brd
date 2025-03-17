
import React from 'react';
import { cn } from '@/lib/utils';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

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
  timeline?: string;
  budget?: string;
  className?: string;
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
  timeline,
  budget,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className={cn("proposal-item group animate-slide-in-left", className)}
    >
      <div className="flex items-center gap-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="w-12 h-12 flex items-center justify-center rounded-md bg-white border border-gray-100 cursor-pointer hover:scale-105 transition-transform">
              {logo}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-y-1">
              <h4 className="text-sm font-semibold">{company}</h4>
            </div>
            <p className="text-sm">
              {description?.substring(0, 100)}...
            </p>
            {timeline && (
              <div className="flex items-center pt-2">
                <span className="text-xs text-muted-foreground">Timeline: {timeline}</span>
              </div>
            )}
          </HoverCardContent>
        </HoverCard>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{company}</h3>
              <p className="text-muted-foreground text-sm">{role}</p>
              {additionalInfo && (
                <p className="text-muted-foreground text-sm">{additionalInfo}</p>
              )}
            </div>
            <div className="flex gap-8 items-center">
              {location && (
                <span className="text-sm text-muted-foreground">{location}</span>
              )}
              {salary && (
                <span className="text-sm font-medium">{salary}</span>
              )}
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {timeAgo}
              </span>
              
              <CollapsibleTrigger asChild>
                <button className="rounded-full h-5 w-5 inline-flex items-center justify-center text-sm transition-transform duration-200">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
      </div>
      
      <CollapsibleContent className="mt-4 space-y-2">
        {description && (
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Project Overview</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}
        
        {deliverables && deliverables.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Key Deliverables</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {deliverables.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-border">
          {timeline && (
            <span className="text-xs text-muted-foreground">Timeline: {timeline}</span>
          )}
          {budget && (
            <span className="text-xs font-medium">Budget: {budget}</span>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ProposalItem;
