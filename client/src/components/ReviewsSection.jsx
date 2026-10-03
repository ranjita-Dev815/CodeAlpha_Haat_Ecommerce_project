import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api, { errMsg } from '../api/client.js';
import Notice from './Notice.jsx';
import StarRating from './StarRating.jsx';
import { formatDate } from '../utils/format.js';

// Usage: <ReviewsSection product={product} onReviewed={(updatedProduct) => setProduct(updatedProduct)} />
export default function ReviewsSection({ product, onReviewed }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const alreadyReviewed =
    user && product.reviews.some((r) => String(r.user) === String(user._id));

  const submit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      setError('Please choose a rating and write a comment.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/products/${product._id}/reviews`, { rating, comment });
      setRating(0);
      setComment('');
      onReviewed?.(data); // backend returns the updated product with the new review + rating
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="reviews">
      <h2>
        Reviews{' '}
        {product.numReviews > 0 && (
          <StarRating value={product.rating} count={product.numReviews} />
        )}
      </h2>

      {product.reviews.length === 0 && <p className="muted">No reviews yet.</p>}

      <ul className="reviews-list">
        {product.reviews.map((r) => (
          <li key={r._id} className="review-row">
            <div className="review-head">
              <strong>{r.name}</strong>
              <StarRating value={r.rating} size={12} />
              <span className="muted small">{formatDate(r.createdAt)}</span>
            </div>
            <p>{r.comment}</p>
          </li>
        ))}
      </ul>

      {!user && <p className="muted">Log in to write a review.</p>}

      {user && !alreadyReviewed && (
        <form onSubmit={submit} className="review-form">
          {error && <Notice tone="error" title="Couldn't submit review">{error}</Notice>}

          <label>
            Rating
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={0}>Select…</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>

          <label>
            Comment
            <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      )}

      {user && alreadyReviewed && <p className="muted">You've already reviewed this product.</p>}
    </section>
  );
}
