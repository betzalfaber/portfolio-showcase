import React, { useEffect, useState } from 'react';
import { getSocialLinks, saveSocialLink } from '../../lib/api';
import { SocialLink } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  Settings,
  Plus,
  Edit2,
  Share2,
  Database,
  ShieldCheck,
  Download,
  X
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [editingLink, setEditingLink] = useState<Partial<SocialLink> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getSocialLinks();
      setLinks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setEditingLink({
      platform: 'github',
      label: '',
      url: 'https://',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink({ ...link });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink?.label || !editingLink.url) return;
    await saveSocialLink(editingLink);
    await loadData();
    setIsModalOpen(false);
  };

  const exportDataBackup = () => {
    const backup: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('nexus_')) {
        try {
          backup[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          backup[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyber-cyan" />
          <span>Platform Settings & Network</span>
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Configure social endpoints, inspect Supabase connectivity, and export system snapshots
        </p>
      </div>

      {/* Social Links Config */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyber-cyan" />
            <h2 className="font-display font-bold text-base text-white">
              Public Social & Network Endpoints
            </h2>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-3.5 py-1.5 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono hover:bg-cyber-cyan/30 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Endpoint</span>
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="py-6 text-center text-xs font-mono text-slate-500">Loading social links...</div>
          ) : links.length === 0 ? (
            <div className="py-6 text-center text-xs font-mono text-slate-500">No social endpoints configured.</div>
          ) : (
            links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-space-950/60 border border-white/5 text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{link.label}</span>
                    <span className="text-[10px] text-slate-500 uppercase">({link.platform})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-md">{link.url}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-1.5 rounded bg-white/[0.05] text-slate-300 hover:text-white"
                    aria-label={`Edit ${link.label} endpoint`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Database Diagnostic Status */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Database className="w-4 h-4 text-emerald-400" />
          <h2 className="font-display font-bold text-base text-white">
            Backend & Storage Infrastructure Status
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-space-950 border border-white/5 space-y-2">
            <span className="text-slate-400 text-[10px] block uppercase">PostgreSQL Database Engine</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className="text-slate-200 font-bold">
                {isSupabaseConfigured ? 'Supabase PostgreSQL Cloud Active' : 'Local Mock Data Persistence Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              {isSupabaseConfigured
                ? 'Your application is actively querying and synchronizing with your live Supabase cloud database instance.'
                : 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect your live Supabase instance.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-space-950 border border-white/5 space-y-2">
            <span className="text-slate-400 text-[10px] block uppercase">Row Level Security (RLS)</span>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>RLS Policies Enforced</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Unauthenticated public visitors have strict read-only access to published records (`is_published = true`). Mutating records requires JWT admin credentials.
            </p>
          </div>
        </div>

        {/* Export JSON backup button */}
        <div className="pt-3 flex items-center justify-between border-t border-white/5">
          <span className="text-xs font-mono text-slate-400">
            Export Local Platform Snapshot
          </span>
          <button
            onClick={exportDataBackup}
            className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Snapshot</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Social Modal */}
      {isModalOpen && editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-xl">
          <div className="relative w-full max-w-md bg-space-900 border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-display font-bold text-base text-white">
                Configure Social Endpoint
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300">Platform</label>
                <select
                  value={editingLink.platform || 'github'}
                  onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X / Twitter</option>
                  <option value="email">Direct Mail</option>
                  <option value="discord">Discord</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Display Label *</label>
                <input
                  type="text"
                  required
                  value={editingLink.label || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, label: e.target.value })}
                  placeholder="e.g. GitHub Profile"
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Destination URL *</label>
                <input
                  type="text"
                  required
                  value={editingLink.url || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyber-cyan text-space-950 font-bold uppercase tracking-wider"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
