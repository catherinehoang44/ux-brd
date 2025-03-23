import React, { useState, useEffect } from 'react';
import ProposalItem from './ProposalItem';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import SortControls from './SortControls';
import ExclusionsSection from './ExclusionsSection';
import EmailUpdateBar from './EmailUpdateBar';
import { getSheetData, addEmailUpdate } from '@/services/googleSheetService';
import { format, isValid } from 'date-fns';

interface ProposalListProps {
  className?: string;
  items?: any[];
  isEmailBarVisible?: boolean;
  onToggleEmailBar?: () => void;
  onSubscribe?: (email: string) => void;
  isSubscribed?: boolean;
  exclusions?: string[];
  hideExclusions?: boolean;
  selectedVersion?: string;
}

const formSchema = z.object({
  name: z.string(),
  section: z.string(),
  message: z.string().optional(),
});

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const ProposalList: React.FC<ProposalListProps> = ({ 
  className, 
  items = [],
  isEmailBarVisible = true,
  onToggleEmailBar,
  onSubscribe,
  isSubscribed = false,
  exclusions = [],
  hideExclusions = false,
  selectedVersion = 'FY25 Q2'
}) => {
  const [sortBy, setSortBy] = useState<'priority' | 'deadline'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = high to low
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uxRequirements, setUxRequirements] = useState<any[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      section: "",
      message: "",
    },
  });

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const logoComponents = {
    testing: <div className="text-gray-500"><ClipboardList size={24} /></div>,
    design: <div className="text-gray-500"><FileText size={24} /></div>,
    research: <div className="text-gray-500"><CheckSquare size={24} /></div>,
    data: <div className="text-gray-500"><BarChart2 size={24} /></div>,
    acceptance: <div className="text-gray-500"><FileCheck size={24} /></div>,
  };

  const formatReviewDate = (dateString: string): string => {
    let dateValue: Date;
    
    if (!isNaN(Number(dateString))) {
      const excelEpoch = new Date(1899, 11, 30);
      dateValue = new Date(excelEpoch);
      dateValue.setDate(excelEpoch.getDate() + Number(dateString));
    } else {
      dateValue = new Date(dateString);
    }
    
    if (isValid(dateValue)) {
      return `Review by ${format(dateValue, 'MMMM d, yyyy')}`;
    }
    
    return `Review ${dateString}`;
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const sheetData = await getSheetData();
        console.log("Fetched sheet data:", sheetData);
        
        const requirementsData = sheetData.requirementDropdowns
          .filter(item => item.display && item.documentVersion === selectedVersion)
          .map(item => {
            const contents = sheetData.requirementContents
              .filter(content => content.key === item.key)
              .sort((a, b) => {
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
            
            let sectionCounter = 1;
            let subSectionCounter = 0;
            const deliverables: string[] = [];
            
            const topicMap = new Map();
            
            contents.forEach(content => {
              if (content.topic && content.topic.trim() !== '') {
                topicMap.set(content.topic, []);
              }
              
              if (content.bulletPoint && content.bulletPoint.trim() !== '' && content.topic) {
                const bullets = topicMap.get(content.topic) || [];
                bullets.push(content.bulletPoint);
                topicMap.set(content.topic, bullets);
              }
            });
            
            for (const [topic, bullets] of topicMap.entries()) {
              const topicNumber = `${sectionCounter}.0`;
              deliverables.push(`${topicNumber} ${topic}`);
              
              bullets.forEach((bullet: string, idx: number) => {
                const bulletNumber = `${sectionCounter}.${idx + 1}`;
                deliverables.push(`${bulletNumber} ${bullet}`);
              });
              
              sectionCounter++;
            }
            
            const stakeholders = sheetData.signOffStakeholders
              .filter(stakeholder => stakeholder.key === item.key)
              .map(stakeholder => stakeholder.stakeholder);
            
            const resources = sheetData.quickLinks
              .filter(link => link.key === item.key)
              .map(link => ({
                name: link.linkText,
                url: link.link
              }));
            
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
              id: item.key,
              company: item.title,
              logo,
              role: item.subtitle,
              location: item.status,
              timeAgo: formatReviewDate(item.reviewBy),
              description: item.subtitle,
              deliverables,
              notes: item.note,
              stakeholders,
              resources,
              overviewNote: item.subtitle
            };
          });
        
        console.log("Processed requirements data:", requirementsData);
        setUxRequirements(requirementsData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load sheet data:", error);
        setError("Failed to load requirements data. Please try again later.");
        setLoading(false);
      }
    }
    
    loadData();
  }, [selectedVersion]);

  const handleSort = (type: 'priority' | 'deadline') => {
    if (sortBy === type) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(type);
      setSortDirection('desc');
    }
  };

  const handleSubmitUpdate = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Update request submitted successfully.");
  };

  const handleEmailSubscribe = async (values: z.infer<typeof emailSchema>) => {
    try {
      const success = await addEmailUpdate(values.email);
      if (success) {
        toast.success("You're now subscribed for updates!");
        emailForm.reset();
        if (onSubscribe) {
          onSubscribe(values.email);
        }
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const sortedRequirements = [...uxRequirements].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      const priorityComparison = 
        (priorityOrder[a.location as keyof typeof priorityOrder] ?? 999) - 
        (priorityOrder[b.location as keyof typeof priorityOrder] ?? 999);
      
      if (priorityComparison === 0) {
        return a.company.localeCompare(b.company);
      }
      
      return sortDirection === 'desc' ? priorityComparison : -priorityComparison;
    } else {
      const daysA = a.timeAgo.includes('days') 
        ? parseInt(a.timeAgo.match(/\d+/)?.[0] || '999') 
        : (a.timeAgo.includes('today') ? 0 : 999);
      const daysB = b.timeAgo.includes('days') 
        ? parseInt(b.timeAgo.match(/\d+/)?.[0] || '999') 
        : (b.timeAgo.includes('today') ? 0 : 999);
      
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
          requirementItems={displayItems}
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
              <p className="text-gray-500">No requirements available for {selectedVersion}. Add some to the Google Sheet.</p>
            </div>
          )}
        </div>
      )}
      
      <ExclusionsSection exclusions={exclusions} hidden={hideExclusions} />
      
      {isEmailBarVisible && (
        <EmailUpdateBar 
          onSubscribe={(email) => {
            handleEmailSubscribe({ email });
          }}
          onToggleEmailBar={onToggleEmailBar}
        />
      )}
    </div>
  );
};

export default ProposalList;
