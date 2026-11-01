import React, { useEffect, useState } from 'react';
import { getProjects, saveProject, deleteProject, uploadPortfolioMedia } from '../../lib/api';
import { Project } from '../../types';
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Sparkles,
  Upload,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  'Full-Stack',
  '3D & Graphics',
  'AI & Machine Learning',
  'Cybersecurity',
  'Cloud & Systems',
];

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateNew = () => {
    setEditingProject({
      title: '',
      slug: '',
      short_description: '',
      full_description: '',
      cover_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      screenshots: [],
      technologies: ['TypeScript', 'React'],
      category: 'Full-Stack',
      github_url: '',
      demo_url: '',
      featured: false,
      is_published: true,
      architecture_notes: '',
      order_index: projects.length + 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action is permanent.')) {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleTogglePublish = async (project: Project) => {
    const updated = await saveProject({ ...project, is_published: !project.is_published });
    setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleToggleFeatured = async (project: Project) => {
    const updated = await saveProject({ ...project, featured: !project.featured });
    setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const url = await uploadPortfolioMedia(file, 'portfolio-media');
      setEditingProject((prev) => (prev ? { ...prev, cover_image: url } : null));
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || 'Failed to upload media file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject.slug || !editingProject.short_description) {
      setFormError('Please fill in title, slug, and short description.');
      return;
    }

    try {
      await saveProject(editingProject);
      await loadProjects();
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || 'Error saving project record.');
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyber-cyan" />
            <span>Projects Inventory</span>
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Create, update, toggle visibility, and configure software architectures
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-cyber-cyan text-space-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyber-cyan/90 transition-all flex items-center gap-2 shadow-glow-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-space-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
          />
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:block">
          {filtered.length} of {projects.length} Projects
        </span>
      </div>

      {/* Projects Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-space-900/80 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-cyber-cyan animate-pulse">
                    LOADING PROJECTS REPOSITORY...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No matching projects found.
                  </td>
                </tr>
              ) : (
                filtered.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={proj.cover_image}
                        alt={proj.title}
                        className="w-12 h-8 rounded object-cover bg-space-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-white text-xs truncate max-w-xs">{proj.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">/{proj.slug}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/5 text-[11px] text-slate-300">
                        {proj.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(proj)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          proj.is_published
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                        }`}
                      >
                        {proj.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(proj)}
                        className={`p-1.5 rounded transition-colors ${
                          proj.featured ? 'text-amber-400 bg-amber-500/10' : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title={proj.featured ? 'Unfeature' : 'Feature on homepage'}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(proj)}
                        className="p-1.5 rounded bg-white/[0.05] text-slate-300 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
                        title="Edit project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1.5 rounded bg-white/[0.05] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-xl">
          <div className="relative w-full max-w-3xl bg-space-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white">
                {editingProject.id ? 'Edit Project Specification' : 'Add New Project Specification'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
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
                  <label className="text-slate-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingProject({
                        ...editingProject,
                        title,
                        slug: editingProject.slug ? editingProject.slug : slug,
                      });
                    }}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Slug Identifier *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">Category</label>
                  <select
                    value={editingProject.category || 'Full-Stack'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={editingProject.technologies?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Go, TypeScript, Three.js, Redis"
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Short Description *</label>
                <input
                  type="text"
                  required
                  value={editingProject.short_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Full Architectural Description</label>
                <textarea
                  rows={4}
                  value={editingProject.full_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, full_description: e.target.value })}
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Distributed Architecture & Subsystem Notes</label>
                <textarea
                  rows={2}
                  value={editingProject.architecture_notes || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, architecture_notes: e.target.value })}
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={editingProject.github_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Live Demo URL</label>
                  <input
                    type="url"
                    value={editingProject.demo_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>

              {/* Cover Image Upload & Preview */}
              <div className="space-y-2">
                <label className="text-slate-300">Cover Image URL or File Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProject.cover_image || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, cover_image: e.target.value })}
                    className="flex-1 bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-cyan"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {uploading && <div className="text-[10px] text-cyber-cyan">Uploading file to storage...</div>}
                {editingProject.cover_image && (
                  <div className="w-32 h-20 rounded-lg overflow-hidden border border-white/10 mt-1">
                    <img src={editingProject.cover_image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Status checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                    className="rounded bg-space-950 border-white/10 text-cyber-cyan focus:ring-0"
                  />
                  <span className="text-slate-200">Published to Public Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.featured ?? false}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded bg-space-950 border-white/10 text-amber-400 focus:ring-0"
                  />
                  <span className="text-slate-200">Featured Highlight</span>
                </label>
              </div>

              {/* Submit Buttons */}
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
                  className="px-6 py-2.5 rounded-xl bg-cyber-cyan text-space-950 font-bold uppercase tracking-wider shadow-glow-cyan hover:opacity-95"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
