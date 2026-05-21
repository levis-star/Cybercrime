import React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bell, Bot, Database, FileText, Info, LayoutDashboard, LogOut, Menu, Search, ShieldCheck, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ language, setLanguage }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role && user.role !== 'citizen';
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (next) => {
    setLanguage(next);
    i18n.changeLanguage(next);
  };

  const close = () => setMenuOpen(false);

  return (
    <header className={isAdmin ? 'topbar adminTopbar' : 'topbar'}>
      <Link className="brand" to={isAdmin ? '/admin' : '/'} onClick={close}>
        {isAdmin ? <Database size={26} /> : <ShieldCheck size={26} />}
        <span>{isAdmin ? 'CyberSafe Admin' : 'CyberSafe TZ'}</span>
      </Link>

      {/* Desktop nav */}
      <nav className="navlinks desktopNav" aria-label="Main navigation">
        {isAdmin ? (
          <>
            <NavLink to="/admin"><LayoutDashboard size={18} />Dashboard</NavLink>
            <span className="adminRole">{user.role}</span>
          </>
        ) : (
          <>
            <NavLink to="/"><LayoutDashboard size={18} />Dashboard</NavLink>
            <NavLink to="/report"><FileText size={18} />{t('report')}</NavLink>
            <NavLink to="/awareness"><Bell size={18} />{t('awareness')}</NavLink>
            <NavLink to="/chatbot"><Bot size={18} />{t('chatbot')}</NavLink>
            <NavLink to="/track"><Search size={18} />{t('track')}</NavLink>
            <NavLink to="/about"><Info size={18} />{t('about')}</NavLink>
          </>
        )}
      </nav>

      <div className="toolbar">
        <div className="segmented" aria-label="Language">
          <button className={language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>EN</button>
          <button className={language === 'sw' ? 'active' : ''} onClick={() => changeLanguage('sw')}>SW</button>
        </div>
        {user ? (
          <button className="iconText" onClick={logout}><LogOut size={18} />Logout</button>
        ) : (
          <Link className="button ghost" to="/login" onClick={close}>{t('login')}</Link>
        )}
        <button
          className="hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="mobileNav" aria-label="Mobile navigation">
          {isAdmin ? (
            <NavLink to="/admin" onClick={close}><LayoutDashboard size={18} />Dashboard</NavLink>
          ) : (
            <>
              <NavLink to="/" onClick={close}><LayoutDashboard size={18} />Dashboard</NavLink>
              <NavLink to="/report" onClick={close}><FileText size={18} />{t('report')}</NavLink>
              <NavLink to="/awareness" onClick={close}><Bell size={18} />{t('awareness')}</NavLink>
              <NavLink to="/chatbot" onClick={close}><Bot size={18} />{t('chatbot')}</NavLink>
              <NavLink to="/track" onClick={close}><Search size={18} />{t('track')}</NavLink>
              <NavLink to="/about" onClick={close}><Info size={18} />{t('about')}</NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
