
import React from 'react';
import ProposalLayout from '@/components/ProposalLayout';
import ProposalList from '@/components/ProposalList';

const Index = () => {
  return (
    <ProposalLayout title="UX Business Requirements" price="Approve Document">
      <div className="flex flex-col gap-8 pb-16">
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-medium mb-4">UX Requirements & Testing Framework</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
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
