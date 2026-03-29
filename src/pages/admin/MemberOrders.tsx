import { useState, useEffect } from 'react';
import { adminService, cartService } from '../../services/api';
import type { AdminOrder, CartDetailItem } from '../../types';

const MemberOrders = () => {
  const [orders,        setOrders]        = useState<AdminOrder[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [detailItems,   setDetailItems]   = useState<CartDetailItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await adminService.getAllOrders();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
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

  const filtered = orders.filter(o =>
    o.cartId.toLowerCase().includes(search.toLowerCase()) ||
    (o.memEmail || '').toLowerCase().includes(search.toLowerCase())
  );

  const selectedOrder = orders.find(o => o.cartId === selectedId);

  return (
    <div className="page-wrapper container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: '#10b981' }}>🛒 คำสั่งซื้อทั้งหมด</h1>
        <input
          type="text"
          placeholder="ค้นหา Cart ID หรืออีเมล..."
          className="input-field"
          style={{ maxWidth: '360px' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedId ? '1fr 380px' : '1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Orders table */}
          <div className="glass" style={{ borderRadius: '1rem', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '1rem' }}>Cart ID</th>
                  <th style={{ padding: '1rem' }}>อีเมลสมาชิก</th>
                  <th style={{ padding: '1rem' }}>จำนวนสินค้า</th>
                  <th style={{ padding: '1rem' }}>ยอดรวม</th>
                  <th style={{ padding: '1rem' }}>รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr
                    key={order.cartId}
                    style={{ borderBottom: '1px solid var(--border-glass)', background: selectedId === order.cartId ? 'rgba(59,130,246,0.05)' : 'transparent' }}
                  >
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.9rem' }}>{order.cartId}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{order.memEmail}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{order.itemCount} ชิ้น</td>
                    <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 600 }}>
                      ฿{Number(order.totalPrice).toLocaleString('th-TH')}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        onClick={() => viewDetail(order.cartId)}
                      >
                        {selectedId === order.cartId ? 'ปิด' : 'ดูรายการ'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>ไม่พบคำสั่งซื้อ</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selectedId && (
            <div className="glass" style={{ padding: '1.75rem', borderRadius: '1rem', position: 'sticky', top: '6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
                <h3 style={{ margin: 0 }}>รายละเอียดคำสั่งซื้อ</h3>
                <button onClick={() => { setSelectedId(null); setDetailItems([]); }} style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', padding: '0.3rem 0.7rem', borderRadius: '0.4rem', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                <p><strong>Cart ID:</strong> <code>{selectedId}</code></p>
                <p><strong>สมาชิก:</strong> {selectedOrder?.memEmail}</p>
                <p><strong>สถานะ:</strong> <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ ยืนยันแล้ว</span></p>
              </div>

              <h4 style={{ marginBottom: '0.75rem' }}>รายการสินค้า</h4>

              {loadingDetail ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" /></div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {detailItems.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.pdName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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
                    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
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

export default MemberOrders;
