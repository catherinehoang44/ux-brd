
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
  documentVersions?: string[];
  selectedVersion?: string;
  onVersionChange?: (version: string) => void;
  lastUpdated?: string;
}

const ProposalLayout: React.FC<ProposalLayoutProps> = ({ 
  children, 
  title, 
  price,
  className,
  approvalCount,
  onApproval,
  documentVersions,
  selectedVersion,
  onVersionChange,
  lastUpdated
}) => {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Header 
          title={title} 
          price={price} 
          approvalCount={approvalCount} 
          onApproval={onApproval}
          documentVersions={documentVersions}
          selectedVersion={selectedVersion}
          onVersionChange={onVersionChange}
          lastUpdated={lastUpdated}
        />
        <main className={cn("px-8 pb-12", className)}>
          {children}
        </main>
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
};

export default ProposalLayout;
