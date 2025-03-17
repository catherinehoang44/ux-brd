
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';

interface ProposalLayoutProps {
  children: React.ReactNode;
  title: string;
  price?: string;
  className?: string;
  approvalCount?: number;
  onApproval?: (isApproved: boolean) => void;
}

const ProposalLayout: React.FC<ProposalLayoutProps> = ({ 
  children, 
  title, 
  price,
  className,
  approvalCount,
  onApproval
}) => {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Header title={title} price={price} approvalCount={approvalCount} onApproval={onApproval} />
        <main className={cn("px-8 pb-12", className)}>
          {children}
        </main>
        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default ProposalLayout;
