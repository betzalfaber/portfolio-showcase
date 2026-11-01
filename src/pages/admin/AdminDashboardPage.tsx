import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getProjects,
  getCertificates,
  getSkills,
  getContactMessages,
  deleteContactMessage
} from '../../lib/api';
import { Project, Certificate, Skill, ContactMessage } from '../../types';
import {
  FolderGit2,
  Award,
  Cpu,
  Mail,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Plus
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [p, c, s, m] = await Promise.all([
        getProjects(),
        getCertificates(),
        getSkills(),
        getContactMessages(),
      ]);
      setProjects(p);
      setCertificates(c);
      setSkills(s);
      setMessages(m);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Delete this contact message permanently?')) {
      await deleteContactMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
    }
  };

  const publishedProjects = projects.filter((p) => p.is_published).length;
  const publishedCerts = certificates.filter((c) => c.is_published).length;

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-cyber-cyan animate-pulse">
        SYNCHRONIZING OPERATIONAL METRICS...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Operational Overview
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            System metrics, repository inventories, and incoming transmissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/projects"
            className="px-3.5 py-2 rounded-xl bg-cyber-cyan text-space-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyber-cyan/90 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            to="/admin/certificates"
            className="px-3.5 py-2 rounded-xl bg-emerald-400 text-space-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-300 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Certificate</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects KPI */}
        <Link
          to="/admin/projects"
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyber-cyan/40 transition-all block space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Total Projects</span>
            <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            {projects.length}
          </div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{publishedProjects} Published • {projects.length - publishedProjects} Drafts</span>
          </div>
        </Link>

        {/* Certificates KPI */}
        <Link
          to="/admin/certificates"
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all block space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Certifications</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            {certificates.length}
          </div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{publishedCerts} Published Active</span>
          </div>
        </Link>

        {/* Skills KPI */}
        <Link
          to="/admin/skills"
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyber-violet/40 transition-all block space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Skills Matrix</span>
            <div className="p-2 rounded-lg bg-cyber-violet/10 text-cyber-violet">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            {skills.length}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Across 6 Technical Vectors
          </div>
        </Link>

        {/* Messages KPI */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Transmissions</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            {messages.length}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Inquiries Received
          </div>
        </div>
      </div>

      {/* Incoming Messages Terminal Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyber-cyan" />
            <h2 className="font-display font-bold text-base text-white">
              Recent Inquiries & Contact Transmissions
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {messages.length} Total Messages
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500">
            No incoming transmissions in queue. Test by submitting the contact form on /contact.
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-space-900/60 border border-white/5 space-y-2 hover:border-white/10 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs font-mono">
                      {msg.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      &lt;{msg.email}&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-500">
                      {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Just now'}
                    </span>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete transmission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-mono text-cyber-cyan font-semibold">
                  {msg.subject}
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                  {msg.message}
                </p>

                <div className="pt-1">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="text-[11px] font-mono text-cyber-cyan hover:underline inline-flex items-center gap-1"
                  >
                    <span>Reply via Email Client</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
