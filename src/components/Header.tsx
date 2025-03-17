
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  price?: string;
}

const Header: React.FC<HeaderProps> = ({ title, price = "$175" }) => {
  return (
    <div className="flex justify-between items-center py-6 px-8 w-full animate-fade-in">
      <div className="flex flex-col items-start">
        <h1 className="text-4xl font-light tracking-tight">{title}</h1>
      </div>
      <Button 
        variant="outline" 
        className="rounded-full px-6 py-2 border border-border bg-white hover:bg-secondary transition-colors duration-300"
      >
        Submit · {price}
      </Button>
    </div>
  );
};

export default Header;
