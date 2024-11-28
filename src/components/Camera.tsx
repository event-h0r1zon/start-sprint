import React, { useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface CameraViewProps {
  onStream: (stream: MediaStream) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onStream }) => {
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