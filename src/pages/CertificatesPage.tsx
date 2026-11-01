import React, { useEffect, useState } from 'react';
import { getCertificates } from '../lib/api';
import { Certificate } from '../types';
import {
  Award,
  Search,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  FileText,
  X,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Cloud Architecture',
  'Cybersecurity',
  'Machine Learning',
  'Software Engineering',
];

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'name_asc'>('date_desc');
  const [activeCertModal, setActiveCertModal] = useState<Certificate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getCertificates({
        onlyPublished: true,
        category: selectedCategory,
        search: searchQuery,
        sortBy,
      });
      setCertificates(data);
      setLoading(false);
    }
    load();
  }, [selectedCategory, searchQuery, sortBy]);

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Award className="w-3.5 h-3.5" />
          <span>CREDENTIALS REGISTRY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
          Certifications & Credentials
        </h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm max-w-2xl">
          Industry-validated credentials and technical certifications with verifiable cryptographical identifiers.
        </p>
      </div>

      {/* Controls Bar: Search, Category & Sorting */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search credential or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-space-900/80 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-400 text-space-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date_desc' | 'date_asc' | 'name_asc')}
            className="bg-space-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-400"
          >
            <option value="date_desc">Latest Issued</option>
            <option value="date_asc">Oldest Issued</option>
            <option value="name_asc">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Certificates Gallery Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-emerald-400 animate-pulse">
          VERIFYING CREDENTIAL LEDGER...
        </div>
      ) : certificates.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl p-8 space-y-4">
          <p className="text-slate-400 font-mono text-sm">No credentials matched your search query.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Preview Image Header */}
              <div
                className="relative aspect-[16/10] overflow-hidden bg-space-900 cursor-pointer"
                onClick={() => setActiveCertModal(cert)}
              >
                <img
                  src={cert.image_preview}
                  alt={cert.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/20 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-space-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                  {cert.category}
                </div>
                {cert.featured && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-semibold bg-space-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                    {cert.issuing_organization}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-space-950/80 px-2 py-0.5 rounded">
                    {cert.issue_date}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h2
                    onClick={() => setActiveCertModal(cert)}
                    className="font-display font-bold text-base text-white group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2"
                  >
                    {cert.name}
                  </h2>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                    <span className="truncate pr-2">ID: {cert.credential_id}</span>
                    <button
                      onClick={() => copyToClipboard(cert.credential_id)}
                      className="text-slate-400 hover:text-emerald-400 transition-colors"
                      title="Copy Credential ID"
                    >
                      {copiedId === cert.credential_id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Skills tags */}
                {cert.skills_covered && cert.skills_covered.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cert.skills_covered.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skills_covered.length > 3 && (
                      <span className="text-[10px] font-mono text-slate-500 self-center">
                        +{cert.skills_covered.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Card Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setActiveCertModal(cert)}
                    className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Certificate</span>
                  </button>

                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 hover:border-emerald-500/30"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {activeCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl bg-space-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setActiveCertModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/40">
                  {activeCertModal.issuing_organization}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Issued: {activeCertModal.issue_date}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                {activeCertModal.name}
              </h3>
            </div>

            {/* Image Preview */}
            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[16/10] bg-space-950">
              <img
                src={activeCertModal.image_preview}
                alt={activeCertModal.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Credentials details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px]">CREDENTIAL IDENTIFIER</span>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="truncate mr-2 font-bold">{activeCertModal.credential_id}</span>
                  <button
                    onClick={() => copyToClipboard(activeCertModal.credential_id)}
                    className="text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    {copiedId === activeCertModal.credential_id ? (
                      <span className="text-emerald-300">Copied!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-space-950/60 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px]">VALIDITY STATUS</span>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {activeCertModal.expiration_date
                      ? `Valid until ${activeCertModal.expiration_date}`
                      : 'Lifetime Credential / No Expiry'}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills / competencies */}
            {activeCertModal.skills_covered && (
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                  Demonstrated Competencies
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeCertModal.skills_covered.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal CTAs */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <a
                href={activeCertModal.verification_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-400 text-space-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-300 transition-all flex items-center gap-2"
              >
                <span>Launch Authority Verification</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {activeCertModal.pdf_url && (
                <a
                  href={activeCertModal.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 font-mono text-xs hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Document (PDF)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
