
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { trackDocumentApproval, getSheetData } from '@/services/googleSheetService';

interface HeaderProps {
  title: string;
  price?: string;
  approvalCount?: number;
  onApproval?: (isApproved: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  price = "Approve", 
  approvalCount = 0,
  onApproval
}) => {
  const [isApproved, setIsApproved] = useState(false);
  const [documentVersion, setDocumentVersion] = useState("FY25Q2");
  const [lastUpdated, setLastUpdated] = useState("March 17, 2025");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const data = await getSheetData();
        setLastUpdated(data.lastUpdated);
      } catch (error) {
        console.error("Failed to fetch last updated date:", error);
      }
    };
    
    fetchLastUpdated();
  }, []);
  
  const handleApproval = async () => {
    const newApprovalState = !isApproved;
    setIsSubmitting(true);
    
    try {
      await trackDocumentApproval(newApprovalState, documentVersion);
      setIsApproved(newApprovalState);
      
      if (onApproval) {
        onApproval(newApprovalState);
      }
      
      if (newApprovalState) {
        toast.success("Document approved successfully!");
      } else {
        toast.info("Approval removed");
      }
    } catch (error) {
      toast.error("Failed to record approval. Please try again.");
      console.error("Approval tracking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex justify-between items-center py-6 px-8 w-full animate-fade-in">
      <div className="flex flex-col items-start">
        <span className="text-sm text-muted-foreground mb-1">Adobe Certification Portal</span>
        <h1 className="text-3xl font-light tracking-tight">{title}</h1>
        <div className="flex items-center gap-3 mt-1">
          <Select 
            defaultValue={documentVersion}
            onValueChange={setDocumentVersion}
          >
            <SelectTrigger className="h-7 text-xs w-[120px] border-0 bg-transparent p-0 hover:bg-transparent focus:ring-0">
              <SelectValue placeholder="FY25 Q2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FY25Q2">FY25 Q2</SelectItem>
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
        <Button 
          variant={isApproved ? "default" : "outline"}
          className={`rounded-full px-6 py-2 transition-all duration-500 ${
            isApproved 
              ? "bg-green-500 hover:bg-green-600 text-white transform hover:scale-105" 
              : "border border-border bg-white hover:bg-secondary dark:bg-background dark:hover:bg-secondary"
          }`}
          onClick={handleApproval}
          disabled={isSubmitting}
        >
          <CheckSquare className={`mr-2 h-4 w-4 transition-all duration-300 ${isApproved ? 'scale-110' : ''}`} />
          {isSubmitting ? "Processing..." : isApproved ? "Remove Approval" : price}
        </Button>
      </div>
    </div>
  );
};

export default Header;
