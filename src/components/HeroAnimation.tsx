
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Fallback component to show when 3D rendering fails
const FallbackAnimation = () => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-blue-900 rounded-lg">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse"></div>
        <p className="text-white text-lg font-medium">Immersive Experience</p>
      </div>
    </div>
  );
};

function AnimatedSphere() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
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
      <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
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
      <meshStandardMaterial color="#3b82f6" side={THREE.DoubleSide} />
    </mesh>
  );
}

// Error boundary component for React Three Fiber
class ErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Error in 3D component:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Detect if WebGL is supported
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

const HeroAnimation: React.FC = () => {
  const [webGLSupported, setWebGLSupported] = useState(true);
  
  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  if (!webGLSupported) {
    return <FallbackAnimation />;
  }

  return (
    <div className="h-[500px] w-full overflow-hidden">
      <ErrorBoundary fallback={<FallbackAnimation />}>
        <Suspense fallback={<FallbackAnimation />}>
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{ 
              powerPreference: "high-performance",
              alpha: true,
              antialias: true,
              stencil: false,
              depth: true
            }}
            dpr={[1, 2]} // Responsive to device pixel ratio
          >
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <AnimatedSphere />
            <FloatingCube />
            <FloatingCard />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate 
              autoRotateSpeed={1}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default HeroAnimation;
