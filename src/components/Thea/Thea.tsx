
import React from 'react';
import TheaAvatar from './TheaAvatar';
import TheaChat from './TheaChat';
import TheaIntro from './TheaIntro';

const Thea: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <TheaAvatar />
      <TheaChat />
      <TheaIntro />
    </div>
  );
};

export default Thea;
