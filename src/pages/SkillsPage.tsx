import React, { useEffect, useState } from 'react';
import { getSkills } from '../lib/api';
import { Skill } from '../types';
import {
  Cpu,
  Sparkles,
  Layers,
  Code2,
  Server,
  Database,
  ShieldCheck
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Frontend',
  'Backend',
  'Databases & Cloud',
  'AI & Machine Learning',
  'Tools & DevOps',
  'Cybersecurity',
];

export const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getSkills(selectedCategory);
      setSkills(data);
      setLoading(false);
    }
    load();
  }, [selectedCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Code2 className="w-4 h-4 text-cyber-cyan" />;
      case 'backend':
        return <Server className="w-4 h-4 text-cyber-violet" />;
      case 'databases & cloud':
        return <Database className="w-4 h-4 text-cyber-blue" />;
      case 'ai & machine learning':
        return <Cpu className="w-4 h-4 text-pink-400" />;
      case 'cybersecurity':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Layers className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-violet/10 border border-cyber-violet/30 text-cyber-violet text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>TECHNICAL MATRIX</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
          Engineering Capabilities
        </h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm max-w-2xl">
          Comprehensive breakdown of programming languages, distributed frameworks, cloud architectures, and graphics pipelines.
        </p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 glass-panel p-3 rounded-2xl border border-white/10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? 'bg-cyber-violet text-white font-bold shadow-glow-violet'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-cyber-violet animate-pulse">
          INITIALIZING CAPABILITY VECTORS...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyber-violet/40 transition-all duration-300 space-y-4 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-cyber-cyan transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-mono font-bold text-cyber-cyan">
                    {skill.proficiency}%
                  </span>
                  <span className="block text-[10px] font-mono text-slate-500">
                    {skill.years_of_experience} yrs exp
                  </span>
                </div>
              </div>

              {/* Proficiency Gauge Bar */}
              <div className="w-full bg-space-900 rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-magenta rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {skill.description}
              </p>

              {skill.featured && (
                <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-amber-300">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Core Specialization</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
