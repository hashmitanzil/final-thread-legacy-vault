
import React, { Suspense, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { MessageSquare, X, Sparkles } from 'lucide-react';
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
    md: 'w-16 h-16', // Increased size
    lg: 'w-24 h-24'  // Increased size
  };
  
  return (
    <motion.div
      className={cn(
        'rounded-full flex items-center justify-center cursor-pointer relative z-50 overflow-hidden',
        sizeClasses[size],
        isMinimized 
          ? 'bg-gradient-to-br from-purple-600 to-pink-500 shadow-[0_0_15px_rgba(139,92,246,0.7)]' 
          : 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-[0_0_20px_rgba(139,92,246,0.8)]',
        'shadow-lg border-2 border-white/20',
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={controls}
      whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(147, 51, 234, 0.9)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick || toggleChat}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-400/50 to-transparent"></div>
      <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping-slow"></div>
      
      {/* Sparkle effects */}
      {!isChatOpen && (
        <>
          <motion.div
            className="absolute top-0 right-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <Sparkles className="text-yellow-300 h-4 w-4" />
          </motion.div>
          <motion.div
            className="absolute bottom-1 left-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <Sparkles className="text-cyan-300 h-3 w-3" />
          </motion.div>
        </>
      )}
      
      {isChatOpen ? (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <X className="text-white h-6 w-6 z-10 drop-shadow-lg" />
        </motion.div>
      ) : (
        <div className="w-full h-full">
          <Canvas camera={{ position: [0, 0, 1.5], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d946ef" />
            <Suspense fallback={<div className="text-center text-white text-xs">Loading...</div>}>
              <TheaAvatarModel isTalking={isSpeaking} />
            </Suspense>
          </Canvas>
        </div>
      )}
    </motion.div>
  );
};

export default TheaAvatar;
