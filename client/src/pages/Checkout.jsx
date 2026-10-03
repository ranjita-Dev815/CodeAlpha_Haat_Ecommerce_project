import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import Notice from '../components/Notice.jsx';
import useTitle from '../utils/useTitle.js';
import { calcPrices, formatPrice } from '../utils/format.js';

const EMPTY = { fullName: '', phone: '', address: '', city: '', state: '', postalCode: '' };

export default function Checkout() {
  useTitle('Checkout');
  const { items, itemsPrice, clear } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(EMPTY);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (items.length === 0) {
    return (
      <Notice title="Your cart is empty">
        Add something to your cart before checking out.
      </Notice>
    );
  }

  const totals = calcPrices(itemsPrice);
  const setField = (field) => (e) => setAddress({ ...address, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      // Server recalculates prices from its own product data; qty/product ids are all it trusts here
      const { data } = await api.post('/orders', {
        orderItems: items.map((i) => ({ product: i._id, qty: i.qty })),
        shippingAddress: address,
        paymentMethod,
      });
      clear();
      navigate(`/orders/${data._id}`, { replace: true, state: { justPlaced: true } });
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <div className="checkout">
      <form onSubmit={submit} className="form checkout-form">
        <h1>Checkout</h1>
        {error && <Notice tone="error" title="Couldn't place your order">{error}</Notice>}

        <fieldset>
          <legend>Shipping address</legend>
          <label>
            Full name
            <input required autoComplete="name" value={address.fullName} onChange={setField('fullName')} />
          </label>
          <label>
            Phone number
            <input required type="tel" autoComplete="tel" value={address.phone} onChange={setField('phone')} />
          </label>
          <label>
            Address
            <input required autoComplete="street-address" value={address.address} onChange={setField('address')} />
          </label>
          <div className="form-row">
            <label>
              City
              <input required autoComplete="address-level2" value={address.city} onChange={setField('city')} />
            </label>
            <label>
              State
              <input required autoComplete="address-level1" value={address.state} onChange={setField('state')} />
            </label>
            <label>
              PIN code
              <input required autoComplete="postal-code" value={address.postalCode} onChange={setField('postalCode')} />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Payment method</legend>
          <label className="radio">
            <input type="radio" name="pay" value="cod" checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')} />
            Cash on delivery
          </label>
          <label className="radio">
            <input type="radio" name="pay" value="razorpay" checked={paymentMethod === 'razorpay'}
              onChange={() => setPaymentMethod('razorpay')} />
            Pay online (Razorpay) - coming in Phase 3
          </label>
        </fieldset>

        <button type="submit" className="btn btn-accent btn-block" disabled={busy}>
          {busy ? 'Placing order...' : `Place order - ${formatPrice(totals.total)}`}
        </button>
      </form>

      <aside className="summary" aria-label="Order summary">
        <h2>Order summary</h2>
        <ul className="summary-list">
          {items.map((i) => (
            <li key={i._id}>
              <span>{i.name} &times; {i.qty}</span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="totals">
          <div><dt>Items</dt><dd>{formatPrice(totals.items)}</dd></div>
          <div><dt>Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd></div>
          <div><dt>GST (18%)</dt><dd>{formatPrice(totals.tax)}</dd></div>
          <div className="totals-final"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
