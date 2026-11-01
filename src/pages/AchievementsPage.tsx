import React, { useEffect, useState } from 'react';
import { getAchievements } from '../lib/api';
import { Achievement } from '../types';
import { Trophy, Award, Star, ExternalLink, Calendar, Sparkles } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  const categories = ['All', 'Award', 'Hackathon', 'Publication', 'Recognition'];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAchievements();
      setAchievements(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = selectedCategory === 'All'
    ? achievements
    : achievements.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hackathon':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'publication':
        return <Star className="w-5 h-5 text-cyber-cyan" />;
      default:
        return <Award className="w-5 h-5 text-cyber-violet" />;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <Trophy className="w-3.5 h-3.5" />
          <span>HONORS LEDGER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
          Achievements & Recognition
        </h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm max-w-2xl">
          Competitive hackathon victories, peer-reviewed engineering papers, and industry honors.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 glass-panel p-3 rounded-2xl border border-white/10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? 'bg-amber-400 text-space-950 font-bold shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-amber-400 animate-pulse">
          AUDITING HONORS REGISTRY...
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-amber-400">
                      {item.organization} • {item.category}
                    </span>
                    <h2 className="font-display font-bold text-base sm:text-lg text-white">
                      {item.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.date}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pl-0 sm:pl-14">
                {item.description}
              </p>

              {item.url && (
                <div className="pt-2 pl-0 sm:pl-14">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-cyber-cyan hover:underline"
                  >
                    <span>View Public Citation / Verification</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
