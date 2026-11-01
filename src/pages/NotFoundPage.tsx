import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="relative">
        <span className="font-display font-extrabold text-7xl sm:text-9xl text-white/10 select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-cyber-cyan/20 border border-cyber-cyan/50 flex items-center justify-center shadow-glow-cyan">
            <Compass className="w-8 h-8 text-cyber-cyan animate-spin-slow" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="font-display font-bold text-2xl text-white">
          Coordinates Not Found
        </h1>
        <p className="text-xs font-mono text-slate-400 leading-relaxed">
          The quadrant or resource trajectory you requested does not exist within the current Nexus Universe topology.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-cyan text-space-950 font-mono text-xs uppercase tracking-wider font-bold shadow-glow-cyan hover:bg-cyber-cyan/90 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Universe Core</span>
      </Link>
    </div>
  );
};
