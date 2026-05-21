import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const navLinks = [
  { to: '/report',    label: 'Report incident' },
  { to: '/awareness', label: 'Awareness hub' },
  { to: '/chatbot',   label: 'Guidance' },
  { to: '/track',     label: 'Track case' },
  { to: '/policy',    label: 'Privacy & policy' },
];

export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="footerInner">
        {/* Brand */}
        <div className="footerBrand">
          <ShieldCheck size={22} />
          <strong>CyberSafe TZ</strong>
          <span>Tanzania Cybercrime Reporting Portal</span>
        </div>

        {/* 5 nav links — horizontal button row, left-aligned */}
        <nav className="footerLinks" aria-label="Footer navigation">
          {navLinks.map(({ to, label }) => (
            <Link className="footerBtn" to={to} key={to}>{label}</Link>
          ))}
        </nav>

        {/* Contacts */}
        <div className="footerContact">
          <strong>Emergency contacts</strong>
          <span>Police: <a href="tel:112">112</a></span>
          <span>Cybercrime unit: <a href="tel:+255222123456">+255 22 212 3456</a></span>
          <span>Email: <a href="mailto:cybercrime@police.go.tz">cybercrime@police.go.tz</a></span>
          <Link className="footerAboutLink" to="/about">About this system →</Link>
        </div>
      </div>

      <div className="footerBar">
        <span>© {new Date().getFullYear()} Tanzania Cybercrime Reporting System</span>
        <span>Built under Tanzania Cybercrimes Act 2015</span>
      </div>
    </footer>
  );
}
