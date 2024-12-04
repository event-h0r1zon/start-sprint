import React from 'react';
import { Play, Pause, StopCircle } from 'lucide-react';

interface SessionControlsProps {
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  isActive,
  isPaused,
  onStart,
  onPause,
  onStop,
}) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 
                    bg-black/20 backdrop-blur-sm p-4 rounded-full">
      {!isActive ? (
        <button
          onClick={onStart}
          className="bg-accent text-white p-4 rounded-full hover:opacity-90 
                     transition-opacity duration-200"
        >
          <Play className="w-6 h-6" />
        </button>
      ) : (
        <>
          <button
            onClick={onPause}
            className="bg-primary text-white p-4 rounded-full hover:opacity-90 
                       transition-opacity duration-200"
          >
            {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </button>
          <button
            onClick={onStop}
            className="bg-accent text-white p-4 rounded-full hover:opacity-90 
                       transition-opacity duration-200"
          >
            <StopCircle className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default SessionControls;