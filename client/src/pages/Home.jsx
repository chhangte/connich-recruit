import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, ChevronRight, Briefcase, Building2, TrendingUp, Users } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const DEPARTMENTS = ['All', 'Engineering', 'Education', 'Design', 'Marketing', 'Administration', 'Finance'];

const DEPT_COLORS = {
  Engineering:     { bg: '#eff6ff', text: '#1d4ed8' },
  Education:       { bg: '#f0fdf4', text: '#15803d' },
  Design:          { bg: '#fdf4ff', text: '#7e22ce' },
  Marketing:       { bg: '#fff7ed', text: '#c2410c' },
  Administration:  { bg: '#f0f9ff', text: '#0369a1' },
  Finance:         { bg: '#fefce8', text: '#a16207' },
  Default:         { bg: '#f8fafc', text: '#475569' },
};

const getDeptStyle = (dept) => DEPT_COLORS[dept] || DEPT_COLORS.Default;

const JobCard = ({ job }) => {
  const style = getDeptStyle(job.department);
  const timeAgo = job.createdAt
    ? Math.floor((Date.now() - new Date(job.createdAt)) / 86400000) + 'd ago'
    : 'Recently';

  return (
    <Link to={`/jobs/${job._id}`} className="no-underline block animate-fade-up">
      <div className="card-hover p-5 flex flex-col gap-4 group">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
            style={{ background: style.bg, color: style.text }}
          >
            {(job.department || 'CO').slice(0, 2).toUpperCase()}
          </div>
          <span
            className="badge text-xs"
            style={{ background: style.bg, color: style.text }}
          >
            {job.department || 'General'}
          </span>
        </div>

        {/* Title & company */}
        <div>
          <h3 className="font-semibold text-text text-base leading-snug group-hover:text-accent transition-colors mb-1">
            {job.title}
          </h3>
          <p className="text-sm text-text-muted flex items-center gap-1.5">
            <Building2 size={13} /> Connich
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-auto pt-3 border-t border-border">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {job.location}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1 font-medium text-text-2">
              ${job.salary}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={12} /> {timeAgo}
          </span>
        </div>
      </div>
    </Link>
  );
};

const SkeletonCard = () => (
  <div className="card p-5 space-y-4 animate-pulse">
    <div className="flex justify-between">
      <div className="w-10 h-10 bg-surface-3 rounded-lg" />
      <div className="w-20 h-5 bg-surface-3 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-surface-3 rounded w-3/4" />
      <div className="h-3 bg-surface-3 rounded w-1/2" />
    </div>
    <div className="pt-3 border-t border-border flex gap-3">
      <div className="h-3 bg-surface-3 rounded w-20" />
      <div className="h-3 bg-surface-3 rounded w-16 ml-auto" />
    </div>
  </div>
);

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-4 p-5 card">
    <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
      <Icon size={18} className="text-accent" />
    </div>
    <div>
      <p className="text-xl font-bold text-text leading-none mb-0.5">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  </div>
);

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/jobs`);
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    const matchesDept = activeDept === 'All' || j.department === activeDept;
    const matchesSearch =
      !search ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase()) ||
      j.department?.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 bg-white border-b border-border">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 badge-blue text-xs font-medium mb-5 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            Now hiring across 12 departments
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text tracking-tight leading-tight mb-4">
            Build your career{' '}
            <span className="text-accent">at Connich</span>
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            We're a team of educators, engineers, and builders. Find a role where your work truly matters.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto animate-fade-up-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-xmuted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, location, or department…"
              className="input-lg pl-11 w-full shadow-sm"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-up-2">
          <StatCard icon={Briefcase}   value={loading ? '—' : `${jobs.length}+`} label="Open positions" />
          <StatCard icon={Building2}   value="1"      label="Company" />
          <StatCard icon={Users}       value="1,200+" label="Candidates" />
          <StatCard icon={TrendingUp}  value="98%"    label="Satisfaction" />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8 animate-fade-up-3">
          <span className="section-label mr-2">Filter</span>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                activeDept === dept
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-text-muted border-border hover:border-border-2 hover:text-text'
              }`}
            >
              {dept}
            </button>
          ))}
          {(activeDept !== 'All' || search) && (
            <button
              onClick={() => { setActiveDept('All'); setSearch(''); }}
              className="text-xs text-danger hover:underline ml-1"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Job grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm text-text-muted mb-5">
              Showing <span className="font-semibold text-text">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'role' : 'roles'}
              {activeDept !== 'All' && <> in <span className="font-semibold text-text">{activeDept}</span></>}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((job) => <JobCard key={job._id} job={job} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-text-xmuted" />
            </div>
            <h3 className="font-semibold text-text mb-1">No roles found</h3>
            <p className="text-sm text-text-muted mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => { setActiveDept('All'); setSearch(''); }}
              className="btn-outline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* CTA strip */}
        {!loading && jobs.length > 0 && (
          <div className="mt-16 p-8 rounded-2xl bg-surface-2 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-up">
            <div>
              <h3 className="font-semibold text-text mb-1">Don't see the right role?</h3>
              <p className="text-sm text-text-muted">We're always growing. Send us your details and we'll reach out.</p>
            </div>
            <a
              href="mailto:careers@connich.com"
              className="btn-outline text-sm flex items-center gap-2 shrink-0 no-underline"
            >
              Get in touch <ChevronRight size={15} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
