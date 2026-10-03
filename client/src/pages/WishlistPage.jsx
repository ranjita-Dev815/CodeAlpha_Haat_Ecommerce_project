import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import useTitle from '../utils/useTitle.js';
import Notice from '../components/Notice.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function WishlistPage() {
  const { items, loading } = useWishlist();
  useTitle('My Wishlist');

  if (loading) {
    return (
      <div className="skeleton skeleton-detail" aria-busy="true" aria-label="Loading wishlist" />
    );
  }

  if (items.length === 0) {
    return (
      <Notice
        title="Your wishlist is empty"
        action={<Link to="/" className="btn btn-sm">Browse products</Link>}
      >
        Tap the heart on any product to save it here.
      </Notice>
    );
  }

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>
      <div className="tile-grid">
        {items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
