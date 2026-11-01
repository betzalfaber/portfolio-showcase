import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Menu,
  X,
  Sparkles,
  Terminal,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Universe', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Certificates', path: '/certificates' },
  { label: 'Skills', path: '/skills' },
  { label: 'Education', path: '/education' },
  { label: 'Achievements', path: '/achievements' },
  { label: 'Contact', path: '/contact' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-space-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyber-cyan/20 via-cyber-violet/20 to-cyber-blue/30 border border-cyber-cyan/40 flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <div className="absolute inset-0 rounded-lg bg-cyber-cyan/10 blur-sm group-hover:blur-md transition-all" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base tracking-widest bg-gradient-to-r from-white via-slate-200 to-cyber-cyan bg-clip-text text-transparent">
              NEXUS
            </span>
            <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase -mt-0.5">
              Portfolio OS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs font-medium font-mono uppercase tracking-wider transition-all duration-200 relative ${
                  isActive
                    ? 'text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 shadow-glow-cyan/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side controls: System status & Admin */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Status badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-space-900 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>AVAILABLE</span>
          </div>

          {/* Admin link */}
          <Link
            to={user ? '/admin/dashboard' : '/admin/login'}
            title={user ? 'Administrator Dashboard' : 'Admin Portal'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.03] text-xs font-mono text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan/30 hover:bg-cyber-cyan/[0.05] transition-all"
          >
            {user ? (
              <>
                <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Console</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin</span>
              </>
            )}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            to={user ? '/admin/dashboard' : '/admin/login'}
            className="p-2 rounded-md border border-white/10 text-slate-300"
            title={user ? 'Administrator Dashboard' : 'Admin Login'}
            aria-label={user ? 'Administrator Dashboard' : 'Admin Login'}
          >
            <Lock className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md border border-white/10 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="lg:hidden border-b border-white/10 bg-space-900/95 backdrop-blur-2xl px-4 py-4 space-y-2 overflow-hidden"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-mono tracking-wider transition-all ${
                    isActive
                      ? 'text-cyber-cyan bg-cyber-cyan/15 border border-cyber-cyan/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 px-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                SYSTEM ONLINE
              </span>
              <Link
                to={user ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-cyber-cyan hover:underline flex items-center gap-1"
              >
                {user ? 'Admin Console' : 'Administrator Login'}
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
