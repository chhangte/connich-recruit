import React, { useState, useEffect } from 'react';
import { Plus, Users, FileText, Printer, MoreVertical, Search, Filter } from 'lucide-react';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // Mock jobs
    const mockJobs = [
      { _id: '1', title: 'Primary School Teacher', applicantsCount: 12, status: 'OPEN' },
      { _id: '2', title: 'Admin Assistant', applicantsCount: 5, status: 'OPEN' },
    ];
    setJobs(mockJobs);
    setActiveJob(mockJobs[0]);
    
    // Mock applicants for the first job
    const mockApplicants = [
      { _id: '101', name: 'Alice Sharma', education: 'M.Ed', status: 'SHORTLISTED', appliedDate: 'Oct 21' },
      { _id: '102', name: 'Bob Varma', education: 'B.Ed', status: 'PENDING', appliedDate: 'Oct 20' },
      { _id: '103', name: 'Charlie Gupta', education: 'M.A. English', status: 'REJECTED', appliedDate: 'Oct 19' },
    ];
    setApplicants(mockApplicants);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto flex h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Sidebar - Job List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900 text-lg">Your Jobs</h2>
            <button className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100">
              <Plus size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {jobs.map(job => (
              <button 
                key={job._id}
                onClick={() => setActiveJob(job)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${
                  activeJob?._id === job._id ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50'
                }`}
              >
                <h3 className={`font-bold ${activeJob?._id === job._id ? 'text-indigo-700' : 'text-gray-900'}`}>{job.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Users size={12} /> {job.applicantsCount} apps</span>
                  <span className="text-green-600">● {job.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Applicants */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="p-8 border-b border-gray-100 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{activeJob?.title}</h1>
              <p className="text-gray-500 mt-1">Manage applications for this role</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-600" />
              </div>
              <button className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100"><Filter size={20} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <th className="px-6 pb-2">Applicant</th>
                  <th className="px-6 pb-2">Qualification</th>
                  <th className="px-6 pb-2">Status</th>
                  <th className="px-6 pb-2">Applied</th>
                  <th className="px-6 pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(app => (
                  <tr key={app._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                    <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                          {app.name[0]}
                        </div>
                        <span className="font-bold text-gray-900">{app.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-y border-gray-50 text-gray-600 font-medium">{app.education}</td>
                    <td className="px-6 py-4 border-y border-gray-50">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                        app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-700' : 
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-y border-gray-50 text-gray-500 font-medium">{app.appliedDate}</td>
                    <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-50">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Application">
                          <FileText size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Print PDF">
                          <Printer size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <MoreVertical size={18} />
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

export default RecruiterDashboard;
