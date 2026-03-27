import { useState, useEffect } from 'react';
import ProductCard, { type Product } from '../components/ProductCard';
import api from '../services/api';

// dummy products fallback for demonstration if API fails
const DUMMY_PRODUCTS: Product[] = [
  { id: '1', name: 'Pro Running Shoes', price: 120.00, description: 'High performance running shoes.', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
  { id: '2', name: 'Yoga Mat', price: 30.00, description: 'Premium non-slip yoga mat.', imageUrl: 'https://images.unsplash.com/photo-1601134767222-1d70e41753c1' },
  { id: '3', name: 'Dumbbell Set', price: 85.00, description: 'Adjustable dumbbell set for home gym.', imageUrl: 'https://images.unsplash.com/photo-1638204090176-b33df64ccb61' },
  { id: '4', name: 'Protein Powder', price: 45.00, description: 'Whey protein isolate, chocolate flavor.', imageUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9' }
];

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch {
        console.warn('Failed to fetch from API, using dummy mock data.');
        setProducts(DUMMY_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="page-wrapper container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Welcome to SportShop</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Premium sports equipment for your fitness journey.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}><h2>Loading...</h2></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
