import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard, { type Product } from '../components/ProductCard';
import api from '../services/api';
import './Home.css';

// ── Categorised dummy data ──────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  icon: string;
  products: Product[];
}

const CATEGORIES: Category[] = [
  {
    id: 'weightlifting',
    label: 'ยกน้ำหนัก',
    icon: '🏋️',
    products: [
      {
        id: 'w1',
        name: 'บาร์เบลล์ Olympic มาตรฐาน 20 kg',
        description: 'บาร์เบลล์เหล็กชุบโครเมี่ยม ขนาดมาตรฐาน Olympic ยาว 220 cm รับน้ำหนักสูงสุด 300 kg เหมาะทั้งมือใหม่และนักกีฬาอาชีพ',
        price: 3500,
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
        stock: 15,
      },
      {
        id: 'w2',
        name: 'ดัมเบลล์ปรับน้ำหนัก 5–32.5 kg',
        description: 'ดัมเบลล์แบบ dial-select ปรับน้ำหนักได้ 15 ระดับ ประหยัดพื้นที่ เหมาะสำหรับโฮมยิม',
        price: 4800,
        imageUrl: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600&q=80',
        stock: 0,
      },
      {
        id: 'w3',
        name: 'แท่นยกน้ำหนัก Adjustable Bench',
        description: 'ม้านั่งยกน้ำหนักปรับองศาได้ 7 ระดับ (0°–85°) โครงเหล็กหนา รับน้ำหนักได้ถึง 300 kg',
        price: 5500,
        imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
        stock: 10,
      },
      {
        id: 'w4',
        name: 'แผ่นน้ำหนัก Olympic 20 kg (คู่)',
        description: 'แผ่นน้ำหนักหุ้มยาง Olympic รู 50 mm ลดเสียงกระแทก มาเป็นคู่ (2×20 kg)',
        price: 2800,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1726768835872-7f68fb50eca6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 5,
      },
    ],
  },
  {
    id: 'cardio',
    label: 'วิ่ง & Cardio',
    icon: '🏃',
    products: [
      {
        id: 'c1',
        name: 'รองเท้าวิ่ง Pro Runner X9',
        description: 'รองเท้าวิ่งเทคโนโลยี carbon-fiber plate รองรับแรงกระแทกสูง เบาเพียง 220 g เหมาะทุกระยะทาง',
        price: 3200,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        stock: 30,
      },
      {
        id: 'c2',
        name: 'เชือกกระโดด Speed Rope Bearing',
        description: 'เชือกกระโดดความเร็วสูง สายเคเบิลเคลือบเหล็ก ball-bearing ด้ามจับ 360° หมุนลื่น',
        price: 450,
        imageUrl: 'https://images.unsplash.com/photo-1651315283994-03ec73dc21f1?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 50,
      },
      {
        id: 'c3',
        name: 'ลู่วิ่งไฟฟ้า Treadmill Foldable',
        description: 'ลู่วิ่งไฟฟ้าพับได้ มอเตอร์ 2.5 HP ความเร็ว 1–16 km/h หน้าจอ LCD และระบบกันกระแทกแบบ multi-layer',
        price: 18500,
        imageUrl: 'https://images.unsplash.com/photo-1591940765155-0604537032a5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 3,
      },
    ],
  },
  {
    id: 'yoga',
    label: 'โยคะ & Stretch',
    icon: '🧘',
    products: [
      {
        id: 'y1',
        name: 'เสื่อโยคะ Premium TPE 10 mm',
        description: 'เสื่อโยคะ TPE ไม่มีสารพิษ หนา 10 mm กันลื่นสองด้าน น้ำหนักเบา พร้อมสายรัด',
        price: 890,
        imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 40,
      },
      {
        id: 'y2',
        name: 'แถบยางยืดออกกำลังกาย 5 ระดับ',
        description: 'Resistance band ชุด 5 เส้น แรงต้าน 5–40 lbs เหมาะสำหรับการยืดเหยียด กายภาพบำบัด และฝึกแรง',
        price: 380,
        imageUrl: 'https://images.unsplash.com/photo-1672804591677-e859bf816875?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 0,
      },
      {
        id: 'y3',
        name: 'โฟมโรลเลอร์นวดกล้ามเนื้อ',
        description: 'Foam roller พื้นผิวนูนช่วยนวดกล้ามเนื้อลึก บรรเทาอาการตึงและช่วยฟื้นฟูหลังออกกำลังกาย',
        price: 550,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1666736569451-121617facc47?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 25,
      },
    ],
  },
  {
    id: 'supplement',
    label: 'Supplement',
    icon: '💊',
    products: [
      {
        id: 's1',
        name: 'Whey Protein Isolate รสวานิลา 2 kg',
        description: 'เวย์โปรตีนไอโซเลท โปรตีน 27 g ต่อเสิร์ฟ ไขมัน 0 g ละลายง่าย 60 เสิร์ฟต่อถัง',
        price: 1650,
        imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80',
        stock: 60,
      },
      {
        id: 's2',
        name: 'Creatine Monohydrate 500 g',
        description: 'Creatine บริสุทธิ์ 100% เพิ่มความแข็งแกร่ง ฟื้นฟูกล้ามเนื้อเร็ว ไม่มีน้ำตาล ไม่มีสี',
        price: 750,
        imageUrl: 'https://images.unsplash.com/photo-1693996046514-0406d0773a7d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 40,
      },
      {
        id: 's3',
        name: 'BCAA Amino Acid รสสตรอว์เบอรี่ 300 g',
        description: 'BCAA อัตราส่วน 2:1:1 ช่วยป้องกันการสลายกล้ามเนื้อ เพิ่มความทนทาน ดื่มง่ายไม่มีน้ำตาล',
        price: 890,
        imageUrl: 'https://images.unsplash.com/photo-1572359896611-094c2cb3e609?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        stock: 50,
      },
    ],
  },
];

const FLAT_PRODUCTS: Product[] = CATEGORIES.flatMap(c => c.products);

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const aboutRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch {
        console.warn('Failed to fetch from API, using categorised mock data.');
        setProducts(FLAT_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Scroll-reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.12 }
    );
    const items = document.querySelectorAll('.reveal');
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  // Use API data flat if loaded, otherwise use categorised dummy
  const usingApi = products.length > 0 && products[0].id !== 'w1';

  return (
    <>
      {/* ── Hero Section ── */}
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
              อุปกรณ์ออกกำลังกายและยกน้ำหนักคุณภาพสูง<br />
              ครบทุกความต้องการ ส่งตรงถึงบ้าน
            </p>
            <div className="hero-actions">
              <button className="hero-btn-primary" onClick={() => {
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                ดูสินค้าทั้งหมด
              </button>
              <button className="hero-btn-outline" onClick={() => {
                document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                ประวัติร้าน
              </button>
            </div>
          </div>

          <div className="hero-image-wrap">
            <div className="hero-glow" />
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900"
              alt="Gym Equipment"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* ── Products Section ── */}
      <section id="products-section" className="products-section container">
        <div className="section-header">
          <h2>สินค้าของเรา</h2>
          <p>อุปกรณ์ออกกำลังกายคุณภาพสูง ราคาคุ้มค่า พร้อมจัดส่งทั่วประเทศ</p>
        </div>

        {/* Category filter tabs */}
        <div className="cat-tabs">
          <button
            className={`cat-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            🛍️ ทั้งหมด
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>กำลังโหลดสินค้า...</p>
          </div>
        ) : usingApi ? (
          /* API data — flat grid */
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Dummy data — grouped by category */
          (activeCategory === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === activeCategory)).map(cat => (
            <div key={cat.id} className="category-section">
              <h3 className="category-heading">
                <span className="cat-icon">{cat.icon}</span>
                {cat.label}
                <span className="cat-count">{cat.products.length} รายการ</span>
              </h3>
              <div className="products-grid">
                {cat.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>


      {/* ── About / Store History Section ── */}
      <section id="about-section" className="about-section" ref={aboutRef}>
        <div className="about-inner container">
          <div className="reveal about-text-block">
            <p className="about-eyebrow">ประวัติร้านเรา</p>
            <h2 className="about-title">YimHaikan<br /><span>เราคือใคร?</span></h2>
            <p className="about-desc">
              YimHaikan พึ่งก็ตั้งขึ้น โดยพัทธดนย์ อาจหาญ และ นวพล ปานประเสริธแสง
            </p>
            <p className="about-desc">
              เราคัดสรรเฉพาะสินค้าที่ผ่านการทดสอบคุณภาพ ไม่ว่าจะเป็นบาร์เบลล์ ดัมเบลล์ แท่นยกน้ำหนัก หรืออุปกรณ์เสริมทุกประเภท
              พร้อมบริการหลังการขายที่ใส่ใจลูกค้าทุกคน
            </p>
            <button
              className="hero-btn-primary"
              style={{ marginTop: '1.5rem' }}
              onClick={() => navigate('/register')}
            >
              เข้าร่วมกับเรา →
            </button>
          </div>

          <div className="reveal about-stats-block">
            {[
              { icon: '🏪', num: '1', label: 'ปีแห่งประสบการณ์' },
              { icon: '📦', num: '500+', label: 'รายการสินค้า' },
              { icon: '🚚', num: '50K+', label: 'ลูกค้าทั่วประเทศ' },
              { icon: '⭐', num: '4.9', label: 'คะแนนความพึงพอใจ' },
            ].map(stat => (
              <div key={stat.label} className="stat-card">
                <span className="stat-icon">{stat.icon}</span>
                <span className="stat-num">{stat.num}</span>
                <span className="stat-label">{stat.label}</span>
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
