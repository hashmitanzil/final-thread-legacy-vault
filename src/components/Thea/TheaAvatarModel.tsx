
import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Head: THREE.Mesh;
    Hair: THREE.Mesh;
    Eyes: THREE.Mesh;
    Mouth: THREE.Mesh;
  };
  materials: {
    Skin: THREE.MeshStandardMaterial;
    Hair: THREE.MeshStandardMaterial;
    Eyes: THREE.MeshStandardMaterial;
    Mouth: THREE.MeshStandardMaterial;
  };
  animations: THREE.AnimationClip[];
};

interface TheaAvatarModelProps {
  isTalking?: boolean;
}

const TheaAvatarModel: React.FC<TheaAvatarModelProps> = ({ isTalking = false }) => {
  // Simple head model - we're just creating a basic model since we don't have an actual GLTF file
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
      <mesh position={[0, 0.2, 0]} castShadow>
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
      
      {/* Mouth */}
      <mesh position={[0, -0.15, 0.4]} castShadow>
        <boxGeometry args={[0.2, isTalking ? 0.1 : 0.03, 0.05]} />
        <meshStandardMaterial color="#cc5555" />
      </mesh>
    </group>
  );
};

export default TheaAvatarModel;
