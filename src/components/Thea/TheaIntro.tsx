
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useThea } from '@/contexts/TheaContext';

const TheaIntro: React.FC = () => {
  const { isIntroShown, completeIntro, messages } = useThea();
  
  if (!isIntroShown) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-24 right-8 md:right-12 max-w-xs bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-purple-200 dark:border-purple-900 z-50"
    >
      <button
        onClick={completeIntro}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-medium">T</span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">
            Thea - Your Legacy Guide
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {messages.length > 0 ? messages[0].text : "Hi, I'm Thea, your legacy guide. Let me walk you through your experience."}
          </p>
          <div className="mt-3">
            <button
              onClick={completeIntro}
              className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TheaIntro;
