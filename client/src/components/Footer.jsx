import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-2 border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 no-underline text-text hover:text-text">
              <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
                <Briefcase size={14} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-sm">Connich Careers</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Find your next opportunity at Connich. Empowering educators and professionals worldwide.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="section-label mb-3">Company</p>
            <ul className="space-y-2">
              {['About', 'Blog', 'Press'].map(l => (
                <li key={l}><a href="#" className="text-sm text-text-muted hover:text-text no-underline">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label mb-3">Candidates</p>
            <ul className="space-y-2">
              {['Browse Jobs', 'Your Applications', 'Career Resources'].map(l => (
                <li key={l}><a href="#" className="text-sm text-text-muted hover:text-text no-underline">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label mb-3">Legal</p>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                <li key={l}><a href="#" className="text-sm text-text-muted hover:text-text no-underline">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-xmuted">© {new Date().getFullYear()} Connich. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {['Twitter', 'LinkedIn', 'GitHub'].map((name) => (
              <a key={name} href="#" className="text-xs text-text-xmuted hover:text-text no-underline transition-colors">
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
