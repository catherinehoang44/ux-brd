
import React, { useState } from 'react';
import ProposalLayout from '@/components/ProposalLayout';
import ProposalList from '@/components/ProposalList';

const Index = () => {
  const [approvalCount, setApprovalCount] = useState(0);
  const [isEmailBarVisible, setIsEmailBarVisible] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleApproval = (isApproved: boolean) => {
    setApprovalCount(prev => isApproved ? prev + 1 : Math.max(0, prev - 1));
  };
  
  const handleToggleEmailBar = () => {
    setIsEmailBarVisible(prev => !prev);
  };
  
  const handleSubscribe = (email: string) => {
    setIsSubscribed(true);
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
          />
        </div>
      </div>
    </ProposalLayout>
  );
};

export default Index;
