import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api/client.js';
import Notice from '../../components/Notice.jsx';
import useTitle from '../../utils/useTitle.js';
import { formatPrice } from '../../utils/format.js';

export default function Dashboard() {
  useTitle('Admin dashboard');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    Promise.all([
      api.get('/products', { params: { limit: 1 } }),
      api.get('/orders', { params: { limit: 1 } }),
    ])
      .then(([productsRes, ordersRes]) => {
        if (ignore) return;
        // Pull every order page to total up revenue; fine at this scale (seed data + demo orders)
        return api.get('/orders').then((res) => {
          if (ignore) return;
          const orders = res.data.orders || [];
          const revenue = orders.reduce((sum, o) => sum + (o.isPaid || o.paymentMethod === 'cod' ? o.totalPrice : 0), 0);
          const processing = orders.filter((o) => o.status === 'processing').length;
          setStats({
            products: productsRes.data.total,
            orders: ordersRes.data.total,
            revenue,
            processing,
          });
        });
      })
      .catch((err) => !ignore && setError(errMsg(err)));
    return () => {
      ignore = true;
    };
  }, []);

  if (error) return <Notice tone="error" title="Dashboard didn't load">{error}</Notice>;
  if (!stats) return <div className="skeleton skeleton-list" aria-busy="true" aria-label="Loading dashboard" />;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Products</p>
          <p className="stat-value">{stats.products}</p>
          <Link to="/admin/products" className="link-btn">Manage</Link>
        </div>
        <div className="stat-card">
          <p className="stat-label">Orders</p>
          <p className="stat-value">{stats.orders}</p>
          <Link to="/admin/orders" className="link-btn">Manage</Link>
        </div>
        <div className="stat-card">
          <p className="stat-label">Awaiting processing</p>
          <p className="stat-value">{stats.processing}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Revenue (paid + COD)</p>
          <p className="stat-value">{formatPrice(stats.revenue)}</p>
        </div>
      </div>
    </div>
  );
}
