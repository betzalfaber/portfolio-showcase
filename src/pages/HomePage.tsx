import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NexusCanvas } from '../scenes/NexusCanvas';
import { getProjects, getCertificates, getProfile } from '../lib/api';
import { Project, Certificate, Profile } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, FolderGit2, Award, Terminal } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredCerts, setFeaturedCerts] = useState<Certificate[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function load() {
      const [proj, certs, prof] = await Promise.all([
        getProjects({ onlyPublished: true }),
        getCertificates({ onlyPublished: true }),
        getProfile(),
      ]);
      setFeaturedProjects(proj.filter((p) => p.featured).slice(0, 3));
      setFeaturedCerts(certs.filter((c) => c.featured).slice(0, 3));
      setProfile(prof);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* 3D Interactive Spatial Environment */}
      <section className="w-full relative" aria-label="3D Nexus Universe">
        <NexusCanvas />
      </section>

      {/* Below the fold: Architectural Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-24">
        {/* Architect Profile Brief */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
                <Terminal className="w-3.5 h-3.5" />
                <span>NEXUS ARCHITECT DOSSIER</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide">
                {profile?.full_name || '[Placeholder — Your Name]'}
              </h2>
              <p className="text-cyber-cyan font-mono text-sm">
                {profile?.title || '[Placeholder — Systems Architect & Full-Stack Engineer]'}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed font-sans">
                {profile?.bio ||
                  'Architecting high-performance digital systems, scalable cloud microservices, and interactive 3D WebGL experiences.'}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                {profile?.interests?.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan font-mono text-xs uppercase tracking-wider text-center hover:bg-cyber-cyan/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Read Full Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl glass-panel-interactive text-white font-mono text-xs uppercase tracking-wider text-center"
              >
                Initiate Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Projects Highlight */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyber-cyan text-xs font-mono uppercase tracking-widest mb-1">
                <FolderGit2 className="w-4 h-4" />
                <span>Selected Systems</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Featured Projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="text-xs font-mono text-cyber-cyan hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View All Projects ({featuredProjects.length}+)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className="group rounded-2xl glass-panel-interactive overflow-hidden flex flex-col border border-white/10 hover:border-cyber-cyan/40"
              >
                <div className="relative aspect-video overflow-hidden bg-space-900">
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-space-950/80 backdrop-blur-md border border-cyber-cyan/40 text-[10px] font-mono text-cyber-cyan">
                    {project.category}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-base text-white group-hover:text-cyber-cyan transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.short_description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[10px] font-mono text-slate-500 self-center">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Credentials Highlight */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-1">
                <Award className="w-4 h-4" />
                <span>Validated Credentials</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Verified Certifications
              </h2>
            </div>
            <Link
              to="/certificates"
              className="text-xs font-mono text-emerald-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Explore Certificate Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCerts.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl glass-panel p-6 border border-white/10 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {cert.issuing_organization}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {cert.issue_date}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-white line-clamp-2">
                    {cert.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400">
                    ID: <span className="text-slate-300">{cert.credential_id}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-cyber-cyan hover:underline flex items-center gap-1"
                  >
                    <span>Verify Credential</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
