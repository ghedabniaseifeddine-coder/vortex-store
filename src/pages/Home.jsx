import React, { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, formatDA, FREE_SHIPPING_THRESHOLD } from '../data/catalog.js';
import { useStore } from '../store.jsx';
import ProductCard, { Art } from '../components/ProductCard.jsx';

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

const TRUST = [
  ['⚡', 'Fast charging certified'],
  ['🛡️', '6-month replacement warranty'],
  ['🚚', 'Cash on delivery · 58 wilayas'],
  ['🔒', 'Original products only'],
  ['↩️', '7-day easy returns'],
];

export default function Home({ navigate }) {
  const { products, addToCart, settings, notify } = useStore();
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState(null);
  useReveal();

  const featured = useMemo(() => products.find((p) => p.featured) || products[0], [products]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inCat = active === 'all' || p.categoryId === active;
      const inQuery = !q || `${p.name} ${p.description}`.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [products, active, query]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setPreview(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const add = (product) => {
    if (product.stock <= 0) {
      notify('That one just sold out');
      return;
    }
    addToCart(product);
  };

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <span className="eyebrow">Smart Accessories · Algeria</span>
            <h1 className="hero__title">
              Gear that makes your phone feel <em>brand new</em>.
            </h1>
            <p className="hero__lead">
              Cases, fast chargers, wireless audio and protection — engineered for the devices you use
              every single day. Delivered to your door, paid in cash.
            </p>

            <div className="hero__actions">
              <button
                className="btn btn--primary"
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore the collection
              </button>
              <button className="btn btn--ghost" onClick={() => navigate('/checkout')}>
                Checkout
              </button>
            </div>

            <div className="hero__stats">
              <div className="stat"><b>{products.length}</b><span>Products</span></div>
              <div className="stat"><b>58</b><span>Wilayas</span></div>
              <div className="stat"><b>6 mo</b><span>Warranty</span></div>
              <div className="stat"><b>COD</b><span>Payment</span></div>
            </div>
          </div>

          {featured && (
            <div className="hero__stage">
              <div className="hero__stage-label">
                <span>Featured</span>
                <b>● In stock</b>
              </div>
              <div className="hero__stage-art">
                <Art kind={featured.art} tone={featured.tone} />
              </div>
              <h3 className="hero__stage-name">{featured.name}</h3>
              <p className="hero__stage-meta">{featured.specs[0]}</p>
              <div className="hero__stage-row">
                <span className="card__price">{formatDA(featured.price)}</span>
                <button className="card__add" onClick={() => add(featured)}>Add to cart</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---------- TRUST ---------- */}
      <div className="trust" aria-hidden="true">
        <div className="trust__track">
          {[...TRUST, ...TRUST].map(([icon, label], i) => (
            <span className="trust__item" key={i}><i>{icon}</i>{label}</span>
          ))}
        </div>
      </div>

      {/* ---------- CATEGORIES ---------- */}
      <section className="section section--tight" id="categories">
        <div className="container">
          <div className="section__head reveal">
            <div>
              <h2 className="section__title">Shop by category</h2>
              <p className="section__sub">Six focused collections — everything tested before it ships.</p>
            </div>
          </div>

          <div className="cat-grid reveal">
            {CATEGORIES.map((c) => {
              const count = products.filter((p) => p.categoryId === c.id).length;
              return (
                <button
                  key={c.id}
                  className="cat-card"
                  style={{ '--tone': c.color }}
                  onClick={() => {
                    setActive(c.id);
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="cat-card__art">
                    <div style={{ width: 70, height: 62 }}>
                      <Art kind={c.art} tone={c.color} />
                    </div>
                  </div>
                  <div className="cat-card__name">{c.name}</div>
                  <div className="cat-card__count">{count} products</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- CATALOG ---------- */}
      <section className="section" id="catalog">
        <div className="container">
          <div className="section__head reveal">
            <div>
              <h2 className="section__title">The collection</h2>
              <p className="section__sub">
                Free shipping over {formatDA(settings.freeShipping || FREE_SHIPPING_THRESHOLD)}.
              </p>
            </div>
            <input
              className="field"
              style={{ maxWidth: 260, padding: '11px 15px', background: 'rgba(4,8,16,0.9)', border: '1px solid var(--line)', borderRadius: 999, color: 'var(--ink)' }}
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </div>

          <div className="chips reveal" style={{ marginBottom: 26 }}>
            <button className={`chip ${active === 'all' ? 'is-active' : ''}`} onClick={() => setActive('all')}>
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`chip ${active === c.id ? 'is-active' : ''}`}
                onClick={() => setActive(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="empty"><b>No products match</b>Try another search or category.</div>
          ) : (
            <div className="grid">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={setPreview} onAdd={add} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- SUPPORT ---------- */}
      <section className="section section--tight" id="support-info">
        <div className="container">
          <div className="panel reveal">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 26 }}>
              {[
                ['Delivery', 'Cash on delivery in all 58 wilayas. 24–72h in the north, up to 5 days in the south.'],
                ['Warranty', 'Six months replacement on every accessory. No repair queues, no arguments.'],
                ['Returns', 'Seven days to change your mind — item unused, packaging intact.'],
                ['Support', `Message us any time: ${settings.phone}`],
              ].map(([title, body]) => (
                <div key={title}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', margin: '0 0 8px' }}>{title}</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.86rem', margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- QUICK VIEW ---------- */}
      {preview && (
        <div className="modal" onClick={() => setPreview(null)} role="dialog" aria-label={preview.name}>
          <div
            className="modal__panel"
            style={{ '--tone': preview.tone }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal__close" onClick={() => setPreview(null)} aria-label="Close">✕</button>
            <div className="modal__media" style={{ '--tone': preview.tone }}>
              <div style={{ width: 170, height: 220 }}>
                <Art kind={preview.art} tone={preview.tone} />
              </div>
            </div>
            <div className="modal__body">
              <span className="card__cat" style={{ '--tone': preview.tone }}>
                {CATEGORIES.find((c) => c.id === preview.categoryId)?.name}
              </span>
              <h2>{preview.name}</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                <span className="card__price" style={{ fontSize: '1.3rem' }}>{formatDA(preview.price)}</span>
                {preview.oldPrice ? <span className="card__old">{formatDA(preview.oldPrice)}</span> : null}
              </div>
              <p>{preview.description}</p>
              <ul className="modal__specs">
                {preview.specs.map((s) => <li key={s} style={{ '--tone': preview.tone }}>{s}</li>)}
              </ul>
              <button
                className="btn btn--primary btn--block"
                onClick={() => { add(preview); setPreview(null); }}
                disabled={preview.stock <= 0}
              >
                {preview.stock > 0 ? 'Add to cart' : 'Out of stock'}
              </button>
              <p style={{ fontSize: '0.78rem', color: 'var(--dim)', margin: '12px 0 0' }}>
                {preview.stock > 0 ? `${preview.stock} in stock` : 'Restocking soon'} · Cash on delivery
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
