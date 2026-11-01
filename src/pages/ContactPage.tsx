import React, { useState, useEffect } from 'react';
import { getProfile, getSocialLinks, submitContactMessage } from '../lib/api';
import { Profile, SocialLink } from '../types';
import {
  Send,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [prof, links] = await Promise.all([getProfile(), getSocialLinks()]);
      setProfile(prof);
      setSocialLinks(links);
    }
    load();
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errs.subject = 'Please specify a subject (at least 3 characters).';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please input a detailed message (minimum 10 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitContactMessage(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message || 'Failed to transmit message. Please try again or use direct email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'x':
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>TRANSMISSION TERMINAL</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
          Initiate Contact
        </h1>
        <p className="text-slate-400 font-mono text-xs sm:text-sm max-w-2xl">
          Direct communication protocol for consulting, engineering opportunities, and technical collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info & Verified Channels */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="space-y-2">
              <h2 className="font-display font-bold text-lg text-white">
                Direct Channels
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Encrypted dispatch & direct communications
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2.5 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Primary Address</span>
                  <a
                    href={`mailto:${profile?.email || 'placeholder.email@nexus-domain.com'}`}
                    className="hover:text-cyber-cyan transition-colors"
                  >
                    {profile?.email || 'placeholder.email@nexus-domain.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2.5 rounded-xl bg-cyber-violet/10 border border-cyber-violet/30 text-cyber-violet">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Base Coordinates</span>
                  <span>{profile?.location || '[Placeholder — City, Country]'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Network Coordinates
              </span>
              <div className="flex flex-col gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyber-cyan/40 hover:bg-cyber-cyan/10 text-xs font-mono text-slate-300 hover:text-white transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      {getPlatformIcon(link.platform)}
                      <span>{link.label}</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>TLS 1.3 Strict Ingress Sanitation</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
            {isSubmitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white">
                  Transmission Acknowledged
                </h3>
                <p className="text-xs font-mono text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your message was securely delivered to the Nexus administrative buffer. A response will be dispatched to your provided address shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all"
                  >
                    Transmit Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h3 className="font-display font-bold text-lg text-white">
                    Send Transmission
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    STATUS: READY
                  </span>
                </div>

                {submitError && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-300">
                      Operator / Name <span className="text-cyber-cyan">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Commander Shepard"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-space-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
                    />
                    {errors.name && <p className="text-[10px] font-mono text-rose-400">{errors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-300">
                      Return Address / Email <span className="text-cyber-cyan">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. shepard@alliance.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-space-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
                    />
                    {errors.email && <p className="text-[10px] font-mono text-rose-400">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">
                    Subject Header <span className="text-cyber-cyan">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Systems Architecture Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-space-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
                  />
                  {errors.subject && <p className="text-[10px] font-mono text-rose-400">{errors.subject}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">
                    Transmission Content <span className="text-cyber-cyan">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Provide details regarding project scope, consulting timeline, or collaboration..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-space-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan resize-none"
                  />
                  {errors.message && <p className="text-[10px] font-mono text-rose-400">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-display font-bold text-xs uppercase tracking-widest shadow-glow-cyan hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Packet...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Dispatch Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
