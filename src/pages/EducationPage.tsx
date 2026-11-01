import React, { useEffect, useState } from 'react';
import { getEducation } from '../lib/api';
import { Education } from '../types';
import { GraduationCap, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const EducationPage: React.FC = () => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getEducation();
      setEducationList(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>ACADEMIC ARCHIVE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
          Education & Qualifications
        </h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm max-w-2xl">
          Formal academic training, degrees, honors, and computer science foundations.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-amber-400 animate-pulse">
          FETCHING ACADEMIC RECORDS...
        </div>
      ) : (
        <div className="space-y-6">
          {educationList.map((edu) => (
            <div
              key={edu.id}
              className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-amber-400/40 transition-all duration-300 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/5">
                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    {edu.degree}
                  </span>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-white pt-1">
                    {edu.field_of_study}
                  </h2>
                  <p className="text-sm font-mono text-slate-300">
                    {edu.institution}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end text-xs font-mono text-slate-400 space-y-1 shrink-0">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{edu.start_date} — {edu.end_date || 'Present'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{edu.location}</span>
                  </span>
                  {edu.grade_or_gpa && (
                    <span className="text-cyber-cyan font-bold pt-1">
                      GPA / Honors: {edu.grade_or_gpa}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {edu.description}
              </p>

              {/* Key academic achievements */}
              {edu.achievements && edu.achievements.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Key Distinctions & Academic Honors</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {edu.achievements.map((ach, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
