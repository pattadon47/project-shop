import { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import type { Product, ProductType } from '../../types';

interface ProductForm {
  pdId: string;
  pdName: string;
  pdPrice: number;
  pdTypeId: string;
  pdRemark: string;
}

const emptyForm = (): ProductForm => ({
  pdId: '', pdName: '', pdPrice: 0, pdTypeId: '', pdRemark: '',
});

const ManageProducts = () => {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [pdTypes,    setPdTypes]    = useState<ProductType[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form,       setForm]       = useState<ProductForm>(emptyForm());
  const [imageFile,  setImageFile]  = useState<File | null>(null);
  const [preview,    setPreview]    = useState('');
  const [saving,     setSaving]     = useState(false);
  const [msg,        setMsg]        = useState('');
  const [search,     setSearch]     = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, t] = await Promise.all([
        productService.getAll(),
        productService.getAllTypes(),
      ]);
      setProducts(p);
      setPdTypes(t);
    } catch {
      setMsg('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setImageFile(null);
    setPreview('');
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditTarget(p);
    setForm({
      pdId:     p.pdId,
      pdName:   p.pdName,
      pdPrice:  p.pdPrice,
      pdTypeId: p.pdTypeId,
      pdRemark: p.pdRemark ?? '',
    });
    setImageFile(null);
    setPreview(p.pd_image_url ? `/img_pd/${p.pd_image_url}` : '');
    setShowModal(true);
  };

  const handleDelete = async (pdId: string) => {
    if (!window.confirm(`ลบสินค้า ${pdId}?`)) return;
    try {
      await productService.delete(pdId);
      setProducts(products.filter(p => p.pdId !== pdId));
      setMsg('ลบสินค้าสำเร็จ');
    } catch (err: unknown) {
      const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMsg(m || 'ลบสินค้าไม่สำเร็จ');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        // แก้ไข — ส่ง multipart/form-data
        const fd = new FormData();
        if (form.pdName   !== editTarget.pdName)   fd.append('pdName',   form.pdName);
        if (form.pdPrice  !== editTarget.pdPrice)  fd.append('pdPrice',  String(form.pdPrice));
        if (form.pdTypeId !== editTarget.pdTypeId) fd.append('pdTypeId', form.pdTypeId);
        if (form.pdRemark !== (editTarget.pdRemark ?? '')) fd.append('pdRemark', form.pdRemark);
        if (imageFile) fd.append('file', imageFile);
        await productService.update(editTarget.pdId, fd);
        setMsg('แก้ไขสินค้าสำเร็จ');
      } else {
        // สร้างใหม่
        await productService.create({
          pdId:    form.pdId,
          pdName:  form.pdName,
          pdPrice: form.pdPrice,
          pdTypeId: form.pdTypeId,
        });
        setMsg('เพิ่มสินค้าสำเร็จ');
      }
      await loadAll();
      setShowModal(false);
    } catch (err: unknown) {
      const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMsg(m || 'บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'pdPrice' ? Number(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setImageFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const filtered = products.filter(p =>
    p.pdId.toLowerCase().includes(search.toLowerCase()) ||
    p.pdName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: '#f59e0b' }}>📦 จัดการสินค้า</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="input-field"
            style={{ maxWidth: '260px' }}
          />
          <button className="btn-primary" onClick={openCreate}>+ เพิ่มสินค้า</button>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}><div className="spinner" /></div>
      ) : (
        <div className="glass" style={{ borderRadius: '1rem', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '1rem' }}>รูป</th>
                <th style={{ padding: '1rem' }}>รหัส</th>
                <th style={{ padding: '1rem' }}>ชื่อสินค้า</th>
                <th style={{ padding: '1rem' }}>ประเภท</th>
                <th style={{ padding: '1rem' }}>ราคา</th>
                <th style={{ padding: '1rem' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.pdId} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <img
                      src={p.pd_image_url ? `/img_pd/${p.pd_image_url}` : 'https://placehold.co/60x60?text=No'}
                      alt={p.pdName}
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '0.4rem' }}
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/60x60?text=No'; }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{p.pdId}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 500, maxWidth: '200px' }}>{p.pdName}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.pdt?.pdTypeName}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>฿{Number(p.pdPrice).toLocaleString('th-TH')}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ background: 'transparent', color: '#60a5fa', border: '1px solid #60a5fa', padding: '0.35rem 0.7rem', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => openEdit(p)}>
                        แก้ไข
                      </button>
                      <button className="btn-danger" style={{ padding: '0.35rem 0.7rem', borderRadius: '0.4rem', fontSize: '0.85rem' }} onClick={() => handleDelete(p.pdId)}>
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>ไม่พบสินค้า</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editTarget ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* pdId — เฉพาะตอนสร้างใหม่ */}
              {!editTarget && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>รหัสสินค้า (pdId) *</label>
                  <input name="pdId" className="input-field" value={form.pdId} onChange={handleChange} required placeholder="เช่น PD001" />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>ชื่อสินค้า *</label>
                <input name="pdName" className="input-field" value={form.pdName} onChange={handleChange} required placeholder="ชื่อสินค้า" />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>ประเภท *</label>
                  <select name="pdTypeId" className="input-field" value={form.pdTypeId} onChange={handleChange} required>
                    <option value="">-- เลือกประเภท --</option>
                    {pdTypes.map(t => <option key={t.pdTypeId} value={t.pdTypeId}>{t.pdTypeName}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>ราคา (฿) *</label>
                <input name="pdPrice" type="number" className="input-field" value={form.pdPrice} onChange={handleChange} required min={0} step="0.01" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>รายละเอียด (pdRemark)</label>
                <textarea name="pdRemark" className="input-field" value={form.pdRemark} onChange={handleChange} placeholder="รายละเอียดสินค้า..." rows={3} style={{ resize: 'vertical' }} />
              </div>

              {editTarget && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>เปลี่ยนรูปภาพ (ไม่บังคับ)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ color: 'var(--text-muted)' }} />
                  {preview && (
                    <img src={preview} alt="preview" style={{ marginTop: '0.5rem', maxHeight: '100px', borderRadius: '0.5rem', objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'กำลังบันทึก...' : (editTarget ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า')}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', borderRadius: '0.5rem', cursor: 'pointer', padding: '0.5rem' }}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
