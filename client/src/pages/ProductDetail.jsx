import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { stockLabel } from '../components/ProductCard.jsx';
import ImageGallery from '../components/ImageGallery.jsx';
import ReviewsSection from '../components/ReviewsSection.jsx';
import RelatedProducts from '../components/RelatedProducts.jsx';
import StarRating from '../components/StarRating.jsx';
import Notice from '../components/Notice.jsx';
import useTitle from '../utils/useTitle.js';
import { formatPrice } from '../utils/format.js';
import { useWishlist } from '../context/WishlistContext.jsx';


export default function ProductDetail() {
  const { id } = useParams();
  const { items, addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();   
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useTitle(product?.name);

  useEffect(() => {
    let ignore = false;
    setProduct(null);
    setError('');
    setNotFound(false);
    setQty(1);
    setJustAdded(false);
    api
      .get(`/products/${id}`)
      .then((res) => !ignore && setProduct(res.data))
      .catch((err) => {
        if (ignore) return;
        // Invalid or unknown ids both come back as 400/404
        if ([400, 404].includes(err.response?.status)) setNotFound(true);
        else setError(errMsg(err));
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  if (notFound) {
    return (
      <Notice title="This product doesn't exist"
        action={<Link className="btn btn-sm" to="/">Browse products</Link>}>
        It may have been removed, or the link is wrong.
      </Notice>
    );
  }
  if (error) return <Notice tone="error" title="Product didn't load">{error}</Notice>;
  if (!product) return <div className="skeleton skeleton-detail" aria-busy="true" aria-label="Loading product" />;

  const stock = stockLabel(product.stock);
  const inCart = items.find((i) => i._id === product._id)?.qty || 0;
  const room = Math.max(0, product.stock - inCart);

  const add = () => {
    addItem(product, qty);
    setJustAdded(true);
    setQty(1);
  };

  return (
    <>
      <div className="detail">
        <ImageGallery
          key={product._id}
          image={product.image}
          images={product.images}
          alt={product.name}
        />

        <div className="detail-info">
          <p className="muted"><Link to={`/?category=${encodeURIComponent(product.category)}`}>{product.category}</Link></p>
          <h1>{product.name}</h1>
          <button
  type="button"
  className="wishlist-btn"
  onClick={() => toggle(product._id)}
  aria-label={isWishlisted(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted(product._id) ? '#e63946' : 'none'} stroke="#e63946" strokeWidth="2">
    <path d="M12 21s-6.5-4.35-9.33-8.34C.5 9.5 1.5 5.5 5 4.5c2-.5 4 .5 7 3.5 3-3 5-4 7-3.5 3.5 1 4.5 5 2.33 8.16C18.5 16.65 12 21 12 21z" />
  </svg>
</button>
          {product.brand && <p className="muted">by {product.brand}</p>}

          {product.numReviews > 0 && (
            <p className="detail-rating">
              <a href="#reviews">
                <StarRating value={product.rating} count={product.numReviews} size={16} />
              </a>
            </p>
          )}

          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className={`stock stock-${stock.tone}`}>{stock.text}</p>
          <p className="detail-desc">{product.description}</p>

          {product.stock > 0 && (
            <div className="detail-buy">
              <div className="stepper" role="group" aria-label="Quantity">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">-</button>
                <span aria-live="polite">{room > 0 ? qty : 0}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(room, q + 1))} disabled={qty >= room} aria-label="Increase quantity">+</button>
              </div>
              <button type="button" className="btn btn-accent" onClick={add} disabled={room < 1}>
                {room < 1 ? 'All available units are in your cart' : 'Add to cart'}
              </button>
            </div>
          )}

          {justAdded && (
            <p className="added-note" role="status">
              Added to your cart. <Link to="/cart">Go to cart</Link>
            </p>
          )}
        </div>
      </div>

      <div id="reviews">
        <ReviewsSection
          product={{ ...product, reviews: product.reviews ?? [] }}
          onReviewed={setProduct}
        />
      </div>

      <RelatedProducts productId={product._id} />
    </>
  );
}
