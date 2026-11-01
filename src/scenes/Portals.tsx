import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

interface PortalData {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  position: [number, number, number];
  color: string;
  emissive: string;
}

const portals: PortalData[] = [
  {
    id: 'projects',
    title: 'PROJECTS MATRIX',
    subtitle: 'Explore full-stack, 3D & AI systems',
    path: '/projects',
    position: [5.2, 1.2, 1.8],
    color: '#00f0ff',
    emissive: '#0070f3',
  },
  {
    id: 'certificates',
    title: 'CREDENTIALS VAULT',
    subtitle: 'Verified AWS, GCP & CNCF certifications',
    path: '/certificates',
    position: [-4.8, 2.2, -1.5],
    color: '#00ff88',
    emissive: '#10b981',
  },
  {
    id: 'skills',
    title: 'TECHNICAL SKILLS',
    subtitle: 'Languages, frameworks & architecture',
    path: '/skills',
    position: [-4.2, -2.0, 2.8],
    color: '#a855f7',
    emissive: '#8b5cf6',
  },
  {
    id: 'education',
    title: 'ACADEMIC ARCHIVE',
    subtitle: 'Degrees, research & honors',
    path: '/education',
    position: [4.0, -2.4, -2.5],
    color: '#f59e0b',
    emissive: '#d97706',
  },
  {
    id: 'about',
    title: 'PROFILE DOSSIER',
    subtitle: 'Biography, philosophy & contact',
    path: '/about',
    position: [0.0, 3.8, -3.2],
    color: '#38bdf8',
    emissive: '#0284c7',
  },
];

interface PortalNodeProps {
  data: PortalData;
}

const PortalNode: React.FC<PortalNodeProps> = ({ data }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (hovered ? 1.5 : 0.6);
      meshRef.current.rotation.x += delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * (hovered ? 2.0 : 0.8);
      ringRef.current.rotation.x += delta * 0.4;
    }
  });

  return (
    <group position={data.position}>
      {/* Light emitted by this portal */}
      <pointLight
        color={data.color}
        intensity={hovered ? 3.5 : 1.2}
        distance={6}
        decay={2}
      />

      {/* Main portal orb */}
      <mesh
        ref={meshRef}
        scale={hovered ? [1.25, 1.25, 1.25] : [1, 1, 1]}
        onClick={(e) => {
          e.stopPropagation();
          navigate(data.path);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
          setHovered(false);
        }}
      >
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.emissive}
          emissiveIntensity={hovered ? 1.5 : 0.7}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Outer Wireframe Shell */}
      <mesh scale={hovered ? [1.4, 1.4, 1.4] : [1.15, 1.15, 1.15]}>
        <dodecahedronGeometry args={[0.68, 1]} />
        <meshBasicMaterial
          color={data.color}
          wireframe
          transparent
          opacity={hovered ? 0.7 : 0.3}
        />
      </mesh>

      {/* Orbiting Ring */}
      <mesh ref={ringRef} scale={hovered ? [1.3, 1.3, 1.3] : [1, 1, 1]}>
        <torusGeometry args={[1.05, 0.02, 16, 60]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={hovered ? 2 : 1}
        />
      </mesh>

      {/* Interactive HTML Floating Card */}
      <Html
        position={[0, -1.1, 0]}
        center
        distanceFactor={14}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={() => navigate(data.path)}
          className={`cursor-pointer transition-all duration-300 pointer-events-auto select-none ${
            hovered ? 'scale-105' : 'opacity-85 scale-95'
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            className={`px-3.5 py-2 rounded-xl backdrop-blur-xl border transition-all text-center whitespace-nowrap shadow-2xl ${
              hovered
                ? 'bg-space-900/90 border-cyber-cyan shadow-glow-cyan text-white'
                : 'bg-space-950/75 border-white/10 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 font-display font-bold text-xs tracking-wider">
              <span style={{ color: data.color }}>●</span>
              <span>{data.title}</span>
            </div>
            {hovered && (
              <div className="text-[10px] font-mono text-slate-300 mt-1 flex items-center justify-center gap-1">
                <span>{data.subtitle}</span>
                <ArrowRight className="w-3 h-3 text-cyber-cyan inline" />
              </div>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};

export const Portals: React.FC = () => {
  return (
    <group>
      {portals.map((portal) => (
        <PortalNode key={portal.id} data={portal} />
      ))}
    </group>
  );
};
