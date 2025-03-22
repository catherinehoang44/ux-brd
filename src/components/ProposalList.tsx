
import React, { useState, useEffect } from 'react';
import ProposalItem from './ProposalItem';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipboardList, FileText, CheckSquare, BarChart2, FileCheck, AlertCircle } from 'lucide-react';
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
import { getSheetData } from '@/services/googleSheetService';

interface ProposalListProps {
  className?: string;
  items?: any[];
  isEmailBarVisible?: boolean;
  onToggleEmailBar?: () => void;
  onSubscribe?: (email: string) => void;
  isSubscribed?: boolean;
  exclusions?: string[];
  hideExclusions?: boolean;
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
  exclusions = [],
  hideExclusions = false
}) => {
  const [sortBy, setSortBy] = useState<'priority' | 'deadline'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = high to low
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uxRequirements, setUxRequirements] = useState<any[]>([]);
  
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

  // Load data from Google Sheets on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const sheetData = await getSheetData();
        
        // Process the data into the format needed for ProposalItems
        const requirementsData = sheetData.requirementDropdowns
          .filter(item => item.display)
          .map(item => {
            // Find all content for this requirement
            const contents = sheetData.requirementContents
              .filter(content => content.title === item.title)
              .sort((a, b) => {
                // Sort by numeric part of the topic/bulletPoint if possible
                const getNumericPart = (str: string) => {
                  const match = str.match(/^(\d+(\.\d+)*)/);
                  return match ? match[0] : str;
                };
                return getNumericPart(a.topic || a.bulletPoint).localeCompare(
                  getNumericPart(b.topic || b.bulletPoint), 
                  undefined, 
                  { numeric: true, sensitivity: 'base' }
                );
              });
            
            // Group content by topics
            const deliverables: string[] = [];
            let currentTopic = '';
            
            contents.forEach(content => {
              if (content.topic) {
                currentTopic = content.topic;
                deliverables.push(currentTopic);
              } else if (content.bulletPoint) {
                deliverables.push(content.bulletPoint);
              }
            });
            
            // Get stakeholders for this requirement
            const stakeholders = sheetData.signOffStakeholders
              .filter(stakeholder => stakeholder.title === item.title)
              .map(stakeholder => stakeholder.stakeholder);
            
            // Get quick links for this requirement
            const resources = sheetData.quickLinks
              .filter(link => link.title === item.title)
              .map(link => ({
                name: link.linkText,
                url: link.link
              }));
            
            // Determine logo based on title
            let logo = logoComponents.testing;
            if (item.title.toLowerCase().includes('design')) {
              logo = logoComponents.design;
            } else if (item.title.toLowerCase().includes('research')) {
              logo = logoComponents.research;
            } else if (item.title.toLowerCase().includes('data')) {
              logo = logoComponents.data;
            } else if (item.title.toLowerCase().includes('acceptance')) {
              logo = logoComponents.acceptance;
            }
            
            return {
              id: item.title,
              company: item.title,
              logo,
              role: item.subtitle,
              location: item.status,
              timeAgo: `Review ${item.reviewBy}`,
              description: item.subtitle,
              deliverables,
              notes: item.note,
              stakeholders,
              resources,
              overviewNote: item.subtitle
            };
          });
        
        setUxRequirements(requirementsData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load sheet data:", error);
        setError("Failed to load requirements data. Please try again later.");
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

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

  // Sort the requirements based on the selected sort type and direction
  const sortedRequirements = [...uxRequirements].sort((a, b) => {
    if (sortBy === 'priority') {
      // Priority order: Critical > High > Medium > Low
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      const priorityComparison = 
        priorityOrder[a.location as keyof typeof priorityOrder] - 
        priorityOrder[b.location as keyof typeof priorityOrder];
      
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
      
      {loading && (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Loading requirements data...</p>
        </div>
      )}
      
      {error && (
        <div className="py-10 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-gray-500 mt-2">Please check your internet connection and try refreshing the page.</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="space-y-8">
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
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
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-gray-500">No requirements available. Add some to the Google Sheet.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Exclusions Section */}
      <ExclusionsSection exclusions={exclusions} hidden={hideExclusions} />
      
      {/* Email Update Bar */}
      {isEmailBarVisible && (
        <EmailUpdateBar 
          onSubscribe={onSubscribe}
          onToggleEmailBar={onToggleEmailBar}
        />
      )}

      {/* Dialog content for the Request Update dialog (used by the button in SortControls) */}
      <Dialog>
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
                        {uxRequirements.map(req => (
                          <SelectItem key={req.id} value={req.id.toLowerCase().replace(/\s+/g, '-')}>
                            {req.company}
                          </SelectItem>
                        ))}
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
