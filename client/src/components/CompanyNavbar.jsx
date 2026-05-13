import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Briefcase, Menu, X, ExternalLink, Globe } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

/**
 * CompanyNavbar
 * Tenant-branded navbar shown within /:slug/* routes.
 * Reflects only the current company's identity and navigation.
 */
const CompanyNavbar = () => {
  const { company } = useCompany();
  const { slug } = useParams();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!company) return null;

  const primary = company.brandPrimary || '#2563eb';
  const accent = company.brandAccent || '#1e3a5f';

  const initials = (company.name || 'CO').slice(0, 2).toUpperCase();
  const isJobsActive = location.pathname.includes(`/${slug}/jobs`);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 border-b"
      style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', borderColor: `${primary}20` }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-14">

        {/* Company Logo + Name */}
        <Link
          to={`/${slug}`}
          className="flex items-center gap-2.5 no-underline hover:opacity-80 transition-opacity"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border"
            style={{ borderColor: `${primary}30` }}
          >
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-full h-full object-contain p-0.5"
              />
            ) : (
              <span
                className="text-xs font-bold"
                style={{ color: primary }}
              >
                {initials}
              </span>
            )}
          </div>
          <span className="font-semibold text-sm text-gray-900">{company.name}</span>
          <span
            className="hidden sm:block text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${primary}15`, color: primary }}
          >
            Careers
          </span>
        </Link>

        {/* Desktop Nav spacer */}
        <div className="hidden md:flex flex-1 ml-6" />

        {/* Desktop Right: Website link + "Apply" CTA */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 no-underline transition-colors"
            >
              <Globe size={14} />
              <span className="hidden lg:inline">Website</span>
              <ExternalLink size={11} />
            </a>
          )}
          <Link
            to={`/${slug}/jobs`}
            className="text-sm font-semibold px-4 py-2 rounded-lg no-underline transition-all hover:opacity-90 text-white shadow-sm"
            style={{ background: primary }}
          >
            View all jobs
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden ml-auto p-2 rounded-md text-gray-500 hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white animate-fade-in" style={{ borderColor: `${primary}20` }}>
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            <Link
              to={`/${slug}`}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 no-underline"
            >
              About {company.name}
            </Link>
            <Link
              to={`/${slug}/jobs`}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-semibold no-underline text-white"
              style={{ background: primary }}
            >
              View all open positions
            </Link>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md text-sm text-gray-400 hover:text-gray-600 no-underline flex items-center gap-1.5"
              >
                <Globe size={14} /> {company.website.replace(/^https?:\/\//, '')} <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default CompanyNavbar;
