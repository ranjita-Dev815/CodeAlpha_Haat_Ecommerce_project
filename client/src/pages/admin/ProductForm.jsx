import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../../api/client.js';
import Notice from '../../components/Notice.jsx';
import useTitle from '../../utils/useTitle.js';

const EMPTY = { name: '', description: '', price: '', category: '', brand: '', image: '', stock: '' };

export default function ProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  useTitle(editing ? 'Edit product' : 'Add product');

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(editing);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api
      .get(`/products/${id}`)
      .then((res) => {
        const p = res.data;
        setForm({
          name: p.name, description: p.description, price: p.price,
          category: p.category, brand: p.brand || '', image: p.image || '', stock: p.stock,
        });
      })
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editing) await api.put(`/products/${id}`, payload);
      else await api.post('/products', payload);
      navigate('/admin/products');
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  if (loading) return <div className="skeleton skeleton-list" aria-busy="true" aria-label="Loading product" />;

  return (
    <div>
      <h1>{editing ? 'Edit product' : 'Add product'}</h1>
      {error && <Notice tone="error" title="Couldn't save the product">{error}</Notice>}
      <form onSubmit={submit} className="form admin-form">
        <label>
          Name
          <input required maxLength={120} value={form.name} onChange={setField('name')} />
        </label>
        <label>
          Description
          <textarea required rows={4} value={form.description} onChange={setField('description')} />
        </label>
        <div className="form-row">
          <label>
            Price (INR)
            <input required type="number" min="0" step="0.01" value={form.price} onChange={setField('price')} />
          </label>
          <label>
            Stock
            <input required type="number" min="0" step="1" value={form.stock} onChange={setField('stock')} />
          </label>
        </div>
        <div className="form-row">
          <label>
            Category
            <input required value={form.category} onChange={setField('category')} />
          </label>
          <label>
            Brand
            <input value={form.brand} onChange={setField('brand')} />
          </label>
        </div>
        <label>
          Image URL
          <input value={form.image} onChange={setField('image')} placeholder="https://..." />
        </label>
        {form.image && (
          <img src={form.image} alt="Preview" className="admin-preview" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        )}
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-accent" disabled={busy}>
            {busy ? 'Saving...' : editing ? 'Save changes' : 'Add product'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
