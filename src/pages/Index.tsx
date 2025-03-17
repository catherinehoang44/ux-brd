
import React, { useState } from 'react';
import ProposalLayout from '@/components/ProposalLayout';
import ProposalList from '@/components/ProposalList';

const Index = () => {
  const [approvalCount, setApprovalCount] = useState(0);
  
  const handleApproval = (isApproved: boolean) => {
    setApprovalCount(prev => isApproved ? prev + 1 : Math.max(0, prev - 1));
  };
  
  return (
    <ProposalLayout 
      title="UX Business Requirements" 
      price="Approve Document"
      approvalCount={approvalCount}
      onApproval={handleApproval}
    >
      <div className="flex flex-col gap-12 pb-24">
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-medium mb-5">Objective</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            This document outlines the comprehensive UX business requirements for the Adobe Certification Portal (ACP). 
            The ACP serves as the primary platform for users to discover, register for, complete, and manage their Adobe DX product certifications.
          </p>
          <ProposalList />
        </div>
      </div>
    </ProposalLayout>
  );
};

export default Index;
