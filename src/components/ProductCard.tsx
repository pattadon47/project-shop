import { Link } from 'react-router-dom';
import './ProductCard.css';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="product-card glass">
      <div className="card-image-wrapper">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={product.name} 
          className="card-img"
        />
        {product.stock === 0 && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--danger)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            สินค้าหมด
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-desc">
          {product.description.length > 60 
            ? `${product.description.substring(0, 60)}...` 
            : product.description}
        </p>
        <div className="card-footer" style={{ alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="card-price">฿{product.price.toLocaleString('th-TH')}</span>
            {product.stock !== undefined && product.stock > 0 && (
               <span style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '2px' }}>
                 เหลือ {product.stock} ชิ้น
               </span>
            )}
            {product.stock !== undefined && product.stock === 0 && (
               <span style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '2px' }}>
                 หมดสต็อก
               </span>
            )}
          </div>
          <Link to={`/product/${product.id}`} className="btn-primary" style={{ opacity: product.stock === 0 ? 0.6 : 1, pointerEvents: product.stock === 0 ? 'none' : 'auto' }}>
            รายละเอียด
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
