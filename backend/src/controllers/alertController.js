import { z } from 'zod';
import { store } from '../data/store.js';

export const createAlertSchema = z.object({
  body: z.object({
    title: z.string().min(4).max(120),
    content: z.string().min(10).max(1200),
    language: z.enum(['en', 'sw']),
    targetRegion: z.string().min(2).max(80),
    severityLevel: z.enum(['low', 'medium', 'high', 'critical'])
  })
});

export function listAlerts(req, res) {
  const { language, region } = req.query;
  const alerts = store.alerts.filter((item) => {
    const languageMatch = language ? item.language === language : true;
    const regionMatch = region ? item.targetRegion === region || item.targetRegion === 'National' : true;
    return languageMatch && regionMatch;
  });
  return res.json({ alerts });
}

export async function createAlert(req, res) {
  const alert = await store.addAlert(req.validated.body, req.user.id);
  await store.log(req.user.id, 'alert_create', alert.id);
  return res.status(201).json({ alert });
}
