import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Clock, ChevronRight, User, LogOut, FileText, Bell, Settings } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const STATUS_MAP = {
  PENDING:     { label: 'Under review', cls: 'badge-yellow' },
  SHORTLISTED: { label: 'Shortlisted',  cls: 'badge-green'  },
  REJECTED:    { label: 'Not selected', cls: 'badge-red'    },
};

const Dashboard = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/applications/my/${user.id || user._id}`);
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user, navigate]);

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sideNav = [
    { icon: FileText, label: 'My Applications', active: true },
    { icon: Bell, label: 'Notifications', active: false },
    { icon: Settings, label: 'Account settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-surface-2 pt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

          {/* ── Sidebar ── */}
          <aside className="md:col-span-1 animate-fade-up">
            {/* Profile card */}
            <div className="card p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {initials}
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-sm text-text truncate">{user.name}</p>
                  <p className="text-xs text-text-muted truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs text-text-muted">Applicant account</span>
              </div>
            </div>

            {/* Nav */}
            <nav className="card divide-y divide-border overflow-hidden">
              {sideNav.map(({ icon: Icon, label, active }) => (
                <button
                  key={label}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                    active ? 'bg-accent-light text-accent font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-danger hover:bg-danger-light transition-colors"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </nav>
          </aside>

          {/* ── Main ── */}
          <main className="md:col-span-3 animate-fade-up-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-text">My Applications</h1>
                <p className="text-sm text-text-muted mt-0.5">Track the status of your submitted applications</p>
              </div>
              <Link to="/" className="btn-outline text-sm no-underline">
                Browse jobs
              </Link>
            </div>

            {/* Stats */}
            {!loading && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total', value: applications.length, color: 'text-text' },
                  { label: 'Under review', value: applications.filter(a => a.status === 'PENDING').length, color: 'text-warning' },
                  { label: 'Shortlisted', value: applications.filter(a => a.status === 'SHORTLISTED').length, color: 'text-success' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="card p-4 text-center">
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-text-muted mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Applications list */}
            <div className="card overflow-hidden">
              {loading ? (
                <div className="divide-y divide-border">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-5 flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 rounded-lg bg-surface-3 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-surface-3 rounded w-1/2" />
                        <div className="h-3 bg-surface-3 rounded w-1/3" />
                      </div>
                      <div className="w-20 h-5 bg-surface-3 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : applications.length > 0 ? (
                <div className="divide-y divide-border">
                  {applications.map((app) => {
                    const status = STATUS_MAP[app.status] || STATUS_MAP.PENDING;
                    return (
                      <div key={app._id} className="p-5 flex items-center gap-4 hover:bg-surface-2 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
                          <Briefcase size={16} className="text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-text truncate">{app.job?.title || 'Unknown Position'}</p>
                          <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                            <Clock size={11} /> Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <span className={status.cls}>{status.label}</span>
                        <Link to={`/jobs/${app.job?._id}`} className="text-text-xmuted hover:text-text no-underline p-1">
                          <ChevronRight size={15} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center mx-auto mb-3">
                    <Briefcase size={20} className="text-text-xmuted" />
                  </div>
                  <h3 className="font-semibold text-text text-sm mb-1">No applications yet</h3>
                  <p className="text-sm text-text-muted mb-5">Start applying to roles and they'll show up here.</p>
                  <Link to="/" className="btn-primary text-sm no-underline">Browse open roles</Link>
                </div>
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
