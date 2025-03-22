
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

interface SortControlsProps {
  sortBy: 'priority' | 'deadline';
  sortDirection: 'asc' | 'desc';
  onSortChange: (type: 'priority' | 'deadline') => void;
  requirementItems?: any[];
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  section: z.string().min(1, { message: "Please select a section" }),
  message: z.string().optional(),
});

const SortControls: React.FC<SortControlsProps> = ({ 
  sortBy,
  sortDirection,
  onSortChange,
  requirementItems = []
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      section: "",
      message: "",
    },
  });

  const handleSubmitUpdate = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Update request submitted successfully.");
    form.reset();
    setDialogOpen(false);
  };
  
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(sortBy === 'priority' && "bg-secondary")}
          onClick={() => onSortChange('priority')}
        >
          Priority
          <ArrowUpDown className={`ml-1 h-3 w-3 transform ${sortBy === 'priority' && sortDirection === 'asc' ? 'rotate-180' : ''}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(sortBy === 'deadline' && "bg-secondary")}
          onClick={() => onSortChange('deadline')}
        >
          Deadline
          <ArrowUpDown className={`ml-1 h-3 w-3 transform ${sortBy === 'deadline' && sortDirection === 'asc' ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Request Update
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Request Document Update</h2>
            <p className="text-sm text-muted-foreground">
              Submit a change request for this UX Business Requirements Document.
            </p>
          </div>
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
                        {requirementItems && requirementItems.length > 0 ? (
                          requirementItems.map(req => (
                            <SelectItem key={req.id} value={req.id}>
                              {req.company}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="general">General</SelectItem>
                        )}
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

export default SortControls;
