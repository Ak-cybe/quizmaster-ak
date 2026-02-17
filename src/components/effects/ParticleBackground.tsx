import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Sparkles } from "@react-three/drei";
import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import * as THREE from "three";

// Particle field component - optimized for performance
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random particle positions - reduced count for better performance
  const particles = useMemo(() => {
    const count = 1000; // Reduced from 2000 for better performance
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread particles in a sphere
      const radius = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Glowing orbs that float - reduced count
function GlowingOrbs() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
        <mesh position={[3, 2, -2]}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.8} />
        </mesh>
      </Float>
      
      <Float speed={2} rotationIntensity={0.3} floatIntensity={1.5}>
        <mesh position={[-4, 1, -3]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#ec4899" transparent opacity={0.7} />
        </mesh>
      </Float>
      
      <Float speed={1} rotationIntensity={0.8} floatIntensity={3}>
        <mesh position={[2, -2, -4]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
        </mesh>
      </Float>
    </>
  );
}

// Central glowing core
function CoreGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <circleGeometry args={[2, 24]} />
      <meshBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// Animated ring
function AnimatedRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3 + 1;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -4]}>
      <torusGeometry args={[3, 0.02, 8, 64]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
    </mesh>
  );
}

// Main scene component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <ParticleField />
      <GlowingOrbs />
      <CoreGlow />
      <AnimatedRing />
      <Sparkles
        count={50}
        scale={10}
        size={2}
        speed={0.3}
        color="#a855f7"
      />
    </>
  );
}

interface ParticleBackgroundProps {
  className?: string;
}

export function ParticleBackground({ className = "" }: ParticleBackgroundProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Delay mounting to prevent WebGL context issues during initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          alpha: true,
          stencil: false,
          depth: false
        }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
