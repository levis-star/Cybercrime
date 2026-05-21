import React from 'react';
import { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function ApiStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    api
      .get('/health')
      .then(() => setStatus('connected'))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <div className={`apiStatus ${status}`}>
      API {status === 'connected' ? 'connected' : status === 'offline' ? 'offline' : 'checking'}
    </div>
  );
}
