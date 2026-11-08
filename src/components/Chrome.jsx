import React, { useEffect } from 'react';
import { formatDA, categoryOf } from '../data/catalog.js';
import { useStore } from '../store.jsx';
import { Art } from './ProductCard.jsx';

const LINKS = [
  { label: 'Shop', to: '/' },
  { label: 'Cases', to: '/#catalog' },
  { label: 'Charging', to: '/#catalog' },
  { label: 'Audio', to: '/#catalog' },
  { label: 'Support', to: '/#support' },
];

export function Header({ path, navigate }) {
  const { cartCount, setCartOpen } = useStore();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a
          className="brand"
          href="/"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          aria-label="VORTEX STORE home"
        >
          <span className="brand__mark">V</span>
          <span className="brand__text">
            VORTEX
            <small>STORE</small>
          </span>
        </a>

        <nav className="nav" aria-label="Main navigation">
          {LINKS.map((l) => (
            <button
              key={l.label}
              className={path === l.to ? 'is-active' : ''}
              onClick={() => {
                if (l.to.startsWith('/#')) {
                  if (path !== '/') navigate('/');
                  requestAnimationFrame(() => {
                    document.querySelector(l.to.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  });
                } else {
                  navigate(l.to);
                }
              }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="header__actions">
          <button className="icon-btn" onClick={() => navigate('/admin')} aria-label="Store admin">
            Admin
          </button>
          <button className="icon-btn cart-pill" onClick={() => setCartOpen(true)} aria-label={`Cart, ${cartCount} items`}>
            Cart
            <span className="cart-pill__count">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function CartDrawer({ navigate }) {
  const {
    cart, cartOpen, setCartOpen, setQty, removeFromCart, cartTotal, settings,
  } = useStore();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setCartOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCartOpen]);

  const freeAt = settings.freeShipping;
  const remaining = Math.max(0, freeAt - cartTotal);

  return (
    <div className={`drawer ${cartOpen ? 'is-open' : ''}`} aria-hidden={!cartOpen}>
      <div className="drawer__scrim" onClick={() => setCartOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-label="Shopping cart">
        <div className="drawer__head">
          <h3>Your cart ({cart.length})</h3>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
        </div>

        <div className="drawer__body">
          {cart.length === 0 ? (
            <div className="empty">
              <b>Your cart is empty</b>
              Add some gear and it will show up here.
            </div>
          ) : (
            cart.map((line) => {
              const cat = categoryOf(line.categoryId || '');
              return (
                <div className="line" key={line.id}>
                  <div className="line__art" style={{ '--tone': line.tone || cat.color }}>
                    <Art kind={line.art} tone={line.tone} />
                  </div>
                  <div className="line__info">
                    <p className="line__name">{line.name}</p>
                    <span className="line__price">{formatDA(line.price)}</span>
                    <div style={{ marginTop: 8 }}>
                      <div className="qty">
                        <button onClick={() => setQty(line.id, line.qty - 1)} aria-label="Decrease quantity">−</button>
                        <span>{line.qty}</span>
                        <button onClick={() => setQty(line.id, line.qty + 1)} aria-label="Increase quantity">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="line__side">
                    <b style={{ fontSize: '0.86rem' }}>{formatDA(line.price * line.qty)}</b>
                    <button className="line__remove" onClick={() => removeFromCart(line.id)}>Remove</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="drawer__foot">
          <div className="drawer__total">
            <span style={{ color: 'var(--muted)', fontSize: '0.86rem' }}>Subtotal</span>
            <b>{formatDA(cartTotal)}</b>
          </div>
          <p className="drawer__note">
            {cart.length === 0
              ? 'Cash on delivery across 58 wilayas.'
              : remaining > 0
                ? `Add ${formatDA(remaining)} more for free shipping.`
                : 'Free shipping unlocked 🎉'}
          </p>
          <button
            className="btn btn--primary btn--block"
            disabled={cart.length === 0}
            onClick={() => { setCartOpen(false); navigate('/checkout'); }}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}

export function Footer({ navigate }) {
  return (
    <footer className="footer" id="support">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <a className="brand" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ marginBottom: 14 }}>
              <span className="brand__mark">V</span>
              <span className="brand__text">VORTEX<small>STORE</small></span>
            </a>
            <p>Premium smartphone accessories — cases, charging, audio and protection. Delivered everywhere in Algeria, cash on delivery.</p>
            <p style={{ color: 'var(--cyan)' }}>support@vortex-store.dz</p>
          </div>

          <div className="footer__col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#catalog" onClick={(e) => { e.preventDefault(); navigate('/'); }}>All products</a></li>
              <li><a href="#catalog">Cases</a></li>
              <li><a href="#catalog">Chargers</a></li>
              <li><a href="#catalog">Audio</a></li>
              <li><a href="#catalog">Power banks</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Help</h4>
            <ul>
              <li><a href="#support">Delivery &amp; returns</a></li>
              <li><a href="#support">Warranty</a></li>
              <li><a href="#support">Track my order</a></li>
              <li><a href="#support">Contact</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Store</h4>
            <ul>
              <li><a href="/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>Admin panel</a></li>
              <li><a href="/checkout" onClick={(e) => { e.preventDefault(); navigate('/checkout'); }}>Checkout</a></li>
              <li>Cash on delivery</li>
              <li>58 wilayas covered</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} VORTEX STORE — Smartphone accessories.</span>
          <div className="footer__pay">
            <span>COD</span>
            <span>Yalidine</span>
            <span>ZR Express</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="toast" role="status" key={toast.id}>
      <i>✓</i>
      {toast.message}
    </div>
  );
}
