import React, { useRef, useEffect } from 'react';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;
    videoRef.current.style.display = 'none';
    const parentDiv = videoRef.current.parentElement;
    if (parentDiv) {
      videoRef.current.width = parentDiv.clientWidth;
      videoRef.current.height = parentDiv.clientHeight;
      canvasRef.current.width = parentDiv.clientWidth;
      canvasRef.current.height = parentDiv.clientHeight;
    }

    function onResults(results) {
      const canvasCtx = canvasRef.current.getContext('2d');

      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.poseLandmarks) {
        const leftEar = results.poseLandmarks[7]; // Index 7 corresponds to the left ear
        canvasCtx.beginPath();
        canvasCtx.arc(leftEar.x * canvasRef.current.width, leftEar.y * canvasRef.current.height, 5, 0, 2 * Math.PI);
        canvasCtx.fillStyle = 'blue';
        canvasCtx.fill();
        if (onPoseAnalysis) {
          onPoseAnalysis(`Left Ear Position: ${JSON.stringify(leftEar)}`);
        }
      }
    }

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await pose.send({ image: videoRef.current });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
  }, [videoRef, canvasRef]);

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden flex items-center justify-center">
      <video ref={videoRef} className="absolute" />
      <canvas ref={canvasRef} className="absolute" />
      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm p-2 rounded-lg">
      </div>
    </div>
  );
};

export default CameraView;
