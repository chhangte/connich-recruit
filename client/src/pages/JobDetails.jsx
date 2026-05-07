import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, ChevronLeft, ArrowRight } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch
    const mockJob = {
      _id: id,
      title: 'Primary School Teacher',
      description: 'We are looking for a passionate Primary School Teacher to join our academic team. The ideal candidate will be responsible for creating a positive and nurturing learning environment for students.',
      requirements: [
        'Bachelor’s degree in Education or related field',
        'Proven experience as a teacher',
        'Excellent communication and interpersonal skills',
        'Passion for working with children'
      ],
      location: 'On-site, Mumbai',
      department: 'Academic',
      salary: 'Competitive based on experience',
      postedDate: 'Oct 15, 2026'
    };
    setJob(mockJob);
    setLoading(false);
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
          <ChevronLeft size={20} />
          <span>Back to jobs</span>
        </Link>

        {/* Header */}
        <div className="bg-indigo-50 rounded-3xl p-8 md:p-12 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-sm">
          <div>
            <div className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
              {job.department}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>
            <div className="flex flex-wrap gap-6 text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-indigo-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-indigo-500" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-indigo-500" />
                <span>Posted {job.postedDate}</span>
              </div>
            </div>
          </div>
          <Link 
            to={`/apply/${id}`} 
            className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 flex justify-center items-center gap-2"
          >
            Apply Now <ArrowRight size={20} />
          </Link>
        </div>

        {/* Content */}
        <div className="space-y-12 px-2">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {job.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
            <ul className="space-y-4">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600 text-lg">
                  <div className="mt-2 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="pt-8 border-t border-gray-100 flex justify-center">
            <Link 
              to={`/apply/${id}`} 
              className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 flex items-center gap-3"
            >
              Start Application <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
