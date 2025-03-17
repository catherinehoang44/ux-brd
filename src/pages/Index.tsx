
import React from 'react';
import ProposalLayout from '@/components/ProposalLayout';
import ProposalList from '@/components/ProposalList';
import DataVisualizer from '@/components/DataVisualizer';

const Index = () => {
  return (
    <ProposalLayout title="Design Engineer" price="$175">
      <div className="flex flex-col gap-8">
        <div className="w-full">
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
