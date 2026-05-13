import React from 'react';
import { X, Mail, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ApplyGateModal = ({ isOpen, onClose, jobId, company }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGuestContinue = () => {
    const slug = company?.slug;
    if (slug) {
      navigate(`/${slug}/apply/${jobId}`);
    } else {
      navigate(`/apply/${jobId}`);
    }
    onClose();
  };

  const brandPrimary = company?.brandPrimary || '#2563eb';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-up overflow-hidden relative border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={20} className="text-gray-400" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Account Benefits */}
          <div className="flex-1 p-8 sm:p-10 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
              <Users size={24} style={{ color: brandPrimary }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Recommended for tracking your application and receiving direct updates from recruiters.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                Track status in real-time
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                Receive messages from recruiters
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <CheckCircle2 size={18} className="text-purple-500 shrink-0" />
                Save your profile for future roles
              </li>
            </ul>

            <Link
              to={`/signup?redirect=/apply/${jobId}`}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white transition-all no-underline shadow-sm hover:shadow-md"
              style={{ background: brandPrimary }}
            >
              Sign Up & Apply <ChevronRight size={18} />
            </Link>

            <p className="text-xs text-center text-gray-500 mt-5">
              Already have an account? <Link to={`/login?redirect=/apply/${jobId}`} className="font-semibold hover:underline" style={{ color: brandPrimary }}>Log In</Link>
            </p>
          </div>

          {/* Right: Guest Flow */}
          <div className="flex-1 p-8 sm:p-10 bg-gray-50/50 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-6">
              <Mail size={22} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Continue as Guest</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Skip account creation and apply directly. You'll receive updates via email.
            </p>

            <button
              onClick={handleGuestContinue}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2 group"
            >
              Apply as Guest
              <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
            </button>

            <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-100/50">
              <p className="text-[11px] text-amber-700 leading-relaxed">
                <strong className="uppercase text-[9px] tracking-wider mr-1">Notice:</strong>
                Guest applications cannot be tracked through our portal. You will rely solely on email notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyGateModal;
