
import React from 'react';
import ProposalLayout from '@/components/ProposalLayout';
import ProposalList from '@/components/ProposalList';
import DataVisualizer from '@/components/DataVisualizer';

const Index = () => {
  return (
    <ProposalLayout title="Business Proposals" price="Submit Proposal">
      <div className="flex flex-col gap-8">
        <div className="w-full">
          <h2 className="text-xl font-medium mb-4">Proposal Analytics</h2>
          <DataVisualizer />
        </div>
        
        <div className="w-full max-w-4xl">
          <ProposalList />
        </div>
      </div>
    </ProposalLayout>
  );
};

export default Index;
