
import React from 'react';
import ProposalItem from './ProposalItem';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipboardList, BarChart2, CheckSquare, CheckCircle, Settings, Info } from 'lucide-react';

interface ProposalListProps {
  className?: string;
  items?: any[];
}

const ProposalList: React.FC<ProposalListProps> = ({ className, items = [] }) => {
  // Icons for each section
  const logoComponents = {
    testing: <div className="text-orange-500"><ClipboardList size={24} /></div>,
    data: <div className="text-green-500"><BarChart2 size={24} /></div>,
    approval: <div className="text-blue-500"><CheckSquare size={24} /></div>,
    quality: <div className="text-purple-500"><CheckCircle size={24} /></div>,
    design: <div className="text-gray-700"><Settings size={24} /></div>,
    info: <div className="text-gray-900"><Info size={24} /></div>,
  };

  // UX Business Requirements Document sections
  const uxRequirements = [
    {
      id: 1,
      company: "UX Testing Framework",
      logo: logoComponents.testing,
      role: "Testing Methodologies & Implementation",
      location: "Priority: High",
      timeAgo: "Review in 7 days",
      description: "This section defines the comprehensive testing methodologies required for validating UX improvements to the Adobe Certification Portal.",
      deliverables: [
        "Maze Testing Implementation - Min. 30 participants",
        "Usability Testing - Min. 8 participants, recorded sessions",
        "A/B Testing - Min. 2 weeks duration, p<0.05 significance"
      ],
      timeline: "Q1 2024",
      budget: "40 hours per major feature"
    },
    {
      id: 2,
      company: "Data Tracking Requirements",
      logo: logoComponents.data,
      role: "User Behavior & Metrics",
      location: "Priority: Critical",
      timeAgo: "Review in 5 days",
      description: "Comprehensive data collection requirements to ensure all user interactions are properly tracked and analyzed to inform UX decisions.",
      deliverables: [
        "User Behavior Metrics - Time on page, drop-off points",
        "Certification Metrics - Completion rates, abandonment patterns",
        "User Feedback Data - Satisfaction scores, NPS ratings",
        "Technical Performance - Load times, error rates"
      ],
      timeline: "Ongoing",
      budget: "Dashboard setup + monthly analysis"
    },
    {
      id: 3,
      company: "Approval Workflows",
      logo: logoComponents.approval,
      role: "Design & Implementation Sign-offs",
      location: "Priority: Medium",
      timeAgo: "Review in 10 days",
      description: "Structured approval processes for all UX deliverables to ensure consistent quality and alignment with business objectives.",
      deliverables: [
        "UX Design Approvals - Wireframes, high-fidelity designs",
        "Research Findings Approvals - Methodologies, implementation",
        "Implementation Approvals - Visual, interaction components"
      ],
      timeline: "Process implementation by Q2 2024",
      budget: "Process documentation + training"
    },
    {
      id: 4,
      company: "Quality Assurance & Validation",
      logo: logoComponents.quality,
      role: "Testing & Validation Protocols",
      location: "Priority: High",
      timeAgo: "Review in 14 days",
      description: "Detailed requirements for quality assurance processes to validate UX implementations against approved designs and specifications.",
      deliverables: [
        "UAT Requirements - UX team participation, documentation",
        "QA Requirements - Visual consistency, interaction patterns",
        "Research Requests - Standardized templates, planning timelines"
      ],
      timeline: "Q2-Q3 2024",
      budget: "20 hours per feature release"
    },
    {
      id: 5,
      company: "Design Requirements",
      logo: logoComponents.design,
      role: "Design System & Implementation",
      location: "Priority: High",
      timeAgo: "Review in 7 days",
      description: "Specifications for design system implementation, responsive design requirements, and accessibility standards for the certification portal.",
      deliverables: [
        "Design System Implementation - Adobe Spectrum compliance",
        "Responsive Design - 320px to 1920px width support",
        "Accessibility Requirements - WCAG 2.1 AA compliance",
        "Performance Standards - Max 2s load time, 100ms response"
      ],
      timeline: "Q1-Q3 2024",
      budget: "Component library + implementation"
    },
    {
      id: 6,
      company: "Acceptance Criteria",
      logo: logoComponents.info,
      role: "Validation & Project Completion",
      location: "Priority: Critical",
      timeAgo: "Final review",
      description: "Detailed criteria for accepting completed UX implementations and validating that all requirements have been met according to specifications.",
      deliverables: [
        "UX Testing Framework Acceptance - Documented results",
        "Data Collection Acceptance - Verified metrics tracking",
        "Approval Workflow Acceptance - Completed documentation",
        "UX Implementation Acceptance - Visual & functional validation",
        "Performance Acceptance - Core Web Vitals compliance"
      ],
      timeline: "Final project milestone",
      budget: "Validation workshops + reports"
    }
  ];

  const displayItems = items.length > 0 ? items : uxRequirements;

  return (
    <div className={cn("space-y-3 w-full", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Document Sections</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Request Update</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Document Update</DialogTitle>
              <DialogDescription>
                Submit a change request for this UX Business Requirements Document.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p className="text-sm text-muted-foreground">
                This feature would allow stakeholders to request changes or updates to specific sections of the requirements document.
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
          timeAgo={item.timeAgo}
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
        <span className="text-sm font-medium">Get document updates</span>
      </div>
    </div>
  );
};

export default ProposalList;
