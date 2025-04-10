
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { useThea } from '@/contexts/TheaContext';
import { cn } from '@/lib/utils';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TheaAvatarModel from './TheaAvatarModel';

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
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };
  
  return (
    <motion.div
      className={cn(
        'rounded-full flex items-center justify-center cursor-pointer relative z-50 overflow-hidden',
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
        <X className="text-white h-5 w-5 z-10" />
      ) : (
        <div className="w-full h-full">
          <Canvas camera={{ position: [0, 0, 1.5], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={null}>
              <TheaAvatarModel isTalking={isSpeaking} />
            </Suspense>
          </Canvas>
        </div>
      )}
    </motion.div>
  );
};

export default TheaAvatar;
