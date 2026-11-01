import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Award,
  Cpu,
  GraduationCap,
  Trophy,
  UserCheck,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  AlertTriangle,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminNavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const adminNavItems: AdminNavItem[] = [
  { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
  { label: 'Certificates', path: '/admin/certificates', icon: Award },
  { label: 'Skills Matrix', path: '/admin/skills', icon: Cpu },
  { label: 'Education', path: '/admin/education', icon: GraduationCap },
  { label: 'Achievements', path: '/admin/achievements', icon: Trophy },
  { label: 'Profile Dossier', path: '/admin/profile', icon: UserCheck },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, signOut, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-space-900/80 backdrop-blur-xl p-5 sticky top-0 h-screen">
        {/* Brand */}
        <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
          <div className="w-8 h-8 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/50 flex items-center justify-center shadow-glow-cyan">
            <Sparkles className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-widest text-white">
              NEXUS CORE
            </span>
            <span className="block text-[10px] font-mono text-cyber-cyan tracking-wider uppercase">
              Admin Terminal
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1" aria-label="Admin Navigation">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 shadow-glow-cyan/40 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Quick exit & Live Site */}
        <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-cyber-cyan hover:bg-white/[0.04] transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </span>
            <span className="text-[10px] text-slate-500">Live ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-space-900/90 backdrop-blur-lg sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyber-cyan" />
          <span className="font-display font-bold text-sm tracking-wider">NEXUS ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-md border border-white/10 text-slate-300"
            aria-label="Toggle Navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-space-900/95 border-b border-white/10 p-4 space-y-1 z-30">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider ${
                    isActive ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <Link to="/" className="text-xs font-mono text-cyber-cyan flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5" /> Public Portfolio
            </Link>
            <button onClick={handleLogout} className="text-xs font-mono text-rose-400 flex items-center gap-1">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar info */}
        <header className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-space-950/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              AUTHENTICATED: <strong className="text-slate-200">{user?.email || 'admin@nexus.io'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isDemoMode ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Local Mock Engine (Add Supabase keys in .env)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-[11px] font-mono">
                <Database className="w-3 h-3" />
                <span>Connected to Supabase PostgreSQL</span>
              </div>
            )}
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
