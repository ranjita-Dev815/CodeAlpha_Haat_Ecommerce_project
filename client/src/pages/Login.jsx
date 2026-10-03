import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api/client.js';
import Notice from '../components/Notice.jsx';
import useTitle from '../utils/useTitle.js';

export default function Login() {
  useTitle('Log in');
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <h1>Log in</h1>
      {error && <Notice tone="error" title="Couldn't log you in">{error}</Notice>}
      <form onSubmit={submit} className="form">
        <label>
          Email
          <input type="email" required autoComplete="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Password
          <input type="password" required autoComplete="current-password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button type="submit" className="btn btn-accent" disabled={busy}>
          {busy ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="muted">
        New here? <Link to="/register" state={location.state}>Create an account</Link>
      </p>
      <p className="demo">
        Just looking around?{' '}
        <button type="button" className="link-btn"
          onClick={() => setForm({ email: 'user@example.com', password: 'user123' })}>
          Fill in the demo account
        </button>
      </p>
    </div>
  );
}
