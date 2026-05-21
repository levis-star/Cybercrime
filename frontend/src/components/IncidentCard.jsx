import React from 'react';

export default function IncidentCard({ report }) {
  return (
    <article className="card incident">
      <div>
        <span className="pill">{report.status.replace('_', ' ')}</span>
        <h3>{report.category}</h3>
        <p>{report.description}</p>
      </div>
      <div className="incidentMeta">
        <strong>{report.severityScore}</strong>
        <span>{report.locationRegion}</span>
        <code>{report.trackingCode}</code>
      </div>
    </article>
  );
}
