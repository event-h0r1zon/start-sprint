import React, { useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { initializePoseDetector, analyzePose } from '../utils/poseDetection';

interface CameraViewProps {
  onStream: (stream: MediaStream) => void;
  onPoseAnalysis?: (feedback: string) => void;
  isActive?: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  onStream, 
  onPoseAnalysis,
  isActive = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          onStream(stream);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onStream]);

  useEffect(() => {
    let animationFrame: number;
    let detector: any;

    const analyzePoseLoop = async () => {
      if (!videoRef.current || !detector || !isActive) return;

      const feedback = await analyzePose(videoRef.current);
      if (feedback && onPoseAnalysis) {
        onPoseAnalysis(feedback);
      }

      animationFrame = requestAnimationFrame(analyzePoseLoop);
    };

    const setupDetector = async () => {
      if (isActive) {
        detector = await initializePoseDetector();
        analyzePoseLoop();
      }
    };

    setupDetector();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, onPoseAnalysis]);

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm p-2 rounded-lg">
        <Camera className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

export default CameraView;