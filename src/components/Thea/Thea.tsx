
import React, { useEffect } from 'react';
import { useThea } from '@/contexts/TheaContext';
import TheaAvatar from './TheaAvatar';
import TheaChat from './TheaChat';
import TheaIntro from './TheaIntro';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Thea: React.FC = () => {
  const { isMinimized, isIntroShown, currentSection, scrollTriggers, messages } = useThea();
  
  // Find the most recent message to display as a popup
  const mostRecentMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  
  // Error handling for Thea component
  useEffect(() => {
    try {
      // Check if critical dependencies are available
      if (!window.localStorage) {
        console.warn('LocalStorage not available. Some Thea features may not work properly.');
      }
      
      // Error handling for session storage
      if (!window.sessionStorage) {
        console.warn('SessionStorage not available. Thea intro state may not persist.');
        // Provide fallback with localStorage
        if (window.localStorage) {
          console.info('Using localStorage as fallback for Thea intro state.');
        }
      }
      
    } catch (error) {
      console.error('Error initializing Thea:', error);
      toast({
        title: "Assistant Error",
        description: "There was an issue loading Thea assistant. Please refresh the page.",
        variant: "destructive"
      });
    }
  }, []);
  
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
              transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
              className="bg-gradient-to-br from-white/95 to-gray-100/95 dark:from-gray-800/95 dark:to-gray-900/95 p-5 rounded-xl shadow-lg border border-purple-200/50 dark:border-purple-700/30 mb-2 max-w-xs backdrop-blur-sm"
            >
              <div className="relative">
                <div className="absolute -top-2 -right-2 flex items-center justify-center">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500 mt-1 shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {mostRecentMessage.text}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-r border-b border-purple-200 dark:border-purple-700/30"></div>
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
