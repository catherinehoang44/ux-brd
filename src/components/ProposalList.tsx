
import React, { useState } from 'react';
import ProposalItem from './ProposalItem';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipboardList, BarChart2, CheckSquare, CheckCircle, Settings, Info, ArrowUpDown, Users, Link } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProposalListProps {
  className?: string;
  items?: any[];
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  section: z.string().min(1, { message: "Please select a section" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

const ProposalList: React.FC<ProposalListProps> = ({ className, items = [] }) => {
  const [sortBy, setSortBy] = useState<'priority' | 'deadline'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = high to low
  const [updateEmail, setUpdateEmail] = useState('');
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
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
    design: <div className="text-gray-700"><Settings size={24} /></div>,
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
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  // UX Business Requirements Document sections
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
        "Maze Testing Implementation - Min. 30 participants",
        "Usability Testing - Min. 8 participants, recorded sessions",
        "A/B Testing - Min. 2 weeks duration, p<0.05 significance"
      ],
      timeline: "Q1 2024",
      stakeholders: ["UX Research Lead", "UX Manager", "Product Owner"],
      resources: [
        { name: "Testing Protocol", url: "#testing-protocol" },
        { name: "Research Guidelines", url: "#research-guidelines" }
      ]
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
        "User Behavior Metrics - Time on page, drop-off points",
        "Certification Metrics - Completion rates, abandonment patterns",
        "User Feedback Data - Satisfaction scores, NPS ratings",
        "Technical Performance - Load times, error rates"
      ],
      timeline: "Ongoing",
      stakeholders: ["Analytics Manager", "UX Manager", "Technical Lead"],
      resources: [
        { name: "Data Schema", url: "#data-schema" },
        { name: "Analytics Dashboard", url: "#analytics-dashboard" }
      ]
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
        "UX Design Approvals - Wireframes, high-fidelity designs",
        "Research Findings Approvals - Methodologies, implementation",
        "Implementation Approvals - Visual, interaction components"
      ],
      timeline: "Process implementation by Q2 2024",
      stakeholders: ["UX Director", "Product Owner", "Design System Lead"],
      resources: [
        { name: "Approval Templates", url: "#approval-templates" },
        { name: "Workflow Diagrams", url: "#workflow-diagrams" }
      ]
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
        "UAT Requirements - UX team participation, documentation",
        "QA Requirements - Visual consistency, interaction patterns",
        "Research Requests - Standardized templates, planning timelines"
      ],
      timeline: "Q2-Q3 2024",
      stakeholders: ["QA Lead", "UX Manager", "Development Lead"],
      resources: [
        { name: "UAT Scripts", url: "#uat-scripts" },
        { name: "QA Checklist", url: "#qa-checklist" }
      ]
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
        "Design System Implementation - Adobe Spectrum compliance",
        "Responsive Design - 320px to 1920px width support",
        "Accessibility Requirements - WCAG 2.1 AA compliance",
        "Performance Standards - Max 2s load time, 100ms response"
      ],
      timeline: "Q1-Q3 2024",
      stakeholders: ["Design System Lead", "Accessibility Expert", "UX Manager"],
      resources: [
        { name: "Spectrum Guidelines", url: "#spectrum-guidelines" },
        { name: "Accessibility Standards", url: "#accessibility-standards" }
      ]
    },
    {
      id: 6,
      company: "Acceptance Criteria",
      logo: logoComponents.info,
      role: "Validation & Project Completion",
      location: "Critical",
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
      stakeholders: ["UX Director", "Product Owner", "Technical Director"],
      resources: [
        { name: "Acceptance Templates", url: "#acceptance-templates" },
        { name: "Validation Checklist", url: "#validation-checklist" }
      ]
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
        : (a.timeAgo.includes('Final') ? 0 : 999);
      const daysB = b.timeAgo.includes('days') 
        ? parseInt(b.timeAgo.match(/\d+/)?.[0] || '999') 
        : (b.timeAgo.includes('Final') ? 0 : 999);
      return sortDirection === 'desc' ? daysA - daysB : daysB - daysA;
    }
  });

  const displayItems = items.length > 0 ? items : sortedRequirements;

  return (
    <div className={cn("space-y-3 w-full", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Document Sections</h2>
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
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
          stakeholders={item.stakeholders}
          resources={item.resources}
          className={`transition-all duration-${300 + index * 75}`}
        />
      ))}
      
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-3 px-4 flex justify-center">
        <div className="w-full max-w-4xl flex justify-between items-center">
          <form onSubmit={handleDocUpdates} className="flex flex-1 max-w-md gap-3">
            <Input 
              type="email"
              placeholder="your@email.com"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
              className="bg-transparent outline-none text-sm"
            />
            <Button type="submit" variant="default" size="sm">
              Get Document Updates
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProposalList;
