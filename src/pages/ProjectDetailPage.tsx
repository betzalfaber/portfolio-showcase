import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug } from '../lib/api';
import { Project } from '../types';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
  Calendar,
  FolderGit2
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const data = await getProjectBySlug(slug);
      setProject(data);
      if (data) {
        setActiveImage(data.cover_image);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-xs text-cyber-cyan animate-pulse">
        DECRYPTING PROJECT ARCHIVAL DATA...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <h2 className="text-2xl font-display font-bold text-white">Project Not Found</h2>
        <p className="text-slate-400 font-mono text-xs">
          The requested project specification ({slug}) does not exist in the active registry.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Projects Matrix</span>
        </Link>
      </div>
    );
  }

  const allImages = [project.cover_image, ...(project.screenshots || [])].filter(Boolean);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Matrix</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
            {project.category}
          </span>
          {project.featured && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured System</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
          {project.title}
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
          {project.short_description}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-cyber-cyan text-space-950 font-mono text-xs uppercase tracking-wider font-bold shadow-glow-cyan hover:bg-cyber-cyan/90 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Live Deployment</span>
            </a>
          )}

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white font-mono text-xs uppercase tracking-wider hover:bg-white/[0.08] transition-all flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>Inspect Source Code</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Image & Screenshots Showcase */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/10 space-y-4">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-space-900 border border-white/5">
          <img
            src={activeImage}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        {allImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImage === img
                    ? 'border-cyber-cyan shadow-glow-cyan scale-105'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Description & Tech Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyber-cyan" />
              <span>Architectural Overview</span>
            </h2>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
              {project.full_description}
            </div>
          </div>

          {project.architecture_notes && (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
              <h2 className="font-display font-bold text-sm text-cyber-violet flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Distributed Architecture & Subsystem Notes</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-mono">
                {project.architecture_notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Specifications */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyber-cyan" />
              <span>Technology Stack</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3 text-xs font-mono text-slate-400">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span>Status</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Published
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span>Slug Identifier</span>
              <span className="text-slate-200">{project.slug}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Category</span>
              <span className="text-slate-200">{project.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
