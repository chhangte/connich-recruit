import React from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { Link2, AtSign, Globe, ExternalLink } from 'lucide-react';

/**
 * TenantFooter
 * Minimal footer shown within /:slug/* routes.
 * Shows "Powered by Connich Careers", company social links, and nothing else.
 * Keeps the company feel without leaking platform-level navigation.
 */
const TenantFooter = () => {
  const { company } = useCompany();

  const social = company?.socialLinks || {};
  const hasSocials = social.linkedin || social.twitter || social.facebook || social.instagram;

  const primary = company?.brandPrimary || '#2563eb';

  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: `${primary}15`, background: `${primary}05` }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Powered by branding */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Powered by</span>
            <Link
              to="/"
              className="flex items-center gap-1.5 no-underline font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              <img src="/logo.png" alt="Connich Careers" className="w-5 h-5 object-contain" />
              Connich Recruit
            </Link>
          </div>

          {/* Company socials */}
          {hasSocials && (
            <div className="flex items-center gap-3">
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 no-underline transition-colors"
                  aria-label="LinkedIn"
                >
                  <Link2 size={16} />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sky-500 no-underline transition-colors"
                  aria-label="Twitter / X"
                >
                  <AtSign size={16} />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 no-underline transition-colors"
                  aria-label="Facebook"
                >
                  <Globe size={16} />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 no-underline transition-colors"
                  aria-label="Instagram"
                >
                  <Globe size={16} />
                </a>
              )}
              {company?.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 no-underline transition-colors"
                  aria-label="Website"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}

          {/* Copyright */}
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {company?.name || ''}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default TenantFooter;
