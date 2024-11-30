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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedSport, setSelectedSport] = useState('boxing');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showPerformanceProfile, setShowPerformanceProfile] = useState(false);

  const sports = [
    { id: 'boxing', name: 'Boxing', icon: '🥊' },
    { id: 'yoga', name: 'Yoga', icon: '🧘' },
    { id: 'weightlifting', name: 'Weightlifting', icon: '🏋️' },
    { id: 'running', name: 'Running Form', icon: '🏃' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
  ];

  const recommendedVideos = {
    boxing: [
      { 
        title: 'Perfect Jab Technique', 
        url: 'https://example.com/video1', 
        thumbnail: '🥊', 
        duration: '5:30',
        description: 'Learn the proper form for throwing a jab while maintaining chin protection'
      },
      { 
        title: 'Common Jab Mistakes to Avoid', 
        url: 'https://example.com/video2', 
        thumbnail: '⚠️', 
        duration: '4:15',
        description: 'Fix these common mistakes in your jab technique and guard position'
      },
      { 
        title: 'Chin Protection Drills', 
        url: 'https://example.com/video3', 
        thumbnail: '🛡️', 
        duration: '7:15',
        description: 'Essential drills to maintain proper guard while throwing jabs'
      },
      { 
        title: 'Shadow Boxing: Jab Focus', 
        url: 'https://example.com/video4', 
        thumbnail: '👊', 
        duration: '6:45',
        description: 'Practice your jab technique with these shadow boxing exercises'
      }
    ],
    yoga: [
      { title: 'Basic Yoga Poses', url: 'https://example.com/yoga1', thumbnail: '🧘‍♀️', duration: '10:00' },
      { title: 'Morning Yoga Flow', url: 'https://example.com/yoga2', thumbnail: '🌅', duration: '15:00' },
    ],
  };

  const performanceData = [
    {
      name: 'Guard Position',
      value: 75,
      fill: '#8884d8'
    },
    {
      name: 'Jab Speed',
      value: 65,
      fill: '#83a6ed'
    },
    {
      name: 'Chin Protection',
      value: 60,
      fill: '#8dd1e1'
    },
    {
      name: 'Stance',
      value: 80,
      fill: '#82ca9d'
    },
    {
      name: 'Form',
      value: 70,
      fill: '#a4de6c'
    }
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
    setShowRecommendations(false);
    setShowPerformanceProfile(false);
    setFeedback(`${selectedSport} session started - Analyzing your form...`);
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
    setFeedback(isPaused ? 'Session resumed' : 'Session paused');
  };

  const stopSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setShowPerformanceProfile(true);
    setFeedback('Session ended - Great work!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {!isActive && !showRecommendations && !showPerformanceProfile ? (
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
      ) : showPerformanceProfile ? (
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
                  minAngle={15}
                  background
                  clockWise={true}
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
                  <h3 className="text-white font-medium mb-2">{item.name}</h3>
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

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  setShowPerformanceProfile(false);
                  setShowRecommendations(true);
                }}
                className="bg-accent text-white px-6 py-3 rounded-full hover:opacity-90 transition-all"
              >
                View Recommended Videos
              </button>
              <button
                onClick={() => {
                  setShowPerformanceProfile(false);
                  setShowRecommendations(false);
                }}
                className="bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all"
              >
                Back to Sports Selection
              </button>
            </div>
          </div>
        </div>
      ) : showRecommendations ? (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Recommended Technique Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedVideos[selectedSport as keyof typeof recommendedVideos]?.map((video, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{video.thumbnail}</span>
                    <span className="text-white">{video.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-2">{video.description}</p>
                  <p className="text-gray-400">Duration: {video.duration}</p>
                  <a 
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition-all"
                  >
                    Watch Now
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          <button
            onClick={() => {
              setShowRecommendations(false);
              setFeedback('');
            }}
            className="mt-8 mx-auto block bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all"
          >
            Back to Sports Selection
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
