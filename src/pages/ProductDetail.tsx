import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../components/ProductCard';
import api from '../services/api';

const DUMMY_PRODUCT: Product = {
  id: '1', 
  name: 'Pro Running Shoes', 
  price: 120.00, 
  description: 'High performance running shoes built for speed and endurance on any terrain. Features breathable mesh and carbon fiber plates.', 
  imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.warn('API error, using dummy data for product detail:', error);
        setProduct({ ...DUMMY_PRODUCT, id: id || '1' });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!user) {
      alert("Please login to add to cart");
      navigate('/login');
      return;
    }
    // MOCK Cart addition logic. We would ideally have a CartContext or API call.
    alert(`Added ${product?.name} to cart!`);
  };

  if (loading) return <div className="page-wrapper container" style={{ textAlign: 'center' }}><h2>Loading...</h2></div>;
  if (!product) return <div className="page-wrapper container" style={{ textAlign: 'center' }}><h2>Product not found</h2></div>;

  return (
    <div className="page-wrapper container">
      <div className="glass" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', padding: '2rem', borderRadius: '1rem' }}>
        <div style={{ flex: '1 1 400px', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>{product.name}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{product.description}</p>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>${product.price.toFixed(2)}</div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }} onClick={addToCart}>
              Add to Cart
            </button>
            {user?.role === 'Admin' && (
              <button className="btn-primary" style={{ background: 'var(--bg-card)' }} onClick={() => navigate('/admin/products')}>
                Edit Content
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
