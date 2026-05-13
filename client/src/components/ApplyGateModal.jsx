import React, { useState } from 'react';
import { X, Mail, Users, CheckCircle2, ChevronRight, LayoutGrid, MessageSquare } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ApplyGateModal = ({ isOpen, onClose, jobId, company }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleGuestContinue = (e) => {
    if (e) e.preventDefault();
    if (!email) return;

    const slug = company?.slug;
    const path = slug ? `/${slug}/apply/${jobId}` : `/apply/${jobId}`;
    navigate(path, { state: { guestEmail: email } });
    onClose();
  };

  const brandPrimary = company?.brandPrimary || '#0f172a';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg animate-fade-up overflow-hidden relative border border-gray-100 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 bg-white/80 backdrop-blur-sm"
          aria-label="Close modal"
        >
          <X size={20} className="text-gray-400" />
        </button>

        <div className="flex flex-col">
          {/* Account Benefits Section */}
          <div className="p-8 sm:p-10 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Create an Account on Connich</h2>
            <p className="text-sm text-gray-500 mb-6">
              Recommended for the best experience.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <LayoutGrid size={16} className="text-green-600" />
                </div>
                Track status in real-time
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <MessageSquare size={16} className="text-blue-600" />
                </div>
                Direct inbox from recruiters
              </li>
            </ul>

            <Link
              to={`/signup?redirect=/apply/${jobId}`}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white transition-all no-underline shadow-sm hover:shadow-md active:scale-[0.98]"
              style={{ background: brandPrimary }}
            >
              Sign Up & Apply <ChevronRight size={18} />
            </Link>

            <p className="text-sm text-center text-gray-500 mt-5">
              Already have an account? <Link to={`/login?redirect=/apply/${jobId}`} className="text-blue-600 font-semibold hover:underline">Log In</Link>
            </p>
          </div>

          {/* Guest Flow Section */}
          <div className="p-8 sm:p-10 bg-gray-50/30">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-6">
              <Mail size={22} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Continue with Email</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Apply quickly without an account. <span className="font-semibold text-gray-900">All updates will be sent only to your email.</span>
            </p>

            <form onSubmit={handleGuestContinue} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!email}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 rounded-2xl border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                Continue to Application
                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
              </button>
            </form>

            <div className="mt-8 p-4 rounded-xl bg-blue-50/50 border border-blue-100/30">
              <p className="text-[11px] text-blue-600/80 leading-relaxed text-center">
                An update will be sent to your email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyGateModal;
