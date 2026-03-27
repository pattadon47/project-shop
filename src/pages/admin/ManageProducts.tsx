import { useState } from 'react';
import type { Product } from '../../components/ProductCard';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Pro Running Shoes', price: 120.00, description: 'High performance...', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
  { id: '2', name: 'Yoga Mat', price: 30.00, description: 'Premium non-slip...', imageUrl: 'https://images.unsplash.com/photo-1601134767222-1d70e41753c1' }
];

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);


  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="page-wrapper container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#f59e0b' }}>Manage Products</h1>
        <button className="btn-primary" onClick={() => alert('Mock Add New Product form will pop up here')}>+ Add Product</button>
      </div>

      <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-glass)' }}>
              <th style={{ padding: '1rem' }}>Image</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '1rem' }}>
                  <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                </td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{product.name}</td>
                <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    style={{ background: 'transparent', color: '#60a5fa', border: '1px solid #60a5fa', padding: '0.4rem 0.8rem', borderRadius: '0.25rem' }}
                    onClick={() => alert(`Edit Product Form for [${product.name}]`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-danger" 
                    style={{ padding: '0.4rem 0.8rem', borderRadius: '0.25rem' }}
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
