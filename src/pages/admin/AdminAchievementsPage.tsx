import React, { useEffect, useState } from 'react';
import { getAchievements, saveAchievement, deleteAchievement } from '../../lib/api';
import { Achievement } from '../../types';
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const CATEGORIES: Achievement['category'][] = [
  'Award',
  'Hackathon',
  'Publication',
  'Patent',
  'Recognition',
];

export const AdminAchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingAch, setEditingAch] = useState<Partial<Achievement> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getAchievements();
    setAchievements(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setEditingAch({
      title: '',
      organization: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Hackathon',
      url: '',
      featured: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ach: Achievement) => {
    setEditingAch({ ...ach });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this achievement?')) {
      await deleteAchievement(id);
      setAchievements(achievements.filter((a) => a.id !== id));
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch?.title || !editingAch.organization || !editingAch.description) {
      setFormError('Please fill in title, organization, and description.');
      return;
    }

    try {
      await saveAchievement(editingAch);
      await loadData();
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || 'Failed to save achievement.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Honors & Achievements</span>
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Maintain hackathon victories, engineering publications, and awards
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-amber-400 text-space-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      <div className="space-y-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[11px] font-mono border border-amber-500/20">
                  {ach.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{ach.date}</span>
                {ach.featured && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>
              <h2 className="font-display font-bold text-base text-white">
                {ach.title}
              </h2>
              <div className="text-xs font-mono text-slate-400">{ach.organization}</div>
              <p className="text-xs text-slate-300 font-sans max-w-2xl mt-1">
                {ach.description}
              </p>
              {ach.url && (
                <a
                  href={ach.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-cyber-cyan hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <span>Verification Citation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(ach)}
                className="p-2 rounded bg-white/[0.05] text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(ach.id)}
                className="p-2 rounded bg-white/[0.05] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-xl">
          <div className="relative w-full max-w-xl bg-space-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white">
                {editingAch.id ? 'Edit Achievement Record' : 'Add Achievement Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300">Award / Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={editingAch.title || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                  placeholder="e.g. 1st Place Winner: Global Hackathon"
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">Awarding Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingAch.organization || ''}
                    onChange={(e) => setEditingAch({ ...editingAch, organization: e.target.value })}
                    placeholder="e.g. Linux Foundation / Google"
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Category</label>
                  <select
                    value={editingAch.category || 'Hackathon'}
                    onChange={(e) => setEditingAch({ ...editingAch, category: e.target.value as Achievement['category'] })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">Date Awarded</label>
                  <input
                    type="date"
                    value={editingAch.date || ''}
                    onChange={(e) => setEditingAch({ ...editingAch, date: e.target.value })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Verification / Proof URL</label>
                  <input
                    type="url"
                    value={editingAch.url || ''}
                    onChange={(e) => setEditingAch({ ...editingAch, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingAch.description || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                  placeholder="Details of the accomplishment..."
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAch.featured ?? true}
                    onChange={(e) => setEditingAch({ ...editingAch, featured: e.target.checked })}
                    className="rounded bg-space-950 border-white/10 text-amber-400 focus:ring-0"
                  />
                  <span className="text-slate-200">Highlight in Honors Highlights</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-space-950 font-bold uppercase tracking-wider hover:bg-amber-300"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
