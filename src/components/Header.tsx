
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { recordDocumentApproval } from '@/services/googleSheetService';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

interface HeaderProps {
  title: string;
  price?: string;
  approvalCount?: number;
  onApproval?: (isApproved: boolean) => void;
  documentVersions?: string[];
  selectedVersion?: string;
  onVersionChange?: (version: string) => void;
  lastUpdated?: string;
  hideApprovalButton?: boolean; // We'll keep this prop but make it false by default
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  price = "Approve", 
  approvalCount = 0,
  onApproval,
  documentVersions = ['FY25 Q2'],
  selectedVersion = 'FY25 Q2',
  onVersionChange,
  lastUpdated = 'March 17, 2025',
  hideApprovalButton = false // Changed default to false to show the button
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleVersionChange = (version: string) => {
    if (onVersionChange) {
      onVersionChange(version);
    }
  };
  
  return (
    <div className="flex justify-between items-center py-6 px-8 w-full animate-fade-in">
      <div className="flex flex-col items-start">
        <span className="text-sm text-muted-foreground mb-1">Adobe Certification Portal</span>
        <h1 className="text-3xl font-light tracking-tight">{title}</h1>
        <div className="flex items-center gap-3 mt-1">
          <Select value={selectedVersion} onValueChange={handleVersionChange}>
            <SelectTrigger className="h-7 text-xs w-[120px] border-0 bg-transparent p-0 hover:bg-transparent focus:ring-0">
              <SelectValue placeholder={selectedVersion} />
            </SelectTrigger>
            <SelectContent>
              {documentVersions.map(version => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {approvalCount > 0 && (
          <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
            {approvalCount} Approvals
          </div>
        )}
        {!hideApprovalButton && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="rounded-full px-6 py-2 transition-all duration-500 border border-border bg-white hover:bg-secondary dark:bg-background dark:hover:bg-secondary"
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                {price}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Document Approval</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  This feature is coming soon. For now, we will approve documents on call. Please email or Slack <a href="mailto:catherineh@adobe.com" className="text-primary hover:underline">catherineh@adobe.com</a> for more questions or details.
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
        )}
      </div>
    </div>
  );
};

export default Header;
