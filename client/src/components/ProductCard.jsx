import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import StarRating from './StarRating.jsx';
import { formatPrice } from '../utils/format.js';

export function stockLabel(stock) {
  if (stock < 1) return { text: 'Sold out', tone: 'out' };
  if (stock <= 5) return { text: `Only ${stock} left`, tone: 'low' };
  return { text: 'In stock', tone: 'in' };
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const stock = stockLabel(product.stock);
  const soldOut = product.stock < 1;
  const wishlisted = user ? isWishlisted(product._id) : false;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(t);
  }, [added]);

  const add = () => {
    addItem(product, 1);
    setAdded(true);
  };

  const wish = (e) => {
    e.preventDefault(); // don't follow the card link
    if (!user) return; // logged-out visitors don't see the heart at all (see below)
    toggle(product._id);
  };

  return (
    <article className={`tile${soldOut ? ' is-sold-out' : ''}`}>
      <Link to={`/product/${product._id}`} className="tile-media" tabIndex={-1} aria-hidden="true">
        <img src={product.image} alt="" loading="lazy" width="600" height="600" />
        <span className="sticker">{formatPrice(product.price)}</span>
      </Link>

      {user && (
        <button
          type="button"
          className={`wish-btn${wishlisted ? ' is-active' : ''}`}
          onClick={wish}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      )}

      <h3 className="tile-name">
        <Link to={`/product/${product._id}`}>{product.name}</Link>
      </h3>
      <p className="tile-brand">{product.brand}</p>

      {product.numReviews > 0 && (
        <StarRating value={product.rating} count={product.numReviews} size={13} />
      )}

      <p className={`stock stock-${stock.tone}`}>{stock.text}</p>
      <button type="button" className="btn btn-block" onClick={add} disabled={soldOut}>
        {soldOut ? 'Sold out' : added ? 'Added to cart' : 'Add to cart'}
      </button>
    </article>
  );
}
