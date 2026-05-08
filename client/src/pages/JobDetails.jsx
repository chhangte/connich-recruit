import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Clock, CheckCircle2, Building2, ExternalLink } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read auth state directly so this page doesn't need a prop
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const handleApply = () => {
    if (user) {
      navigate(`/apply/${id}`);
    } else {
      navigate(`/login?redirect=/apply/${id}`);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-semibold text-text mb-2">Job not found</h2>
        <p className="text-sm text-text-muted mb-4">This listing may have been removed or expired.</p>
        <Link to="/" className="btn-primary no-underline">Browse all jobs</Link>
      </div>
    </div>
  );

  const style = getDeptStyle(job.department);
  const timeAgo = job.createdAt
    ? Math.floor((Date.now() - new Date(job.createdAt)) / 86400000) + ' days ago'
    : 'Recently';

  return (
    <div className="min-h-screen bg-white pt-14">
      {/* Breadcrumb bar */}
      <div className="border-b border-border bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-text-muted">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 hover:text-text transition-colors">
            <ArrowLeft size={15} /> All jobs
          </button>
          <span>/</span>
          <span className="text-text truncate">{job.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* ── Left: Main Content ── */}
          <div className="lg:col-span-2 animate-fade-up">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: style.bg, color: style.text }}
                >
                  {(job.department || 'CO').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-text-muted flex items-center gap-1.5">
                    <Building2 size={13} /> Connich
                  </p>
                  <span className="badge text-xs" style={{ background: style.bg, color: style.text }}>
                    {job.department || 'General'}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-text mb-4">{job.title}</h1>

              <div className="flex flex-wrap gap-3">
                {job.location && (
                  <span className="badge-gray flex items-center gap-1.5">
                    <MapPin size={12} /> {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="badge-blue flex items-center gap-1.5">
                    <Briefcase size={12} /> ${job.salary}
                  </span>
                )}
                <span className="badge-gray flex items-center gap-1.5">
                  <Clock size={12} /> Posted {timeAgo}
                </span>
              </div>
            </div>

            <div className="divider" />

            {/* Description */}
            {job.description && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-text mb-3">About this role</h2>
                <p className="text-text-2 leading-relaxed text-sm">{job.description}</p>
              </section>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-text mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-2">
                      <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* About company */}
            <section className="p-5 rounded-xl bg-surface-2 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                  <Briefcase size={15} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-text">Connich</p>
                  <p className="text-xs text-text-muted">Education Technology</p>
                </div>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Connich is a fast-growing edtech company empowering teachers, students and administrators with best-in-class tools. Join a mission-driven team that puts impact first.
              </p>
              <a href="#" className="text-xs text-accent hover:text-accent-hover flex items-center gap-1 mt-3 no-underline font-medium">
                Learn more about Connich <ExternalLink size={11} />
              </a>
            </section>
          </div>

          {/* ── Right: Apply Panel ── */}
          <div className="animate-fade-up-1">
            <div className="card p-6 sticky top-20">
              <h3 className="font-semibold text-text mb-1">Ready to apply?</h3>
              <p className="text-sm text-text-muted mb-5">
                Submit your application in under 2 minutes. We review every submission.
              </p>

              <div className="space-y-3 mb-5">
                {job.salary && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Compensation</span>
                    <span className="font-semibold text-text">${job.salary}</span>
                  </div>
                )}
                {job.location && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Location</span>
                    <span className="font-medium text-text-2">{job.location}</span>
                  </div>
                )}
                {job.department && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Department</span>
                    <span
                      className="badge text-xs"
                      style={{ background: style.bg, color: style.text }}
                    >
                      {job.department}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-5">
                <button
                  onClick={handleApply}
                  className="btn-primary-lg w-full justify-center"
                >
                  Apply for this role
                </button>
                <p className="text-xs text-center text-text-xmuted mt-3">
                  {user ? 'Takes less than 2 minutes' : 'Sign in to apply · Free account'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
