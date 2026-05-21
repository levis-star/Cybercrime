import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AlertBanner({ alerts }) {
  if (!alerts.length) return null;
  const alert = alerts[0];
  return (
    <div className={`alertBanner ${alert.severityLevel}`}>
      <AlertTriangle size={20} />
      <strong>{alert.title}</strong>
      <span>{alert.content}</span>
    </div>
  );
}
