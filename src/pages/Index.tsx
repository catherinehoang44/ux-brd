
import React, { useState, useEffect } from 'react';
import ProposalLayout from '@/components/ProposalLayout';
import ProposalList from '@/components/ProposalList';
import { getSheetData, recordDocumentApproval } from '@/services/googleSheetService';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  const [approvalCount, setApprovalCount] = useState(0);
  const [isEmailBarVisible, setIsEmailBarVisible] = useState(false); // Set to false to hide email bar
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [documentVersions, setDocumentVersions] = useState<string[]>(['FY25 Q2']);
  const [selectedVersion, setSelectedVersion] = useState<string>('FY25 Q2');
  const [lastUpdated, setLastUpdated] = useState<string>('March 17, 2025');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch available document versions
    const fetchVersions = async () => {
      try {
        setIsLoading(true);
        const data = await getSheetData();
        console.log("Retrieved sheet data:", data);
        
        if (data.documentVersions && data.documentVersions.length > 0) {
          setDocumentVersions(data.documentVersions);
          setSelectedVersion(data.documentVersions[0]);
        }
        if (data.lastUpdated) {
          setLastUpdated(data.lastUpdated);
        }
      } catch (error) {
        console.error('Error fetching document versions:', error);
        toast.error('Failed to load document data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVersions();
  }, []);
  
  const handleApproval = (isApproved: boolean) => {
    setApprovalCount(prev => isApproved ? prev + 1 : Math.max(0, prev - 1));
    
    // Record the approval or removal in Google Sheets
    recordDocumentApproval(
      isApproved ? 'Approval Given' : 'Approval Removed', 
      selectedVersion
    ).then(success => {
      if (!success) {
        toast.error("Failed to record approval status");
      }
    });
  };
  
  const handleToggleEmailBar = () => {
    setIsEmailBarVisible(prev => !prev);
  };
  
  const handleSubscribe = (email: string) => {
    setIsSubscribed(true);
  };
  
  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
  };
  
  const exclusions = [
    "Content creation and authoring workflows for certification exams.",
    "Back-end systems integration with third-party certification platforms.",
    "IT infrastructure and hardware requirements.",
    "Staff training and organizational change management.",
    "Marketing and promotional strategies for certifications.",
    "Financial processing and payment gateway implementations."
  ];
  
  return (
    <ProposalLayout 
      title="UX Business Requirements" 
      price="Approve Document"
      approvalCount={approvalCount}
      onApproval={handleApproval}
      documentVersions={documentVersions}
      selectedVersion={selectedVersion}
      onVersionChange={handleVersionChange}
      lastUpdated={lastUpdated}
      hideApprovalButton={false} // Changed to false to show the approval button
    >
      <ScrollArea className="h-[calc(100vh-80px)] w-full pr-4">
        <div className="flex flex-col gap-12 pb-24 px-4">
          <div className="w-full max-w-4xl">
            <h2 className="text-xl font-medium mb-5">Objective</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              This document outlines the comprehensive UX business requirements for the Adobe Certification Portal (ACP). 
              The ACP serves as the primary platform for users to discover, register for, complete, and manage their Adobe DX product certifications.
            </p>
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-500">Loading requirements data from Excel...</p>
              </div>
            ) : (
              <ProposalList 
                isEmailBarVisible={isEmailBarVisible} 
                onToggleEmailBar={handleToggleEmailBar}
                onSubscribe={handleSubscribe}
                isSubscribed={isSubscribed}
                exclusions={exclusions}
                hideExclusions={true}
                selectedVersion={selectedVersion}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </ProposalLayout>
  );
};

export default Index;
