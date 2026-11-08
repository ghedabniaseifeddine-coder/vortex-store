import React from 'react';
import { categoryOf, formatDA } from '../data/catalog.js';

/** CSS-only product artwork — keeps the page light while matching the 3D world. */
export function Art({ kind, tone, className = '' }) {
  return (
    <div className={`art art--${kind} ${className}`} style={{ '--tone': tone || '#2ee6ff' }}>
      <span className="art__glow" />
      <span className="art__shape" />
      <span className="art__sheen" />
    </div>
  );
}

export default function ProductCard({ product, onOpen, onAdd }) {
  const cat = categoryOf(product.categoryId);
  const off = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const out = product.stock <= 0;

  return (
    <article className="card" style={{ '--tone': product.tone || cat.color }}>
      <div
        className="card__media"
        onClick={() => onOpen(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(product); } }}
        aria-label={`View ${product.name}`}
      >
        {off > 0 && !out && <span className="card__badge">-{off}%</span>}
        {out && <span className="card__badge card__badge--out">Out of stock</span>}
        <Art kind={product.art} tone={product.tone} />
      </div>

      <div className="card__body">
        <div className="card__cat">{cat.name}</div>
        <h3 className="card__name">{product.name}</h3>
        <p className="card__desc">{product.description}</p>

        <div className="card__row">
          <div>
            <span className="card__price">{formatDA(product.price)}</span>
            {product.oldPrice ? <span className="card__old">{formatDA(product.oldPrice)}</span> : null}
          </div>
          <button
            className="card__add"
            onClick={() => onAdd(product)}
            disabled={out}
            aria-label={`Add ${product.name} to cart`}
          >
            {out ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
