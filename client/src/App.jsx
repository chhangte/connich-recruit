import React, { useState, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Shared
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Platform
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BrowseJobs from './pages/BrowseJobs';
import Apply from './pages/Apply';
import Dashboard from './pages/Dashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BrowseCompanies from './pages/BrowseCompanies';
import RecruiterSignup from './pages/RecruiterSignup';
import RecruiterLogin from './pages/RecruiterLogin';

// Tenant
import TenantLayout from './layouts/TenantLayout';
import CompanyHome from './pages/CompanyHome';
import CompanyJobsPage from './pages/CompanyJobsPage';
import CompanyJobDetail from './pages/CompanyJobDetail';

/* ── Error Boundary ─────── */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('App crashed:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', color: '#dc2626' }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error?.message}</pre>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PlatformLayout = ({ user, logout, children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar user={user} logout={logout} />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={<PlatformLayout user={user} logout={logout}><Home /></PlatformLayout>}
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/recruiter/signup" element={<RecruiterSignup setUser={setUser} />} />
          <Route path="/recruiter/login" element={<RecruiterLogin setUser={setUser} />} />
          
          <Route
            path="/jobs/:id"
            element={<PlatformLayout user={user} logout={logout}><JobDetails /></PlatformLayout>}
          />
          <Route
            path="/browse"
            element={<PlatformLayout user={user} logout={logout}><BrowseJobs /></PlatformLayout>}
          />
          <Route
            path="/apply/:id"
            element={<Apply user={user} />}
          />
          <Route
            path="/dashboard"
            element={user?.role === 'APPLICANT' ? <PlatformLayout user={user} logout={logout}><Dashboard user={user} /></PlatformLayout> : <Navigate to="/login" />}
          />
          <Route
            path="/recruiter"
            element={user?.role === 'RECRUITER' ? <PlatformLayout user={user} logout={logout}><RecruiterDashboard user={user} setUser={setUser} /></PlatformLayout> : <Navigate to="/recruiter/login" />}
          />
          
          {/* Company Tenant Routes */}
          <Route path="/:slug" element={<TenantLayout><CompanyHome /></TenantLayout>} />
          <Route path="/:slug/jobs" element={<TenantLayout><CompanyJobsPage /></TenantLayout>} />
          <Route path="/:slug/jobs/:jobId" element={<TenantLayout><CompanyJobDetail /></TenantLayout>} />
          <Route path="/:slug/apply/:id" element={<TenantLayout><Apply user={user} /></TenantLayout>} />

          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="/browse-companies"
            element={<PlatformLayout user={user} logout={logout}><BrowseCompanies /></PlatformLayout>}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
