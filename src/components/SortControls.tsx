
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface SortControlsProps {
  sortBy: 'priority' | 'deadline';
  sortDirection: 'asc' | 'desc';
  onSortChange: (type: 'priority' | 'deadline') => void;
  dialogTriggerRef?: React.RefObject<HTMLButtonElement>;
}

const SortControls: React.FC<SortControlsProps> = ({ 
  sortBy,
  sortDirection,
  onSortChange,
  dialogTriggerRef
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(sortBy === 'priority' && "bg-secondary")}
          onClick={() => onSortChange('priority')}
        >
          Priority
          <ArrowUpDown className={`ml-1 h-3 w-3 transform ${sortBy === 'priority' && sortDirection === 'asc' ? 'rotate-180' : ''}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(sortBy === 'deadline' && "bg-secondary")}
          onClick={() => onSortChange('deadline')}
        >
          Deadline
          <ArrowUpDown className={`ml-1 h-3 w-3 transform ${sortBy === 'deadline' && sortDirection === 'asc' ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            ref={dialogTriggerRef}
          >
            Request Update
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default SortControls;
