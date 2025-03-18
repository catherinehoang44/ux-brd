
import React from 'react';

interface ExclusionsSectionProps {
  exclusions?: string[];
  hidden?: boolean;
}

const ExclusionsSection: React.FC<ExclusionsSectionProps> = ({ exclusions = [], hidden = false }) => {
  if (hidden || !exclusions || exclusions.length === 0) return null;
  
  return (
    <div className="mt-12 pt-6 border-t border-border">
      <h2 className="text-xl font-medium mb-5">Exclusions: Out of Scope</h2>
      <ul className="space-y-2">
        {exclusions.map((exclusion, index) => (
          <li key={index} className="text-gray-600 dark:text-gray-300 flex items-start gap-2">
            <span className="text-gray-400">•</span>
            <span>{exclusion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExclusionsSection;
