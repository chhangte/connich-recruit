import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, User, Book, Briefcase, Info } from 'lucide-react';

const Apply = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    education: '',
    experience: '',
    additionalInfo: ''
  });

  if (!user) {
    // Redirect to login if not logged in
    window.location.href = '/login';
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submit
    alert('Application submitted successfully!');
    navigate('/dashboard');
  };

  const steps = [
    { id: 1, title: 'Personal', icon: <User size={20} /> },
    { id: 2, title: 'Education', icon: <Book size={20} /> },
    { id: 3, title: 'Experience', icon: <Briefcase size={20} /> },
    { id: 4, title: 'Review', icon: <Info size={20} /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-500 z-0" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }} 
            />
            
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step >= s.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  {step > s.id ? <CheckCircle size={24} /> : s.icon}
                </div>
                <span className={`text-xs font-bold mt-2 ${step >= s.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {steps.find(s => s.id === step).title} Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <textarea 
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your current city and area"
                    rows="3"
                    className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Highest Education</label>
                  <input 
                    type="text" 
                    name="education"
                    required
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="e.g. B.Ed, M.A. in English"
                    className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Relevant Experience</label>
                  <textarea 
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Briefly describe your previous roles..."
                    rows="4"
                    className="w-full px-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-gray-500 font-medium">Phone:</span>
                    <span className="text-gray-900 font-bold">{formData.phone}</span>
                    <span className="text-gray-500 font-medium">Education:</span>
                    <span className="text-gray-900 font-bold">{formData.education}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block mb-1">Experience:</span>
                    <p className="text-gray-900 font-bold">{formData.experience}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl text-indigo-700 text-sm">
                  <Info size={20} />
                  <span>By submitting, you agree to our recruitment terms.</span>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-500 font-bold hover:text-indigo-600 transition-colors"
                >
                  <ChevronLeft size={20} /> Back
                </button>
              )}
              <div className="ml-auto flex gap-4">
                {step < 4 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                  >
                    Continue <ChevronRight size={20} />
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="bg-green-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
