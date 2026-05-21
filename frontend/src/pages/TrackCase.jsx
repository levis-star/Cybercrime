import React, { useState } from 'react';
import { Building2, FileCheck, MapPin, Search, ShieldCheck, UserCheck } from 'lucide-react';
import { reportService } from '../services/reportService.js';

const TASK_FORCE_LABELS = {
  police:       'Tanzania Police Force (Jeshi la Polisi)',
  military:     "Tanzania People's Defence Force (TPDF)",
  court:        'Mahakama (Court System)',
  fia:          'Financial Intelligence Authority (FIA)',
  tcra:         'Tanzania Communications Regulatory Authority (TCRA)',
  intelligence: 'Tanzania Intelligence & Security Services (TISS)',
};

const STATUS_COLORS = {
  new:          '#5f736f',
  under_review: '#0f766e',
  escalated:    '#d97706',
  resolved:     '#16a34a',
  closed:       '#94a3b8',
};

export default function TrackCase() {
  const [trackingCode, setTrackingCode] = useState('');
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const track = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      setResult(await reportService.track(trackingCode.trim()));
    } catch {
      setError('No case found with that tracking code. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const report     = result?.report;
  const evidence   = result?.evidence || [];
  const assignment = report?.assignment;

  return (
    <section className="page narrow">
      <div className="sectionHeader">
        <span className="eyebrow">Case status</span>
        <h1>Track your report</h1>
        <p>Enter the unique case number you received after submitting your report.</p>
      </div>

      <div className="trackBox">
        <input
          placeholder="e.g. TZ-CC-2026-0001"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && track()}
        />
        <button className="button primary" onClick={track} disabled={loading || !trackingCode.trim()}>
          <Search size={18} />{loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {report && (
        <article className="caseCard">
          {/* Status badge */}
          <div className="caseStatusRow">
            <span className="caseStatusBadge" style={{ background: STATUS_COLORS[report.status] || '#5f736f' }}>
              {report.status.replace('_', ' ').toUpperCase()}
            </span>
            <code className="caseCode">{report.trackingCode}</code>
          </div>

          <h2>{report.category}</h2>
          <p className="caseDesc">{report.description}</p>

          {/* Core details */}
          <div className="reviewBox">
            <p><strong>Region (Mkoa)</strong><span>{report.locationRegion}</span></p>
            {report.locationDistrict && <p><strong>District (Wilaya)</strong><span>{report.locationDistrict}</span></p>}
            <p><strong>Severity score</strong><span>{report.pythonSeverityScore ?? report.severityScore}</span></p>
            <p><strong>Submitted</strong><span>{new Date(report.createdAt).toLocaleDateString('en-TZ', { year:'numeric', month:'long', day:'numeric' })}</span></p>
          </div>

          {/* Task force assignment */}
          {assignment ? (
            <div className="assignmentCard">
              <div className="assignmentHeader">
                <UserCheck size={22} />
                <h3>Case assigned to task force</h3>
              </div>
              <div className="assignmentDetails">
                <div className="assignmentRow">
                  <Building2 size={16} />
                  <div>
                    <span className="assignLabel">Task force</span>
                    <strong>{TASK_FORCE_LABELS[assignment.taskForce] || assignment.taskForceName}</strong>
                  </div>
                </div>
                <div className="assignmentRow">
                  <MapPin size={16} />
                  <div>
                    <span className="assignLabel">Assigned region (Mkoa)</span>
                    <strong>{assignment.region}</strong>
                  </div>
                </div>
                <div className="assignmentRow">
                  <ShieldCheck size={16} />
                  <div>
                    <span className="assignLabel">Assigned district (Wilaya)</span>
                    <strong>{assignment.district}</strong>
                  </div>
                </div>
                <p className="assignedDate">
                  Assigned on {new Date(assignment.assignedAt).toLocaleDateString('en-TZ', { year:'numeric', month:'long', day:'numeric' })}
                </p>
              </div>
            </div>
          ) : (
            <div className="assignmentPending">
              <UserCheck size={20} />
              <div>
                <strong>Awaiting assignment</strong>
                <p>Your case is in the review queue and will be assigned to the relevant authority shortly.</p>
              </div>
            </div>
          )}

          {/* Evidence */}
          {evidence.length > 0 && (
            <div className="evidenceSection">
              <h3><FileCheck size={18} /> Attached evidence ({evidence.length})</h3>
              <ul className="uploadedList">
                {evidence.map((f) => (
                  <li key={f.id}>
                    <FileCheck size={16} />
                    <span>{f.fileUrl.split('/').pop()}</span>
                    <span className="logTime">{new Date(f.uploadedAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      )}
    </section>
  );
}
