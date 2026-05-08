import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, UserX, Search, Filter, Settings, Briefcase } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, applicants: 0, recruiters: 0, admins: 0 });

  useEffect(() => {
    const mockUsers = [
      { _id: '1', name: 'John Doe',        email: 'john@example.com',    role: 'APPLICANT', joined: 'Oct 2026' },
      { _id: '2', name: 'Sarah Recruiter', email: 'sarah@kidsden.com',   role: 'RECRUITER', joined: 'Sep 2026' },
      { _id: '3', name: 'Admin One',       email: 'admin@kidsden.com',   role: 'ADMIN',     joined: 'Jan 2026' },
      { _id: '4', name: 'Maria Teacher',   email: 'maria@kidsden.com',   role: 'APPLICANT', joined: 'Nov 2026' },
    ];
    setUsers(mockUsers);
    setStats({
      total: mockUsers.length,
      applicants: mockUsers.filter(u => u.role === 'APPLICANT').length,
      recruiters: mockUsers.filter(u => u.role === 'RECRUITER').length,
      admins: mockUsers.filter(u => u.role === 'ADMIN').length,
    });
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const ROLE_BADGE = {
    ADMIN:     'badge-red',
    RECRUITER: 'badge-blue',
    APPLICANT: 'badge-gray',
  };

  return (
    <div className="min-h-screen bg-surface-2 pt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-up">
          <div>
            <h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
            <p className="text-sm text-text-muted mt-0.5">Manage users, roles and platform settings</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Settings size={15} />
            System settings
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up-1">
          {[
            { label: 'Total users',  value: stats.total,      icon: Users,    color: 'text-accent' },
            { label: 'Applicants',   value: stats.applicants, icon: Briefcase, color: 'text-text' },
            { label: 'Recruiters',   value: stats.recruiters, icon: UserCheck, color: 'text-warning' },
            { label: 'Admins',       value: stats.admins,     icon: Shield,   color: 'text-danger' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-surface-3 flex items-center justify-center shrink-0">
                <Icon size={16} className={color} />
              </div>
              <div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-text-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* User Table */}
        <div className="card overflow-hidden animate-fade-up-2">
          {/* Table header */}
          <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="font-semibold text-text flex items-center gap-2">
              <Users size={16} className="text-accent" /> User Management
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-xmuted" />
                <input
                  type="text"
                  placeholder="Search users…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-8 py-2 text-sm w-full sm:w-52"
                />
              </div>
              <button className="btn-outline p-2">
                <Filter size={15} />
              </button>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-2 text-xs text-text-xmuted uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text">{u.name}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={ROLE_BADGE[u.role]}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-muted">{u.joined}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn-ghost p-2 text-success" title="Promote"><UserCheck size={15} /></button>
                        <button className="btn-ghost p-2 text-danger" title="Deactivate"><UserX size={15} /></button>
                        <button className="btn-ghost p-2 text-accent" title="Permissions"><Shield size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="sm:hidden divide-y divide-border">
            {filtered.map((u) => (
              <div key={u._id} className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {u.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{u.name}</p>
                    <p className="text-xs text-text-muted">{u.email}</p>
                    <span className={`${ROLE_BADGE[u.role]} mt-1`}>{u.role}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="btn-ghost p-1.5 text-success"><UserCheck size={14} /></button>
                  <button className="btn-ghost p-1.5 text-danger"><UserX size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-text-muted">No users match your search.</div>
          )}

          <div className="px-5 py-3 bg-surface-2 border-t border-border text-xs text-text-xmuted">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
