import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Cpu, FolderGit2, Award, GraduationCap } from 'lucide-react';
import { prefersReducedMotion } from '../lib/webgl';

interface FallbackNode {
  title: string;
  subtitle: string;
  path: string;
  color: string;
  icon: React.ElementType;
}

const fallbackNodes: FallbackNode[] = [
  {
    title: 'Projects Matrix',
    subtitle: 'Full-stack & graphics engineering',
    path: '/projects',
    color: '#00f0ff',
    icon: FolderGit2,
  },
  {
    title: 'Credentials Vault',
    subtitle: 'Verified AWS, GCP & CNCF certs',
    path: '/certificates',
    color: '#00ff88',
    icon: Award,
  },
  {
    title: 'Technical Matrix',
    subtitle: 'Full-spectrum engineering skills',
    path: '/skills',
    color: '#a855f7',
    icon: Cpu,
  },
  {
    title: 'Academic Archive',
    subtitle: 'Degrees, research & honors',
    path: '/education',
    color: '#f59e0b',
    icon: GraduationCap,
  },
];

export const NexusFallback2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const isReduced = prefersReducedMotion();
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: isReduced ? 0 : (Math.random() - 0.5) * 0.6,
      vy: isReduced ? 0 : (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: ['#00f0ff', '#8b5cf6', '#38bdf8', '#00ff88'][Math.floor(Math.random() * 4)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect near particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (!isReduced) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
      });

      if (!isReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full min-h-[600px] flex items-center justify-center p-6 overflow-hidden">
      {/* 2D Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Central Interactive Hub */}
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>Nexus 2D Planetary Grid</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-200 to-cyber-cyan bg-clip-text text-transparent">
            ENTER THE UNIVERSE
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            High-performance digital portfolio showcasing architecture, distributed systems, verified credentials, and software engineering.
          </p>
        </div>

        {/* Grid of Navigation Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {fallbackNodes.map((node) => {
            const Icon = node.icon;
            return (
              <Link
                key={node.path}
                to={node.path}
                className="group p-5 rounded-2xl glass-panel-interactive text-left block space-y-3 relative overflow-hidden"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${node.color}15`,
                    borderColor: `${node.color}40`,
                    color: node.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white group-hover:text-cyber-cyan transition-colors">
                    {node.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{node.subtitle}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-cyber-cyan pt-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
