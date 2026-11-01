import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, uploadPortfolioMedia } from '../../lib/api';
import { Profile } from '../../types';
import {
  UserCheck,
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getProfile();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const url = await uploadPortfolioMedia(file, 'portfolio-media');
      setProfile((prev) => (prev ? { ...prev, avatar_url: url } : null));
      setMessage({ text: 'Avatar successfully uploaded to storage!', type: 'success' });
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ text: error.message || 'Avatar upload failed.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage(null);

    try {
      const updated = await updateProfile(profile);
      setProfile(updated);
      setMessage({ text: 'Architect Profile Dossier successfully saved & updated!', type: 'success' });
    } catch (err: unknown) {
      const error = err as Error;
      setMessage({ text: error.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-20 text-center font-mono text-xs text-cyber-cyan animate-pulse">
        LOADING ARCHITECT DOSSIER...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyber-cyan" />
          <span>Profile Dossier Management</span>
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Configure public biography, titles, contact information, and resume document
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 text-xs font-mono">
        {/* Avatar section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyber-cyan/40 bg-space-900 shrink-0">
            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-2 w-full">
            <label className="text-slate-300 block">Avatar Image URL or Upload</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={profile.avatar_url}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                className="flex-1 bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
              />
              <label className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5 shrink-0">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            {uploading && <div className="text-[10px] text-cyber-cyan">Uploading avatar...</div>}
          </div>
        </div>

        {/* Identity Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300">Full Name *</label>
            <input
              type="text"
              required
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Professional Title *</label>
            <input
              type="text"
              required
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-slate-300">Hero Tagline</label>
          <input
            type="text"
            value={profile.tagline || ''}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300">Full Biography *</label>
          <textarea
            rows={5}
            required
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan resize-none font-sans text-xs leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300">Contact Email *</label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Base Location</label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Phone (optional)</label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-slate-300">Resume / CV Document URL</label>
          <input
            type="text"
            value={profile.resume_url || ''}
            onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
            placeholder="https://... or link to Google Drive / PDF"
            className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300">Research & Engineering Vectors (comma separated)</label>
          <input
            type="text"
            value={profile.interests?.join(', ') || ''}
            onChange={(e) =>
              setProfile({
                ...profile,
                interests: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })
            }
            className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.is_available_for_hire}
              onChange={(e) => setProfile({ ...profile, is_available_for_hire: e.target.checked })}
              className="rounded bg-space-950 border-white/10 text-emerald-400 focus:ring-0"
            />
            <span className="text-slate-200">Show "AVAILABLE FOR HIRE" Public Status Beacon</span>
          </label>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-display font-bold uppercase tracking-wider shadow-glow-cyan hover:opacity-95 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile Dossier</span>
          </button>
        </div>
      </form>
    </div>
  );
};
