import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api/client.js';
import Notice from '../components/Notice.jsx';
import useTitle from '../utils/useTitle.js';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  useTitle('My Profile');
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(name.trim());
      setSuccess(true);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="profile-hello">
          <span className="account-avatar profile-avatar">{user.name.charAt(0).toUpperCase()}</span>
          <div>
            <p className="muted small">Hello,</p>
            <p className="profile-name">{user.name}</p>
          </div>
        </div>

        <nav className="profile-nav">
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">My Wishlist</Link>
          <span className="profile-nav-active">Profile Information</span>
        </nav>
      </aside>

      <section className="profile-main">
        <h1>Personal Information</h1>

        {error && <Notice tone="error" title="Couldn't save changes">{error}</Notice>}
        {success && <Notice tone="success" title="Saved">Your profile has been updated.</Notice>}

        <form onSubmit={submit} className="form profile-form">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            Email address
            <input value={user.email} disabled />
            <span className="hint">Email can't be changed here yet.</span>
          </label>

          <button type="submit" className="btn btn-accent" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>
    </div>
  );
}