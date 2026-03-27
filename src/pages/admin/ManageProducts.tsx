import { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import type { Product } from '../../types';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Pro Running Shoes', price: 120.00, description: 'High performance running shoes.', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', stock: 15 },
  { id: '2', name: 'Yoga Mat', price: 30.00, description: 'Premium non-slip yoga mat.', imageUrl: 'https://images.unsplash.com/photo-1601134767222-1d70e41753c1?w=200', stock: 30 },
  { id: '3', name: 'Dumbbell Set', price: 85.00, description: 'Adjustable dumbbell set for home gym.', imageUrl: 'https://images.unsplash.com/photo-1638204090176-b33df64ccb61?w=200', stock: 8 },
  { id: '4', name: 'Protein Powder', price: 45.00, description: 'Whey protein isolate, chocolate flavor.', imageUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=200', stock: 50 },
];

const emptyForm = (): Omit<Product, 'id'> => ({ name: '', description: '', price: 0, imageUrl: '', stock: 0 });

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch {
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditTarget(p);
    setForm({ name: p.name, description: p.description, price: p.price, imageUrl: p.imageUrl, stock: p.stock ?? 0 });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
    } catch { /* mock */ }
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        const updated = await productService.update(editTarget.id, form);
        setProducts(products.map(p => p.id === editTarget.id ? updated : p));
      } else {
        const created = await productService.create(form);
        setProducts([...products, created]);
      }
    } catch {
      // mock fallback
      if (editTarget) {
        setProducts(products.map(p => p.id === editTarget.id ? { ...editTarget, ...form } : p));
      } else {
        setProducts([...products, { id: 'mock_' + Date.now(), ...form }]);
      }
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  return (
    <div className="page-wrapper container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#f59e0b' }}>Manage Products</h1>
        <button className="btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}><div className="spinner" /></div>
      ) : (
        <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '1rem' }}>Image</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Stock</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '1rem' }}>
                    <img src={p.imageUrl || 'https://via.placeholder.com/60'} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.4rem' }} />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 600 }}>฿{p.price.toFixed(2)}</td>
                  <td style={{ padding: '1rem', color: (p.stock ?? 0) > 0 ? 'var(--success)' : 'var(--danger)' }}>{p.stock ?? '—'}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        style={{ background: 'transparent', color: '#60a5fa', border: '1px solid #60a5fa', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer' }}
                        onClick={() => openEdit(p)}
                      >Edit</button>
                      <button className="btn-danger" style={{ padding: '0.4rem 0.8rem', borderRadius: '0.4rem' }} onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '540px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editTarget ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Product Name</label>
                <input name="name" className="input-field" value={form.name} onChange={handleChange} required placeholder="e.g. Pro Running Shoes" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Description</label>
                <textarea name="description" className="input-field" value={form.description} onChange={handleChange} required placeholder="Product description..." rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Price (฿)</label>
                  <input name="price" type="number" className="input-field" value={form.price} onChange={handleChange} required min={0} step="0.01" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Stock</label>
                  <input name="stock" type="number" className="input-field" value={form.stock} onChange={handleChange} min={0} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Image URL</label>
                <input name="imageUrl" className="input-field" value={form.imageUrl} onChange={handleChange} placeholder="https://... (Unsplash or direct URL)" />
              </div>
              {form.imageUrl && (
                <div style={{ textAlign: 'center' }}>
                  <img src={form.imageUrl} alt="preview" style={{ maxHeight: '120px', borderRadius: '0.5rem', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>{saving ? 'Saving...' : (editTarget ? 'Save Changes' : 'Add Product')}</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-main)', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
