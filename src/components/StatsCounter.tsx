import React from 'react';
import { Badge } from './ui/badge';

interface StatsCounterProps {
  excellent: number;
  average: number;
  bad: number;
}

const StatsCounter: React.FC<StatsCounterProps> = ({ excellent, average, bad }) => {
  return (
    <div className="flex justify-center gap-6 mt-4 p-4 bg-black/20 backdrop-blur-sm rounded-lg">
      <div className="flex flex-col items-center">
        <Badge variant="default" className="bg-green-500 mb-2">Excellent</Badge>
        <span className="text-2xl font-bold text-white">{excellent}</span>
      </div>
      <div className="flex flex-col items-center">
        <Badge variant="default" className="bg-yellow-500 mb-2">Average</Badge>
        <span className="text-2xl font-bold text-white">{average}</span>
      </div>
      <div className="flex flex-col items-center">
        <Badge variant="default" className="bg-red-500 mb-2">Bad</Badge>
        <span className="text-2xl font-bold text-white">{bad}</span>
      </div>
    </div>
  );
};

export default StatsCounter;