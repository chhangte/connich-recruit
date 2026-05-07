import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, LogOut } from 'lucide-react';

const Navbar = ({ user, logout }) => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Briefcase size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Kids Den Careers</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 transition-colors">
              Jobs
            </Link>
            
            {user ? (
              <>
                <Link to={user.role === 'APPLICANT' ? '/dashboard' : '/recruiter'} className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 transition-colors">
                  Dashboard
                </Link>
                <button onClick={logout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium px-3 py-2 transition-colors">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
