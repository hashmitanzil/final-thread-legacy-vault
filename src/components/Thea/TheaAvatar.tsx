
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, X, MinusCircle } from 'lucide-react';
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
  const { isMinimized, toggleChat, isChatOpen } = useThea();
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };
  
  return (
    <motion.div
      className={cn(
        'rounded-full flex items-center justify-center cursor-pointer relative z-50',
        sizeClasses[size],
        isMinimized ? 'bg-purple-600' : 'bg-purple-500',
        'shadow-lg',
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -10, 0],
      }}
      transition={{
        y: {
          repeat: Infinity,
          repeatType: "mirror",
          duration: 2,
          ease: "easeInOut"
        },
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 }
      }}
      onClick={onClick || toggleChat}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 rounded-full bg-purple-400 opacity-30 animate-ping-slow"></div>
      {isChatOpen ? (
        <X className="text-white h-5 w-5" />
      ) : (
        <MessageSquare className="text-white h-5 w-5" />
      )}
    </motion.div>
  );
};

export default TheaAvatar;
