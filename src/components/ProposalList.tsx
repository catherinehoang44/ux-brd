
import React from 'react';
import ProposalItem from './ProposalItem';
import { cn } from '@/lib/utils';

interface ProposalListProps {
  className?: string;
  items?: any[];
}

const ProposalList: React.FC<ProposalListProps> = ({ className, items = [] }) => {
  // Demo logos using stylized text (in a real app, these would be actual images or SVGs)
  const logoComponents = {
    delphi: <div className="text-2xl font-bold text-orange-500">ⓓⓓ</div>,
    tradestream: <div className="text-2xl font-bold text-green-500">ⓣⓢ</div>,
    character: <div className="text-2xl font-bold text-gray-700">ⓒⓐ</div>,
    flint: <div className="text-2xl font-bold text-gray-900">ⓕⓛ</div>,
  };

  // Default items if none provided
  const defaultItems = [
    {
      id: 1,
      company: 'Delphi',
      logo: logoComponents.delphi,
      role: 'Design Engineer',
      location: 'SF',
      timeAgo: '5 days ago',
    },
    {
      id: 2,
      company: 'Tradestream',
      logo: logoComponents.tradestream,
      role: 'Design Engineer',
      location: 'Remote (EU)',
      timeAgo: '6 days ago',
    },
    {
      id: 3,
      company: 'character.ai',
      logo: logoComponents.character,
      role: 'Design Engineer, Monetization',
      location: 'Menlo Park, CA',
      salary: '$150-300K',
      timeAgo: '1 week ago',
    },
    {
      id: 4,
      company: 'Flint',
      logo: logoComponents.flint,
      role: 'Founding Design Engineer',
      location: 'SF',
      timeAgo: '3 weeks ago',
    }
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {displayItems.map((item, index) => (
        <ProposalItem
          key={item.id}
          company={item.company}
          logo={item.logo}
          role={item.role}
          location={item.location}
          salary={item.salary}
          timeAgo={item.timeAgo}
          additionalInfo={item.additionalInfo}
          className={`transition-all duration-${300 + index * 75}`}
        />
      ))}
      
      <div className="w-full flex justify-between items-center bg-white rounded-lg p-4 border border-border mt-4">
        <input 
          type="email"
          placeholder="sara@fire.com..."
          className="w-full bg-transparent outline-none text-sm"
        />
        <span className="text-sm font-medium">Latest news & jobs</span>
      </div>
    </div>
  );
};

export default ProposalList;
