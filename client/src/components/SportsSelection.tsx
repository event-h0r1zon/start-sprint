import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SportsSelectionProps {
  selectedSport: string;
  onSportSelect: (sport: string) => void;
  onStartTraining: () => void;
}

const SportsSelection: React.FC<SportsSelectionProps> = ({
  selectedSport,
  onSportSelect,
  onStartTraining,
}) => {
  const sports = [
    { id: 'boxing', name: 'Boxing', icon: '🥊' },
    { id: 'yoga', name: 'Yoga', icon: '🧘' },
    { id: 'weightlifting', name: 'Weightlifting', icon: '🏋️' },
    { id: 'running', name: 'Running Form', icon: '🏃' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
  ];

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-2">Training Buddy</h1>
      <p className="text-gray-400 text-center mb-8">Select your sport and get real-time feedback</p>
      
      <div className="w-full max-w-2xl mb-12">
        <Carousel className="w-full">
          <CarouselContent>
            {sports.map((sport) => (
              <CarouselItem key={sport.id} className="md:basis-1/3 lg:basis-1/4">
                <div 
                  className={`
                    p-4 aspect-square rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer
                    transition-all duration-200 hover:scale-105 shadow-lg
                    ${selectedSport === sport.id ? 'bg-accent/20 border-2 border-accent' : 'bg-gray-800/50'}
                  `}
                  onClick={() => onSportSelect(sport.id)}
                >
                  <span className="text-3xl">{sport.icon}</span>
                  <h3 className="text-white font-medium text-sm">{sport.name}</h3>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <button
        onClick={onStartTraining}
        className="bg-accent text-white px-8 py-4 rounded-full text-lg font-medium
                 shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95"
      >
        Select
      </button>
    </div>
  );
};

export default SportsSelection;