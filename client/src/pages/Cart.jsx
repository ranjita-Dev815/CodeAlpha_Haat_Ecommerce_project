import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Notice from '../components/Notice.jsx';
import useTitle from '../utils/useTitle.js';
import { FREE_SHIPPING_ABOVE, calcPrices, formatPrice } from '../utils/format.js';

export default function Cart() {
  useTitle('Your cart');
  const { items, setQty, removeItem, itemsPrice, count } = useCart();
  const navigate = useNavigate();
  const totals = calcPrices(itemsPrice);

  if (items.length === 0) {
    return (
      <Notice title="Your cart is empty"
        action={<Link to="/" className="btn btn-sm">Browse products</Link>}>
        Add something you like and it will show up here.
      </Notice>
    );
  }

  const toFreeShipping = FREE_SHIPPING_ABOVE - totals.items;

  return (
    <div className="cart">
      <section aria-labelledby="cart-title">
        <h1 id="cart-title">Your cart</h1>
        <p className="muted">{count} {count === 1 ? 'item' : 'items'}</p>

        <ul className="cart-list">
          {items.map((i) => (
            <li key={i._id} className="cart-row">
              <Link to={`/product/${i._id}`} className="cart-img" aria-hidden="true" tabIndex={-1}>
                <img src={i.image} alt="" width="96" height="96" />
              </Link>
              <div className="cart-main">
                <Link to={`/product/${i._id}`} className="cart-name">{i.name}</Link>
                <p className="muted">{formatPrice(i.price)} each</p>
                <button type="button" className="link-btn" onClick={() => removeItem(i._id)}>Remove</button>
              </div>
              <div className="stepper" role="group" aria-label={`Quantity for ${i.name}`}>
                <button type="button" onClick={() => setQty(i._id, i.qty - 1)} disabled={i.qty <= 1} aria-label="Decrease quantity">-</button>
                <span>{i.qty}</span>
                <button type="button" onClick={() => setQty(i._id, i.qty + 1)} disabled={i.qty >= i.stock} aria-label="Increase quantity">+</button>
              </div>
              <p className="cart-line">{formatPrice(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>
      </section>

      <aside className="summary" aria-label="Order summary">
        <h2>Order summary</h2>
        <dl className="totals">
          <div><dt>Items</dt><dd>{formatPrice(totals.items)}</dd></div>
          <div><dt>Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd></div>
          <div><dt>GST (18%)</dt><dd>{formatPrice(totals.tax)}</dd></div>
          <div className="totals-final"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
        </dl>
        {toFreeShipping > 0 && (
          <p className="muted small">Add {formatPrice(toFreeShipping + 1)} more to get free shipping.</p>
        )}
        <button type="button" className="btn btn-accent btn-block" onClick={() => navigate('/checkout')}>
          Go to checkout
        </button>
      </aside>
    </div>
  );
}
