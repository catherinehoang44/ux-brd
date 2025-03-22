import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CheckCircle, Clock, AlarmClock, XCircle, FileText } from 'lucide-react';
import { getSheetData } from '@/services/googleSheetService';

interface Requirement {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'planned' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastUpdated: string;
  section: string;
}

interface DataVisualizerProps {
  className?: string;
}

const DataVisualizer: React.FC<DataVisualizerProps> = ({ className }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getSheetData();
        
        const mappedRequirements = data.requirementDropdowns
          .filter(item => item.display)
          .map((item, index) => {
            let status: 'completed' | 'in-progress' | 'planned' | 'blocked' = 'planned';
            if (item.status.toLowerCase().includes('completed')) {
              status = 'completed';
            } else if (item.status.toLowerCase().includes('progress')) {
              status = 'in-progress';
            } else if (item.status.toLowerCase().includes('blocked')) {
              status = 'blocked';
            }
            
            let priority: 'critical' | 'high' | 'medium' | 'low' = 'medium';
            if (item.status.toLowerCase().includes('critical')) {
              priority = 'critical';
            } else if (item.status.toLowerCase().includes('high')) {
              priority = 'high';
            } else if (item.status.toLowerCase().includes('medium')) {
              priority = 'medium';
            } else if (item.status.toLowerCase().includes('low')) {
              priority = 'low';
            }
            
            return {
              id: `UX-${String(index + 1).padStart(3, '0')}`,
              name: item.title,
              status,
              priority,
              lastUpdated: item.reviewBy || new Date().toISOString().split('T')[0],
              section: item.subtitle.split(' ')[0] || 'General'
            };
          });
        
        setRequirements(mappedRequirements);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load requirements:", err);
        setError("Failed to load requirements data");
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  const filteredRequirements = statusFilter === 'all' 
    ? requirements 
    : requirements.filter(req => req.status === statusFilter);

  const statusCounts = {
    completed: requirements.filter(r => r.status === 'completed').length,
    inProgress: requirements.filter(r => r.status === 'in-progress').length,
    planned: requirements.filter(r => r.status === 'planned').length,
    blocked: requirements.filter(r => r.status === 'blocked').length,
    total: requirements.length
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planned':
        return <AlarmClock className="h-4 w-4 text-amber-500" />;
      case 'blocked':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
      case 'blocked':
        return 'Blocked';
      default:
        return status;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-500">Critical</Badge>;
      case 'high':
        return <Badge className="bg-amber-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className={cn("w-full bg-background border border-border rounded-lg overflow-hidden", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex gap-2">
            <div className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <span className="font-semibold">{statusCounts.total}</span> Total
            </div>
            <div className="text-sm px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              <span className="font-semibold">{statusCounts.completed}</span> Completed
            </div>
            <div className="text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <span className="font-semibold">{statusCounts.inProgress}</span> In Progress
            </div>
            <div className="text-sm px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
              <span className="font-semibold">{statusCounts.planned}</span> Planned
            </div>
            <div className="text-sm px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
              <span className="font-semibold">{statusCounts.blocked}</span> Blocked
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            
            <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value as 'grid' | 'list')}>
              <ToggleGroupItem value="grid" aria-label="Grid view">Grid</ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">List</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Loading requirements...</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : filteredRequirements.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">No requirements available. Add some to the Google Sheet.</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredRequirements.map((req) => (
              <div key={req.id} className="p-3 rounded-md border border-border bg-card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-mono text-muted-foreground">{req.id}</div>
                  {getPriorityBadge(req.priority)}
                </div>
                <div className="font-medium mb-2">{req.name}</div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(req.status)}
                    <span>{getStatusText(req.status)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{req.section}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-md divide-y divide-border">
            <div className="grid grid-cols-12 p-3 font-medium text-sm bg-muted">
              <div className="col-span-1">ID</div>
              <div className="col-span-4">Requirement</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2">Section</div>
              <div className="col-span-1">Updated</div>
            </div>
            {filteredRequirements.map((req) => (
              <div key={req.id} className="grid grid-cols-12 p-3 text-sm hover:bg-muted/50 transition-colors">
                <div className="col-span-1 font-mono text-muted-foreground">{req.id}</div>
                <div className="col-span-4 font-medium">{req.name}</div>
                <div className="col-span-2 flex items-center gap-1">
                  {getStatusIcon(req.status)}
                  <span>{getStatusText(req.status)}</span>
                </div>
                <div className="col-span-2">{getPriorityBadge(req.priority)}</div>
                <div className="col-span-2">{req.section}</div>
                <div className="col-span-1 text-xs text-muted-foreground">{req.lastUpdated}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataVisualizer;
