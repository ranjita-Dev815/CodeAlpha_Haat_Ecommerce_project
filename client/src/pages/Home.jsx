import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/Pagination.jsx';
import Notice from '../components/Notice.jsx';
import useTitle from '../utils/useTitle.js';

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

export default function Home() {
  const [params, setParams] = useSearchParams();
  const keyword = params.get('keyword') || '';
  const category = params.get('category') || 'all';
  const sort = params.get('sort') || 'newest';
  const page = Number(params.get('page')) || 1;
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const query = params.toString();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [price, setPrice] = useState({ min: minPrice, max: maxPrice });

  const title = keyword ? `Results for "${keyword}"` : category !== 'all' ? category : 'All products';
  useTitle(title);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      const isDefault = (key === 'category' && value === 'all') || (key === 'sort' && value === 'newest');
      if (value === '' || value == null || isDefault) next.delete(key);
      else next.set(key, value);
    });
    if (!('page' in changes)) next.delete('page');
    setParams(next);
  };

  useEffect(() => setPrice({ min: minPrice, max: maxPrice }), [minPrice, maxPrice]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    api
      .get('/products', { params: Object.fromEntries(params) })
      .then((res) => !ignore && setData(res.data))
      .catch((err) => !ignore && setError(errMsg(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  const applyPrice = (e) => {
    e.preventDefault();
    update({ minPrice: price.min, maxPrice: price.max });
  };

  const hasFilters = Boolean(keyword || minPrice || maxPrice || category !== 'all' || sort !== 'newest');

  return (
    <div className="shop">
      <aside className="filters" aria-label="Filters">
        <form onSubmit={applyPrice} className="price-form">
          <h2 className="filters-title">Price in rupees</h2>
          <div className="price-row">
            <label>
              Min
              <input type="number" min="0" inputMode="numeric" value={price.min}
                onChange={(e) => setPrice({ ...price, min: e.target.value })} />
            </label>
            <label>
              Max
              <input type="number" min="0" inputMode="numeric" value={price.max}
                onChange={(e) => setPrice({ ...price, max: e.target.value })} />
            </label>
          </div>
          <button type="submit" className="btn btn-ghost btn-sm">Apply price</button>
        </form>

        {hasFilters && (
          <button type="button" className="link-btn" onClick={() => setParams({})}>
            Clear all filters
          </button>
        )}
      </aside>

      <section aria-labelledby="results-title">
        <div className="results-head">
          <div>
            <h1 id="results-title">{title}</h1>
            {data && !error && (
              <p className="muted">{data.total} {data.total === 1 ? 'product' : 'products'}</p>
            )}
          </div>
          <label className="sort">
            Sort by
            <select value={sort} onChange={(e) => update({ sort: e.target.value })}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>

        {error && (
          <Notice tone="error" title="Products didn't load"
            action={<button type="button" className="btn btn-sm" onClick={() => setParams(new URLSearchParams(params))}>Try again</button>}>
            {error}
          </Notice>
        )}

        {!error && loading && !data && (
          <div className="grid" aria-busy="true" aria-label="Loading products">
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton" />)}
          </div>
        )}

        {!error && data && data.products.length === 0 && (
          <Notice title="No products match these filters"
            action={<button type="button" className="btn btn-sm" onClick={() => setParams({})}>Clear all filters</button>}>
            Try a different search word, another category, or a wider price range.
          </Notice>
        )}

        {!error && data && data.products.length > 0 && (
          <div className={`grid${loading ? ' is-refreshing' : ''}`}>
            {data.products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {data && !error && (
          <Pagination page={data.page} pages={data.pages} onChange={(n) => update({ page: String(n) })} />
        )}
      </section>
    </div>
  );
}
