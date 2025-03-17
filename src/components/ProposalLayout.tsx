
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface ProposalLayoutProps {
  children: React.ReactNode;
  title: string;
  price?: string;
  className?: string;
}

const ProposalLayout: React.FC<ProposalLayoutProps> = ({ 
  children, 
  title, 
  price,
  className 
}) => {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title={title} price={price} />
        <main className={cn("px-8 pb-12", className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProposalLayout;
