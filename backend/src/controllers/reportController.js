import { z } from 'zod';
import { store } from '../data/store.js';
import { callPython } from '../utils/pythonBridge.js';

const categories = [
  'Mobile money fraud',
  'SIM swap',
  'Social media scams',
  'Phishing',
  'Identity theft',
  'Cyberbullying',
  'Online harassment',
  'Fake jobs',
  'Financial fraud'
];

export const createReportSchema = z.object({
  body: z.object({
    category: z.enum(categories),
    description: z.string().min(20).max(3000),
    locationRegion: z.string().min(2).max(80),
    locationDistrict: z.string().min(2).max(80).optional().nullable(),
    latitude: z.number().min(-12).max(0).optional().nullable(),
    longitude: z.number().min(28).max(42).optional().nullable(),
    anonymityStatus: z.enum(['anonymous', 'verified']),
    hasEvidence: z.boolean().default(false)
  })
});

export const trackingSchema = z.object({
  params: z.object({
    trackingCode: z.string().min(8).max(30)
  })
});

export const updateReportSchema = z.object({
  body: z.object({
    reportId: z.string(),
    status: z.enum(['new', 'under_review', 'escalated', 'resolved', 'closed']).optional(),
    verificationStatus: z.enum(['unverified', 'pending', 'verified', 'rejected']).optional()
  })
});

export async function createReport(req, res) {
  const body = req.validated.body;

  // Try Python severity scoring, fall back to store's JS formula
  const pythonScore = await callPython('/analyze', {
    category: body.category,
    description: body.description,
    hasEvidence: body.hasEvidence,
    anonymityStatus: body.anonymityStatus
  });

  const report = await store.createReport({
    ...body,
    userId: req.user?.id,
    pythonSeverityScore: pythonScore?.severityScore ?? null,
    severityFlags: pythonScore?.flags ?? []
  });

  return res.status(201).json({ report });
}

export function getReport(req, res) {
  const report = store.reports.find((item) => item.trackingCode === req.validated.params.trackingCode);
  if (!report) return res.status(404).json({ message: 'Report not found' });
  const reportEvidence = store.evidence.filter((item) => item.reportId === report.id);
  return res.json({ report, evidence: reportEvidence });
}

export async function updateReport(req, res) {
  const report = store.reports.find((item) => item.id === req.validated.body.reportId);
  if (!report) return res.status(404).json({ message: 'Report not found' });

  const updated = await store.updateReport(report, {
    status: req.validated.body.status || report.status,
    verificationStatus: req.validated.body.verificationStatus || report.verificationStatus
  }, req.user.id);

  return res.json({ report: updated });
}

export async function uploadEvidenceFile(req, res) {
  const report = store.reports.find((item) => item.trackingCode === req.params.trackingCode);
  if (!report) return res.status(404).json({ message: 'Report not found' });
  if (!req.file) return res.status(422).json({ message: 'Evidence file is required' });

  const item = await store.addEvidence(report.id, req.file);
  return res.status(201).json({ evidence: item });
}

export function listCategories(_req, res) {
  return res.json({ categories });
}
