import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, ArrowRight, BookOpen, Bot, Building2,
  FileText, FileWarning, Lock, Phone, ScrollText,
  Search, Shield, ShieldAlert, ShieldCheck, Users, Zap
} from 'lucide-react';
import AlertBanner from '../components/AlertBanner.jsx';

const HOW_IT_WORKS = [
  {
    step: '01',
    Icon: FileWarning,
    title: 'Report the crime',
    text: 'Fill in our guided wizard — takes about 5 minutes. Report anonymously or as a verified citizen. No technical knowledge required.'
  },
  {
    step: '02',
    Icon: ShieldCheck,
    title: 'Receive your tracking code',
    text: 'After submission you instantly receive a unique case number like TZ-CC-2026-0001. Keep it safe — it is your only key to follow your report.'
  },
  {
    step: '03',
    Icon: Search,
    title: 'Investigators review your case',
    text: 'Our analysts assess severity and assign your case to the correct authority — police, TCRA, FIA, or another task force — for your region.'
  },
  {
    step: '04',
    Icon: Zap,
    title: 'Track progress anytime',
    text: 'Use your tracking code on the Track Case page at any time to see status updates, which task force is handling your case, and their region.'
  }
];

const CRIME_CATEGORIES = [
  { label: 'Mobile Money Fraud',         color: '#d34f3f', desc: 'Fake M-Pesa requests, fraudulent transfers, agent impersonation.' },
  { label: 'SIM Swap Attack',            color: '#e07b39', desc: 'Criminals port your number to steal mobile banking access.' },
  { label: 'Phishing & Fake Links',      color: '#d97706', desc: 'Fraudulent websites, fake bank portals, deceptive SMS links.' },
  { label: 'Identity Theft',             color: '#7c3aed', desc: 'Stolen personal data used to open accounts or commit fraud.' },
  { label: 'Online Job Scams',           color: '#0f766e', desc: 'Fake employment offers demanding registration or advance fees.' },
  { label: 'Cyberbullying / Harassment', color: '#1d4ed8', desc: 'Threats, blackmail, or targeted online abuse of any person.' },
  { label: 'Hacking / Unauthorised Access', color: '#475569', desc: 'Breach of personal accounts, devices, or business systems.' },
  { label: 'Online Extortion',           color: '#b91c1c', desc: 'Sextortion, ransomware, or threats to publish private content.' },
];

const WHO_IT_SERVES = [
  { Icon: Users,     title: 'Citizens',          text: 'Any Tanzanian who has experienced or witnessed a cybercrime.' },
  { Icon: Building2, title: 'Businesses',         text: 'Small businesses, banks, mobile money agents targeted by fraud.' },
  { Icon: BookOpen,  title: 'Students',           text: 'Young people facing cyberbullying, fake scholarships, or harassment.' },
  { Icon: Shield,    title: 'Community leaders',  text: 'Ward leaders and teachers reporting on behalf of community members.' },
];

const QUICK_TIPS = [
  { Icon: Lock,          title: 'Never share your PIN',      text: 'No legitimate bank, mobile money service, or government office will ever call to ask for your PIN or password.' },
  { Icon: AlertTriangle, title: 'Verify before you pay',     text: 'Always double-check payment requests via a separate call to the person\'s known number before transferring money.' },
  { Icon: Phone,         title: 'Screenshot everything',     text: 'If you suspect a crime, screenshot all messages, calls, and transactions immediately — before anything is deleted.' },
];

const NAV_CARDS = [
  { title: 'Report incident',   text: 'Submit a cybercrime report safely and anonymously.',          href: '/report',    Icon: FileWarning, primary: true },
  { title: 'Track your case',   text: 'Check the status of a report using your tracking code.',      href: '/track',     Icon: Search },
  { title: 'Awareness hub',     text: 'Bilingual guides on fraud, phishing, and how to stay safe.',  href: '/awareness', Icon: BookOpen },
  { title: 'Get guidance',      text: 'Ask the AI chatbot what to do and how to preserve evidence.', href: '/chatbot',   Icon: Bot },
];

export default function CitizenPortal({ alerts }) {
  const { t } = useTranslation();

  return (
    <section className="page portal">
      <AlertBanner alerts={alerts} />

      {/* ── Hero ── */}
      <div className="heroBand">
        <div className="heroCopy">
          <span className="eyebrow">Tanzania public safety portal</span>
          <h1>{t('headline')}</h1>
          <p>{t('subhead')}</p>
          <div className="actions">
            <Link className="button primary" to="/report">Start a report <ArrowRight size={18} /></Link>
            <Link className="button" to="/track">Track my case</Link>
          </div>
        </div>
        <div className="quickPanel" aria-label="Portal highlights">
          <div><FileWarning /><strong>Anonymous or verified</strong><span>Submit safely — no account required.</span></div>
          <div><ShieldAlert /><strong>Live scam alerts</strong><span>Regional alerts for fraud and phishing.</span></div>
          <div><Bot /><strong>Bilingual guidance</strong><span>NLP support in English and Kiswahili.</span></div>
          <div><BookOpen /><strong>Works on any device</strong><span>Low-bandwidth friendly, mobile-first.</span></div>
        </div>
      </div>

      {/* ── Quick navigation cards ── */}
      <div className="dashSection">
        <div className="sectionHeader compact">
          <span className="eyebrow">Where would you like to go?</span>
          <h2>Choose your action</h2>
        </div>
        <div className="workflowGrid">
          {NAV_CARDS.map(({ title, text, href, Icon, primary }) => (
            <Link className={`card workflow${primary ? ' workflowPrimary' : ''}`} to={href} key={title}>
              <Icon size={22} />
              <h2>{title}</h2>
              <p>{text}</p>
              <span className="cardArrow"><ArrowRight size={16} /></span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="dashSection dashSectionAlt">
        <div className="sectionHeader compact">
          <span className="eyebrow">Step by step</span>
          <h2>How to report a cybercrime</h2>
          <p>The full reporting process takes about five minutes. Here is exactly what happens.</p>
        </div>
        <div className="howGrid">
          {HOW_IT_WORKS.map(({ step, Icon, title, text }) => (
            <div className="howCard" key={step}>
              <div className="howStep">{step}</div>
              <div className="howIcon"><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="actions" style={{ marginTop: '28px', justifyContent: 'center' }}>
          <Link className="button primary" to="/report">Open report wizard <ArrowRight size={18} /></Link>
          <Link className="button" to="/chatbot">Ask the chatbot first</Link>
        </div>
      </div>

      {/* ── Crime types ── */}
      <div className="dashSection">
        <div className="sectionHeader compact">
          <span className="eyebrow">We handle</span>
          <h2>Types of cybercrime you can report</h2>
          <p>Our system supports all major categories of digital crime affecting Tanzanians.</p>
        </div>
        <div className="crimeGrid">
          {CRIME_CATEGORIES.map(({ label, color, desc }) => (
            <div className="crimeCard" key={label}>
              <div className="crimeDot" style={{ background: color }} />
              <div>
                <strong>{label}</strong>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Who it serves ── */}
      <div className="dashSection dashSectionAlt">
        <div className="sectionHeader compact">
          <span className="eyebrow">Who it serves</span>
          <h2>Built for every Tanzanian</h2>
        </div>
        <div className="whoGrid">
          {WHO_IT_SERVES.map(({ Icon, title, text }) => (
            <div className="whoCard" key={title}>
              <div className="whoIcon"><Icon size={24} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick safety tips ── */}
      <div className="dashSection">
        <div className="sectionHeader compact">
          <span className="eyebrow">Stay protected</span>
          <h2>Three rules every Tanzanian should know</h2>
        </div>
        <div className="tipsRow">
          {QUICK_TIPS.map(({ Icon, title, text }) => (
            <div className="tipCard" key={title}>
              <div className="tipIcon"><Icon size={26} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="actions" style={{ marginTop: '24px', justifyContent: 'center' }}>
          <Link className="button" to="/awareness">Read all safety guides <ArrowRight size={16} /></Link>
        </div>
      </div>

      {/* ── Legal framework ── */}
      <div className="dashSection">
        <div className="legalNote panel">
          <Shield size={28} />
          <div>
            <h3>Legal framework &amp; your rights</h3>
            <p>
              This portal operates under the <strong>Tanzania Cybercrimes Act No. 14 of 2015</strong>,
              the <strong>Electronic and Postal Communications Act (EPOCA) 2010</strong>, and the{' '}
              <strong>Personal Data Protection Act 2022</strong>.
              All reports are handled with full confidentiality. Your identity is never published.
              Evidence is retained only for active investigations and deleted after case closure.
              {' '}<Link to="/policy" style={{ color: 'inherit', fontWeight: 600 }}>Read our full privacy policy →</Link>
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
