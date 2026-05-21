import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Bot, BookOpen, Clock, EyeOff, FileText, Lock,
  Mail, MapPin, Phone, Search, Shield, ShieldCheck, Trash2
} from 'lucide-react';

const MISSION = [
  {
    Icon: FileText,
    title: 'Safe, private reporting',
    text: 'Any citizen can submit a cybercrime report anonymously — no name or account needed. A private tracking code is issued immediately so victims can follow their case without revealing their identity.'
  },
  {
    Icon: BookOpen,
    title: 'Bilingual public awareness',
    text: 'Prevention guides and real-case breakdowns are available in both English and Kiswahili, covering mobile money fraud, phishing, fake jobs, SIM swap, and identity theft.'
  },
  {
    Icon: Bot,
    title: 'Intelligent NLP guidance',
    text: 'An AI-powered chatbot helps victims understand what steps to take, how to preserve digital evidence, and when to escalate their case to law enforcement.'
  },
  {
    Icon: Search,
    title: 'Full case transparency',
    text: 'Citizens track their report status at any time using only their tracking code — no login required. Status updates include which task force has been assigned and in which region.'
  },
];

const AUTHORITIES = [
  {
    name: 'Tanzania Police Force — Cybercrime Unit',
    address: 'Police Headquarters, Dar es Salaam',
    phone: '+255 22 212 3456',
    email: 'cybercrime@police.go.tz',
    hours: 'Monday – Friday, 08:00 – 17:00'
  },
  {
    name: 'Emergency Police Line',
    address: 'Nationwide',
    phone: '112',
    email: null,
    hours: '24 hours, 7 days a week'
  },
  {
    name: 'Tanzania Communications Regulatory Authority (TCRA)',
    address: 'Mawasiliano Towers, Sam Nujoma Road, Dar es Salaam',
    phone: '+255 22 211 9730',
    email: 'dg@tcra.go.tz',
    hours: 'Monday – Friday, 08:00 – 16:30'
  },
  {
    name: 'Financial Intelligence Unit (FIU)',
    address: 'Bank of Tanzania Building, Dar es Salaam',
    phone: '+255 22 223 9000',
    email: 'info@fiu.go.tz',
    hours: 'Monday – Friday, 08:00 – 16:00'
  },
];

export default function AboutUs() {
  return (
    <section className="page aboutPage">

      {/* ── Hero ── */}
      <div className="aboutHero">
        <div className="aboutHeroCopy">
          <span className="eyebrow">Tanzania public safety system</span>
          <h1>About CyberSafe TZ</h1>
          <p>
            CyberSafe TZ is a bilingual cybercrime reporting and awareness portal built to help
            Tanzanian citizens, businesses, and communities report digital offences safely,
            learn how to protect themselves online, and follow their case status — all without
            requiring technical knowledge or a registered account.
          </p>
          <div className="actions">
            <Link className="button primary" to="/report">Start a report <ArrowRight size={18} /></Link>
            <Link className="button" to="/awareness">Awareness hub</Link>
          </div>
        </div>
        <div className="aboutHeroVisual">
          <ShieldCheck size={72} strokeWidth={1.2} />
          <p>Protecting Tanzania's digital community</p>
        </div>
      </div>

      {/* ── Mission ── */}
      <div className="aboutSection">
        <div className="sectionHeader">
          <span className="eyebrow">Our mission</span>
          <h2>What this system is built to do</h2>
          <p>CyberSafe TZ was built to close the gap between Tanzanians experiencing cybercrime and the authorities who can act on it.</p>
        </div>
        <div className="missionGrid">
          {MISSION.map(({ Icon, title, text }) => (
            <div className="missionCard" key={title}>
              <Icon size={28} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Commitment to citizens ── */}
      <div className="aboutSection">
        <div className="sectionHeader">
          <span className="eyebrow">Our promise to you</span>
          <h2>Our commitment to every citizen</h2>
          <p>We built CyberSafe TZ around one principle: every Tanzanian deserves to report crime safely, without fear.</p>
        </div>
        <div className="commitGrid">
          <div className="commitCard">
            <div className="commitIcon"><EyeOff size={26} /></div>
            <h3>Your identity stays private</h3>
            <p>Reports can be submitted fully anonymously — no account, no name, no personal details required. A private tracking code is issued so only you can follow your case.</p>
          </div>
          <div className="commitCard">
            <div className="commitIcon"><Lock size={26} /></div>
            <h3>Your data is never sold or shared</h3>
            <p>Information you submit is shared only with the assigned law enforcement authority handling your specific case. It is never sold, published, or disclosed to any third party.</p>
          </div>
          <div className="commitCard">
            <div className="commitIcon"><Clock size={26} /></div>
            <h3>Cases reviewed within 48 hours</h3>
            <p>Every submitted report is reviewed by a trained analyst within 48 hours. High-severity incidents — such as active fraud or financial theft — are escalated immediately.</p>
          </div>
          <div className="commitCard">
            <div className="commitIcon"><Trash2 size={26} /></div>
            <h3>Evidence deleted after case closure</h3>
            <p>Any files or screenshots you attach as evidence are stored securely with encryption and permanently deleted once your case is closed or withdrawn.</p>
          </div>
        </div>
      </div>

      {/* ── Authority contacts ── */}
      <div className="aboutSection">
        <div className="sectionHeader">
          <span className="eyebrow">Official contacts</span>
          <h2>Cybercrime reporting authorities</h2>
          <p>
            For urgent threats, active financial theft, or cases involving violence — contact these
            authorities directly in addition to submitting a report here.
          </p>
        </div>
        <div className="authorityGrid">
          {AUTHORITIES.map((auth) => (
            <div className="authorityCard" key={auth.name}>
              <h3>{auth.name}</h3>
              <div className="authorityDetails">
                <span><MapPin size={15} />{auth.address}</span>
                <span><Phone size={15} /><a href={`tel:${auth.phone}`}>{auth.phone}</a></span>
                {auth.email && (
                  <span><Mail size={15} /><a href={`mailto:${auth.email}`}>{auth.email}</a></span>
                )}
                <span className="authorityHours">Open: {auth.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Legal ── */}
      <div className="aboutSection">
        <div className="legalNote panel">
          <Shield size={28} />
          <div>
            <h3>Legal framework</h3>
            <p>
              This system operates under the <strong>Tanzania Cybercrimes Act No. 14 of 2015</strong>,
              the <strong>Electronic and Postal Communications Act (EPOCA) 2010</strong>, and the{' '}
              <strong>Personal Data Protection Act 2022</strong>.
              All reports are handled with full confidentiality. Victim identity is never published.
              Evidence is retained only for active investigations and deleted after case closure.
              {' '}<Link to="/policy" style={{ color: 'inherit', fontWeight: 600 }}>Read our privacy policy →</Link>
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
