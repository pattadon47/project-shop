import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService, cartService } from '../services/api';
import type { Product } from '../types';

const ProductDetail = () => {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const { cartId, refreshCart } = useCart();

  const [product,       setProduct]       = useState<Product | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [addingToCart,  setAddingToCart]  = useState(false);
  const [cartMsg,       setCartMsg]       = useState('');
  const [cartMsgType,   setCartMsgType]   = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data: Product[] = await productService.getById(id!);
        setProduct(data[0] ?? null);   // backend returns array
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const showMsg = (msg: string, type: 'success' | 'error' = 'success') => {
    setCartMsg(msg);
    setCartMsgType(type);
    setTimeout(() => setCartMsg(''), 3000);
  };

  const addToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAddingToCart(true);
    try {
      let activeCartId = cartId;

      // ถ้าไม่มี cart → สร้างใหม่
      if (!activeCartId) {
        const created = await cartService.createCart();
        if (!created.cartOK) throw new Error('สร้างตะกร้าไม่สำเร็จ');
        activeCartId = created.messageAddCart; // backend returns cartId in messageAddCart
      }

      // 🟢 Type assertion for activeCartId since it's guaranteed to be string here
      await cartService.addItem(activeCartId as string, product!.pdId);
      await refreshCart();
      showMsg('✓ เพิ่มสินค้าลงตะกร้าสำเร็จ!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showMsg(msg || 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const imageUrl = product?.pd_image_url
    ? `/img_pd/${product.pd_image_url}`
    : 'https://placehold.co/600x500?text=No+Image';

  if (loading) return (
    <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>กำลังโหลดสินค้า...</p>
    </div>
  );

  if (!product) return (
    <div className="page-wrapper container" style={{ textAlign: 'center' }}>
      <h2>ไม่พบสินค้านี้</h2>
      <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>กลับหน้าหลัก</button>
    </div>
  );

  return (
    <div className="page-wrapper container">
      <div className="glass" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', padding: '2rem', borderRadius: '1rem' }}>

        {/* Image */}
        <div style={{ flex: '1 1 400px', borderRadius: '0.75rem', overflow: 'hidden', maxHeight: '500px' }}>
          <img
            src={imageUrl}
            alt={product.pdName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x500?text=No+Image'; }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>

          {/* Brand & Type badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {product.pdt && (
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(99,102,241,0.15)', color: '#818cf8', borderRadius: '999px', fontWeight: 600 }}>
                {product.pdt.pdTypeName}
              </span>
            )}

          </div>

          <h1 style={{ fontSize: '2rem', margin: 0 }}>{product.pdName}</h1>

          {product.pdRemark && (
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{product.pdRemark}</p>
          )}

          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>
            ฿{Number(product.pdPrice).toLocaleString('th-TH')}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            รหัสสินค้า: <code style={{ color: 'var(--text)' }}>{product.pdId}</code>
          </div>

          {cartMsg && (
            <div style={{
              padding: '0.6rem 1rem',
              background: cartMsgType === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              color: cartMsgType === 'success' ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${cartMsgType === 'success' ? 'var(--success)' : 'var(--danger)'}`,
              borderRadius: '0.5rem'
            }}>
              {cartMsg}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {user?.dutyId !== 'admin' && (
              <button
                className="btn-primary"
                style={{ flex: 1, minWidth: '180px', padding: '1rem', fontSize: '1.1rem' }}
                onClick={addToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'กำลังเพิ่ม...' : '🛒 เพิ่มลงตะกร้า'}
              </button>
            )}
            {user?.dutyId === 'admin' && (
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}
                onClick={() => navigate('/admin/products')}
              >
                ✏️ จัดการสินค้า
              </button>
            )}
            <button
              style={{ padding: '1rem 1.5rem', background: 'transparent', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => navigate(-1)}
            >
              ← กลับ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
