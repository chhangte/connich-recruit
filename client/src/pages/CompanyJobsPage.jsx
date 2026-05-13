import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, Clock, CheckCircle2, Building2, Filter, X
} from 'lucide-react';
import axios from 'axios';
import { useCompany } from '../context/CompanyContext';

const DEPT_COLORS = {
  Engineering:    { bg: '#eff6ff', text: '#1d4ed8' },
  Education:      { bg: '#f0fdf4', text: '#15803d' },
  Design:         { bg: '#fdf4ff', text: '#7e22ce' },
  Marketing:      { bg: '#fff7ed', text: '#c2410c' },
  Administration: { bg: '#f0f9ff', text: '#0369a1' },
  Finance:        { bg: '#fefce8', text: '#a16207' },
  HR:             { bg: '#fff0f3', text: '#be185d' },
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

const CompanyJobsPage = () => {
  const { company, jobs: contextJobs } = useCompany();
  const { slug } = useParams();

  const [jobs, setJobs] = useState(contextJobs || []);
  const [loading, setLoading] = useState(contextJobs.length === 0);
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Refresh jobs when landing directly on this page (in case context has empty jobs)
  useEffect(() => {
    if (contextJobs.length > 0) {
      setJobs(contextJobs);
      setLoading(false);
      return;
    }
    if (!company) return;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/companies/${slug}/jobs`);
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [company, slug, contextJobs]);

  // Update SEO title
  useEffect(() => {
    if (company) {
      document.title = `Open Positions at ${company.name} | Connich Careers`;
    }
  }, [company]);

  const departments = useMemo(() => {
    const depts = new Set(jobs.map(j => j.department).filter(Boolean));
    return ['All', ...Array.from(depts).sort()];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let result = jobs.filter(j => {
      const matchDept = activeDept === 'All' || j.department === activeDept;
      const matchSearch = !search ||
        j.title?.toLowerCase().includes(search.toLowerCase()) ||
        j.location?.toLowerCase().includes(search.toLowerCase()) ||
        j.department?.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

    return result;
  }, [jobs, activeDept, search, sortBy]);

  if (!company) return null;

  const primary = company.brandPrimary || '#2563eb';
  const accent = company.brandAccent || '#1e3a5f';
  const initials = (company.name || 'CO').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      {/* ── Company Header Bar ─────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl border flex items-center justify-center overflow-hidden shrink-0"
              style={{ borderColor: `${primary}30`, background: `${primary}08` }}
            >
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-lg font-bold" style={{ color: primary }}>{initials}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {jobs.length} open position{jobs.length !== 1 ? 's' : ''}
                {company.location && ` · ${company.location}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Filters Sidebar ─────────────────────────── */}
          <aside className="w-full lg:w-60 shrink-0 animate-fade-up">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 mb-3"
            >
              <span className="flex items-center gap-2"><Filter size={14} /> Filters</span>
              {filtersOpen ? <X size={14} /> : null}
            </button>

            <div className={`${filtersOpen ? 'block' : 'hidden'} lg:block bg-white rounded-xl border border-gray-100 p-5 sticky top-20 shadow-sm`}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <Filter size={12} /> Filters
              </h2>

              {/* Search */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 mb-2">Search roles</label>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Title, location…"
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors bg-gray-50"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Department filter */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 mb-2">Department</label>
                <div className="space-y-0.5">
                  {departments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => setActiveDept(dept)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeDept === dept
                          ? 'font-semibold text-white'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                      style={activeDept === dept ? { background: primary } : {}}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-gray-50 transition-colors"
                >
                  <option value="latest">Latest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>
          </aside>

          {/* ── Job List ────────────────────────────────── */}
          <div className="flex-1 min-w-0 animate-fade-up-1">
            {/* Result count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                {loading ? 'Loading…' : `${filteredJobs.length} position${filteredJobs.length !== 1 ? 's' : ''} found`}
              </p>
              {(search || activeDept !== 'All') && (
                <button
                  onClick={() => { setSearch(''); setActiveDept('All'); }}
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                >
                  <X size={11} /> Clear filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 h-24 animate-pulse" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
                <Building2 size={36} className="text-gray-200 mx-auto mb-4" />
                <h3 className="font-medium text-gray-500 mb-1">No positions found</h3>
                <p className="text-sm text-gray-300">Try adjusting your search or filters.</p>
                <button
                  onClick={() => { setSearch(''); setActiveDept('All'); }}
                  className="mt-4 text-sm font-medium px-4 py-2 rounded-lg text-white no-underline transition-all hover:opacity-90"
                  style={{ background: primary }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map(job => {
                  const style = getDeptStyle(job.department);
                  const isDeadline = job.hiringMode === 'DEADLINE' && job.lastDateToApply;
                  const deadline = isDeadline ? new Date(job.lastDateToApply) : null;
                  const daysLeft = deadline ? Math.ceil((deadline - Date.now()) / 86400000) : null;
                  const isExpired = daysLeft !== null && daysLeft < 0;
                  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

                  return (
                    <Link
                      key={job._id}
                      to={`/${slug}/jobs/${job._id}`}
                      className="no-underline block group"
                    >
                      <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ background: style.bg, color: style.text }}
                          >
                            {(job.department || 'GE').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-current transition-colors" style={{ color: 'inherit' }}>
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
                              {job.salary && (
                                <span className="flex items-center gap-1 font-medium text-gray-600">
                                  <Briefcase size={10} /> {job.salary}
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
                          <span
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: primary }}
                          >
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyJobsPage;
