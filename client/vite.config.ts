import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { readFileSync } from "fs";
import { basename } from "path";
// vite.config.ts
import { mediapipe } from 'vite-plugin-mediapipe';

function mediapipe_workaround() {
  return {
    name: 'mediapipe_workaround',
    load(id: string) {
      const MEDIAPIPE_EXPORT_NAMES = {
        'pose.js': [
          'POSE_LANDMARKS', 
          'POSE_CONNECTIONS', 
          'POSE_LANDMARKS_LEFT', 
          'POSE_LANDMARKS_RIGHT', 
          'POSE_LANDMARKS_NEUTRAL', 
          'Pose',
          'VERSION',
        ],
        'hands.js': [
          'VERSION', 
          'HAND_CONNECTIONS', 
          'Hands', 
        ],
        'camera_utils.js': [
          'Camera', 
        ],
        'drawing_utils.js': [
          'drawConnectors',
          'drawLandmarks',
          'lerp',
        ],
        'control_utils.js': [
          'drawConnectors',
          'FPS',
          'ControlPanel',
          'StaticText',
          'Toggle',
          'SourcePicker',
          
          // 'InputImage', not working with this export. Is defined in index.d.ts 
          // but is not defined in control_utils.js
          'InputImage',
          
          'Slider',
        ],
      }

      let fileName = basename(id);
      if (!(fileName in MEDIAPIPE_EXPORT_NAMES)) return null
      let code = readFileSync(id, 'utf-8');
      for (const name of MEDIAPIPE_EXPORT_NAMES[fileName as keyof typeof MEDIAPIPE_EXPORT_NAMES]) {
        code += `exports.${name} = ${name};`;
      }
      return {code};
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    mediapipe_workaround(),
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

