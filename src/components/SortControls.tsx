
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface SortControlsProps {
  sortBy: 'priority' | 'deadline';
  sortDirection: 'asc' | 'desc';
  onSortChange: (type: 'priority' | 'deadline') => void;
  requirementItems?: any[];
}

const SortControls: React.FC<SortControlsProps> = ({ 
  sortBy,
  sortDirection,
  onSortChange,
  requirementItems = []
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Request Update
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Request Document Update</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This feature is coming soon. For now, please email or Slack <a href="mailto:catherineh@adobe.com" className="text-primary hover:underline">catherineh@adobe.com</a> if there are any changes you want to request or discuss.
            </p>
            <Button 
              onClick={() => setDialogOpen(false)} 
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SortControls;
