import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/api';
import type { OrderHistory, CartDetailItem } from '../types';

const OrderHistoryPage = () => {
  const [orders,        setOrders]        = useState<OrderHistory[]>([]);
  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [detailItems,   setDetailItems]   = useState<CartDetailItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading,       setLoading]       = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await cartService.getHistory();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const viewDetail = async (cartId: string) => {
    if (selectedId === cartId) {
      setSelectedId(null);
      setDetailItems([]);
      return;
    }
    setSelectedId(cartId);
    setLoadingDetail(true);
    try {
      const items: CartDetailItem[] = await cartService.getCartDetail(cartId);
      setDetailItems(items);
    } catch {
      setDetailItems([]);
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '8rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>กำลังโหลดประวัติ...</p>
    </div>
  );

  return (
    <div className="page-wrapper container">
      <h1 style={{ marginBottom: '2rem' }}>📦 ประวัติการสั่งซื้อ</h1>

      {orders.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h2>ยังไม่มีประวัติการสั่งซื้อ</h2>
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
            เริ่มช้อปปิ้ง
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedId ? '1fr 380px' : '1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Orders list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => {
              const isSelected = selectedId === order.cartId;
              return (
                <div
                  key={order.cartId}
                  className="glass"
                  onClick={() => viewDetail(order.cartId)}
                  style={{
                    padding: '1.5rem', borderRadius: '0.75rem', cursor: 'pointer',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-glass)'}`,
                    transition: 'border 0.2s, transform 0.2s',
                    transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>
                      🧾 คำสั่งซื้อ: <code>{order.cartId}</code>
                    </h3>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', fontWeight: 600 }}>
                      ✓ ยืนยันแล้ว
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span>📦 {order.itemCount} รายการ</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
                      ฿{Number(order.totalPrice).toLocaleString('th-TH')}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    คลิกเพื่อดูรายละเอียด
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          {selectedId && (
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', position: 'sticky', top: '6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>รายละเอียดคำสั่งซื้อ</h2>
                <button onClick={() => { setSelectedId(null); setDetailItems([]); }} style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', padding: '0.3rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
                  ✕ ปิด
                </button>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ID: <code>{selectedId}</code>
              </p>

              {loadingDetail ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" /></div>
              ) : (
                <>
                  <h3 style={{ marginBottom: '0.75rem' }}>สินค้าในคำสั่งซื้อ</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {detailItems.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 500 }}>{item.pdName}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {item.qty} × ฿{Number(item.price).toLocaleString('th-TH')}
                          </div>
                        </div>
                        <div style={{ fontWeight: 600 }}>
                          ฿{(item.qty * item.price).toLocaleString('th-TH')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {detailItems.length > 0 && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                      <span>รวม</span>
                      <span style={{ color: 'var(--primary)' }}>
                        ฿{detailItems.reduce((s, i) => s + i.qty * i.price, 0).toLocaleString('th-TH')}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
