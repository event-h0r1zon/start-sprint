import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

let detector: poseDetection.PoseDetector | null = null;

export const initializePoseDetector = async () => {
  if (!detector) {
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
    };
    detector = await poseDetection.createDetector(model, detectorConfig);
  }
  return detector;
};

export const analyzePose = async (video: HTMLVideoElement) => {
  if (!detector) return null;

  const poses = await detector.estimatePoses(video);
  if (!poses || poses.length === 0) return null;

  const pose = poses[0];
  const feedback = [];

  // Check guard position (hands up)
  const leftWrist = pose.keypoints.find(k => k.name === 'left_wrist');
  const rightWrist = pose.keypoints.find(k => k.name === 'right_wrist');
  const nose = pose.keypoints.find(k => k.name === 'nose');

  if (leftWrist && rightWrist && nose) {
    // Check if hands are at proper guard height (around chin level)
    if (leftWrist.y > nose.y + 50 || rightWrist.y > nose.y + 50) {
      feedback.push('Keep your guard up! Hands should be at chin level');
    }

    // Check if hands are too high
    if (leftWrist.y < nose.y - 30 || rightWrist.y < nose.y - 30) {
      feedback.push('Lower your guard slightly');
    }
  }

  // Check stance width
  const leftAnkle = pose.keypoints.find(k => k.name === 'left_ankle');
  const rightAnkle = pose.keypoints.find(k => k.name === 'right_ankle');
  
  if (leftAnkle && rightAnkle) {
    const stanceWidth = Math.abs(leftAnkle.x - rightAnkle.x);
    if (stanceWidth < 30) {
      feedback.push('Widen your stance');
    } else if (stanceWidth > 100) {
      feedback.push('Narrow your stance');
    }
  }

  return feedback.length > 0 ? feedback.join('. ') : 'Good form!';
};