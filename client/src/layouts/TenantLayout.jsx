import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CompanyProvider, useCompany } from '../context/CompanyContext';
import CompanyNavbar from '../components/CompanyNavbar';
import TenantFooter from '../components/TenantFooter';
import ScrollToTop from '../components/ScrollToTop';
import { AlertTriangle, ArrowRight } from 'lucide-react';

/**
 * Inner layout — consumes the CompanyContext that TenantLayout provides.
 */
const TenantInner = ({ children }) => {
  const { company, loading, error } = useCompany();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Loading company portal…</p>
        </div>
      </div>
    );
  }

  if (error === 'not_found' || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={24} className="text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Career page not found</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            This company careers page doesn't exist or may have been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg no-underline hover:bg-blue-700 transition-colors"
          >
            Browse all jobs <ArrowRight size={14} />
          </Link>
          <p className="mt-4 text-xs text-gray-400">
            Are you a recruiter?{' '}
            <Link to="/recruiter/login" className="text-blue-500 no-underline hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (error === 'server_error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Something went wrong loading this company page.</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <CompanyNavbar />
      <main className="flex-1">
        {children}
      </main>
      <TenantFooter />
    </div>
  );
};

/**
 * TenantLayout
 * Entry point for all /:slug/* routes.
 * Wraps children in CompanyProvider (single fetch) + branded layout.
 */
const TenantLayout = ({ children }) => {
  const { slug } = useParams();

  return (
    <CompanyProvider slug={slug}>
      <ScrollToTop />
      <TenantInner>
        {children}
      </TenantInner>
    </CompanyProvider>
  );
};

export default TenantLayout;
