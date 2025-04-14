
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { useThea } from '@/contexts/TheaContext';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const { isMinimized, toggleChat, isChatOpen, isSpeaking, messages } = useThea();
  const controls = useAnimation();
  
  // Most recent message for popup
  const mostRecentMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const showRecent = isMinimized && mostRecentMessage && mostRecentMessage.sender === 'thea';
  
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

  // Pulsing animation when speaking
  useEffect(() => {
    if (isSpeaking) {
      controls.start({
        boxShadow: [
          '0 0 15px rgba(139,92,246,0.7)',
          '0 0 25px rgba(139,92,246,0.9)',
          '0 0 15px rgba(139,92,246,0.7)'
        ],
        transition: { 
          duration: 1.5, 
          repeat: Infinity, 
          repeatType: 'reverse' 
        }
      });
    } else {
      controls.stop();
      controls.start({
        boxShadow: '0 0 15px rgba(139,92,246,0.7)'
      });
    }
  }, [isSpeaking, controls]);
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24'  
  };
  
  return (
    <Popover open={showRecent && !isChatOpen}>
      <PopoverTrigger asChild>
        <motion.div
          className={cn(
            'rounded-full flex items-center justify-center cursor-pointer relative z-[9999] overflow-hidden shadow-lg border-2 border-white/20',
            sizeClasses[size],
            isMinimized 
              ? 'bg-gradient-to-br from-purple-600 to-pink-500' 
              : 'bg-gradient-to-br from-purple-500 to-indigo-600',
            'shadow-lg border-2 border-white/20',
            className
          )}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={controls}
          whileHover={{ 
            scale: 1.1, 
            boxShadow: '0 0 25px rgba(147, 51, 234, 0.9)',
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick || toggleChat}
        >
          {isChatOpen ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <X className="text-white h-6 w-6 z-10 drop-shadow-lg" />
            </motion.div>
          ) : (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="h-10 w-10 text-white z-10 drop-shadow-lg" />
            </motion.div>
          )}
          
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 bg-purple-500 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Particles effect around the button */}
          {isMinimized && !isChatOpen && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0.7 
                  }}
                  animate={{ 
                    x: Math.random() * 60 - 30, 
                    y: Math.random() * 60 - 30, 
                    opacity: 0,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 1, 
                    repeat: Infinity, 
                    repeatType: "loop", 
                    delay: i * 0.2
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      </PopoverTrigger>
      <PopoverContent 
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-purple-200 dark:border-purple-700/30 w-[280px]" 
        side="left"
        sideOffset={20}
      >
        <motion.div 
          className="flex items-start gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Sparkles className="h-5 w-5 text-purple-500 mt-1 shrink-0" />
          <div>
            <p className="text-sm font-medium mb-1">Thea</p>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {mostRecentMessage?.text}
            </p>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default TheaAvatar;
