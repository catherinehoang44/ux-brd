
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CheckCircle, Clock, AlarmClock, XCircle, FileText } from 'lucide-react';

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
  
  // Example requirements data
  const requirements: Requirement[] = [
    { id: 'UX-001', name: 'Maze Testing Implementation', status: 'completed', priority: 'high', lastUpdated: '2025-03-10', section: 'Testing' },
    { id: 'UX-002', name: 'Usability Testing Protocol', status: 'in-progress', priority: 'critical', lastUpdated: '2025-03-15', section: 'Testing' },
    { id: 'UX-003', name: 'A/B Testing Framework', status: 'planned', priority: 'medium', lastUpdated: '2025-03-05', section: 'Testing' },
    { id: 'UX-004', name: 'User Behavior Metrics', status: 'in-progress', priority: 'critical', lastUpdated: '2025-03-12', section: 'Data' },
    { id: 'UX-005', name: 'Certification Metrics', status: 'completed', priority: 'high', lastUpdated: '2025-03-08', section: 'Data' },
    { id: 'UX-006', name: 'User Feedback Collection', status: 'blocked', priority: 'high', lastUpdated: '2025-03-01', section: 'Data' },
    { id: 'UX-007', name: 'UX Design Approvals', status: 'in-progress', priority: 'medium', lastUpdated: '2025-03-14', section: 'Approval' },
    { id: 'UX-008', name: 'UAT Requirements', status: 'planned', priority: 'high', lastUpdated: '2025-03-11', section: 'Quality' },
    { id: 'UX-009', name: 'Design System Implementation', status: 'completed', priority: 'critical', lastUpdated: '2025-03-09', section: 'Design' },
    { id: 'UX-010', name: 'Accessibility Requirements', status: 'in-progress', priority: 'critical', lastUpdated: '2025-03-16', section: 'Design' },
    { id: 'UX-011', name: 'Performance Standards', status: 'planned', priority: 'medium', lastUpdated: '2025-03-07', section: 'Design' },
    { id: 'UX-012', name: 'Validation Criteria', status: 'blocked', priority: 'high', lastUpdated: '2025-03-03', section: 'Quality' },
  ];

  // Filter requirements based on status
  const filteredRequirements = statusFilter === 'all' 
    ? requirements 
    : requirements.filter(req => req.status === statusFilter);

  // Calculate status counts
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
        {view === 'grid' ? (
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
