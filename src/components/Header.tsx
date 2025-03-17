
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';

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
        <p className="text-sm text-muted-foreground mt-1">Version 1.0 • Last updated: June 15, 2024</p>
      </div>
      <Button 
        variant="outline" 
        className="rounded-full px-6 py-2 border border-border bg-white hover:bg-secondary transition-colors duration-300"
      >
        <CheckSquare className="mr-2 h-4 w-4" />
        {price}
      </Button>
    </div>
  );
};

export default Header;
