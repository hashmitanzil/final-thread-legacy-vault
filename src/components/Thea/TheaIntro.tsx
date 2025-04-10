
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useThea } from '@/contexts/TheaContext';
import { Canvas } from '@react-three/fiber';
import TheaAvatarModel from './TheaAvatarModel';

const TheaIntro: React.FC = () => {
  const { isIntroShown, completeIntro, messages, isSpeaking } = useThea();
  
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
      
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 relative">
          <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <TheaAvatarModel isTalking={isSpeaking} />
          </Canvas>
        </div>
        
        <div className="text-center">
          <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-2">
            Thea - Your Legacy Guide
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {messages.length > 0 ? messages[0].text : "Hi, I'm Thea, your legacy guide. Let me walk you through your experience with Final Thread."}
          </p>
          <div className="mt-4">
            <button
              onClick={completeIntro}
              className="flex items-center justify-center w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TheaIntro;
