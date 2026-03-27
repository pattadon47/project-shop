import { Link } from 'react-router-dom';
import './ProductCard.css';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
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
      </div>
      <div className="card-content">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-desc">
          {product.description.length > 60 
            ? `${product.description.substring(0, 60)}...` 
            : product.description}
        </p>
        <div className="card-footer">
          <span className="card-price">${product.price.toFixed(2)}</span>
          <Link to={`/product/${product.id}`} className="btn-primary">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
