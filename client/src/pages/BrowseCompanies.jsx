import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, MapPin, Globe, ChevronRight, Briefcase } from 'lucide-react';
import axios from 'axios';

const BrowseCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/api/companies/all'); // Need to ensure this route exists or use a general one
        setCompanies(res.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filtered = companies.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-2 pt-14">
      {/* Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-text mb-4">Explore Companies</h1>
          <p className="text-text-muted mb-8 max-w-2xl">Discover top employers and view their open positions. Learn about their culture, mission, and current opportunities.</p>
          
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-xmuted" size={18} />
            <input 
              type="text" 
              placeholder="Search by company name, industry, or location…"
              className="input-lg pl-12 w-full shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 h-64 animate-pulse bg-white" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(c => (
              <Link key={c._id} to={`/${c.slug}`} className="no-underline group">
                <div className="card bg-white p-6 h-full flex flex-col hover:border-accent hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl border border-border flex items-center justify-center shrink-0 overflow-hidden bg-surface-2">
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Building2 size={24} className="text-text-xmuted" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-text group-hover:text-accent transition-colors">{c.name}</h3>
                      <p className="text-xs text-text-muted font-medium">{c.industry || 'Industry unspecified'}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-muted line-clamp-3 mb-6 flex-1 italic">
                    {c.tagline || c.about || `View careers at ${c.name}`}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {c.location && (
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <MapPin size={14} /> {c.location}
                      </div>
                    )}
                    {c.website && (
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Globe size={14} /> {c.website.replace(/^https?:\/\//, '')}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1">
                      <Briefcase size={12} /> View Jobs
                    </span>
                    <ChevronRight size={16} className="text-text-xmuted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-border">
            <Building2 className="mx-auto text-text-xmuted mb-4" size={48} />
            <h3 className="text-xl font-bold text-text mb-2">No companies found</h3>
            <p className="text-text-muted">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCompanies;
