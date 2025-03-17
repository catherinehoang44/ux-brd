
import React from 'react';
import { cn } from '@/lib/utils';

interface ProposalItemProps {
  company: string;
  logo: React.ReactNode;
  role: string;
  location?: string;
  salary?: string;
  timeAgo: string;
  additionalInfo?: string;
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
  className,
}) => {
  return (
    <div className={cn("proposal-item group animate-slide-in-left", className)}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-md bg-white border border-gray-100">
          {logo}
        </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalItem;
