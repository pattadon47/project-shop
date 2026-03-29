import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cartService } from '../services/api';
import type { CartDetailItem } from '../types';

const Cart = () => {
  const navigate = useNavigate();
  const { cartId, cartItems, refreshCart } = useCart();

  const [items,      setItems]      = useState<CartDetailItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed,  setConfirmed]  = useState(false);
  const [msg,        setMsg]        = useState('');

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await refreshCart();
      setLoading(false);
    };
    loadCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sync local items with context
  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  const removeItem = async (pdId: string) => {
    if (!cartId) return;
    try {
      await cartService.removeItem(cartId, pdId);
      await refreshCart();
    } catch {
      setMsg('ลบสินค้าไม่สำเร็จ');
      setTimeout(() => setMsg(''), 2500);
    }
  };

  const updateQty = async (pdId: string, qty: number) => {
    if (!cartId || qty < 1) return;
    try {
      await cartService.updateQty(cartId, pdId, qty);
      // อัปเดต local state ทันที
      setItems(prev => prev.map(i => i.pdId === pdId ? { ...i, qty } : i));
    } catch {
      setMsg('อัปเดตจำนวนไม่สำเร็จ');
      setTimeout(() => setMsg(''), 2500);
    }
  };

  const clearCart = async () => {
    if (!cartId) return;
    if (!window.confirm('ลบตะกร้าสินค้าทั้งหมด?')) return;
    try {
      await cartService.deleteCart(cartId);
      await refreshCart();
    } catch {
      setMsg('ลบตะกร้าไม่สำเร็จ');
      setTimeout(() => setMsg(''), 2500);
    }
  };

  const confirmOrder = async () => {
    if (!cartId || items.length === 0) return;
    setConfirming(true);
    try {
      const res = await cartService.confirmCart(cartId);
      if (!res.error) {
        setConfirmed(true);
        await refreshCart();
        setTimeout(() => navigate('/orders'), 1500);
      } else {
        setMsg(res.message || 'ยืนยันคำสั่งซื้อไม่สำเร็จ');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err: unknown) {
      const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMsg(m || 'เกิดข้อผิดพลาด');
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '8rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>กำลังโหลดตะกร้า...</p>
    </div>
  );

  return (
    <div className="page-wrapper container">
      <h1 style={{ marginBottom: '2rem' }}>🛒 ตะกร้าสินค้า</h1>

      {confirmed && (
        <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.15)', border: '1px solid var(--success)', borderRadius: '0.75rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--success)', fontWeight: 600 }}>
          ✓ ยืนยันคำสั่งซื้อสำเร็จ! กำลังไปหน้าประวัติ...
        </div>
      )}

      {msg && (
        <div style={{ padding: '0.8rem 1rem', background: 'rgba(239,68,68,0.15)', border: '1px solid var(--danger)', borderRadius: '0.5rem', marginBottom: '1.5rem', color: 'var(--danger)' }}>
          {msg}
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ marginBottom: '1rem' }}>ตะกร้าว่างเปล่า</h2>
          <button className="btn-primary" onClick={() => navigate('/')}>เลือกซื้อสินค้า</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

          {/* Items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <div key={item.pdId} className="glass" style={{ display: 'flex', padding: '1.2rem', borderRadius: '0.75rem', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: '0.4rem', fontSize: '1rem' }}>{item.pdName}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 600, margin: 0 }}>
                    ฿{Number(item.price).toLocaleString('th-TH')} / ชิ้น
                  </p>
                </div>

                {/* Qty control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => updateQty(item.pdId, item.qty - 1)}
                    disabled={item.qty <= 1}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-glass)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}
                  >−</button>
                  <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.pdId, item.qty + 1)}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-glass)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}
                  >+</button>
                </div>

                <div style={{ fontSize: '1.15rem', fontWeight: 700, minWidth: '90px', textAlign: 'right' }}>
                  ฿{(item.qty * item.price).toLocaleString('th-TH')}
                </div>

                <button
                  className="btn-danger"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', flexShrink: 0 }}
                  onClick={() => removeItem(item.pdId)}
                >
                  ลบ
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
              <button
                onClick={clearCart}
                style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer' }}
              >
                🗑️ ลบตะกร้าทั้งหมด
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="glass" style={{ padding: '1.75rem', borderRadius: '1rem', position: 'sticky', top: '6rem' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>สรุปคำสั่งซื้อ</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>สินค้า ({items.length} รายการ)</span>
              <span>฿{total.toLocaleString('th-TH')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>ค่าจัดส่ง</span>
              <span style={{ color: 'var(--success)' }}>ฟรี</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)', fontSize: '1.3rem', fontWeight: 700 }}>
              <span>รวมทั้งสิ้น</span>
              <span style={{ color: 'var(--primary)' }}>฿{total.toLocaleString('th-TH')}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Cart ID: <code>{cartId}</code>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1rem' }}
              onClick={confirmOrder}
              disabled={confirming || confirmed}
            >
              {confirming ? 'กำลังยืนยัน...' : '✓ ยืนยันคำสั่งซื้อ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
