import { Link } from 'react-router-dom';
import type { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl = product.pd_image_url
    ? `/img_pd/${product.pd_image_url}`
    : 'https://placehold.co/300x200?text=No+Image';

  const description = product.pdRemark ?? '';

  return (
    <div className="product-card glass">
      <div className="card-image-wrapper">
        <img
          src={imageUrl}
          alt={product.pdName}
          className="card-img"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=No+Image'; }}
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{product.pdName}</h3>
        {product.pdt && (
          <span style={{
            fontSize: '0.72rem', padding: '0.2rem 0.6rem',
            background: 'rgba(99,102,241,0.15)', color: '#818cf8',
            borderRadius: '999px', fontWeight: 600, display: 'inline-block', marginBottom: '0.5rem'
          }}>
            {product.pdt.pdTypeName}
          </span>
        )}
        <p className="card-desc">
          {description.length > 60 ? `${description.substring(0, 60)}...` : (description || '—')}
        </p>
        <div className="card-footer">
          <span className="card-price">฿{Number(product.pdPrice).toLocaleString('th-TH')}</span>
          <Link to={`/product/${product.pdId}`} className="btn-primary">
            รายละเอียด
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
