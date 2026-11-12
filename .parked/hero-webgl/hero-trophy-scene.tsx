'use client';

import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sparkles, useTexture } from '@react-three/drei';

const TROPHY_ASPECT = 914 / 1583;
const PLANE_HEIGHT = 3.4;
const PLANE_WIDTH = PLANE_HEIGHT * TROPHY_ASPECT;

function TrophyMesh({ progress }: { progress: { current: number } }) {
  const texture = useTexture('/hero/trophy.png');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const idleSpin = Math.sin(t * 0.4) * 0.06;
    const idleBob = Math.sin(t * 0.6) * 0.05;
    const targetY = -0.55 + progress.current * 1.15 + idleSpin;
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y += (targetY - group.rotation.y) * 0.07;
    group.position.y += (idleBob - group.position.y) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -0.08]} scale={1.3}>
        <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT]} />
        <meshBasicMaterial
          map={texture}
          transparent
          color="#F5B93B"
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT]} />
        <meshStandardMaterial map={texture} transparent metalness={0.75} roughness={0.28} emissive="#3a2600" emissiveIntensity={0.25} />
      </mesh>
      <Sparkles count={30} scale={[PLANE_WIDTH * 1.4, PLANE_HEIGHT * 1.2, 0.6]} size={2.5} speed={0.3} color="#F5B93B" opacity={0.6} />
    </group>
  );
}

function Scene() {
  const progress = useRef(0);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const onScroll = () => {
      const r = hero.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - (r.top + r.height * 0.3) / window.innerHeight));
      progress.current = p;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[2.5, 3, 4]} intensity={60} color="#FFD37A" />
      <pointLight position={[-3, -1.5, 2]} intensity={18} color="#9938D4" />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <TrophyMesh progress={progress} />
      </Suspense>
    </>
  );
}

/** Client-only WebGL scene — mounted by <HeroTrophy> via next/dynamic (ssr:false). */
export function HeroTrophyScene() {
  return (
    <Canvas className="hero__trophy-canvas" camera={{ position: [0, 0, 5], fov: 32 }} gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
      <Scene />
    </Canvas>
  );
}
