
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface DataPoint {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface DataVisualizerProps {
  className?: string;
  count?: number;
}

const DataVisualizer: React.FC<DataVisualizerProps> = ({ 
  className,
  count = 40
}) => {
  const [activePoint, setActivePoint] = useState<string | null>(null);
  
  // Generate some sample data points
  const dataPoints: DataPoint[] = [
    { id: 'DS21', x: 30, y: 55, label: 'DS21' },
    { id: 'FE29', x: 45, y: 45, label: 'FE29' },
    { id: 'BE1', x: 60, y: 45, label: 'BE1' },
    { id: 'DB17', x: 75, y: 35, label: 'DB17' },
    { id: 'KN0', x: 75, y: 60, label: 'KN0' },
    { id: 'DK03', x: 55, y: 70, label: 'DK03' },
    { id: 'CL10', x: 80, y: 45, label: 'CL10' },
    { id: 'TB12', x: 80, y: 55, label: 'TB12' },
    { id: 'H1', x: 25, y: 30, label: 'H1' },
    { id: 'H2', x: 45, y: 30, label: 'H2' },
  ];

  const handlePointHover = (id: string) => {
    setActivePoint(id);
  };

  const handlePointLeave = () => {
    setActivePoint(null);
  };

  return (
    <div className={cn("relative h-96 w-full overflow-hidden pattern-background rounded-lg", className)}>
      <div className="absolute top-4 left-6 text-sm font-medium text-gray-600 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
        Count · {count}
      </div>
      
      {/* Center Circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white border border-border subtle-shadow flex items-center justify-center">
        <div className="text-lg font-light">2023</div>
      </div>
      
      {/* Circular Outline */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full border border-gray-200/50"></div>
      
      {/* Data Points */}
      {dataPoints.map((point) => (
        <div
          key={point.id}
          className={cn(
            "data-point w-10 h-6", 
            activePoint === point.id ? "ring-2 ring-primary/20" : ""
          )}
          style={{ 
            left: `${point.x}%`, 
            top: `${point.y}%` 
          }}
          onMouseEnter={() => handlePointHover(point.id)}
          onMouseLeave={handlePointLeave}
        >
          {point.label}
        </div>
      ))}
    </div>
  );
};

export default DataVisualizer;
