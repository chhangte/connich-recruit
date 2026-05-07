import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">About</h3>
            <p className="mt-4 text-base text-gray-500">
              Kids Den School is committed to providing quality education and a nurturing environment for our students. Join our team and make a difference.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Links</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Current Openings</Link></li>
              <li><Link to="/privacy" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-base text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Portal</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/login" className="text-base text-gray-500 hover:text-indigo-600 transition-colors text-sm">Applicant Login</Link></li>
              <li><Link to="/recruiter/login" className="text-base text-gray-400 hover:text-indigo-600 transition-colors text-xs italic">Recruiter Access</Link></li>
              <li><Link to="/admin/login" className="text-base text-gray-300 hover:text-indigo-600 transition-colors text-[10px]">Admin</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 flex justify-between items-center">
          <p className="text-base text-gray-400">&copy; 2026 Kids Den School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
