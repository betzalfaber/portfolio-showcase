import React, { useEffect, useState } from 'react';
import { getProfile, getSocialLinks } from '../lib/api';
import { Profile, SocialLink } from '../types';
import {
  FileText,
  Mail,
  MapPin,
  Sparkles,
  Terminal,
  ExternalLink,
  Layers,
  Cpu,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const [prof, links] = await Promise.all([getProfile(), getSocialLinks()]);
      setProfile(prof);
      setSocialLinks(links);
      setLoading(false);
    }
    fetch();
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'x':
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="font-mono text-sm text-cyber-cyan animate-pulse">
          INITIALIZING ARCHITECT DOSSIER...
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12">
      {/* Header breadcrumb & badge */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>DOSSIER // IDENTITY MATRIX</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
          Architect Overview
        </h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm">
          Technical background, engineering philosophy, and research interests.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10">
          {/* Avatar & Key Attributes */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-cyber-cyan/40 p-1 bg-space-900 shadow-glow-cyan/50">
                <img
                  src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                  alt={profile?.full_name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-space-950 border border-emerald-400 text-emerald-400 text-[10px] font-mono flex items-center gap-1 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>ONLINE</span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="font-display font-bold text-xl text-white">
                {profile?.full_name}
              </h2>
              <p className="text-xs font-mono text-cyber-cyan">
                {profile?.title}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile?.location}</span>
            </div>

            <div className="w-full pt-2 flex flex-col gap-2">
              <a
                href={profile?.resume_url || '#'}
                className="w-full py-2.5 px-4 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan font-mono text-xs uppercase tracking-wider hover:bg-cyber-cyan/25 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Download Resume (CV)</span>
              </a>

              <Link
                to="/contact"
                className="w-full py-2.5 px-4 rounded-xl glass-panel-interactive text-white font-mono text-xs uppercase tracking-wider text-center"
              >
                Send Direct Message
              </Link>
            </div>
          </div>

          {/* Biography & Philosophies */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyber-cyan" />
                <span>Executive Summary</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                {profile?.bio}
              </p>
            </div>

            {/* Core Focus Areas */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-violet" />
                <span>Primary Research & Engineering Vectors</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile?.interests?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyber-cyan" />
                    <span className="text-xs font-mono text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Philosophy */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Engineering Principles</span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                <p>
                  <strong>• Deterministic Reliability:</strong> Designing distributed services with fault tolerance, idempotency, and automated health reconciliation.
                </p>
                <p>
                  <strong>• Performance by Default:</strong> Eliminating bloat, profiling render loops in WebGL, and utilizing indexing and caching layers.
                </p>
                <p>
                  <strong>• Zero-Trust Security:</strong> Enforcing strict least-privilege policies at the database layer (Supabase RLS) and edge ingress.
                </p>
              </div>
            </div>

            {/* Social Links Network */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Verified Social & Network Endpoints
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan/40 hover:bg-cyber-cyan/10 transition-all"
                  >
                    {getPlatformIcon(link.platform)}
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
