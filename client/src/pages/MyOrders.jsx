import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api/client.js';
import Notice from '../components/Notice.jsx';
import useTitle from '../utils/useTitle.js';
import { formatDate, formatPrice, shortId } from '../utils/format.js';

const STATUS_LABEL = {
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function MyOrders() {
  useTitle('Your orders');
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data)).catch((err) => setError(errMsg(err)));
  }, []);

  if (error) return <Notice tone="error" title="Orders didn't load">{error}</Notice>;
  if (!orders) return <div className="skeleton skeleton-list" aria-busy="true" aria-label="Loading orders" />;

  if (orders.length === 0) {
    return (
      <Notice title="You haven't placed any orders yet"
        action={<Link to="/" className="btn btn-sm">Start shopping</Link>}>
        Orders you place will show up here.
      </Notice>
    );
  }

  return (
    <div>
      <h1>Your orders</h1>
      <ul className="order-list">
        {orders.map((o) => (
          <li key={o._id}>
            <Link to={`/orders/${o._id}`} className="order-row">
              <div>
                <p className="order-id">{shortId(o._id)}</p>
                <p className="muted">Placed {formatDate(o.createdAt)} &middot; {o.orderItems.length} item{o.orderItems.length > 1 ? 's' : ''}</p>
              </div>
              <span className={`status status-${o.status}`}>{STATUS_LABEL[o.status]}</span>
              <p className="order-total">{formatPrice(o.totalPrice)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
