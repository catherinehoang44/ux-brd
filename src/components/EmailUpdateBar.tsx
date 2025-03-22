
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { addEmailUpdate } from '@/services/googleSheetService';

interface EmailUpdateBarProps {
  onSubscribe?: (email: string) => void;
  onToggleEmailBar?: () => void;
  hidden?: boolean; // New prop to hide the component
}

const EmailUpdateBar: React.FC<EmailUpdateBarProps> = ({ 
  onSubscribe,
  onToggleEmailBar,
  hidden = true // Default to hidden
}) => {
  const [updateEmail, setUpdateEmail] = useState('');
  const [emailBarHovered, setEmailBarHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDocUpdates = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (updateEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setIsSubmitting(true);
      
      try {
        // Add the email to the Email Updates table with type "BRD Updates"
        const success = await addEmailUpdate(updateEmail, "BRD Updates");
        
        if (success) {
          setUpdateEmail('');
          if (onSubscribe) {
            onSubscribe(updateEmail);
          }
        } else {
          toast.error("Failed to subscribe. Please try again.");
        }
      } catch (error) {
        console.error("Error subscribing:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  // Don't render if hidden
  if (hidden) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-transparent py-2 px-5 rounded-lg shadow-sm border border-border/5 max-w-xl w-full mx-auto transition-all duration-300 hover:shadow-md z-10 backdrop-blur-sm"
      onMouseEnter={() => setEmailBarHovered(true)}
      onMouseLeave={() => setEmailBarHovered(false)}
    >
      <button 
        className={`absolute top-1/2 right-2 transform -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center text-gray-400/40 dark:text-gray-500/40 hover:bg-gray-200/40 dark:hover:bg-gray-600/40 transition-opacity transition-colors ${emailBarHovered ? 'opacity-100' : 'opacity-0'}`}
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
          className="bg-transparent border-gray-200/20 dark:border-gray-700/20 text-sm flex-1"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          variant="outline" 
          size="sm" 
          className="text-xs"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Subscribing..." : "Get Updates"}
        </Button>
      </form>
    </div>
  );
};

export default EmailUpdateBar;
