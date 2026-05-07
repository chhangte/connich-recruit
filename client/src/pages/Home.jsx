import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, ChevronRight, Search } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now until API is ready
    const mockJobs = [
      { _id: '1', title: 'Primary School Teacher', department: 'Academic', location: 'On-site', salary: 'Competitive' },
      { _id: '2', title: 'Admin Assistant', department: 'Administration', location: 'On-site', salary: 'Based on Experience' },
      { _id: '3', title: 'Music Instructor', department: 'Arts', location: 'Part-time', salary: 'Hourly' },
    ];
    setJobs(mockJobs);
    setLoading(false);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-indigo-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Build Your Career at Kids Den</h1>
          <p className="text-xl text-indigo-100 mb-8">Join our mission to nurture young minds and shape the future.</p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by role or department..." 
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-gray-900 shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Current Openings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {job.department}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center text-gray-500 gap-2 text-sm">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-500 gap-2 text-sm">
                  <Briefcase size={16} />
                  <span>{job.salary}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link 
                  to={`/jobs/${job._id}`} 
                  className="flex-1 flex justify-center items-center gap-2 border border-gray-200 text-gray-700 font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Details
                </Link>
                <Link 
                  to={`/apply/${job._id}`} 
                  className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 text-white font-medium py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Apply <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
