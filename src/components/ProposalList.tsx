
import React, { useState } from 'react';
import ProposalItem from './ProposalItem';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipboardList, FileText, CheckSquare, CheckCircle, BarChart2, Layout, X, FileCheck } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Import our refactored components
import EmailUpdateBar from './EmailUpdateBar';
import ExclusionsSection from './ExclusionsSection';
import SortControls from './SortControls';

interface ProposalListProps {
  className?: string;
  items?: any[];
  isEmailBarVisible?: boolean;
  onToggleEmailBar?: () => void;
  onSubscribe?: (email: string) => void;
  isSubscribed?: boolean;
  exclusions?: string[];
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  section: z.string().min(1, { message: "Please select a section" }),
  message: z.string().optional(),
});

const ProposalList: React.FC<ProposalListProps> = ({ 
  className, 
  items = [],
  isEmailBarVisible = true,
  onToggleEmailBar,
  onSubscribe,
  isSubscribed = false,
  exclusions = []
}) => {
  const [sortBy, setSortBy] = useState<'priority' | 'deadline'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = high to low
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      section: "",
      message: "",
    },
  });

  // Icons for each section - all in gray
  const logoComponents = {
    testing: <div className="text-gray-500"><ClipboardList size={24} /></div>,
    design: <div className="text-gray-500"><FileText size={24} /></div>,
    research: <div className="text-gray-500"><CheckSquare size={24} /></div>,
    data: <div className="text-gray-500"><BarChart2 size={24} /></div>,
    acceptance: <div className="text-gray-500"><FileCheck size={24} /></div>,
  };

  const handleSort = (type: 'priority' | 'deadline') => {
    if (sortBy === type) {
      // Toggle direction if clicking the same sort option
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      // Set new sort type with default direction (desc)
      setSortBy(type);
      setSortDirection('desc');
    }
  };

  const handleSubmitUpdate = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Update request submitted successfully.");
    form.reset();
  };

  // Updated UX Business Requirements Document sections
  const uxRequirements = [
    {
      id: 1,
      company: "Testing Framework",
      logo: logoComponents.testing,
      role: "Standardization, UATs, and Research Validation",
      location: "High",
      timeAgo: "Review in 7 days",
      description: "This section defines the comprehensive testing methodologies required for validating UX improvements to the Adobe Certification Portal.",
      deliverables: [
        "1.0 Standardization",
        "1.1 All major user journeys must be tested through Maze prior to development.",
        "1.2 Testing protocol must include both directed tasks and exploratory scenarios",
        "1.3 Reports must be generated within 5 business days of test completion",
        "2.0 UATs and QAs",
        "2.1 UATs is to test experience. QAs is to test functionality. UATs and QAs can be either usability tests, surveys, and other research methods.",
        "2.1 For usability tests, sample size of 5 - 8 required for statistical validity.",
        "2.2 For surveys, sample size of 30 - 40 required for statistical validity.",
        "3.0 Research Requests and Validation",
        "3.1 On-demand research requests to validate and answer research questions must be requested at least a week in advance, depending on the complexity, through a provided form.",
        "3.2 The form requires requestors to state objective, priority level, sign-off stakeholders, type of testers, and type of test."
      ],
      notes: "Implementation timeline dependent on Research team availability",
      stakeholders: [
        "ACP Board"
      ],
      resources: [
        { name: "Usability Test Scripts", url: "#usability-test-scripts" },
        { name: "Survey Scripts", url: "#survey-scripts" },
        { name: "UAT Checklist", url: "#uat-checklist" },
        { name: "QA Checklist", url: "#qa-checklist" }
      ],
      overviewNote: "Testing procedures for validating UX improvements, covering standardization, UATs, QAs, and research validation methodologies."
    },
    {
      id: 2,
      company: "Design and Research",
      logo: logoComponents.design,
      role: "Tools and Implementation",
      location: "High",
      timeAgo: "Review in 7 days",
      description: "Specifications for design tools and implementation workflows for the certification portal.",
      deliverables: [
        "1.0 Tools",
        "1.1 All wireframes will be done on XD and/or Figma, to enable integration with Maze."
      ],
      notes: "Implementation depends on design tools availability",
      stakeholders: [
        "Design/Comms",
        "UX Manager",
        "ACP Program Manager"
      ],
      resources: [
        { name: "Maze", url: "#maze" },
        { name: "XD Files", url: "#xd-files" }
      ],
      overviewNote: "Design tools and implementation specifications for wireframes and prototypes."
    },
    {
      id: 3,
      company: "Research Insights and Database",
      logo: logoComponents.research,
      role: "Access, Formatting, and Approvals",
      location: "Medium",
      timeAgo: "Review in 10 days",
      description: "Guidelines for research insights access, formatting, and approval workflows.",
      deliverables: [
        "1.0 Access to Insights",
        "1.1 ACP Sharepoint → UX Insights folder",
        "1.2 A central Slack channel that links back to the ACP Sharepoint, to enable discussion.",
        "2.0 Formatting",
        "2.1 Research reports will come in either one of these formats: PDF document, or Powerpoint presentation",
        "2.2 If there is a need for a team discussion, insights will be portrayed as a Powerpoint.",
        "3.0 Research Approval Flow",
        "3.1 Research methodologies must be approved prior to implementation",
        "3.2 Findings must be reviewed by cross-functional team",
        "3.3 Implementation recommendations must receive product strategy approval",
        "4.0 Implementation Approvals",
        "4.1 Visual implementation must be validated against design specifications",
        "4.2 Interaction components must be validated against specifications",
        "4.3 Accessibility compliance must be verified before release"
      ],
      notes: "Process implementation by Q2 2024",
      stakeholders: [
        "UX Manager",
        "ACP Program Manager",
        "Data"
      ],
      resources: [
        { name: "Research Guidelines", url: "#research-guidelines" },
        { name: "Approval Diagram", url: "#approval-diagram" },
        { name: "UX Project Plan", url: "#ux-project-plan" }
      ],
      overviewNote: "Guidelines for accessing, formatting, and approving research insights and implementation recommendations."
    },
    {
      id: 4,
      company: "Data Tracking",
      logo: logoComponents.data,
      role: "User Behavior & Metrics",
      location: "Critical",
      timeAgo: "Review in 5 days",
      description: "Comprehensive data collection requirements to ensure all user interactions are properly tracked and analyzed to inform UX decisions.",
      deliverables: [
        "1.0 User Behavior Metrics",
        "1.1 User drop-off points must be identified and analyzed",
        "1.2 User journey funnels must be established for key conversion paths",
        "2.0 Certification Metrics",
        "2.1 This is out of scope for UX work, but will need: MAU, sign-ups, course begins, course completion, exam prep completions, exam passes and fails, badge sharing, renewals",
        "3.0 User Feedback Collection",
        "3.1 NPS ratings for workstreams in 2.1 must be tracked quarterly",
        "4.0 Technical Performance",
        "4.1 Page load times must not exceed 2 seconds",
        "4.2 System availability must maintain 99.9% uptime"
      ],
      notes: "Ongoing monitoring and quarterly analysis required",
      stakeholders: [
        "UX Manager",
        "ACP Program Manager",
        "Workstream Owner"
      ],
      resources: [
        { name: "ACP Analytics Dashboard", url: "#analytics-dashboard" }
      ],
      overviewNote: "Data tracking requirements for monitoring user behavior and metrics, including key performance indicators."
    },
    {
      id: 5,
      company: "Acceptance Criteria",
      logo: logoComponents.acceptance,
      role: "Validation & Project Completion",
      location: "Critical",
      timeAgo: "Review today",
      description: "Detailed criteria for accepting completed UX implementations and validating that all requirements have been met according to specifications.",
      deliverables: [
        "1.0 UATs",
        "1.1 Still need to brainstorm this.",
        "2.0 QAs",
        "3.0 Technical Performance",
        "4.0 Design Implementation"
      ],
      notes: "Final project milestone with executive sign-off required",
      stakeholders: [
        "UX Manager",
        "ACP Program Manager",
        "Certification Group Manager"
      ],
      resources: [
        { name: "Validation Checklist", url: "#validation-checklist" }
      ],
      overviewNote: "Final acceptance criteria for project completion, validation procedures, and sign-off requirements."
    }
  ];

  // Sort the requirements based on the selected sort type and direction
  const sortedRequirements = [...uxRequirements].sort((a, b) => {
    if (sortBy === 'priority') {
      // Priority order: Critical > High > Medium > Low
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      const priorityComparison = priorityOrder[a.location as keyof typeof priorityOrder] - priorityOrder[b.location as keyof typeof priorityOrder];
      
      // If same priority, sort alphabetically by company name
      if (priorityComparison === 0) {
        return a.company.localeCompare(b.company);
      }
      
      return sortDirection === 'desc' ? priorityComparison : -priorityComparison;
    } else {
      // Extract the number of days from the timeAgo string
      const daysA = a.timeAgo.includes('days') 
        ? parseInt(a.timeAgo.match(/\d+/)?.[0] || '999') 
        : (a.timeAgo.includes('today') ? 0 : 999);
      const daysB = b.timeAgo.includes('days') 
        ? parseInt(b.timeAgo.match(/\d+/)?.[0] || '999') 
        : (b.timeAgo.includes('today') ? 0 : 999);
      
      // If same deadline, sort alphabetically by company name
      if (daysA === daysB) {
        return a.company.localeCompare(b.company);
      }
      
      return sortDirection === 'desc' ? daysA - daysB : daysB - daysA;
    }
  });

  const displayItems = items.length > 0 ? items : sortedRequirements;

  return (
    <div className={cn("space-y-6 w-full", className)}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-medium">Requirements</h2>
        <SortControls 
          sortBy={sortBy} 
          sortDirection={sortDirection} 
          onSortChange={handleSort} 
        />
      </div>
      
      <div className="space-y-8">
        {displayItems.map((item) => (
          <div key={item.id} className="mb-8 relative transition-all duration-300">
            <ProposalItem
              company={item.company}
              logo={item.logo}
              role={item.role}
              location={item.location}
              timeAgo={item.timeAgo}
              description={item.description}
              deliverables={item.deliverables}
              notes={item.notes}
              stakeholders={item.stakeholders}
              resources={item.resources}
              overviewNote={item.overviewNote}
            />
          </div>
        ))}
      </div>
      
      {/* Exclusions Section */}
      <ExclusionsSection exclusions={exclusions} />
      
      {/* Email Update Bar */}
      {isEmailBarVisible && (
        <EmailUpdateBar 
          onSubscribe={onSubscribe}
          onToggleEmailBar={onToggleEmailBar}
        />
      )}

      {/* Update Request Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="mt-6">Request Update</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Document Update</DialogTitle>
            <DialogDescription>
              Submit a change request for this UX Business Requirements Document.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitUpdate)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="testing">Testing Framework</SelectItem>
                        <SelectItem value="design">Design and Research</SelectItem>
                        <SelectItem value="research">Research Insights and Database</SelectItem>
                        <SelectItem value="data">Data Tracking</SelectItem>
                        <SelectItem value="acceptance">Acceptance Criteria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Request</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe the changes you'd like to request..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be as specific as possible about the changes you're requesting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProposalList;
