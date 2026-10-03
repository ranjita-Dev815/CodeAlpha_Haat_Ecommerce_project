import { Link, useSearchParams } from 'react-router-dom';

const CATEGORIES = [
  'Electronics',
  'Mobiles',
  'Fashion',
  'Beauty',
  'Home',
  'Appliances',
  'Books',
  'Sports',
  'Furniture',
  'Toys',
];

const ICONS = {
  electronics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" strokeLinecap="round" />
    </svg>
  ),
  mobiles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 19h2" strokeLinecap="round" />
    </svg>
  ),
  fashion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 4l3 2 3-2 4 3-2 3-2-1v11H8V9L6 10 4 7l5-3z" strokeLinejoin="round" />
    </svg>
  ),
  beauty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3c2 2 3 4 3 6a3 3 0 11-6 0c0-2 1-4 3-6z" />
      <path d="M7 21c0-3 2-5 5-5s5 2 5 5" strokeLinecap="round" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9z" strokeLinejoin="round" />
    </svg>
  ),
  appliances: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="5" y="2.5" width="14" height="19" rx="1.5" />
      <circle cx="12" cy="9" r="3" />
      <path d="M8 17.5h8" strokeLinecap="round" />
    </svg>
  ),
  books: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 5.5A2 2 0 016 4h14v15H6a2 2 0 00-2 2V5.5z" strokeLinejoin="round" />
      <path d="M20 19a2 2 0 01-2 2H6" />
    </svg>
  ),
  sports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18" />
    </svg>
  ),
  furniture: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 9V6a2 2 0 012-2h10a2 2 0 012 2v3" />
      <rect x="3.5" y="9" width="17" height="6" rx="1" />
      <path d="M5 15v4M19 15v4" strokeLinecap="round" />
    </svg>
  ),
  toys: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="9" r="4" />
      <circle cx="16" cy="9" r="4" />
      <path d="M6 13c0 4 2 7 6 7s6-3 6-7" strokeLinecap="round" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 12l-8-8H5a1 1 0 00-1 1v7l8 8a1 1 0 001.4 0l6.6-6.6a1 1 0 000-1.4z" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const iconFor = (category) => ICONS[category.toLowerCase()] || ICONS.default;

export default function CategoryNav() {
  const [params] = useSearchParams();
  const activeCategory = params.get('category') || '';

  return (
    <nav className="category-nav" aria-label="Shop by category">
      <div className="container category-nav-inner">
        <Link
          to="/"
          className={`category-item${activeCategory === '' ? ' is-active' : ''}`}
        >
          <span className="category-icon">{ICONS.default}</span>
          <span className="category-label">All</span>
        </Link>

        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            to={`/?category=${encodeURIComponent(cat)}`}
            className={`category-item${activeCategory === cat ? ' is-active' : ''}`}
          >
            <span className="category-icon">{iconFor(cat)}</span>
            <span className="category-label">{cat}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}