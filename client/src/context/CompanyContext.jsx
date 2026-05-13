import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CompanyContext = createContext(null);

/**
 * CompanyProvider
 * Wraps all company-namespaced routes (/:slug/*).
 * Fetches company by slug once and provides it to all children.
 * Also injects CSS custom properties for the company's brand colors.
 */
export const CompanyProvider = ({ slug, children }) => {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/companies/${slug}`);
        if (!cancelled) {
          setCompany(res.data.company);
          setJobs(res.data.jobs || []);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) {
            setError('not_found');
          } else {
            setError('server_error');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCompany();
    return () => { cancelled = true; };
  }, [slug]);

  // Apply company brand colors as CSS custom properties
  useEffect(() => {
    if (!company) return;
    const root = document.documentElement;
    root.style.setProperty('--company-primary', company.brandPrimary || '#2563eb');
    root.style.setProperty('--company-accent', company.brandAccent || '#1e3a5f');

    // Restore on unmount (back to platform defaults)
    return () => {
      root.style.removeProperty('--company-primary');
      root.style.removeProperty('--company-accent');
    };
  }, [company]);

  // Update document title for SEO
  useEffect(() => {
    if (company) {
      document.title = `${company.name} Careers | Powered by Connich`;
    }
    return () => {
      document.title = 'Connich Careers';
    };
  }, [company]);

  return (
    <CompanyContext.Provider value={{ company, jobs, loading, error, setJobs }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) return { company: null, jobs: [], loading: false, error: null };
  return ctx;
};

export default CompanyContext;
