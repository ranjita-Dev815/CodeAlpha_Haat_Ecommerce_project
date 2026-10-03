import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api/client.js';
import Notice from '../../components/Notice.jsx';
import useTitle from '../../utils/useTitle.js';
import { formatDate, formatPrice, shortId } from '../../utils/format.js';

const STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];
const LABEL = { processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };

export default function Orders() {
  useTitle('Manage orders');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  const load = () => {
    api.get('/orders').then((res) => setData(res.data)).catch((err) => setError(errMsg(err)));
  };

  useEffect(load, []);

  const changeStatus = async (order, status) => {
    if (status === order.status) return;
    setUpdating(order._id);
    setError('');
    try {
      const { data: updated } = await api.put(`/orders/${order._id}/status`, { status });
      setData((d) => ({ ...d, orders: d.orders.map((o) => (o._id === updated._id ? updated : o)) }));
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setUpdating(null);
    }
  };

  if (error && !data) return <Notice tone="error" title="Orders didn't load">{error}</Notice>;
  if (!data) return <div className="skeleton skeleton-list" aria-busy="true" aria-label="Loading orders" />;

  return (
    <div>
      <h1>Orders</h1>
      {error && <Notice tone="error" title="Something went wrong">{error}</Notice>}

      {data.orders.length === 0 ? (
        <Notice title="No orders yet">Orders placed by customers will show up here.</Notice>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((o) => {
                const locked = ['delivered', 'cancelled'].includes(o.status);
                return (
                  <tr key={o._id}>
                    <td><Link to={`/orders/${o._id}`}>{shortId(o._id)}</Link></td>
                    <td>{o.user?.name || 'Deleted user'}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{formatPrice(o.totalPrice)}</td>
                    <td>
                      <select
                        value={o.status}
                        disabled={locked || updating === o._id}
                        onChange={(e) => changeStatus(o, e.target.value)}
                        className={`status-select status-${o.status}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
