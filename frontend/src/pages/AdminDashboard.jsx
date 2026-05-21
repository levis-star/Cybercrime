import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import {
  AlertTriangle, CheckCircle2, ClipboardList, Database,
  FileText, MapPin, RadioTower, ShieldAlert, Timer, UserCheck
} from 'lucide-react';
import api from '../services/api.js';
import TanzaniaMap from '../components/TanzaniaMap.jsx';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const STATUS_OPTIONS  = ['new', 'under_review', 'escalated', 'resolved', 'closed'];
const VERIFY_OPTIONS  = ['unverified', 'pending', 'verified', 'rejected'];

const TASK_FORCES = [
  { value: 'police',       label: 'Tanzania Police Force (Jeshi la Polisi)' },
  { value: 'military',     label: 'Tanzania People\'s Defence Force (TPDF)' },
  { value: 'court',        label: 'Mahakama (Court System)' },
  { value: 'fia',          label: 'Financial Intelligence Authority (FIA)' },
  { value: 'tcra',         label: 'Tanzania Communications Regulatory Authority (TCRA)' },
  { value: 'intelligence', label: 'Tanzania Intelligence & Security Services (TISS)' },
];

const TZ_REGIONS = [
  'Arusha','Dar es Salaam','Dodoma','Geita','Iringa','Kagera','Katavi','Kigoma',
  'Kilimanjaro','Lindi','Manyara','Mara','Mbeya','Morogoro','Mtwara','Mwanza',
  'Njombe','Pemba North','Pemba South','Pwani','Rukwa','Ruvuma','Shinyanga',
  'Simiyu','Singida','Songwe','Tabora','Tanga','Unguja North','Unguja South',
  'Unguja Urban/West',
];

const TZ_DISTRICTS = {
  'Arusha':['Arusha City','Arusha DC','Karatu','Longido','Monduli','Ngorongoro'],
  'Dar es Salaam':['Ilala','Kinondoni','Temeke','Ubungo','Kigamboni'],
  'Dodoma':['Dodoma City','Bahi','Chamwino','Chemba','Kondoa','Kongwa','Mpwapwa'],
  'Geita':['Geita DC','Geita TC','Bukombe','Chato','Mbogwe',"Nyang'hwale"],
  'Iringa':['Iringa Municipal','Iringa DC','Kilolo','Mafinga TC','Mufindi'],
  'Kagera':['Bukoba Municipal','Bukoba DC','Biharamulo','Karagwe','Kyerwa','Missenyi','Muleba','Ngara'],
  'Katavi':['Mpanda Municipal','Mpanda DC','Mlele','Nsimbo'],
  'Kigoma':['Kigoma-Ujiji Municipal','Kigoma DC','Buhigwe','Kakonko','Kasulu DC','Kasulu TC','Kibondo','Uvinza'],
  'Kilimanjaro':['Moshi Municipal','Moshi DC','Hai','Mwanga','Rombo','Same','Siha'],
  'Lindi':['Lindi Municipal','Lindi DC','Kilwa','Liwale','Nachingwea','Ruangwa'],
  'Manyara':['Babati TC','Babati DC','Hanang','Kiteto','Mbulu','Simanjiro'],
  'Mara':['Musoma Municipal','Musoma DC','Bunda','Butiama','Rorya','Serengeti','Tarime DC','Tarime TC'],
  'Mbeya':['Mbeya City','Mbeya DC','Busokelo','Chunya','Kyela','Mbarali','Momba','Rungwe'],
  'Morogoro':['Morogoro Municipal','Morogoro DC','Gairo','Ifakara TC','Kilombero','Kilosa','Malinyi','Mvomero','Ulanga'],
  'Mtwara':['Mtwara Municipal','Mtwara DC','Masasi DC','Masasi TC','Nanyumbu','Newala DC','Newala TC','Tandahimba'],
  'Mwanza':['Ilemela','Nyamagana','Kwimba','Magu','Misungwi','Sengerema','Ukerewe'],
  'Njombe':['Njombe TC','Njombe DC','Ludewa','Makambako TC','Makete',"Wanging'ombe"],
  'Pemba North':['Micheweni','Wete'],
  'Pemba South':['Chake Chake','Mkoani'],
  'Pwani':['Bagamoyo','Kibaha DC','Kibaha TC','Kisarawe','Mafia','Mkuranga','Rufiji'],
  'Rukwa':['Sumbawanga Municipal','Sumbawanga DC','Kalambo','Nkasi'],
  'Ruvuma':['Songea Municipal','Songea DC','Mbinga DC','Mbinga TC','Namtumbo','Nyasa','Tunduru DC','Tunduru TC'],
  'Shinyanga':['Shinyanga Municipal','Shinyanga DC','Kahama TC','Kahama DC','Kishapu','Msalala','Ushetu'],
  'Simiyu':['Bariadi DC','Bariadi TC','Busega','Itilima','Maswa','Meatu'],
  'Singida':['Singida Municipal','Singida DC','Ikungi','Iramba','Manyoni','Mkalama'],
  'Songwe':['Mbozi','Momba','Ileje','Songwe DC','Tunduma TC','Vwawa TC'],
  'Tabora':['Tabora Municipal','Igunga','Kaliua','Nzega DC','Nzega TC','Sikonge','Urambo','Uyui'],
  'Tanga':['Tanga City','Handeni DC','Handeni TC','Kilindi','Korogwe DC','Korogwe TC','Lushoto','Mkinga','Muheza','Pangani'],
  'Unguja North':['Kaskazini A','Kaskazini B'],
  'Unguja South':['Kusini'],
  'Unguja Urban/West':['Magharibi','Mjini'],
};

const metricIcons = {
  totalReports: FileText, openReports: Timer,
  highSeverity: ShieldAlert, averageSeverity: AlertTriangle, liveAlerts: RadioTower
};
const metricLabels = {
  totalReports:'Total reports', openReports:'Open reports',
  highSeverity:'High severity', averageSeverity:'Avg. severity', liveAlerts:'Live alerts'
};

const blankAssign = { taskForce: 'police', taskForceName: TASK_FORCES[0].label, region: 'Dar es Salaam', district: '' };

export default function AdminDashboard() {
  const [dashboard, setDashboard]   = useState(null);
  const [analytics, setAnalytics]   = useState(null);
  const [auditLogs, setAuditLogs]   = useState([]);
  const [error, setError]           = useState('');

  // inline status review
  const [reviewState, setReviewState] = useState({});
  const [reviewMsg,   setReviewMsg]   = useState({});

  // inline assignment
  const [assignState, setAssignState] = useState({});
  const [assignMsg,   setAssignMsg]   = useState({});

  const load = () =>
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/analytics'),
      api.get('/admin/audit-logs'),
    ]).then(([d, a, l]) => {
      setDashboard(d.data);
      setAnalytics(a.data);
      setAuditLogs(l.data.logs || []);
    }).catch(() => setError('Unable to load admin dashboard.'));

  useEffect(() => { load(); }, []);

  const categoryChart = useMemo(() => {
    const rows = analytics?.byCategory?.length ? analytics.byCategory : [{ category: 'No data', count: 0 }];
    return {
      labels: rows.map((r) => r.category),
      datasets: [{ label: 'Reports', data: rows.map((r) => r.count), backgroundColor: '#0f766e', borderRadius: 6 }],
    };
  }, [analytics]);

  const severityChart = useMemo(() => {
    const rows = analytics?.severityBands || [];
    return {
      labels: rows.map((r) => r.label),
      datasets: [{ label: 'Cases', data: rows.map((r) => r.count), backgroundColor: ['#79b8a9','#f2b84b','#d34f3f'], borderRadius: 6 }],
    };
  }, [analytics]);

  const submitReview = async (reportId) => {
    const changes = reviewState[reportId];
    if (!changes) return;
    try {
      await api.put('/admin/report-review', { reportId, ...changes });
      setReviewMsg((p) => ({ ...p, [reportId]: 'Saved.' }));
      load();
    } catch (err) {
      setReviewMsg((p) => ({ ...p, [reportId]: err.response?.data?.message || 'Failed.' }));
    }
  };

  const initAssign = (report) => {
    const existing = report.assignment || {};
    setAssignState((p) => ({
      ...p,
      [report.id]: {
        taskForce:     existing.taskForce     || 'police',
        taskForceName: existing.taskForceName || TASK_FORCES[0].label,
        region:        existing.region        || report.locationRegion || 'Dar es Salaam',
        district:      existing.district      || report.locationDistrict || '',
      },
    }));
  };

  const submitAssign = async (reportId) => {
    const data = assignState[reportId];
    if (!data || !data.district) return;
    try {
      await api.put('/admin/assign-case', { reportId, ...data });
      setAssignMsg((p) => ({ ...p, [reportId]: 'Case assigned.' }));
      load();
    } catch (err) {
      setAssignMsg((p) => ({ ...p, [reportId]: err.response?.data?.message || 'Failed.' }));
    }
  };

  const closePanel = (id, setter) =>
    setter((p) => { const n = { ...p }; delete n[id]; return n; });

  if (error) return <section className="page"><p className="error">{error}</p></section>;
  if (!dashboard || !analytics) return (
    <section className="page">
      <div className="skeletonGrid">
        {[...Array(5)].map((_, i) => <div className="skeleton skeletonCard" key={i} />)}
      </div>
    </section>
  );

  return (
    <section className="page adminPage">

      {/* ── Hero ── */}
      <div className="adminHero">
        <div>
          <span className="eyebrow">Cybercrime operations center</span>
          <h1>Admin dashboard</h1>
          <p>Review incoming cases, assign them to the correct task force, and monitor the national crime map.</p>
        </div>
        <div className="dbCard">
          <Database size={24} />
          <div>
            <strong>{dashboard.database.connected ? 'Database connected' : 'Database offline'}</strong>
            <span>{dashboard.database.provider}</span>
          </div>
          <CheckCircle2 size={22} className="okIcon" />
        </div>
      </div>

      {/* ── Metrics ── */}
      <div className="metrics adminMetrics">
        {Object.entries(dashboard.metrics).map(([key, value]) => {
          const Icon = metricIcons[key] || FileText;
          return (
            <article className="metric adminMetric" key={key}>
              <div className="metricIcon"><Icon size={22} /></div>
              <span>{metricLabels[key] || key}</span>
              <strong>{value}</strong>
            </article>
          );
        })}
      </div>

      {/* ── Status pipeline ── */}
      <div className="statusPipeline">
        {dashboard.statusBreakdown.map((item) => (
          <article key={item.status}>
            <span>{item.status.replace('_', ' ')}</span>
            <strong>{item.count}</strong>
          </article>
        ))}
      </div>

      {/* ── Tanzania crime map ── */}
      <div className="panel">
        <div className="panelHeader">
          <h2><MapPin size={20} /> Ramani ya Tanzania — Maeneo ya Uhalifu</h2>
          <span>{analytics.threatMap?.length || 0} incidents mapped</span>
        </div>
        <TanzaniaMap reports={analytics.threatMap || []} />
        <div className="mapLegend">
          <span className="legendDot" style={{ background: '#79b8a9' }} />Low (&lt;40)
          <span className="legendDot" style={{ background: '#f2b84b' }} />Medium (40–69)
          <span className="legendDot" style={{ background: '#d34f3f' }} />High (70+)
          <span className="legendDot" style={{ background: '#c9d9d6' }} />Region (no reports)
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="dashboardGrid adminGrid">
        <div className="panel">
          <div className="panelHeader"><h2>Fraud by category</h2><span>{dashboard.metrics.totalReports} total</span></div>
          <Bar data={categoryChart} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }} />
        </div>
        <div className="panel">
          <div className="panelHeader"><h2>Severity bands</h2><span>Risk view</span></div>
          <Bar data={severityChart} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }} />
        </div>
      </div>

      {/* ── Report queue — review + assign ── */}
      <div className="panel">
        <div className="panelHeader">
          <h2>Case queue</h2>
          <span>Click a row to review status or assign to a task force</span>
        </div>
        {dashboard.recentReports.length ? (
          <div className="reportTable">
            <div className="reportTableHead">
              <span>Tracking</span><span>Category</span><span>Region</span><span>Status</span><span>Assigned to</span>
            </div>
            {dashboard.recentReports.map((report) => (
              <div key={report.id}>
                {/* Row */}
                <div
                  className="reportTableRow"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (!reviewState[report.id] && !assignState[report.id]) initAssign(report);
                  }}
                >
                  <code>{report.trackingCode}</code>
                  <span>{report.category}</span>
                  <span>{report.locationRegion}</span>
                  <span className="pill">{report.status.replace('_', ' ')}</span>
                  <span>
                    {report.assignment
                      ? <span className="assignedBadge"><UserCheck size={14} />{report.assignment.taskForceName.split('(')[0].trim()}</span>
                      : <span className="unassignedBadge">Unassigned</span>}
                  </span>
                </div>

                {/* Status review panel */}
                {reviewState[report.id] && (
                  <div className="reviewInline">
                    <label>Status
                      <select value={reviewState[report.id].status}
                        onChange={(e) => setReviewState((p) => ({ ...p, [report.id]: { ...p[report.id], status: e.target.value } }))}>
                        {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </label>
                    <label>Verification
                      <select value={reviewState[report.id].verificationStatus}
                        onChange={(e) => setReviewState((p) => ({ ...p, [report.id]: { ...p[report.id], verificationStatus: e.target.value } }))}>
                        {VERIFY_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </label>
                    <div className="reviewInlineActions">
                      <button className="button primary" onClick={() => submitReview(report.id)}>Save status</button>
                      <button className="button" onClick={() => { closePanel(report.id, setReviewState); initAssign(report); }}>Assign →</button>
                      <button className="button" onClick={() => closePanel(report.id, setReviewState)}>Cancel</button>
                      {reviewMsg[report.id] && <span className={reviewMsg[report.id] === 'Saved.' ? 'okText' : 'error'}>{reviewMsg[report.id]}</span>}
                    </div>
                  </div>
                )}

                {/* Task force assignment panel */}
                {assignState[report.id] && (
                  <div className="assignInline">
                    <div className="assignHeader">
                      <UserCheck size={18} />
                      <strong>Assign case {report.trackingCode} to task force</strong>
                    </div>
                    <div className="assignGrid">
                      <label>Task force
                        <select value={assignState[report.id].taskForce}
                          onChange={(e) => {
                            const tf = TASK_FORCES.find((t) => t.value === e.target.value);
                            setAssignState((p) => ({ ...p, [report.id]: { ...p[report.id], taskForce: e.target.value, taskForceName: tf?.label || '' } }));
                          }}>
                          {TASK_FORCES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </label>
                      <label>Mkoa (Region)
                        <select value={assignState[report.id].region}
                          onChange={(e) => setAssignState((p) => ({ ...p, [report.id]: { ...p[report.id], region: e.target.value, district: '' } }))}>
                          {TZ_REGIONS.map((r) => <option key={r}>{r}</option>)}
                        </select>
                      </label>
                      <label>Wilaya (District) <span className="requiredStar">*</span>
                        <select value={assignState[report.id].district}
                          onChange={(e) => setAssignState((p) => ({ ...p, [report.id]: { ...p[report.id], district: e.target.value } }))}>
                          <option value="">— select district —</option>
                          {(TZ_DISTRICTS[assignState[report.id].region] || []).map((d) => <option key={d}>{d}</option>)}
                        </select>
                      </label>
                    </div>
                    <div className="reviewInlineActions">
                      <button
                        className="button primary"
                        disabled={!assignState[report.id].district}
                        onClick={() => submitAssign(report.id)}
                      >
                        <UserCheck size={16} /> Assign case
                      </button>
                      <button className="button" onClick={() => { closePanel(report.id, setAssignState); setReviewState((p) => ({ ...p, [report.id]: { status: report.status, verificationStatus: report.verificationStatus } })); }}>← Review status</button>
                      <button className="button" onClick={() => closePanel(report.id, setAssignState)}>Cancel</button>
                      {assignMsg[report.id] && <span className={assignMsg[report.id] === 'Case assigned.' ? 'okText' : 'error'}>{assignMsg[report.id]}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="emptyState"><FileText size={38} /><h3>No citizen reports yet</h3></div>
        )}
      </div>

      {/* ── Audit log ── */}
      <div className="panel">
        <div className="panelHeader"><h2><ClipboardList size={20} /> Audit log</h2><span>Last 50 actions</span></div>
        {auditLogs.length ? (
          <div className="auditTable">
            {auditLogs.map((log) => (
              <div className="auditRow" key={log.id}>
                <code>{log.action}</code>
                <span>{log.targetRecord}</span>
                <span className="logTime">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="emptyState"><ClipboardList size={32} /><h3>No audit entries yet</h3></div>
        )}
      </div>

    </section>
  );
}
