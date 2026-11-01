import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const NexusCore: React.FC = () => {
  const coreRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.position.y = Math.sin(t * 0.8) * 0.2;
    }

    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.4;
      innerRef.current.rotation.y += delta * 0.6;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.5;
      ring1Ref.current.rotation.y += delta * 0.3;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.6;
      ring2Ref.current.rotation.z += delta * 0.4;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= delta * 0.3;
      ring3Ref.current.rotation.z -= delta * 0.5;
    }
  });

  return (
    <group ref={coreRef} position={[0, 0, 0]}>
      {/* Central Light */}
      <pointLight color="#00f0ff" intensity={4} distance={15} decay={2} />
      <pointLight color="#8b5cf6" intensity={3} distance={12} decay={2} />

      {/* Central Solid Pulsing Core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#060b19"
          emissive="#00f0ff"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.9}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe overlay for holographic feel */}
      <mesh>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Orbiting Gyroscope Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.0, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={1.0}
        />
      </mesh>

      {/* Orbiting Gyroscope Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.4, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={1.0}
          roughness={0.1}
          metalness={1.0}
        />
      </mesh>

      {/* Orbiting Gyroscope Ring 3 */}
      <mesh ref={ring3Ref} rotation={[-Math.PI / 4, 0, Math.PI / 4]}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={1.0}
        />
      </mesh>
    </group>
  );
};
