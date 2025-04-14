
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThea } from '@/contexts/TheaContext';
import TheaAvatar from './TheaAvatar';
import TheaChat from './TheaChat';
import TheaIntro from './TheaIntro';

const Thea: React.FC = () => {
  const { isIntroShown } = useThea();
  const [isVisible, setIsVisible] = useState(true);

  // Hide Thea when scrolling down, show when scrolling up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      
      if (scrollingDown && currentScrollY > 300) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0.5, 
          y: isVisible ? 0 : 20,
          scale: isVisible ? 1 : 0.9
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 z-[9999]"
      >
        <TheaAvatar />
        <TheaChat />
        {isIntroShown && <TheaIntro />}
      </motion.div>
    </AnimatePresence>
  );
};

export default Thea;
