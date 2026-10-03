import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api/client.js';
import Notice from '../../components/Notice.jsx';
import useTitle from '../../utils/useTitle.js';
import { formatPrice } from '../../utils/format.js';

export default function Products() {
  useTitle('Manage products');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const load = () => {
    api.get('/products', { params: { limit: 50 } })
      .then((res) => setData(res.data))
      .catch((err) => setError(errMsg(err)));
  };

  useEffect(load, []);

  const remove = async (id) => {
    setDeleting(id);
    setError('');
    try {
      await api.delete(`/products/${id}`);
      setData((d) => ({ ...d, products: d.products.filter((p) => p._id !== id) }));
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  if (error && !data) return <Notice tone="error" title="Products didn't load">{error}</Notice>;
  if (!data) return <div className="skeleton skeleton-list" aria-busy="true" aria-label="Loading products" />;

  return (
    <div>
      <div className="admin-head">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="btn btn-accent btn-sm">Add product</Link>
      </div>
      {error && <Notice tone="error" title="Something went wrong">{error}</Notice>}

      {data.products.length === 0 ? (
        <Notice title="No products yet"
          action={<Link to="/admin/products/new" className="btn btn-sm">Add your first product</Link>} />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image} alt="" width="40" height="40" className="admin-thumb" /></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.stock === 0 ? <span className="stock stock-out">0</span> : p.stock}</td>
                  <td className="admin-actions">
                    <Link to={`/admin/products/${p._id}/edit`} className="link-btn">Edit</Link>
                    {confirmId === p._id ? (
                      <>
                        <button type="button" className="link-btn danger" onClick={() => remove(p._id)} disabled={deleting === p._id}>
                          {deleting === p._id ? 'Deleting...' : 'Confirm delete'}
                        </button>
                        <button type="button" className="link-btn" onClick={() => setConfirmId(null)}>Cancel</button>
                      </>
                    ) : (
                      <button type="button" className="link-btn danger" onClick={() => setConfirmId(p._id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
