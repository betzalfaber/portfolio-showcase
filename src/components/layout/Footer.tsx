import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Linkedin, Mail, Twitter, ShieldCheck } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-space-950 text-slate-400 text-xs font-mono py-12 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-space-900/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyber-cyan" />
              <span className="font-display font-bold text-white tracking-widest text-sm">
                NEXUS PLATFORM
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Next-generation interactive 3D portfolio architecture engineered with React, Three.js, and Supabase.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS 1.3 // RLS Enforced</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-slate-200 uppercase tracking-widest text-xs font-bold mb-3 font-mono">
              Core Registry
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-cyber-cyan transition-colors">
                  Overview & Bio
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-cyber-cyan transition-colors">
                  Engineering Projects
                </Link>
              </li>
              <li>
                <Link to="/certificates" className="hover:text-cyber-cyan transition-colors">
                  Verified Credentials
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-cyber-cyan transition-colors">
                  Technical Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic & Accolades */}
          <div>
            <h4 className="text-slate-200 uppercase tracking-widest text-xs font-bold mb-3 font-mono">
              Credentials
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/education" className="hover:text-cyber-cyan transition-colors">
                  Education Background
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-cyber-cyan transition-colors">
                  Honors & Awards
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyber-cyan transition-colors">
                  Secure Dispatch
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-cyber-cyan transition-colors">
                  Administrator Gateway
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Connectivity */}
          <div className="space-y-3">
            <h4 className="text-slate-200 uppercase tracking-widest text-xs font-bold mb-3 font-mono">
              Telemetry & Connect
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan/40 hover:bg-cyber-cyan/10 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan/40 hover:bg-cyber-cyan/10 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan/40 hover:bg-cyber-cyan/10 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:placeholder.email@nexus-domain.com"
                aria-label="Email"
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan/40 hover:bg-cyber-cyan/10 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 font-mono">
              BUILD: v1.0.0-PROD // SHA-256 VERIFIED
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {CURRENT_YEAR} NEXUS Core. Designed for high performance and modular extensibility.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400">Security Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-400">Encrypted Communication</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
