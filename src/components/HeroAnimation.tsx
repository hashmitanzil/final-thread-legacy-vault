
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere visible args={[1, 100, 200]} ref={mesh}>
      <MeshDistortMaterial 
        color="#8b5cf6" 
        attach="material" 
        distort={0.5} 
        speed={2} 
        roughness={0.2} 
        metalness={0.8}
      />
    </Sphere>
  );
}

function FloatingCube() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
      mesh.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
      mesh.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <mesh ref={mesh} position={[2, 0, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshNormalMaterial />
    </mesh>
  );
}

function FloatingCard() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.3) * 0.2;
      mesh.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.3;
      mesh.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={mesh} position={[-2, 0, 0]}>
      <planeGeometry args={[1, 1.5]} />
      <meshPhongMaterial color="#3b82f6" />
    </mesh>
  );
}

const HeroAnimation: React.FC = () => {
  return (
    <div className="h-[500px] w-full overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <AnimatedSphere />
        <FloatingCube />
        <FloatingCard />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
};

export default HeroAnimation;
