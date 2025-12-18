import React from "react";

function ProductCard({ product, onAddToCart, onViewDetails }) {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">Ksh {product.price}</p>
      </div>
      <div className="product-actions">
        {onViewDetails && (
          <button className="btn view-btn" onClick={() => onViewDetails(product)}>
            View Details
          </button>
        )}
        {onAddToCart && (
          <button className="btn add-btn" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
