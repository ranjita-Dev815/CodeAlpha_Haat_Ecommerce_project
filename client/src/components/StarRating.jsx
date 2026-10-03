export default function StarRating({ value = 0, count, size = 14 }) {
  const rounded = Math.round(value * 2) / 2; // nearest half-star

  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" className={rounded >= n - 0.5 ? 'star-full' : 'star-empty'}>
          {rounded >= n - 0.5 ? '★' : '☆'}
        </span>
      ))}
      {typeof count === 'number' && <span className="stars-count muted small"> ({count})</span>}
    </span>
  );
}
