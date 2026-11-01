import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Lock,
  Mail,
  KeyRound,
  Sparkles,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { signIn, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Authentication clearance denied.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@nexus.io');
    setPassword('NexusAdmin2026!');
  };

  return (
    <div className="min-h-screen bg-space-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-violet/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-blue/30 border border-cyber-cyan/40 items-center justify-center shadow-glow-cyan">
            <Lock className="w-7 h-7 text-cyber-cyan" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wider">
            NEXUS COMMAND
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Administrator Identity & Access Terminal
          </p>
        </div>

        {/* Login Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@nexus.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-space-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300">
                Security Passkey
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-space-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-display font-bold text-xs uppercase tracking-widest shadow-glow-cyan hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          {isDemoMode && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Local Testing Credentials:</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-cyber-cyan hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Fill Demo Info</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] font-mono text-slate-400">
                <div>Email: <strong className="text-slate-200">admin@nexus.io</strong></div>
                <div>Passkey: <strong className="text-slate-200">NexusAdmin2026!</strong></div>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors"
            >
              ← Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
