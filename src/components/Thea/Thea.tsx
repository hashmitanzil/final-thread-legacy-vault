
import React from 'react';
import { useThea } from '@/contexts/TheaContext';
import TheaAvatar from './TheaAvatar';
import TheaChat from './TheaChat';
import TheaIntro from './TheaIntro';
import { motion, AnimatePresence } from 'framer-motion';

const Thea: React.FC = () => {
  const { isMinimized, isIntroShown, currentSection, scrollTriggers, messages } = useThea();
  
  // Find the most recent message to display as a popup
  const mostRecentMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  
  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2"
        layout
      >
        <AnimatePresence>
          {!isMinimized && !isIntroShown && mostRecentMessage && mostRecentMessage.sender === 'thea' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-purple-200 dark:border-purple-700 mb-2 max-w-xs"
            >
              <div className="relative">
                <div className="absolute -top-2 -right-2 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {mostRecentMessage.text}
                </p>
              </div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-r border-b border-purple-200 dark:border-purple-700"></div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <TheaAvatar />
      </motion.div>
      
      <TheaChat />
      <TheaIntro />
    </>
  );
};

export default Thea;
