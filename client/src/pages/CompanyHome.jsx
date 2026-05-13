import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPin, Globe, Briefcase, ArrowRight, CheckCircle2, Clock,
  Building2, ExternalLink, Link2, AtSign
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

const DEPT_COLORS = {
  Engineering:    { bg: '#eff6ff', text: '#1d4ed8' },
  Education:      { bg: '#f0fdf4', text: '#15803d' },
  Design:         { bg: '#fdf4ff', text: '#7e22ce' },
  Marketing:      { bg: '#fff7ed', text: '#c2410c' },
  Administration: { bg: '#f0f9ff', text: '#0369a1' },
  Finance:        { bg: '#fefce8', text: '#a16207' },
  Default:        { bg: '#f8fafc', text: '#475569' },
};
const getDeptStyle = d => DEPT_COLORS[d] || DEPT_COLORS.Default;

const timeAgo = dateStr => {
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const CompanyHome = () => {
  const { company, jobs } = useCompany();
  const { slug } = useParams();

  if (!company) return null;

  const primary = company.brandPrimary || '#2563eb';
  const accent = company.brandAccent || '#1e3a5f';
  const initials = (company.name || 'CO').slice(0, 2).toUpperCase();
  const social = company.socialLinks || {};

  // Show up to 3 jobs on landing page
  const previewJobs = jobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-white pt-14">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${primary} 100%)`
        }}
      >
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 animate-fade-up">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden backdrop-blur-sm">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-3xl font-bold text-white">{initials}</span>
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
                <Briefcase size={11} /> {company.industry || 'Careers'}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                {company.name}
              </h1>
              {company.tagline && (
                <p className="text-white/70 text-lg mt-2">{company.tagline}</p>
              )}
            </div>
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-3 mb-10 animate-fade-up-1">
            {company.location && (
              <span className="flex items-center gap-1.5 bg-white/10 text-white/80 text-sm px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                <MapPin size={13} /> {company.location}
              </span>
            )}
            {company.industry && (
              <span className="flex items-center gap-1.5 bg-white/10 text-white/80 text-sm px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                <Building2 size={13} /> {company.industry}
              </span>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-white/10 text-white/80 text-sm px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10 no-underline hover:bg-white/20 transition-colors"
              >
                <Globe size={13} /> {company.website.replace(/^https?:\/\//, '')} <ExternalLink size={11} />
              </a>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 animate-fade-up-2">
            <Link
              to={`/${slug}/jobs`}
              className="inline-flex items-center gap-2 bg-white text-sm font-bold px-6 py-3 rounded-xl no-underline hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ color: primary }}
            >
              View {jobs.length} open position{jobs.length !== 1 ? 's' : ''} <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white" style={{ borderRadius: '50% 50% 0 0 / 0 0 100% 100%', transform: 'scaleX(2)' }} />
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          {/* ── About Sidebar ─────────────────────────────── */}
          <aside className="lg:col-span-1 animate-fade-up">
            <div className="rounded-2xl border border-gray-100 p-6 sticky top-20 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
                About {company.name}
              </h2>
              {company.about ? (
                <p className="text-sm text-gray-600 leading-relaxed">{company.about}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">No company description provided.</p>
              )}

              <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                {company.industry && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase size={14} className="text-gray-300 shrink-0" />
                    <span className="text-gray-500">{company.industry}</span>
                  </div>
                )}
                {company.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-gray-300 shrink-0" />
                    <span className="text-gray-500">{company.location}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe size={14} className="text-gray-300 shrink-0" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline hover:underline truncate"
                      style={{ color: primary }}
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              {/* Socials */}
              {(social.linkedin || social.twitter || social.facebook || social.instagram) && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                  {social.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-gray-300 hover:text-blue-600 no-underline transition-colors" aria-label="LinkedIn">
                      <Link2 size={16} />
                    </a>
                  )}
                  {social.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                      className="text-gray-300 hover:text-sky-500 no-underline transition-colors" aria-label="Twitter">
                      <AtSign size={16} />
                    </a>
                  )}
                  {social.facebook && (
                    <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                      className="text-gray-300 hover:text-blue-500 no-underline transition-colors" aria-label="Facebook">
                      <Globe size={16} />
                    </a>
                  )}
                  {social.instagram && (
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                      className="text-gray-300 hover:text-pink-500 no-underline transition-colors" aria-label="Instagram">
                      <Globe size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* ── Job Listings Preview ───────────────────────── */}
          <section className="lg:col-span-2 animate-fade-up-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Open Positions
                <span className="ml-2 text-sm font-normal text-gray-400">({jobs.length})</span>
              </h2>
              {jobs.length > 3 && (
                <Link
                  to={`/${slug}/jobs`}
                  className="text-sm font-medium no-underline flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: primary }}
                >
                  View all <ArrowRight size={13} />
                </Link>
              )}
            </div>

            {jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center">
                <Building2 size={36} className="text-gray-200 mx-auto mb-4" />
                <p className="font-medium text-gray-400">No open positions right now</p>
                <p className="text-sm text-gray-300 mt-1">Check back soon for new opportunities.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {previewJobs.map(job => {
                  const style = getDeptStyle(job.department);
                  const isDeadline = job.hiringMode === 'DEADLINE' && job.lastDateToApply;
                  const deadline = isDeadline ? new Date(job.lastDateToApply) : null;
                  const daysLeft = deadline ? Math.ceil((deadline - Date.now()) / 86400000) : null;
                  const isExpired = daysLeft !== null && daysLeft < 0;
                  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

                  return (
                    <Link key={job._id} to={`/${slug}/jobs/${job._id}`} className="no-underline block group">
                      <div className="rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 bg-white">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ background: style.bg, color: style.text }}
                          >
                            {(job.department || 'GE').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm group-hover:transition-colors" style={{ '--hover-color': primary }}>
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-400">
                              {job.location && (
                                <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                              )}
                              {job.department && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: style.bg, color: style.text }}>
                                  {job.department}
                                </span>
                              )}
                              <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(job.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {isDeadline && !isExpired ? (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isUrgent ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                              {daysLeft === 0 ? 'Closes today' : `${daysLeft}d left`}
                            </span>
                          ) : !isDeadline ? (
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600 flex items-center gap-1">
                              <CheckCircle2 size={11} /> Actively hiring
                            </span>
                          ) : null}
                          <span className="text-xs font-semibold" style={{ color: primary }}>
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {jobs.length > 3 && (
              <div className="mt-6 text-center">
                <Link
                  to={`/${slug}/jobs`}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl no-underline transition-all hover:opacity-90 text-white shadow-sm"
                  style={{ background: primary }}
                >
                  See all {jobs.length} positions <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CompanyHome;
