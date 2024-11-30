import React, { useState, useCallback } from 'react';
import CameraView from '../components/Camera';
import FeedbackOverlay from '../components/FeedbackOverlay';
import SessionControls from '../components/SessionControls';
import SportsSelection from '../components/SportsSelection';
import PerformanceProfile from '../components/PerformanceProfile';
import RecommendedVideos from '../components/RecommendedVideos';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedSport, setSelectedSport] = useState('boxing');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showPerformanceProfile, setShowPerformanceProfile] = useState(false);

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
    setFeedback(''); // Remove feedback message when starting
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

  if (!isActive && !showRecommendations && !showPerformanceProfile) {
    return (
      <SportsSelection
        selectedSport={selectedSport}
        onSportSelect={setSelectedSport}
        onStartTraining={startSession}
      />
    );
  }

  if (showPerformanceProfile) {
    return (
      <PerformanceProfile
        onViewRecommendations={() => {
          setShowPerformanceProfile(false);
          setShowRecommendations(true);
        }}
        onBackToSports={() => {
          setShowPerformanceProfile(false);
          setShowRecommendations(false);
        }}
      />
    );
  }

  if (showRecommendations) {
    return (
      <RecommendedVideos
        selectedSport={selectedSport}
        onBack={() => {
          setShowRecommendations(false);
          setFeedback('');
        }}
      />
    );
  }

  return (
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
  );
};

export default Index;