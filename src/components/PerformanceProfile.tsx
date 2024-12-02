import React from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";

interface PerformanceProfileProps {
  onViewRecommendations: () => void;
  onBackToSports: () => void;
  skillLevels: Record<string, number>;
  onStartTraining: () => void;
  showRecommendationsButton?: boolean;
  isPostTraining?: boolean;
}

const PerformanceProfile: React.FC<PerformanceProfileProps> = ({
  onViewRecommendations,
  onBackToSports,
  skillLevels,
  onStartTraining,
  showRecommendationsButton = false,
  isPostTraining = false,
}) => {
  const getIncreasedSkills = () => {
    if (!isPostTraining) return skillLevels;
    
    return {
      'Guard Position': Math.min(100, skillLevels['Guard Position'] + 3),
      'Jab Speed': Math.min(100, skillLevels['Jab Speed'] + 4),
      'Chin Protection': Math.min(100, skillLevels['Chin Protection'] + 2),
      'Stance': Math.min(100, skillLevels['Stance'] + 3),
      'Form': Math.min(100, skillLevels['Form'] + 2)
    };
  };

  const currentSkills = getIncreasedSkills();
  
  const performanceData = Object.entries(currentSkills).map(([name, value], index) => ({
    name,
    value,
    fill: [
      '#8884d8',
      '#83a6ed',
      '#8dd1e1',
      '#82ca9d',
      '#a4de6c'
    ][index % 5],
    increase: isPostTraining ? value - skillLevels[name] : 0
  }));

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Boxing Performance Profile</h2>
      
      <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-xl p-8 mb-8">
        <ChartContainer className="w-full aspect-square max-w-xl mx-auto" config={{}}>
          <RadialBarChart 
            width={500} 
            height={500} 
            innerRadius="30%" 
            outerRadius="80%" 
            data={performanceData}
            startAngle={180} 
            endAngle={-180}
          >
            <RadialBar
              label={{ fill: '#fff', position: 'insideStart' }}
              background
              dataKey="value"
              cornerRadius={10}
            />
            <Legend />
            <Tooltip />
          </RadialBarChart>
        </ChartContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {performanceData.map((item) => (
            <div key={item.name} className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">
                {item.name}
                {item.increase > 0 && (
                  <span className="text-green-400 ml-2">
                    +{item.increase}%
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.value}%`,
                      backgroundColor: item.fill 
                    }}
                  />
                </div>
                <span className="text-white font-mono">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-8 w-full max-w-md mx-auto">
          <button
            onClick={onStartTraining}
            className="w-full bg-accent text-white px-6 py-3 rounded-full hover:opacity-90 transition-all"
          >
            Start Training
          </button>
          {showRecommendationsButton && (
            <button
              onClick={onViewRecommendations}
              className="w-full bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all"
            >
              View Recommended Videos
            </button>
          )}
          <button
            onClick={onBackToSports}
            className="w-full bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all"
          >
            Back to Sports Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceProfile;