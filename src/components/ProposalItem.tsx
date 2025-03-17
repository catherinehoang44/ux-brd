
import React from 'react';
import { cn } from '@/lib/utils';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, Info, Clock, DollarSign } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

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
      className={cn("proposal-item group animate-slide-in-left border border-border p-4 rounded-lg bg-white hover:shadow-md transition-all duration-300", className)}
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
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{company}</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center justify-center size-5 text-muted-foreground rounded-full hover:bg-muted">
                      <Info className="h-3.5 w-3.5" />
                      <span className="sr-only">More info</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Section Details</h4>
                      <p className="text-xs text-muted-foreground">{description}</p>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="py-1 pl-0 text-xs font-medium">Timeline</TableCell>
                            <TableCell className="py-1 pr-0 text-xs">{timeline}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="py-1 pl-0 text-xs font-medium">Resource Est.</TableCell>
                            <TableCell className="py-1 pr-0 text-xs">{budget}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-muted-foreground text-sm">{role}</p>
              {additionalInfo && (
                <p className="text-muted-foreground text-sm">{additionalInfo}</p>
              )}
            </div>
            <div className="flex gap-4 items-center">
              {location && (
                <span className="text-sm text-muted-foreground">{location}</span>
              )}
              {salary && (
                <span className="text-sm font-medium">{salary}</span>
              )}
              <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </span>
              
              <CollapsibleTrigger asChild>
                <button className="rounded-full h-6 w-6 inline-flex items-center justify-center text-sm transition-transform duration-200 hover:bg-gray-100">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  <span className="sr-only">Toggle details</span>
                </button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
      </div>
      
      <CollapsibleContent className="mt-4 space-y-4 bg-gray-50 p-4 rounded-md">
        {description && (
          <div>
            <h4 className="text-sm font-medium mb-2">Overview</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}
        
        {deliverables && deliverables.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Key Deliverables</h4>
            <ul className="space-y-1">
              {deliverables.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <span className="text-xs font-medium">{index + 1}</span>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
          {timeline && (
            <span className="text-xs flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">Timeline:</span> {timeline}
            </span>
          )}
          {budget && (
            <span className="text-xs flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">Resource Estimate:</span> {budget}
            </span>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ProposalItem;
