import { useEffect, useState } from 'react';
import api from '../api/client.js';
import ProductCard from './ProductCard.jsx';

// Usage: <RelatedProducts productId={product._id} />
export default function RelatedProducts({ productId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let alive = true;
    api
      .get(`/products/${productId}/related`)
      .then((res) => {
        if (alive) setProducts(res.data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [productId]);

  if (products.length === 0) return null;

  return (
    <section className="related">
      <h2>You may also like</h2>
      <div className="tile-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
