import React, { useRef, useEffect } from 'react';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { get } from 'http';
import { frame } from 'framer-motion';

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

    let distance_history_side = [];
    let distance_history_ear_hip = [];

    function draw_dot(canvasCtx, point, r, color, frame_shape) {
      canvasCtx.beginPath();
      canvasCtx.arc(point.x * frame_shape[0], point.y * frame_shape[1], r, 0, 2 * Math.PI);
      canvasCtx.fillStyle = color;
      canvasCtx.fill();
    }

    function get_visible_side(landmarks) {
      if (landmarks) {

        const left_depth = landmarks[11].z;
        const right_depth = landmarks[12].z;

        if (left_depth < right_depth) 
          return 'left';
        else 
          return 'right';
        
      }
      else
        return null;
    }

    function calculate_distance_y(landmarks, index1, index2, frame_shape) {
      if (landmarks) {
        const y1 = landmarks[index1].y * frame_shape[1];
        const y2 = landmarks[index2].y * frame_shape[1];
        return Math.abs(y2 - y1);
      }
      else
        return null;
    }

    function smooth_distance(current_distance, history, window_size) {
      history.push(current_distance);
      if (history.length > window_size) 
        history.shift();
      const sum = history.reduce((a, b) => a + b, 0);
      return (sum / history.length);
    }

    function get_landmark_coordinates(landmarks, index, frame_shape) {
      if (landmarks) 
        return {
          x: landmarks[index].x * frame_shape[0],
          y: landmarks[index].y * frame_shape[1],
        };
      else
        return null;
    }

    function draw_side_arm(canvasCtx, landmarks, visible_side, frame_shape, color) {
      let arm_points = visible_side === 'left' ? [11, 13, 15] : [12, 14, 16];

      for (let i = 0; i < arm_points.length - 1; i++) {
        const start = get_landmark_coordinates(landmarks, arm_points[i], frame_shape);
        const end = get_landmark_coordinates(landmarks, arm_points[i + 1], frame_shape);        
        
        canvasCtx.beginPath();
        canvasCtx.moveTo(start.x, start.y);
        canvasCtx.lineTo(end.x, end.y);
        canvasCtx.strokeStyle = color;
        canvasCtx.lineWidth = 3;
        canvasCtx.stroke();
      }
    }

    function onResults(results) {
      const canvasCtx = canvasRef.current.getContext('2d');
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const frame_shape = [canvasRef.current.width, canvasRef.current.height];

      if (results.poseLandmarks) {
        const landmarks = results.poseLandmarks;

        let is_correct = false;
        const visible_side = get_visible_side(landmarks);
        const ear_index = visible_side === 'left' ? 3 : 4;
        const elbow_index = visible_side === 'left' ? 13 : 14;
        const hip_index = visible_side === 'left' ? 23 : 24;
        const chin_index = 0;

        let side_distance = calculate_distance_y(landmarks, elbow_index, chin_index, frame_shape);
        const smoothed_side_distance = smooth_distance(side_distance, distance_history_side, 5);
        
        let ear_hip_distance = calculate_distance_y(landmarks, ear_index, hip_index, frame_shape);
        const smoothed_ear_hip_distance = smooth_distance(ear_hip_distance, distance_history_ear_hip, 5);
        
        let dynamic_threshold = 0;
        if (smooth_distance && side_distance) 
          dynamic_threshold = smoothed_side_distance / smoothed_ear_hip_distance;

        let estimated_threshold = 0.14;
        if (dynamic_threshold)
          is_correct = smoothed_side_distance && dynamic_threshold < estimated_threshold;

        let arm_color = is_correct ? 'green' : 'red';
        draw_side_arm(canvasCtx, landmarks, visible_side, frame_shape, arm_color);

        /*
        if (is_correct) {
          canvasCtx.font = '24px Arial';
          canvasCtx.fillStyle = 'green';
          canvasCtx.fillText('Correct', 10, 50);
        }

        else {
          canvasCtx.font = '24px Arial';
          canvasCtx.fillStyle = 'red';
          canvasCtx.fillText('Incorrect', 10, 50);
        }
        */
        
        if (onPoseAnalysis) {
          if (is_correct)
            onPoseAnalysis('Correct');
          else
            onPoseAnalysis('Incorrect');
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
      }
    });
    camera.start();
  }, [videoRef, canvasRef]);

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden flex items-center justify-center">
      <video ref={videoRef} className="absolute w-full h-full object-cover" />
      <canvas ref={canvasRef} className="absolute w-full h-full object-cover" />
      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm p-2 rounded-lg">
      </div>
    </div>
  );
};

export default CameraView;
