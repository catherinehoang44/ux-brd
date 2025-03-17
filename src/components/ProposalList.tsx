
import React from 'react';
import ProposalItem from './ProposalItem';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

  // Default items if none provided - with enhanced business proposal details
  const defaultItems = [
    {
      id: 1,
      company: 'Delphi Digital',
      logo: logoComponents.delphi,
      role: 'Website Redesign Project',
      location: 'San Francisco',
      timeAgo: 'Due in 30 days',
      description: 'Complete overhaul of the corporate website with focus on improved user experience, faster loading times, and better conversion rates. Includes new information architecture and content strategy.',
      deliverables: [
        'Responsive website redesign',
        'CMS implementation',
        'SEO optimization',
        'Analytics dashboard setup'
      ],
      timeline: '12 weeks',
      budget: '$75,000 - $95,000'
    },
    {
      id: 2,
      company: 'Tradestream',
      logo: logoComponents.tradestream,
      role: 'Mobile App Development',
      location: 'Remote (EU)',
      timeAgo: 'Due in 45 days',
      description: 'Design and development of a mobile trading application for iOS and Android platforms. The app will feature real-time market data, customizable dashboards, and secure transaction processing.',
      deliverables: [
        'UI/UX design',
        'iOS and Android applications',
        'Backend API development',
        'Admin dashboard'
      ],
      timeline: '16 weeks',
      budget: '$120,000 - $150,000'
    },
    {
      id: 3,
      company: 'Character AI',
      logo: logoComponents.character,
      role: 'AI Integration Services',
      location: 'Menlo Park, CA',
      salary: '$150K-$200K',
      timeAgo: 'Due in 60 days',
      description: 'Implementation of conversational AI assistants across customer service channels. Includes training on company-specific data, integration with existing CRM systems, and ongoing optimization.',
      deliverables: [
        'AI model customization',
        'CRM system integration',
        'Voice and chat interfaces',
        'Performance analytics'
      ],
      timeline: '20 weeks',
      budget: '$200,000 - $250,000'
    },
    {
      id: 4,
      company: 'Flint Technologies',
      logo: logoComponents.flint,
      role: 'Data Security Audit',
      location: 'San Francisco',
      timeAgo: 'Due in 15 days',
      description: 'Comprehensive security audit of all data systems and infrastructure. Includes penetration testing, vulnerability assessment, and detailed recommendations for security improvements.',
      deliverables: [
        'Security assessment report',
        'Penetration test results',
        'Remediation roadmap',
        'Security training materials'
      ],
      timeline: '6 weeks',
      budget: '$45,000 - $60,000'
    }
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <div className={cn("space-y-3 w-full", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Current Proposals</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Submit New</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit New Proposal</DialogTitle>
              <DialogDescription>
                Create a new business proposal to add to your dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p className="text-sm text-muted-foreground">
                This feature would allow you to create new proposals. Form implementation would go here.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
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
          description={item.description}
          deliverables={item.deliverables}
          timeline={item.timeline}
          budget={item.budget}
          className={`transition-all duration-${300 + index * 75}`}
        />
      ))}
      
      <div className="w-full flex justify-between items-center bg-white rounded-lg p-4 border border-border mt-6">
        <input 
          type="email"
          placeholder="your@email.com"
          className="w-full bg-transparent outline-none text-sm"
        />
        <span className="text-sm font-medium">Get proposal updates</span>
      </div>
    </div>
  );
};

export default ProposalList;
