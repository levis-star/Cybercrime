import React from 'react';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ApiStatus from './components/ApiStatus.jsx';
import CitizenPortal from './pages/CitizenPortal.jsx';
import ReportWizard from './pages/ReportWizard.jsx';
import AwarenessHub from './pages/AwarenessHub.jsx';
import ChatbotPage from './pages/ChatbotPage.jsx';
import TrackCase from './pages/TrackCase.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PolicyTerms from './pages/PolicyTerms.jsx';
import AboutUs from './pages/AboutUs.jsx';
import { alertService } from './services/alertService.js';
import { useAuth } from './context/AuthContext.jsx';

const PAGE_TITLES = {
  '/': 'CyberSafe TZ — Report Cybercrime',
  '/report': 'Report Incident — CyberSafe TZ',
  '/awareness': 'Awareness Hub — CyberSafe TZ',
  '/chatbot': 'Guidance — CyberSafe TZ',
  '/track': 'Track Case — CyberSafe TZ',
  '/login': 'Login — CyberSafe TZ',
  '/policy': 'Privacy & Policy — CyberSafe TZ',
  '/about': 'About Us — CyberSafe TZ',
  '/admin': 'Admin Dashboard — CyberSafe TZ'
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  useEffect(() => { document.title = PAGE_TITLES[pathname] || 'CyberSafe TZ'; }, [pathname]);
  return null;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.role && user.role !== 'citizen' ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user?.role && user.role !== 'citizen' ? <Navigate to="/admin" replace /> : children;
}

export default function App() {
  const [language, setLanguage] = useState('en');
  const [alerts, setAlerts] = useState([]);
  const { user } = useAuth();
  const isAdmin = user?.role && user.role !== 'citizen';

  useEffect(() => {
    alertService.live(language).then(setAlerts).catch(() => setAlerts([]));
  }, [language]);

  return (
    <div className="appShell">
      <ScrollToTop />
      <Navbar language={language} setLanguage={setLanguage} />
      {isAdmin && <ApiStatus />}
      <main>
        <Routes>
          <Route path="/" element={<PublicRoute><CitizenPortal language={language} alerts={alerts} /></PublicRoute>} />
          <Route path="/report" element={<PublicRoute><ReportWizard /></PublicRoute>} />
          <Route path="/awareness" element={<PublicRoute><AwarenessHub language={language} alerts={alerts} /></PublicRoute>} />
          <Route path="/chatbot" element={<PublicRoute><ChatbotPage language={language} /></PublicRoute>} />
          <Route path="/track" element={<PublicRoute><TrackCase /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/policy" element={<PublicRoute><PolicyTerms /></PublicRoute>} />
          <Route path="/about" element={<PublicRoute><AboutUs /></PublicRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
