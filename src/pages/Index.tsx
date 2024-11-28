import React, { useState, useCallback } from 'react';
import CameraView from '../components/Camera';
import FeedbackOverlay from '../components/FeedbackOverlay';
import SessionControls from '../components/SessionControls';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedSport, setSelectedSport] = useState('boxing');

  const sports = [
    { id: 'boxing', name: 'Boxing', icon: '🥊' },
    { id: 'yoga', name: 'Yoga', icon: '🧘' },
    { id: 'weightlifting', name: 'Weightlifting', icon: '🏋️' },
    { id: 'running', name: 'Running Form', icon: '🏃' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
  ];

  const handleStream = useCallback((newStream: MediaStream) => {
    setStream(newStream);
  }, []);

  const handlePoseAnalysis = useCallback((newFeedback: string) => {
    if (!isPaused && selectedSport === 'boxing') {
      setFeedback(newFeedback);
    }
  }, [isPaused, selectedSport]);

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
    setFeedback(`${selectedSport} session started - Analyzing your form...`);
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
    setFeedback(isPaused ? 'Session resumed' : 'Session paused');
  };

  const stopSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setFeedback('Session ended - Great work!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {!isActive ? (
        <div className="h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">Training Buddy</h1>
          <p className="text-gray-400 text-center mb-8">Select your sport and get real-time feedback</p>
          
          <div className="w-full max-w-md mb-12">
            <Carousel className="w-full">
              <CarouselContent>
                {sports.map((sport) => (
                  <CarouselItem key={sport.id} className="md:basis-1/2 lg:basis-1/3">
                    <div 
                      className={`
                        p-6 aspect-square rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer
                        transition-all duration-200 hover:scale-105
                        ${selectedSport === sport.id ? 'bg-accent/20 border-2 border-accent' : 'bg-gray-800/50'}
                      `}
                      onClick={() => setSelectedSport(sport.id)}
                    >
                      <span className="text-4xl">{sport.icon}</span>
                      <h3 className="text-white font-medium">{sport.name}</h3>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <button
            onClick={startSession}
            className="bg-accent text-white px-8 py-4 rounded-full text-lg font-medium
                     shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95"
          >
            Start Training
          </button>
        </div>
      ) : (
        <div className="relative h-screen">
          <CameraView 
            onStream={handleStream} 
            onPoseAnalysis={handlePoseAnalysis}
            isActive={isActive && !isPaused}
          />
          {feedback && <FeedbackOverlay feedback={feedback} />}
          <SessionControls
            isActive={isActive}
            isPaused={isPaused}
            onStart={startSession}
            onPause={pauseSession}
            onStop={stopSession}
          />
        </div>
      )}
    </div>
  );
};

export default Index;