const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
const TIMEOUT_MS = 4000;

export async function callPython(endpoint, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${PYTHON_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Python service ${res.status}`);
    return await res.json();
  } catch {
    clearTimeout(timer);
    return null;
  }
}
