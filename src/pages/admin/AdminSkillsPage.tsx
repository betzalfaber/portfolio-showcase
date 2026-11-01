import React, { useEffect, useState } from 'react';
import { getSkills, saveSkill, deleteSkill } from '../../lib/api';
import { Skill } from '../../types';
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react';

const CATEGORIES: Skill['category'][] = [
  'Frontend',
  'Backend',
  'Databases & Cloud',
  'AI & Machine Learning',
  'Cybersecurity',
  'Tools & DevOps',
];

export const AdminSkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadSkills = async () => {
    setLoading(true);
    const data = await getSkills();
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleCreateNew = () => {
    setEditingSkill({
      name: '',
      category: 'Frontend',
      proficiency: 85,
      years_of_experience: 3.0,
      description: '',
      featured: false,
      order_index: skills.length + 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this skill entry?')) {
      await deleteSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.name || !editingSkill.description) {
      setFormError('Please fill in name and description.');
      return;
    }

    try {
      await saveSkill(editingSkill);
      await loadSkills();
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || 'Failed to save skill entry.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyber-violet" />
            <span>Skills Matrix Control</span>
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Configure technical vectors, proficiencies, and domain descriptions
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-cyber-violet text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyber-violet/90 transition-all flex items-center gap-2 shadow-glow-violet"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skills Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-space-900/80 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Skill Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Proficiency</th>
                <th className="p-4">Years Exp</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white text-xs flex items-center gap-2">
                      <span>{skill.name}</span>
                      {skill.featured && <Sparkles className="w-3 h-3 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                      {skill.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/5 text-[11px] text-slate-300">
                      {skill.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-space-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-cyber-cyan rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className="text-cyber-cyan font-bold">{skill.proficiency}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">
                    {skill.years_of_experience} yrs
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-1.5 rounded bg-white/[0.05] text-slate-300 hover:text-cyber-violet hover:bg-cyber-violet/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-1.5 rounded bg-white/[0.05] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-xl">
          <div className="relative w-full max-w-lg bg-space-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white">
                {editingSkill.id ? 'Edit Skill Vector' : 'Add New Skill Vector'}
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
                <label className="text-slate-300">Skill / Technology Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. TypeScript, Rust, Kubernetes"
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-violet"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">Category</label>
                  <select
                    value={editingSkill.category || 'Frontend'}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as Skill['category'] })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-violet"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Years Experience</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={editingSkill.years_of_experience ?? 1}
                    onChange={(e) => setEditingSkill({ ...editingSkill, years_of_experience: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-violet"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300">Proficiency Rating (0 - 100%)</label>
                  <span className="text-cyber-cyan font-bold">{editingSkill.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={editingSkill.proficiency ?? 80}
                  onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value, 10) })}
                  className="w-full accent-cyber-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Technical Scope & Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingSkill.description || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  placeholder="Describe your architectural mastery, tooling, and framework scope..."
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-violet resize-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSkill.featured ?? false}
                    onChange={(e) => setEditingSkill({ ...editingSkill, featured: e.target.checked })}
                    className="rounded bg-space-950 border-white/10 text-cyber-violet focus:ring-0"
                  />
                  <span className="text-slate-200">Highlight as Core Specialization</span>
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
                  className="px-6 py-2.5 rounded-xl bg-cyber-violet text-white font-bold uppercase tracking-wider shadow-glow-violet hover:opacity-95"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
