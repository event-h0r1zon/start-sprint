import React, { useState, useCallback } from 'react';
import CameraView from '../components/Camera';
import FeedbackOverlay from '../components/FeedbackOverlay';
import SessionControls from '../components/SessionControls';
import SportsSelection from '../components/SportsSelection';
import PerformanceProfile from '../components/PerformanceProfile';
import RecommendedVideos from '../components/RecommendedVideos';
import StatsCounter from '../components/StatsCounter';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedSport, setSelectedSport] = useState('boxing');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showPerformanceProfile, setShowPerformanceProfile] = useState(false);
  const [showInitialProfile, setShowInitialProfile] = useState(false);
  const [stats, setStats] = useState({ excellent: 0, average: 0, bad: 0 });
  const [skillLevels, setSkillLevels] = useState({
    'Guard Position': 75,
    'Jab Speed': 65,
    'Chin Protection': 60,
    'Stance': 80,
    'Form': 70
  });

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
    setShowInitialProfile(false);
    setFeedback('');
    setStats({ excellent: 0, average: 0, bad: 0 });
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
    // Increase Jab Speed by 4% after training
    setSkillLevels(prev => ({
      ...prev,
      'Jab Speed': Math.min(100, prev['Jab Speed'] + 4)
    }));
  };

  if (!isActive && !showRecommendations && !showPerformanceProfile && !showInitialProfile) {
    return (
      <SportsSelection
        selectedSport={selectedSport}
        onSportSelect={setSelectedSport}
        onStartTraining={() => setShowInitialProfile(true)}
      />
    );
  }

  if (showInitialProfile) {
    return (
      <PerformanceProfile
        onViewRecommendations={() => {
          setShowInitialProfile(false);
          setShowRecommendations(true);
        }}
        onBackToSports={() => {
          setShowInitialProfile(false);
        }}
        skillLevels={skillLevels}
        onStartTraining={startSession}
        showRecommendationsButton={false}
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
        }}
        skillLevels={skillLevels}
        onStartTraining={startSession}
        showRecommendationsButton={true}
        isPostTraining={true}
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
    <div style={{ position: 'relative', height: '100vh', display: 'flex' }}>
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