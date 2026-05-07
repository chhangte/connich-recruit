import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Briefcase } from 'lucide-react';

const Signup = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Mock signup
    const mockUser = {
      name: name,
      email: email,
      role: 'APPLICANT'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-indigo-600 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-100">
            <Briefcase size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Join Kids Den</h2>
          <p className="text-gray-500 mt-2">Create an account to apply for jobs</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-100 flex items-center justify-center gap-2 group"
          >
            Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
