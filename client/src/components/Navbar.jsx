import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

function AccountMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) {
    return <NavLink to="/login">Log in</NavLink>;
  }

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="account-menu" ref={ref}>
      <button
        type="button"
        className="account-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="account-avatar" aria-hidden="true">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="account-name">{user.name.split(' ')[0]}</span>
        <span className={`account-chevron${open ? ' is-open' : ''}`} aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="account-dropdown" role="menu">
          <div className="account-dropdown-head">
            <p className="account-dropdown-title">Your Account</p>
            <p className="muted small">{user.email}</p>
          </div>

          <Link to="/orders" className="account-dropdown-item" onClick={() => setOpen(false)}>
            <span className="account-item-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 7h16l-1.5 12.5a1 1 0 01-1 .9H6.5a1 1 0 01-1-.9L4 7z" />
                <path d="M8 7V5a4 4 0 018 0v2" />
              </svg>
            </span>
            Orders
          </Link>
          <Link to="/profile" className="account-dropdown-item" onClick={() => setOpen(false)}>
            <span className="account-item-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M4.5 20c1.5-4 5-6 7.5-6s6 2 7.5 6" />
              </svg>
            </span>
            My Profile
          </Link>

          <Link to="/wishlist" className="account-dropdown-item" onClick={() => setOpen(false)}>
            <span className="account-item-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 20s-7-4.35-9.5-8.5C1 8 3 5 6 5c2 0 3.3 1.2 4 2.3C10.7 6.2 12 5 14 5c3 0 5 3 3.5 6.5C15 15.65 12 20 12 20z" />
              </svg>
            </span>
            Wishlist
          </Link>

          {user.role === 'admin' && (
            <Link to="/admin" className="account-dropdown-item" onClick={() => setOpen(false)}>
              <span className="account-item-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 9h18" />
                </svg>
              </span>
              Admin
            </Link>
          )}

          <button type="button" className="account-dropdown-item account-logout" onClick={handleLogout}>
            <span className="account-item-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <path d="M16 17l5-5-5-5M21 12H9" />
              </svg>
            </span>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('keyword') || '');

  // Keep the search box in step with the URL (e.g. after "Clear filters")
  useEffect(() => setQ(params.get('keyword') || ''), [params]);

  // Bump the cart badge when the count changes (not on first load)
  const prevCount = useRef(count);
  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (prevCount.current === count) return;
    prevCount.current = count;
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [count]);

  const search = (e) => {
    e.preventDefault();
    const keyword = q.trim();
    navigate(keyword ? `/?keyword=${encodeURIComponent(keyword)}` : '/');
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label="Haat home">haat</Link>

        <form className="nav-search" role="search" onSubmit={search}>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
          />
          <button type="submit" className="btn btn-accent">Search</button>
        </form>

        <nav className="nav-links" aria-label="Main">
          <NavLink to="/cart" className="nav-cart">
            Cart
            {count > 0 && (
              <span className={`badge${bump ? ' bump' : ''}`} aria-label={`${count} items in cart`}>
                {count}
              </span>
            )}
          </NavLink>
          <AccountMenu />
        </nav>
      </div>
    </header>
  );
}
