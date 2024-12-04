import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackOverlayProps {
  feedback: string;
  type?: 'success' | 'warning' | 'error';
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ 
  feedback,
  type = 'success'
}) => {
  const colors = {
    success: 'bg-success/90',
    warning: 'bg-yellow-500/90',
    error: 'bg-accent/90'
  };

  return (
    <AnimatePresence>
      {feedback && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-8 right-8 px-6 py-3 rounded-lg backdrop-blur-sm
             text-white font-medium shadow-lg"
        style={{ maxWidth: '90vw' }}
      >
        <div className={`${colors[type]} px-4 py-2 rounded-lg`}>
        {feedback}
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackOverlay;