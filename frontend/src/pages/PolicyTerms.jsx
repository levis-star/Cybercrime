import React from 'react';

const sections = [
  {
    title: 'Protect yourself before an incident',
    text:
      'Use strong passwords, avoid reusing the same password on many services, and enable two-step verification where it is available. Keep your mobile money PIN, OTP codes, and recovery codes private. Be careful with public Wi-Fi, shared computers, and links sent through SMS or social media. A person who pressures you to act immediately, send money, or reveal private information should be treated as suspicious until verified through an official channel.'
  },
  {
    title: 'Preserve evidence correctly',
    text:
      'If you believe an offense has happened, do not delete messages, block accounts before saving details, or edit screenshots. Keep phone numbers, usernames, profile links, transaction IDs, dates, times, email addresses, website links, and screenshots. Evidence is stronger when it shows the full context of the conversation and the original source of the request.'
  },
  {
    title: 'Report with accurate information',
    text:
      'A report should explain what happened in simple order: how the contact started, what the suspect requested, what information or money was shared, and when you discovered the problem. Do not exaggerate or include unrelated personal information. If you report anonymously, keep your tracking code safe because it is the only way to follow the case without revealing identity.'
  },
  {
    title: 'Privacy and responsible use',
    text:
      'This system should collect only the information needed for case intake and awareness response. Administrators must protect victim identity, avoid publishing private evidence, and use access only for lawful review. Public alerts should warn citizens about patterns of fraud without exposing victims, suspects, or sensitive investigation details.'
  },
  {
    title: 'When to escalate quickly',
    text:
      'Urgent cases include active financial theft, SIM swap, threats of violence, child safety concerns, identity theft, blackmail, or ongoing harassment. In those cases, contact the relevant service provider or authority immediately while also submitting a structured report with evidence.'
  }
];

export default function PolicyTerms() {
  return (
    <section className="page policyPage">
      <div className="sectionHeader">
        <span className="eyebrow">Compliance and citizen guidance</span>
        <h1>Privacy and responsible reporting</h1>
        <p>These guidelines help citizens protect themselves, preserve evidence, and submit reports that can be reviewed safely and professionally.</p>
      </div>
      <div className="policyGrid">
        {sections.map((section) => (
          <article className="panel prose" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
