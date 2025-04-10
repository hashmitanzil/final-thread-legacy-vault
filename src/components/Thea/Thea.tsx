
import React from 'react';
import { useThea } from '@/contexts/TheaContext';
import TheaAvatar from './TheaAvatar';
import TheaChat from './TheaChat';
import TheaIntro from './TheaIntro';
import { motion, AnimatePresence } from 'framer-motion';

const Thea: React.FC = () => {
  const { isMinimized, isIntroShown, currentSection } = useThea();
  
  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2"
        layout
      >
        <AnimatePresence>
          {!isMinimized && !isIntroShown && currentSection && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-2 max-w-xs"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {currentSection === 'features-section' && "These features help secure your digital legacy."}
                {currentSection === 'how-it-works' && "Our 3-step process makes it easy to preserve your memories."}
                {currentSection === 'testimonials' && "See what others say about our service."}
                {currentSection === 'cta-section' && "Ready to get started with Final Thread?"}
              </p>
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
