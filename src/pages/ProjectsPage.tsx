import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../lib/api';
import { Project } from '../types';
import {
  FolderGit2,
  Search,
  ExternalLink,
  Github,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Full-Stack',
  '3D & Graphics',
  'AI & Machine Learning',
  'Cybersecurity',
  'Cloud & Systems',
];

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProjects({
        onlyPublished: true,
        category: selectedCategory,
        search: searchQuery,
      });
      setProjects(data);
      setLoading(false);
    }
    load();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>PROJECTS REGISTRY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
          Software & Systems
        </h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm max-w-2xl">
          Engineered architectures, WebGL simulations, cloud infrastructures, and full-stack applications.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-panel p-4 rounded-2xl border border-white/10">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-space-900/80 border border-white/10 rounded-xl pl-10 pr-8 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan transition-all"
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

        {/* Category buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-cyber-cyan text-space-950 font-bold shadow-glow-cyan'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-cyber-cyan animate-pulse">
          QUERYING NEXUS STORAGE REPOSITORY...
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl p-8 space-y-4">
          <p className="text-slate-400 font-mono text-sm">
            No projects matched your search criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl glass-panel flex flex-col border border-white/10 hover:border-cyber-cyan/40 transition-all duration-300 overflow-hidden relative"
            >
              {/* Cover Image & Category Badge */}
              <div className="relative aspect-video overflow-hidden bg-space-900">
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-space-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                  {project.category}
                </div>
                {project.featured && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <Link to={`/projects/${project.slug}`}>
                    <h2 className="font-display font-bold text-lg text-white group-hover:text-cyber-cyan transition-colors line-clamp-1">
                      {project.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>

                {/* Tech Chips */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] font-mono text-slate-500 self-center">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="text-xs font-mono text-cyber-cyan hover:underline flex items-center gap-1.5"
                    >
                      <span>System Specs</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                          title="View Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-cyber-cyan hover:border-cyber-cyan/30"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
