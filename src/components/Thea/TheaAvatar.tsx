
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { MessageSquare, X, Bot } from 'lucide-react';
import { useThea } from '@/contexts/TheaContext';
import { cn } from '@/lib/utils';

interface TheaAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const TheaAvatar: React.FC<TheaAvatarProps> = ({ 
  size = 'md', 
  onClick,
  className
}) => {
  const { isMinimized, toggleChat, isChatOpen, isSpeaking } = useThea();
  const controls = useAnimation();
  
  useEffect(() => {
    // Animate attention-grabbing effect occasionally
    const interval = setInterval(() => {
      if (isMinimized && !isChatOpen) {
        controls.start({
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
          transition: { duration: 1.5 }
        });
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [isMinimized, isChatOpen, controls]);
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24'  
  };
  
  return (
    <motion.div
      className={cn(
        'rounded-full flex items-center justify-center cursor-pointer relative z-[9999] overflow-hidden fixed bottom-6 right-6',
        sizeClasses[size],
        isMinimized 
          ? 'bg-gradient-to-br from-purple-600 to-pink-500 shadow-[0_0_15px_rgba(139,92,246,0.7)]' 
          : 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-[0_0_20px_rgba(139,92,246,0.8)]',
        'shadow-lg border-2 border-white/20 avatar-glow',
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        ...controls
      }}
      whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(147, 51, 234, 0.9)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick || toggleChat}
    >
      {isChatOpen ? (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <X className="text-white h-6 w-6 z-10 drop-shadow-lg" />
        </motion.div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Bot className="h-10 w-10 text-white z-10 drop-shadow-lg" />
        </div>
      )}
    </motion.div>
  );
};

export default TheaAvatar;
