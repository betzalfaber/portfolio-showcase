import React, { useEffect, useState } from 'react';
import { getCertificates, saveCertificate, deleteCertificate, uploadPortfolioMedia } from '../../lib/api';
import { Certificate } from '../../types';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  Upload,
  X,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  'Cloud Architecture',
  'Cybersecurity',
  'Machine Learning',
  'Software Engineering',
  'DevOps',
];

export const AdminCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadCerts = async () => {
    try {
      const data = await getCertificates();
      setCertificates(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const handleCreateNew = () => {
    setEditingCert({
      name: '',
      issuing_organization: 'Amazon Web Services',
      issue_date: new Date().toISOString().split('T')[0],
      expiration_date: '',
      credential_id: '',
      verification_url: 'https://',
      pdf_url: '',
      image_preview: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
      category: 'Cloud Architecture',
      featured: false,
      is_published: true,
      skills_covered: [],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cert: Certificate) => {
    setEditingCert({ ...cert });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this certificate permanently?')) {
      await deleteCertificate(id);
      setCertificates(certificates.filter((c) => c.id !== id));
    }
  };

  const handleTogglePublish = async (cert: Certificate) => {
    const updated = await saveCertificate({ ...cert, is_published: !cert.is_published });
    setCertificates(certificates.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const url = await uploadPortfolioMedia(file, 'certificates-docs');
      setEditingCert((prev) => (prev ? { ...prev, image_preview: url } : null));
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert?.name || !editingCert.issuing_organization || !editingCert.credential_id || !editingCert.verification_url) {
      setFormError('Please fill in name, issuing organization, credential ID, and verification URL.');
      return;
    }

    try {
      await saveCertificate(editingCert);
      await loadCerts();
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || 'Failed to save certificate.');
    }
  };

  const filtered = certificates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.issuing_organization.toLowerCase().includes(search.toLowerCase()) ||
      c.credential_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Credentials Registry</span>
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Manage industry certifications, credential IDs, and verification URLs
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 rounded-xl bg-emerald-400 text-space-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-300 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Certificate</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search credentials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-space-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:block">
          {filtered.length} of {certificates.length} Credentials
        </span>
      </div>

      {/* Certificates Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-space-900/80 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Certificate Name</th>
                <th className="p-4">Issuer</th>
                <th className="p-4">Issued</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-emerald-400 animate-pulse">
                    LOADING CERTIFICATES REGISTRY...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No matching credentials found.
                  </td>
                </tr>
              ) : (
                filtered.map((cert) => (
                  <tr key={cert.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={cert.image_preview}
                        alt={cert.name}
                        className="w-10 h-7 rounded object-cover bg-space-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-white text-xs truncate max-w-xs">{cert.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">ID: {cert.credential_id}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-300">{cert.issuing_organization}</span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {cert.issue_date}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(cert)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          cert.is_published
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                        }`}
                      >
                        {cert.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={async () => {
                          const updated = await saveCertificate({ ...cert, featured: !cert.featured });
                          setCertificates(certificates.map((c) => (c.id === updated.id ? updated : c)));
                        }}
                        className={`p-1.5 rounded transition-colors ${
                          cert.featured ? 'text-amber-400 bg-amber-500/10' : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(cert)}
                        className="p-1.5 rounded bg-white/[0.05] text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Edit credential"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="p-1.5 rounded bg-white/[0.05] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete credential"
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

      {/* Add / Edit Certificate Modal */}
      {isModalOpen && editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-xl">
          <div className="relative w-full max-w-3xl bg-space-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white">
                {editingCert.id ? 'Edit Certificate Record' : 'Add New Certificate Record'}
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
                  <label className="text-slate-300">Certificate Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.name || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuing_organization || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuing_organization: e.target.value })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">Category</label>
                  <select
                    value={editingCert.category || 'Cloud Architecture'}
                    onChange={(e) => setEditingCert({ ...editingCert, category: e.target.value })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={editingCert.issue_date || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Expiration Date (optional)</label>
                  <input
                    type="date"
                    value={editingCert.expiration_date || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, expiration_date: e.target.value || null })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">Credential ID *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.credential_id || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, credential_id: e.target.value })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Official Verification URL *</label>
                  <input
                    type="url"
                    required
                    value={editingCert.verification_url || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, verification_url: e.target.value })}
                    className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Skills Covered (comma separated)</label>
                <input
                  type="text"
                  value={editingCert.skills_covered?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingCert({
                      ...editingCert,
                      skills_covered: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="VPC, Serverless, IAM, Disaster Recovery"
                  className="w-full bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Image Preview / Upload */}
              <div className="space-y-2">
                <label className="text-slate-300">Image Preview URL or Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCert.image_preview || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, image_preview: e.target.value })}
                    className="flex-1 bg-space-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {uploading && <div className="text-[10px] text-emerald-400">Uploading file to storage...</div>}
                {editingCert.image_preview && (
                  <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/10 mt-1">
                    <img src={editingCert.image_preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Status toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCert.is_published ?? true}
                    onChange={(e) => setEditingCert({ ...editingCert, is_published: e.target.checked })}
                    className="rounded bg-space-950 border-white/10 text-emerald-400 focus:ring-0"
                  />
                  <span className="text-slate-200">Published to Public Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCert.featured ?? false}
                    onChange={(e) => setEditingCert({ ...editingCert, featured: e.target.checked })}
                    className="rounded bg-space-950 border-white/10 text-amber-400 focus:ring-0"
                  />
                  <span className="text-slate-200">Featured Highlight</span>
                </label>
              </div>

              {/* Actions */}
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
                  className="px-6 py-2.5 rounded-xl bg-emerald-400 text-space-950 font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:bg-emerald-300"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
