import { z } from 'zod';
import { store } from '../data/store.js';

export const assignCaseSchema = z.object({
  body: z.object({
    reportId: z.string().min(1),
    taskForce: z.enum(['police', 'military', 'court', 'fia', 'tcra', 'intelligence']),
    taskForceName: z.string().min(2).max(120),
    region: z.string().min(2).max(80),
    district: z.string().min(2).max(80)
  })
});

export function dashboard(_req, res) {
  const totalReports = store.reports.length;
  const openReports = store.reports.filter((item) => !['resolved', 'closed'].includes(item.status)).length;
  const highSeverity = store.reports.filter((item) => item.severityScore >= 70).length;
  const recentReports = store.reports.slice(0, 20);
  const averageSeverity = totalReports
    ? Math.round(store.reports.reduce((sum, report) => sum + report.severityScore, 0) / totalReports)
    : 0;
  const statusBreakdown = ['new', 'under_review', 'escalated', 'resolved', 'closed'].map((status) => ({
    status,
    count: store.reports.filter((report) => report.status === status).length
  }));

  return res.json({
    metrics: { totalReports, openReports, highSeverity, averageSeverity, liveAlerts: store.alerts.length },
    statusBreakdown,
    recentReports,
    database: store.databaseStatus()
  });
}

export function analytics(_req, res) {
  const byCategory = Object.entries(
    store.reports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count }));

  const byRegion = Object.entries(
    store.reports.reduce((acc, report) => {
      acc[report.locationRegion] = (acc[report.locationRegion] || 0) + 1;
      return acc;
    }, {})
  ).map(([region, count]) => ({ region, count }));

  const threatMap = store.reports
    .filter((report) => report.latitude && report.longitude)
    .map((report) => ({
      id: report.id,
      trackingCode: report.trackingCode,
      category: report.category,
      region: report.locationRegion,
      district: report.locationDistrict || null,
      severityScore: report.severityScore,
      status: report.status,
      assignment: report.assignment || null,
      latitude: report.latitude,
      longitude: report.longitude
    }));

  const severityBands = [
    { label: 'Low',    count: store.reports.filter((r) => r.severityScore < 40).length },
    { label: 'Medium', count: store.reports.filter((r) => r.severityScore >= 40 && r.severityScore < 70).length },
    { label: 'High',   count: store.reports.filter((r) => r.severityScore >= 70).length }
  ];

  return res.json({ byCategory, byRegion, threatMap, severityBands });
}

export function auditLogs(_req, res) {
  return res.json({ logs: store.auditLogs.slice(0, 50) });
}

export function databaseStatus(_req, res) {
  return res.json({ database: store.databaseStatus() });
}

export async function assignCase(req, res) {
  const { reportId, taskForce, taskForceName, region, district } = req.validated.body;
  const report = store.reports.find((r) => r.id === reportId);
  if (!report) return res.status(404).json({ message: 'Report not found' });

  const updated = await store.assignReport(
    report,
    { taskForce, taskForceName, region, district },
    req.user.id
  );
  return res.json({ report: updated });
}
