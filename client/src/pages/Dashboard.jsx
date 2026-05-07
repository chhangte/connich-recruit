import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, ChevronRight, Briefcase } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Mock data
    const mockApps = [
      { _id: '1', jobTitle: 'Primary School Teacher', status: 'PENDING', appliedDate: 'Oct 20, 2026' },
      { _id: '2', jobTitle: 'Music Instructor', status: 'SHORTLISTED', appliedDate: 'Oct 18, 2026' },
    ];
    setApplications(mockApps);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'SHORTLISTED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SHORTLISTED': return <CheckCircle size={16} />;
      case 'REJECTED': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h1>
          <p className="text-gray-500">Track and manage your job applications here.</p>
        </header>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Applications</h2>
          
          {applications.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {applications.map(app => (
                <div key={app._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{app.jobTitle}</h3>
                      <p className="text-sm text-gray-500">Applied on {app.appliedDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusStyle(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span>{app.status}</span>
                    </div>
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
              <a href="/" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors">
                Browse Openings
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
