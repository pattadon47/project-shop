import { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import type { Product } from '../../types';

const MOCK_PRODUCTS: Product[] = [
  { id: 'w1', name: 'บาร์เบลล์ Olympic มาตรฐาน 20 kg', price: 3500.00, description: 'บาร์เบลล์เหล็กชุบโครเมี่ยม ขนาดมาตรฐาน Olympic ยาว 220 cm รับน้ำหนักสูงสุด 300 kg เหมาะทั้งมือใหม่และนักกีฬาอาชีพ', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', stock: 15 },
  { id: 'w2', name: 'ดัมเบลล์ปรับน้ำหนัก 5–32.5 kg', price: 4800.00, description: 'ดัมเบลล์แบบ dial-select ปรับน้ำหนักได้ 15 ระดับ ประหยัดพื้นที่ เหมาะสำหรับโฮมยิม', imageUrl: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600&q=80', stock: 20 },
  { id: 'w3', name: 'แท่นยกน้ำหนัก Adjustable Bench', price: 5500.00, description: 'ม้านั่งยกน้ำหนักปรับองศาได้ 7 ระดับ (0°–85°) โครงเหล็กหนา รับน้ำหนักได้ถึง 300 kg', imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80', stock: 10 },
  { id: 'w4', name: 'แผ่นน้ำหนัก Olympic 20 kg (คู่)', price: 2800.00, description: 'แผ่นน้ำหนักหุ้มยาง Olympic รู 50 mm ลดเสียงกระแทก มาเป็นคู่ (2×20 kg)', imageUrl: 'https://plus.unsplash.com/premium_photo-1726768835872-7f68fb50eca6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', stock: 5 },
  { id: 'c1', name: 'รองเท้าวิ่ง Pro Runner X9', price: 3200.00, description: 'รองเท้าวิ่งเทคโนโลยี carbon-fiber plate รองรับแรงกระแทกสูง เบาเพียง 220 g เหมาะทุกระยะทาง', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', stock: 30 },
  { id: 'c2', name: 'เชือกกระโดด Speed Rope Bearing', price: 450.00, description: 'เชือกกระโดดความเร็วสูง สายเคเบิลเคลือบเหล็ก ball-bearing ด้ามจับ 360° หมุนลื่น', imageUrl: 'https://images.unsplash.com/photo-1651315283994-03ec73dc21f1?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', stock: 50 },
  { id: 'c3', name: 'ลู่วิ่งไฟฟ้า Treadmill Foldable', price: 18500.00, description: 'ลู่วิ่งไฟฟ้าพับได้ มอเตอร์ 2.5 HP ความเร็ว 1–16 km/h หน้าจอ LCD และระบบกันกระแทกแบบ multi-layer', imageUrl: 'https://images.unsplash.com/photo-1591940765155-0604537032a5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', stock: 3 },
  { id: 'y1', name: 'เสื่อโยคะ Premium TPE 10 mm', price: 890.00, description: 'เสื่อโยคะ TPE ไม่มีสารพิษ หนา 10 mm กันลื่นสองด้าน น้ำหนักเบา พร้อมสายรัด', imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', stock: 40 },
  { id: 'y2', name: 'แถบยางยืดออกกำลังกาย 5 ระดับ', price: 380.00, description: 'Resistance band ชุด 5 เส้น แรงต้าน 5–40 lbs เหมาะสำหรับการยืดเหยียด กายภาพบำบัด และฝึกแรง', imageUrl: 'https://images.unsplash.com/photo-1672804591677-e859bf816875?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', stock: 100 },
  { id: 'y3', name: 'โฟมโรลเลอร์นวดกล้ามเนื้อ', price: 550.00, description: 'Foam roller พื้นผิวนูนช่วยนวดกล้ามเนื้อลึก บรรเทาอาการตึงและช่วยฟื้นฟูหลังออกกำลังกาย', imageUrl: 'https://plus.unsplash.com/premium_photo-1666736569451-121617facc47?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', stock: 25 },
  { id: 's1', name: 'Whey Protein Isolate รสวานิลา 2 kg', price: 1650.00, description: 'เวย์โปรตีนไอโซเลท โปรตีน 27 g ต่อเสิร์ฟ ไขมัน 0 g ละลายง่าย 60 เสิร์ฟต่อถัง', imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80', stock: 60 },
  { id: 's2', name: 'Creatine Monohydrate 500 g', price: 750.00, description: 'Creatine บริสุทธิ์ 100% เพิ่มความแข็งแกร่ง ฟื้นฟูกล้ามเนื้อเร็ว ไม่มีน้ำตาล ไม่มีสี', imageUrl: 'https://images.unsplash.com/photo-1693996046514-0406d0773a7d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', stock: 40 },
  { id: 's3', name: 'BCAA Amino Acid รสสตรอว์เบอรี่ 300 g', price: 890.00, description: 'BCAA อัตราส่วน 2:1:1 ช่วยป้องกันการสลายกล้ามเนื้อ เพิ่มความทนทาน ดื่มง่ายไม่มีน้ำตาล', imageUrl: 'https://images.unsplash.com/photo-1572359896611-094c2cb3e609?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', stock: 50 },
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
    setSaving(true) 
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
