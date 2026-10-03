import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
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
const STEPS = ['processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useTitle(order ? `Order ${shortId(order._id)}` : 'Order');

  useEffect(() => {
    setOrder(null);
    setError('');
    setNotFound(false);
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => {
        if ([400, 404].includes(err.response?.status)) setNotFound(true);
        else setError(errMsg(err));
      });
  }, [id]);

  if (notFound) {
    return (
      <Notice title="We can't find that order"
        action={<Link to="/orders" className="btn btn-sm">Back to orders</Link>}>
        It may belong to a different account, or the link is wrong.
      </Notice>
    );
  }
  if (error) return <Notice tone="error" title="Order didn't load">{error}</Notice>;
  if (!order) return <div className="skeleton skeleton-detail" aria-busy="true" aria-label="Loading order" />;

  const stepIndex = STEPS.indexOf(order.status);

  return (
    <div className="order-detail">
      {location.state?.justPlaced && (
        <Notice tone="success" title="Order placed">
          We've got it. Pay on delivery when it arrives.
        </Notice>
      )}

      <div className="order-detail-head">
        <div>
          <h1>Order {shortId(order._id)}</h1>
          <p className="muted">Placed {formatDate(order.createdAt)}</p>
        </div>
        <span className={`status status-${order.status}`}>{STATUS_LABEL[order.status]}</span>
      </div>

      {order.status !== 'cancelled' && (
        <ol className="tracker">
          {STEPS.map((s, i) => (
            <li key={s} className={i <= stepIndex ? 'is-done' : ''}>{STATUS_LABEL[s]}</li>
          ))}
        </ol>
      )}

      <div className="order-detail-body">
        <section>
          <h2>Items</h2>
          <ul className="cart-list">
            {order.orderItems.map((i) => (
              <li key={i.product} className="cart-row cart-row-static">
                <img src={i.image} alt="" width="72" height="72" />
                <div className="cart-main">
                  <span className="cart-name">{i.name}</span>
                  <p className="muted">{formatPrice(i.price)} &times; {i.qty}</p>
                </div>
                <p className="cart-line">{formatPrice(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>

          <h2>Shipping address</h2>
          <p>
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.address}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.phone}
          </p>
        </section>

        <aside className="summary" aria-label="Order total">
          <h2>Total</h2>
          <dl className="totals">
            <div><dt>Items</dt><dd>{formatPrice(order.itemsPrice)}</dd></div>
            <div><dt>Shipping</dt><dd>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</dd></div>
            <div><dt>GST</dt><dd>{formatPrice(order.taxPrice)}</dd></div>
            <div className="totals-final"><dt>Total</dt><dd>{formatPrice(order.totalPrice)}</dd></div>
          </dl>
          <p className="muted small">
            {order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Paid online'}
            {order.isPaid ? ' · Paid' : ' · Payment pending'}
          </p>
        </aside>
      </div>
    </div>
  );
}
