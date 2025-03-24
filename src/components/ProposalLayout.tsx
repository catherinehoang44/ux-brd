
import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface ProposalLayoutProps {
  children: ReactNode;
  title: string;
  price?: string;
  approvalCount?: number;
  onApproval?: (isApproved: boolean) => void;
  documentVersions?: string[];
  selectedVersion?: string;
  onVersionChange?: (version: string) => void;
  lastUpdated?: string;
  hideApprovalButton?: boolean;
}

const ProposalLayout: React.FC<ProposalLayoutProps> = ({ 
  children, 
  title, 
  price, 
  approvalCount, 
  onApproval,
  documentVersions,
  selectedVersion,
  onVersionChange,
  lastUpdated,
  hideApprovalButton = false // Changed default to false
}) => {
  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col px-0 md:px-4 lg:px-8 max-w-full">
        <Header 
          title={title} 
          price={price} 
          approvalCount={approvalCount} 
          onApproval={onApproval}
          documentVersions={documentVersions}
          selectedVersion={selectedVersion}
          onVersionChange={onVersionChange}
          lastUpdated={lastUpdated}
          hideApprovalButton={hideApprovalButton}
        />
        <main className="flex-1 pb-12 px-4 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProposalLayout;
