
import React, { useState } from 'react';
import ProposalItem from './ProposalItem';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipboardList, BarChart2, CheckSquare, CheckCircle, Info, ArrowUpDown, Users, Link, X, MessageSquare } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ProposalListProps {
  className?: string;
  items?: any[];
  isEmailBarVisible?: boolean;
  onToggleEmailBar?: () => void;
  onSubscribe?: (email: string) => void;
  isSubscribed?: boolean;
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
  isSubscribed = false
}) => {
  const [sortBy, setSortBy] = useState<'priority' | 'deadline'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = high to low
  const [updateEmail, setUpdateEmail] = useState('');
  const [emailBarHovered, setEmailBarHovered] = useState(false);
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      section: "",
      message: "",
    },
  });

  // Icons for each section
  const logoComponents = {
    testing: <div className="text-orange-500"><ClipboardList size={24} /></div>,
    data: <div className="text-green-500"><BarChart2 size={24} /></div>,
    approval: <div className="text-blue-500"><CheckSquare size={24} /></div>,
    quality: <div className="text-purple-500"><CheckCircle size={24} /></div>,
    design: <div className="text-gray-700"><CheckCircle size={24} /></div>,
    info: <div className="text-gray-900"><Info size={24} /></div>,
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

  const handleDocUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.success("You've been subscribed to document updates.");
      setUpdateEmail('');
      if (onSubscribe) {
        onSubscribe(updateEmail);
      }
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  // UX Business Requirements Document sections - updating to standardized numbering
  const uxRequirements = [
    {
      id: 1,
      company: "UX Testing Framework",
      logo: logoComponents.testing,
      role: "Testing Methodologies & Implementation",
      location: "High",
      timeAgo: "Review in 7 days",
      description: "This section defines the comprehensive testing methodologies required for validating UX improvements to the Adobe Certification Portal.",
      deliverables: [
        "1.0 UX Testing Framework",
        "1.1 Maze Testing Implementation",
        "1.1.1 All major user journeys must be tested through Maze prior to development",
        "1.1.2 Minimum sample size of 30 participants required for statistical validity",
        "1.1.3 Tests must include both usability metrics and preference data",
        "1.1.4 Reports must be generated within 5 business days of test completion",
        "1.2 Usability Testing Requirements",
        "1.2.1 Moderated sessions required for complex interaction patterns",
        "1.2.2 Sessions must be recorded and stored in designated repository",
        "1.2.3 Minimum of 8 participants required for qualitative insights",
        "1.2.4 Testing protocol must include both directed tasks and exploratory scenarios",
        "1.3 A/B Testing Framework",
        "1.3.1 Critical conversion points must undergo A/B testing",
        "1.3.2 Minimum test duration of 2 weeks to account for user variances",
        "1.3.3 Clear success metrics must be established prior to test launch",
        "1.3.4 Results must achieve statistical significance (p<0.05) before implementation"
      ],
      notes: "Implementation timeline dependent on Research team availability",
      stakeholders: [
        "Marketing & Communications Lead",
        "Design System Manager", 
        "Exam Development Lead", 
        "Course Developer Director"
      ],
      resources: [
        { name: "Testing Protocol", url: "#testing-protocol" },
        { name: "Research Guidelines", url: "#research-guidelines" }
      ],
      overviewNote: "Testing procedures for validating UX improvements, covering usability and A/B testing methodologies."
    },
    {
      id: 2,
      company: "Data Tracking Requirements",
      logo: logoComponents.data,
      role: "User Behavior & Metrics",
      location: "Critical",
      timeAgo: "Review in 5 days",
      description: "Comprehensive data collection requirements to ensure all user interactions are properly tracked and analyzed to inform UX decisions.",
      deliverables: [
        "1.0 Data Collection Framework",
        "1.1 User Behavior Metrics",
        "1.1.1 Time on page for all certification paths must be tracked",
        "1.1.2 User drop-off points must be identified and analyzed",
        "1.1.3 User journey funnels must be established for key conversion paths",
        "1.2 Certification Metrics",
        "1.2.1 Completion rates by certification type must be tracked",
        "1.2.2 Abandonment patterns must be identified by certification path",
        "1.2.3 Time to completion metrics must be established",
        "1.3 User Feedback Collection",
        "1.3.1 Satisfaction scores must be collected post-certification",
        "1.3.2 NPS ratings must be tracked quarterly",
        "1.3.3 User sentiment analysis must be conducted on feedback",
        "1.4 Technical Performance",
        "1.4.1 Page load times must not exceed 2 seconds",
        "1.4.2 Error rates must be tracked and reported weekly",
        "1.4.3 System availability must maintain 99.9% uptime"
      ],
      notes: "Ongoing monitoring and quarterly analysis required",
      stakeholders: [
        "Marketing Analytics Team", 
        "Data Science Director", 
        "UX Research Lead", 
        "Technical Performance Lead"
      ],
      resources: [
        { name: "Data Schema", url: "#data-schema" },
        { name: "Analytics Dashboard", url: "#analytics-dashboard" }
      ],
      overviewNote: "Data tracking requirements for monitoring user behavior and metrics, including key performance indicators."
    },
    {
      id: 3,
      company: "Approval Workflows",
      logo: logoComponents.approval,
      role: "Design & Implementation Sign-offs",
      location: "Medium",
      timeAgo: "Review in 10 days",
      description: "Structured approval processes for all UX deliverables to ensure consistent quality and alignment with business objectives.",
      deliverables: [
        "1.0 Approval Workflow Framework",
        "1.1 UX Design Approvals",
        "1.1.1 Wireframes must receive stakeholder sign-off before high-fidelity design",
        "1.1.2 High-fidelity designs must be approved by design system team",
        "1.1.3 Interaction patterns must be validated against usability standards",
        "1.2 Research Findings Approvals",
        "1.2.1 Research methodologies must be approved prior to implementation",
        "1.2.2 Findings must be reviewed by cross-functional team",
        "1.2.3 Implementation recommendations must receive product strategy approval",
        "1.3 Implementation Approvals",
        "1.3.1 Visual implementation must be validated against design specifications",
        "1.3.2 Interaction components must be validated against specifications",
        "1.3.3 Accessibility compliance must be verified before release"
      ],
      notes: "Process implementation by Q2 2024",
      stakeholders: [
        "Design Operations Director", 
        "Product Strategy Lead", 
        "Accessibility Specialist", 
        "Design System Architect"
      ],
      resources: [
        { name: "Approval Templates", url: "#approval-templates" },
        { name: "Workflow Diagrams", url: "#workflow-diagrams" }
      ],
      overviewNote: "Structured approval workflows for UX deliverables with defined sign-off procedures and documentation."
    },
    {
      id: 4,
      company: "Quality Assurance & Validation",
      logo: logoComponents.quality,
      role: "Testing & Validation Protocols",
      location: "High",
      timeAgo: "Review in 14 days",
      description: "Detailed requirements for quality assurance processes to validate UX implementations against approved designs and specifications.",
      deliverables: [
        "1.0 Quality Assurance Framework",
        "1.1 UAT Requirements",
        "1.1.1 UX team participation required for all UAT sessions",
        "1.1.2 Comprehensive documentation of all UAT findings required",
        "1.1.3 Prioritization framework for UX issues must be established",
        "1.2 QA Requirements",
        "1.2.1 Visual consistency must be validated across all platforms",
        "1.2.2 Interaction patterns must be validated against specifications",
        "1.2.3 Responsive design must be validated across device types",
        "1.3 Research Requests",
        "1.3.1 Standardized templates for research requests must be used",
        "1.3.2 Planning timelines must include research review periods",
        "1.3.3 Research outcomes must be incorporated into QA criteria"
      ],
      notes: "Implementation timeline spans Q2-Q3 2024",
      stakeholders: [
        "QA Test Lead", 
        "UX Research Director", 
        "Development Operations", 
        "Cross-Browser Testing Specialist"
      ],
      resources: [
        { name: "UAT Scripts", url: "#uat-scripts" },
        { name: "QA Checklist", url: "#qa-checklist" }
      ],
      overviewNote: "Quality assurance requirements and validation processes to ensure UX implementations match approved specifications."
    },
    {
      id: 5,
      company: "Design Requirements",
      logo: logoComponents.design,
      role: "Design System & Implementation",
      location: "High",
      timeAgo: "Review in 7 days",
      description: "Specifications for design system implementation, responsive design requirements, and accessibility standards for the certification portal.",
      deliverables: [
        "1.0 Design System Implementation",
        "1.1 Component Requirements",
        "1.1.1 All interface components must comply with Adobe Spectrum design system",
        "1.1.2 Component modifications must be approved by design system team",
        "1.1.3 Component documentation must be maintained and updated",
        "1.2 Responsive Design",
        "1.2.1 All interfaces must support viewport widths from 320px to 1920px",
        "1.2.2 Touch-friendly interaction patterns required for mobile interfaces",
        "1.2.3 Component behaviors must be consistent across device types",
        "1.3 Accessibility Requirements",
        "1.3.1 All interfaces must comply with WCAG 2.1 AA standards",
        "1.3.2 Keyboard navigation must be fully supported",
        "1.3.3 Screen reader compatibility must be verified",
        "1.4 Performance Standards",
        "1.4.1 Maximum load time must not exceed 2 seconds on broadband",
        "1.4.2 Interface response time must not exceed 100ms",
        "1.4.3 Animation performance must maintain 60fps on target devices"
      ],
      notes: "Implementation timeline spans Q1-Q3 2024",
      stakeholders: [
        "Design System Lead", 
        "Accessibility Expert", 
        "Frontend Performance Specialist", 
        "Mobile UX Designer"
      ],
      resources: [
        { name: "Spectrum Guidelines", url: "#spectrum-guidelines" },
        { name: "Accessibility Standards", url: "#accessibility-standards" }
      ],
      overviewNote: "Design system implementation specifications, responsive design requirements, and accessibility standards."
    },
    {
      id: 6,
      company: "Acceptance Criteria",
      logo: logoComponents.info,
      role: "Validation & Project Completion",
      location: "Critical",
      timeAgo: "Review today",
      description: "Detailed criteria for accepting completed UX implementations and validating that all requirements have been met according to specifications.",
      deliverables: [
        "1.0 Acceptance Framework",
        "1.1 UX Testing Acceptance",
        "1.1.1 All testing results must be documented and reviewed",
        "1.1.2 Critical usability issues must be resolved before acceptance",
        "1.1.3 Testing coverage must meet minimum requirements",
        "1.2 Data Collection Acceptance",
        "1.2.1 All specified metrics must be verified for accurate tracking",
        "1.2.2 Data visualization must be available and functional",
        "1.2.3 Analytics reports must be configured and accessible",
        "1.3 Approval Workflow Acceptance",
        "1.3.1 All required approvals must be documented",
        "1.3.2 Sign-off documentation must be complete and archived",
        "1.3.3 Audit trail must be maintained for all approvals",
        "1.4 UX Implementation Acceptance",
        "1.4.1 Visual implementation must match approved designs",
        "1.4.2 Interaction patterns must function as specified",
        "1.4.3 Edge cases must be handled appropriately",
        "1.5 Performance Acceptance",
        "1.5.1 Core Web Vitals must meet or exceed requirements",
        "1.5.2 Performance testing results must be documented",
        "1.5.3 Performance optimization recommendations must be provided"
      ],
      notes: "Final project milestone with executive sign-off required",
      stakeholders: [
        "UX Director", 
        "Product Owner", 
        "Technical Director", 
        "Executive Sponsor"
      ],
      resources: [
        { name: "Acceptance Templates", url: "#acceptance-templates" },
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
      const comparison = priorityOrder[a.location as keyof typeof priorityOrder] - priorityOrder[b.location as keyof typeof priorityOrder];
      return sortDirection === 'desc' ? comparison : -comparison;
    } else {
      // Extract the number of days from the timeAgo string
      const daysA = a.timeAgo.includes('days') 
        ? parseInt(a.timeAgo.match(/\d+/)?.[0] || '999') 
        : (a.timeAgo.includes('today') ? 0 : 999);
      const daysB = b.timeAgo.includes('days') 
        ? parseInt(b.timeAgo.match(/\d+/)?.[0] || '999') 
        : (b.timeAgo.includes('today') ? 0 : 999);
      return sortDirection === 'desc' ? daysA - daysB : daysB - daysA;
    }
  });

  const displayItems = items.length > 0 ? items : sortedRequirements;

  return (
    <div className={cn("space-y-6 w-full", className)}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-medium">Requirements</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(sortBy === 'priority' && "bg-secondary")}
              onClick={() => handleSort('priority')}
            >
              Priority
              <ArrowUpDown className={`ml-1 h-3 w-3 transform ${sortBy === 'priority' && sortDirection === 'asc' ? 'rotate-180' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(sortBy === 'deadline' && "bg-secondary")}
              onClick={() => handleSort('deadline')}
            >
              Deadline
              <ArrowUpDown className={`ml-1 h-3 w-3 transform ${sortBy === 'deadline' && sortDirection === 'asc' ? 'rotate-180' : ''}`} />
            </Button>
          </div>
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
                            <SelectItem value="testing">UX Testing Framework</SelectItem>
                            <SelectItem value="data">Data Tracking Requirements</SelectItem>
                            <SelectItem value="approval">Approval Workflows</SelectItem>
                            <SelectItem value="quality">Quality Assurance & Validation</SelectItem>
                            <SelectItem value="design">Design Requirements</SelectItem>
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
            />
          </div>
        ))}
      </div>
      
      {isEmailBarVisible && (
        <div 
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/80 dark:bg-gray-800/60 py-2 px-5 rounded-lg shadow-sm border border-border/5 max-w-xl w-full mx-auto transition-all duration-300 hover:shadow-md z-10 backdrop-blur-sm"
          onMouseEnter={() => setEmailBarHovered(true)}
          onMouseLeave={() => setEmailBarHovered(false)}
        >
          <button 
            className={`absolute -top-2 -right-2 h-6 w-6 bg-gray-100/60 dark:bg-gray-700/60 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-opacity transition-colors ${emailBarHovered ? 'opacity-100' : 'opacity-0'}`}
            onClick={onToggleEmailBar}
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <form onSubmit={handleDocUpdates} className="flex w-full gap-3">
            <Input 
              type="email"
              placeholder="your@email.com"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
              className="bg-transparent border-gray-200/40 dark:border-gray-700/40 text-sm flex-1"
            />
            <Button type="submit" variant="outline" size="sm" className="text-xs">
              Get Updates
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProposalList;

