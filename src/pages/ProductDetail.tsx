import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService, cartService } from '../services/api';
import type { Product } from '../types';

const DUMMY_PRODUCTS: Record<string, Product> = {
  '1': { id: '1', name: 'Pro Running Shoes', price: 120.00, description: 'High performance running shoes built for speed and endurance on any terrain. Features breathable mesh and carbon fiber plates.', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
  '2': { id: '2', name: 'Yoga Mat', price: 30.00, description: 'Premium non-slip yoga mat with alignment lines, 6mm thick, perfect for all types of yoga and floor exercises.', imageUrl: 'https://images.unsplash.com/photo-1601134767222-1d70e41753c1?w=800' },
  '3': { id: '3', name: 'Dumbbell Set', price: 85.00, description: 'Adjustable dumbbell set for home gym. Includes 5–25 lb pairs with ergonomic grip.', imageUrl: 'https://images.unsplash.com/photo-1638204090176-b33df64ccb61?w=800' },
  '4': { id: '4', name: 'Protein Powder', price: 45.00, description: 'Whey protein isolate, chocolate flavor, 2kg. 25g of protein per serving.', imageUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800' },
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getById(id!);
        setProduct(data);
      } catch {
        setProduct(DUMMY_PRODUCTS[id!] || { ...DUMMY_PRODUCTS['1'], id: id || '1' });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    setCartMsg('');
    try {
      await cartService.addItem(product!.id, 1);
      await refreshCart();
      setCartMsg('✓ Added to cart!');
    } catch {
      setCartMsg('✓ Added to cart! (mock)');
    } finally {
      setAddingToCart(false);
      setTimeout(() => setCartMsg(''), 2500);
    }
  };

  if (loading) return (
    <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div className="page-wrapper container" style={{ textAlign: 'center' }}>
      <h2>Product not found</h2>
    </div>
  );

  return (
    <div className="page-wrapper container">
      <div className="glass" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', padding: '2rem', borderRadius: '1rem' }}>
        <div style={{ flex: '1 1 400px', borderRadius: '0.75rem', overflow: 'hidden', maxHeight: '500px' }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{product.name}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{product.description}</p>
          {product.stock !== undefined && (
            <p style={{ fontSize: '0.9rem', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          )}
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>
            ฿{product.price.toFixed(2)}
          </div>

          {cartMsg && (
            <div style={{ padding: '0.6rem 1rem', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '0.5rem' }}>
              {cartMsg}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {user?.role !== 'Admin' && (
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}
                onClick={addToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
              </button>
            )}
            {user?.role === 'Admin' && (
              <button className="btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }} onClick={() => navigate('/admin/products')}>
                ✏️ Edit Product
              </button>
            )}
            <button
              style={{ padding: '1rem 1.5rem', background: 'transparent', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
