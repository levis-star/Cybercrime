import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'citizen' ? '/' : '/admin');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page loginPage">
      <div className="loginIntro">
        <ShieldCheck size={42} />
        <span className="eyebrow">Restricted access</span>
        <h1>Admin operations login</h1>
        <p>Authorized staff can review incoming cybercrime reports, monitor public alerts, and verify case activity. Citizen reporting remains available only while logged out.</p>
      </div>
      <form className="formPanel loginForm" onSubmit={submit}>
        <div className="sectionHeader compactHeader">
          <LockKeyhole size={28} />
          <h2>Sign in</h2>
        </div>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="button primary" type="submit" disabled={loading}>
          <LogIn size={18} />{loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </section>
  );
}
