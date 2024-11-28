import React, { useState, useCallback } from 'react';
import CameraView from '../components/Camera';
import FeedbackOverlay from '../components/FeedbackOverlay';
import SessionControls from '../components/SessionControls';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleStream = useCallback((newStream: MediaStream) => {
    setStream(newStream);
  }, []);

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
    setFeedback('Session started - Analyzing your form...');
    // Here you would typically start your AI analysis
    simulateFeedback();
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

  // Temporary function to simulate AI feedback
  const simulateFeedback = () => {
    const feedbackMessages = [
      'Keep your guard up',
      'Good form on that jab',
      'Rotate your hips more on the cross',
      'Excellent footwork',
      'Remember to breathe',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (!isActive || isPaused) {
        clearInterval(interval);
        return;
      }
      setFeedback(feedbackMessages[index % feedbackMessages.length]);
      index++;
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {!isActive ? (
        <div className="h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">Boxing Buddy</h1>
          <p className="text-gray-400 text-center mb-8">Get real-time feedback on your boxing technique</p>
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
          <CameraView onStream={handleStream} />
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