import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, UserX, Search, Filter, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    applicants: 0,
    recruiters: 0,
    admins: 0
  });

  useEffect(() => {
    // Mock data
    const mockUsers = [
      { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'APPLICANT', joined: 'Oct 2026' },
      { _id: '2', name: 'Sarah Recruiter', email: 'sarah@kidsden.com', role: 'RECRUITER', joined: 'Sep 2026' },
      { _id: '3', name: 'Admin One', email: 'admin@kidsden.com', role: 'ADMIN', joined: 'Jan 2026' },
    ];
    setUsers(mockUsers);
    setStats({
      total: mockUsers.length,
      applicants: 1,
      recruiters: 1,
      admins: 1
    });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
            <p className="text-gray-500 mt-1">Manage users, roles and system configurations.</p>
          </div>
          <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg">
            <Settings size={20} />
            <span>System Settings</span>
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Users', value: stats.total, color: 'indigo' },
            { label: 'Applicants', value: stats.applicants, color: 'blue' },
            { label: 'Recruiters', value: stats.recruiters, color: 'purple' },
            { label: 'Admins', value: stats.admins, color: 'zinc' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
              <p className={`text-4xl font-black text-${stat.color}-600 mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="text-indigo-600" />
              User Management
            </h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-600" />
              </div>
              <button className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100"><Filter size={20} /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-8 py-6">User</th>
                  <th className="px-8 py-6">Role</th>
                  <th className="px-8 py-6">Joined</th>
                  <th className="px-8 py-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 font-black">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-sm text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                        u.role === 'ADMIN' ? 'bg-zinc-900 text-white' : 
                        u.role === 'RECRUITER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-gray-500 font-medium">{u.joined}</td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Promote">
                          <UserCheck size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Deactivate">
                          <UserX size={18} />
                        </button>
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Settings">
                          <Shield size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
