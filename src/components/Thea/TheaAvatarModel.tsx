
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TheaAvatarModelProps {
  isTalking?: boolean;
}

const TheaAvatarModel: React.FC<TheaAvatarModelProps> = ({ isTalking = false }) => {
  // Reference to the group for animations
  const group = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (group.current) {
      // Add subtle floating animation
      group.current.position.y = Math.sin(clock.getElapsedTime()) * 0.05;
      
      // Add subtle head rotation when talking
      if (isTalking) {
        group.current.rotation.y = Math.sin(clock.getElapsedTime() * 2) * 0.1;
      }
    }
  });

  return (
    <group ref={group}>
      {/* Head */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#f5d0c5" />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#553377" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.15, 0.1, 0.4]} castShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
        <mesh position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.04, 32, 32]} />
          <meshStandardMaterial color="#553377" />
        </mesh>
      </mesh>
      
      <mesh position={[-0.15, 0.1, 0.4]} castShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
        <mesh position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.04, 32, 32]} />
          <meshStandardMaterial color="#553377" />
        </mesh>
      </mesh>
      
      {/* Mouth - changes when talking */}
      <mesh position={[0, -0.15, 0.4]} castShadow>
        <boxGeometry args={[0.2, isTalking ? 0.1 : 0.03, 0.05]} />
        <meshStandardMaterial color="#cc5555" />
      </mesh>
    </group>
  );
};

export default TheaAvatarModel;
