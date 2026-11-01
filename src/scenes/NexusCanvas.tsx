import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NexusCore } from './NexusCore';
import { Portals } from './Portals';
import { StarfieldParticles } from './StarfieldParticles';
import { NexusFallback2D } from './NexusFallback2D';
import { isWebGLAvailable, prefersReducedMotion } from '../lib/webgl';
import { Loader2, Volume2, VolumeX, Eye, Sparkles, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-space-950 z-20 text-cyber-cyan gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-cyber-cyan" />
      <span className="font-mono text-xs uppercase tracking-widest text-slate-300">
        Materializing 3D Nexus Universe...
      </span>
    </div>
  );
}

export const NexusCanvas: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [force2D, setForce2D] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const oscillatorRef = React.useRef<OscillatorNode | null>(null);

  useEffect(() => {
    const webglSupported = isWebGLAvailable();
    const reducedMotion = prefersReducedMotion();
    setHasWebGL(webglSupported);
    if (!webglSupported || reducedMotion) {
      setForce2D(true);
    }
  }, []);

  // Simple synthetic celestial ambient synth using Web Audio API (no external file download required)
  const toggleAmbientSound = () => {
    if (!audioEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // Deep A2 celestial drone

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioContextRef.current = ctx;
        oscillatorRef.current = osc;
        setAudioEnabled(true);
      } catch (err) {
        console.warn('Web Audio not supported or blocked:', err);
      }
    } else {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch {
          // ignore
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setAudioEnabled(false);
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {
          // cleanup
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (!hasWebGL || force2D) {
    return (
      <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <NexusFallback2D />
        {hasWebGL && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => setForce2D(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono hover:bg-cyber-cyan/25 transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Enable 3D Viewport</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] min-h-[640px] bg-space-950 overflow-hidden select-none">
      {/* Three.js Canvas */}
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          camera={{ position: [0, 1.5, 12], fov: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />

          {/* 3D Scene Elements */}
          <NexusCore />
          <Portals />
          <StarfieldParticles count={2500} />

          {/* Camera Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={6}
            maxDistance={22}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 3.5}
            dampingFactor={0.05}
            rotateSpeed={0.6}
          />
        </Canvas>
      </Suspense>

      {/* Floating HUD & Actions Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10">
        {/* Top Header info */}
        <div className="flex items-start justify-between pointer-events-auto">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-space-900/90 border border-white/10 text-slate-300 text-[11px] font-mono backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              <span>3D SPATIAL UNIVERSE ACTIVE</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
              Drag to orbit • Scroll to zoom • Click nodes to enter
            </p>
          </div>

          {/* Sound & Fallback controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAmbientSound}
              className="p-2.5 rounded-lg border border-white/10 bg-space-900/80 backdrop-blur-md text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
              title={audioEnabled ? 'Mute Celestial Drone' : 'Unmute Ambient Sound'}
              aria-label="Toggle Ambient Audio"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-cyber-cyan" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setForce2D(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-space-900/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-white/30 text-xs font-mono transition-all"
              title="Switch to 2D Mode for lower power consumption"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">2D Mode</span>
            </button>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center space-y-4 max-w-xl mx-auto pointer-events-auto">
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-widest drop-shadow-[0_4px_24px_rgba(0,240,255,0.4)]">
              NEXUS
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-sans drop-shadow-md">
              Next-Generation 3D Portfolio Platform & Distributed Software Architecture
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/projects"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-display font-bold text-xs uppercase tracking-widest shadow-glow-cyan hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter Portfolio</span>
            </Link>

            <Link
              to="/about"
              className="px-6 py-3 rounded-xl glass-panel-interactive text-white font-mono text-xs uppercase tracking-wider hover:border-cyber-cyan/50"
            >
              Explore Dossier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
