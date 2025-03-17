
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps {
  title: string;
  price?: string;
}

const Header: React.FC<HeaderProps> = ({ title, price = "Approve" }) => {
  return (
    <div className="flex justify-between items-center py-6 px-8 w-full animate-fade-in">
      <div className="flex flex-col items-start">
        <span className="text-sm text-muted-foreground mb-1">Adobe Certification Portal</span>
        <h1 className="text-3xl font-light tracking-tight">{title}</h1>
        <div className="flex items-center gap-3 mt-1">
          <Select defaultValue="FY25Q2">
            <SelectTrigger className="h-7 text-xs w-[120px]">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FY25Q2">FY25 Q2</SelectItem>
              <SelectItem value="FY25Q1">FY25 Q1</SelectItem>
              <SelectItem value="FY24Q4">FY24 Q4</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Last updated: March 17, 2025</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="rounded-full px-6 py-2 border border-border bg-white hover:bg-secondary transition-colors duration-300 dark:bg-background dark:hover:bg-secondary"
      >
        <CheckSquare className="mr-2 h-4 w-4" />
        {price}
      </Button>
    </div>
  );
};

export default Header;
