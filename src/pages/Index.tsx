
import React, { useState, useEffect } from 'react';
import ProposalLayout from '@/components/ProposalLayout';
import ProposalList from '@/components/ProposalList';
import { getSheetData, recordDocumentApproval } from '@/services/googleSheetService';
import { toast } from 'sonner';

const Index = () => {
  const [approvalCount, setApprovalCount] = useState(0);
  const [isEmailBarVisible, setIsEmailBarVisible] = useState(false); // Set to false to hide email bar
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [documentVersions, setDocumentVersions] = useState<string[]>(['FY25 Q2']);
  const [selectedVersion, setSelectedVersion] = useState<string>('FY25 Q2');
  const [lastUpdated, setLastUpdated] = useState<string>('March 17, 2025');
  
  useEffect(() => {
    // Fetch available document versions
    const fetchVersions = async () => {
      try {
        const data = await getSheetData();
        if (data.documentVersions && data.documentVersions.length > 0) {
          setDocumentVersions(data.documentVersions);
          setSelectedVersion(data.documentVersions[0]);
        }
        if (data.lastUpdated) {
          setLastUpdated(data.lastUpdated);
        }
      } catch (error) {
        console.error('Error fetching document versions:', error);
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
      hideApprovalButton={true} // Pass this new prop to hide the approval button
    >
      <div className="flex flex-col gap-12 pb-24">
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-medium mb-5">Objective</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            This document outlines the comprehensive UX business requirements for the Adobe Certification Portal (ACP). 
            The ACP serves as the primary platform for users to discover, register for, complete, and manage their Adobe DX product certifications.
          </p>
          <ProposalList 
            isEmailBarVisible={isEmailBarVisible} 
            onToggleEmailBar={handleToggleEmailBar}
            onSubscribe={handleSubscribe}
            isSubscribed={isSubscribed}
            exclusions={exclusions}
            hideExclusions={true}
            selectedVersion={selectedVersion}
          />
        </div>
      </div>
    </ProposalLayout>
  );
};

export default Index;
