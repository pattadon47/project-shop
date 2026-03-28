import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService, cartService } from '../services/api';
import type { Product } from '../types';

const DUMMY_PRODUCTS: Record<string, Product> = {
  'w1': { id: 'w1', name: 'บาร์เบลล์ Olympic มาตรฐาน 20 kg', price: 3500.00, description: 'บาร์เบลล์เหล็กชุบโครเมี่ยม ขนาดมาตรฐาน Olympic ยาว 220 cm รับน้ำหนักสูงสุด 300 kg เหมาะทั้งมือใหม่และนักกีฬาอาชีพ', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
  'w2': { id: 'w2', name: 'ดัมเบลล์ปรับน้ำหนัก 5–32.5 kg', price: 4800.00, description: 'ดัมเบลล์แบบ dial-select ปรับน้ำหนักได้ 15 ระดับ ประหยัดพื้นที่ เหมาะสำหรับโฮมยิม', imageUrl: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600&q=80' },
  'w3': { id: 'w3', name: 'แท่นยกน้ำหนัก Adjustable Bench', price: 5500.00, description: 'ม้านั่งยกน้ำหนักปรับองศาได้ 7 ระดับ (0°–85°) โครงเหล็กหนา รับน้ำหนักได้ถึง 300 kg', imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80' },
  'w4': { id: 'w4', name: 'แผ่นน้ำหนัก Olympic 20 kg (คู่)', price: 2800.00, description: 'แผ่นน้ำหนักหุ้มยาง Olympic รู 50 mm ลดเสียงกระแทก มาเป็นคู่ (2×20 kg)', imageUrl: 'https://plus.unsplash.com/premium_photo-1726768835872-7f68fb50eca6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  'c1': { id: 'c1', name: 'รองเท้าวิ่ง Pro Runner X9', price: 3200.00, description: 'รองเท้าวิ่งเทคโนโลยี carbon-fiber plate รองรับแรงกระแทกสูง เบาเพียง 220 g เหมาะทุกระยะทาง', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  'c2': { id: 'c2', name: 'เชือกกระโดด Speed Rope Bearing', price: 450.00, description: 'เชือกกระโดดความเร็วสูง สายเคเบิลเคลือบเหล็ก ball-bearing ด้ามจับ 360° หมุนลื่น', imageUrl: 'https://images.unsplash.com/photo-1651315283994-03ec73dc21f1?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  'c3': { id: 'c3', name: 'ลู่วิ่งไฟฟ้า Treadmill Foldable', price: 18500.00, description: 'ลู่วิ่งไฟฟ้าพับได้ มอเตอร์ 2.5 HP ความเร็ว 1–16 km/h หน้าจอ LCD และระบบกันกระแทกแบบ multi-layer', imageUrl: 'https://images.unsplash.com/photo-1591940765155-0604537032a5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  'y1': { id: 'y1', name: 'เสื่อโยคะ Premium TPE 10 mm', price: 890.00, description: 'เสื่อโยคะ TPE ไม่มีสารพิษ หนา 10 mm กันลื่นสองด้าน น้ำหนักเบา พร้อมสายรัด', imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  'y2': { id: 'y2', name: 'แถบยางยืดออกกำลังกาย 5 ระดับ', price: 380.00, description: 'Resistance band ชุด 5 เส้น แรงต้าน 5–40 lbs เหมาะสำหรับการยืดเหยียด กายภาพบำบัด และฝึกแรง', imageUrl: 'https://images.unsplash.com/photo-1672804591677-e859bf816875?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  'y3': { id: 'y3', name: 'โฟมโรลเลอร์นวดกล้ามเนื้อ', price: 550.00, description: 'Foam roller พื้นผิวนูนช่วยนวดกล้ามเนื้อลึก บรรเทาอาการตึงและช่วยฟื้นฟูหลังออกกำลังกาย', imageUrl: 'https://plus.unsplash.com/premium_photo-1666736569451-121617facc47?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  's1': { id: 's1', name: 'Whey Protein Isolate รสวานิลา 2 kg', price: 1650.00, description: 'เวย์โปรตีนไอโซเลท โปรตีน 27 g ต่อเสิร์ฟ ไขมัน 0 g ละลายง่าย 60 เสิร์ฟต่อถัง', imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80' },
  's2': { id: 's2', name: 'Creatine Monohydrate 500 g', price: 750.00, description: 'Creatine บริสุทธิ์ 100% เพิ่มความแข็งแกร่ง ฟื้นฟูกล้ามเนื้อเร็ว ไม่มีน้ำตาล ไม่มีสี', imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&q=80' },
  's3': { id: 's3', name: 'BCAA Amino Acid รสสตรอว์เบอรี่ 300 g', price: 890.00, description: 'BCAA อัตราส่วน 2:1:1 ช่วยป้องกันการสลายกล้ามเนื้อ เพิ่มความทนทาน ดื่มง่ายไม่มีน้ำตาล', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80' },
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
        setProduct(DUMMY_PRODUCTS[id!] || { ...DUMMY_PRODUCTS['w1'], id: id || 'w1' });
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
