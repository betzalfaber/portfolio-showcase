import React, { useEffect, useState } from 'react';
import { getEducation, saveEducation, deleteEducation } from '../../lib/api';
import { Education } from '../../types';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';

export const AdminEducationPage: React.FC = () => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getEducation();
    setEducationList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setEditingEdu({
      institution: '',
      degree: 'Bachelor of Science',
      field_of_study: 'Computer Science',
      start_date: '2020-09-01',
      end_date: '2024-06-30',
      grade_or_gpa: '3.9 / 4.0',
      description: '',
      achievements: [],
      location: '',
      order_index: educationList.length + 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (edu: Education) => {
    setEditingEdu({ ...edu });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this education entry?')) {
      await deleteEducation(id);
      setEducationList(educationList.filter((e) => e.id !== id));
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu?.institution || !editingEdu.degree || !editingEdu.field_of_study) {
      setFormError('Please fill in institution, degree, and field of study.');
      return;
    }

    try {
      await saveEducation(editingEdu);
      await loadData();
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || 'Failed to save education record.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>Academic Qualifications</span>
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Manage academic institutions, degrees, GPA distinctions, and honors
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-amber-400 text-space-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Qualification</span>
        </button>
      </div>

      <div className="space-y-4">
        {educationList.map((edu) => (
          <div
            key={edu.id}
            className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-xs font-mono border border-amber-500/20">
                  {edu.degree}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {edu.start_date} — {edu.end_date || 'Present'}
                </span>
              </div>
              <h2 className="font-display font-bold text-lg text-white">
                {edu.field_of_study}
              </h2>
              <p className="text-xs font-mono text-slate-300">
                {edu.institution} • {edu.location} {edu.grade_or_gpa && `• GPA: ${edu.grade_or_gpa}`}
              </p>
              <p className="text-xs text-slate-400 max-w-2xl font-sans mt-2">
                {edu.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(edu)}
                className="p-2 rounded bg-white/[0.05] text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                className="p-2 rounded bg-white/[0.05] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl bg-space-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white">
                {editingEdu.id ? 'Edit Academic Qualification' : 'Add Academic Qualification'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">Degree / Qualification *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.degree || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                    placeholder="Bachelor of Science / Master of Science"
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Field of Study *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.field_of_study || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, field_of_study: e.target.value })}
                    placeholder="Computer Science & Distributed Systems"
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">Institution *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.institution || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                    placeholder="University of Technology"
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Location</label>
                  <input
                    type="text"
                    value={editingEdu.location || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                    placeholder="Cambridge, MA"
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={editingEdu.start_date || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, start_date: e.target.value })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">End Date</label>
                  <input
                    type="date"
                    value={editingEdu.end_date || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, end_date: e.target.value || null })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Grade / Honors</label>
                  <input
                    type="text"
                    value={editingEdu.grade_or_gpa || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, grade_or_gpa: e.target.value })}
                    placeholder="3.9 / 4.0 (Summa Cum Laude)"
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Description / Focus Areas</label>
                <textarea
                  rows={3}
                  value={editingEdu.description || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  placeholder="Specialized coursework, research thesis..."
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Key Achievements (comma separated)</label>
                <input
                  type="text"
                  value={editingEdu.achievements?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingEdu({
                      ...editingEdu,
                      achievements: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Dean's List, Research Fellowship, Competitive Programming Captain"
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
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
                  Save Qualification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
