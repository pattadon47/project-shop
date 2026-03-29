import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';
import type { Product, ProductType } from '../types';
import './Home.css';

const Home = () => {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [pdTypes,    setPdTypes]    = useState<ProductType[]>([]);
  const [activeType, setActiveType] = useState<string>('all');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const aboutRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, typesData] = await Promise.all([
          productService.getAll(),
          productService.getAllTypes(),
        ]);
        setProducts(productsData);
        setPdTypes(typesData);
      } catch {
        setError('ไม่สามารถโหลดสินค้าได้ กรุณาตรวจสอบ server');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Scroll-reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    try {
      const result = await productService.search(search.trim());
      setProducts(result);
      setActiveType('all');
    } catch {
      setError('ค้นหาไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = async () => {
    setSearch('');
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
      setActiveType('all');
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const filtered = activeType === 'all'
    ? products
    : products.filter(p => p.pdTypeId === activeType);

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow">🏋️ ร้านอุปกรณ์ออกกำลังกาย #1</p>
            <h1 className="hero-title">
              ยกหนักกว่า<br />
              <span className="hero-title-highlight">ทำลายขีดจำกัด</span>
            </h1>
            <p className="hero-desc">
              อุปกรณ์ออกกำลังกายคุณภาพสูง<br />ครบทุกความต้องการ ส่งตรงถึงบ้าน
            </p>
            <div className="hero-actions">
              <button className="hero-btn-primary" onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}>
                ดูสินค้าทั้งหมด
              </button>
              <button className="hero-btn-outline" onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}>
                ประวัติร้าน
              </button>
            </div>
          </div>
          <div className="hero-image-wrap">
            <div className="hero-glow" />
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900" alt="Gym Equipment" className="hero-image" />
          </div>
        </div>
      </section>

      {/* ── Products Section ── */}
      <section id="products-section" className="products-section container">
        <div className="section-header">
          <h2>สินค้าของเรา</h2>
          <p>อุปกรณ์ออกกำลังกายคุณภาพสูง ราคาคุ้มค่า พร้อมจัดส่งทั่วประเทศ</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="input-field"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }}>ค้นหา</button>
          {search && (
            <button type="button" onClick={resetSearch} style={{ padding: '0.6rem 0.9rem', background: 'transparent', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
          )}
        </form>

        {/* Category tabs */}
        <div className="cat-tabs">
          <button className={`cat-tab ${activeType === 'all' ? 'active' : ''}`} onClick={() => setActiveType('all')}>
            🛍️ ทั้งหมด
          </button>
          {pdTypes.map(t => (
            <button
              key={t.pdTypeId}
              className={`cat-tab ${activeType === t.pdTypeId ? 'active' : ''}`}
              onClick={() => setActiveType(t.pdTypeId)}
            >
              {t.pdTypeName}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-wrap"><div className="spinner" /><p>กำลังโหลดสินค้า...</p></div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger)' }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>ไม่พบสินค้า</div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.pdId} product={p} />)}
          </div>
        )}
      </section>

      {/* ── About ── */}
      <section id="about-section" className="about-section" ref={aboutRef}>
        <div className="about-inner container">
          <div className="reveal about-text-block">
            <p className="about-eyebrow">ประวัติร้านเรา</p>
            <h2 className="about-title">YimHaikan<br /><span>เราคือใคร?</span></h2>
            <p className="about-desc">
              YimHaikan ก่อตั้งโดย พัทธดนย์ อาจหาญ และ นวพล ปานประเสริธแสง
            </p>
            <p className="about-desc">
              เราคัดสรรเฉพาะสินค้าที่ผ่านการทดสอบคุณภาพ ไม่ว่าจะเป็นบาร์เบลล์ ดัมเบลล์ แท่นยกน้ำหนัก หรืออุปกรณ์เสริมทุกประเภท
              พร้อมบริการหลังการขายที่ใส่ใจลูกค้าทุกคน
            </p>
            <button className="hero-btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/register')}>
              เข้าร่วมกับเรา →
            </button>
          </div>
          <div className="reveal about-stats-block">
            {[
              { icon: '🏪', num: '1',    label: 'ปีแห่งประสบการณ์' },
              { icon: '📦', num: '500+', label: 'รายการสินค้า' },
              { icon: '🚚', num: '50K+', label: 'ลูกค้าทั่วประเทศ' },
              { icon: '⭐', num: '4.9',  label: 'คะแนนความพึงพอใจ' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <span className="stat-icon">{s.icon}</span>
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-brand">⚡ YimHaikan</div>
          <p className="footer-copy">© 2025 YimHaikan. All rights reserved. | ร้านขายอุปกรณ์ออกกำลังกายออนไลน์</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
