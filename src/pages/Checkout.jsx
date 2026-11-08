import React, { useMemo, useState } from 'react';
import { WILAYAS, formatDA } from '../data/catalog.js';
import { useStore } from '../store.jsx';

export default function Checkout({ navigate }) {
  const { cart, cartTotal, settings, placeOrder, setQty, removeFromCart } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', wilaya: '16', address: '', note: '' });
  const [errors, setErrors] = useState({});
  const [placed, setPlaced] = useState(null);

  const wilaya = useMemo(() => WILAYAS.find((w) => w.code === form.wilaya) || WILAYAS[0], [form.wilaya]);
  const freeAt = settings.freeShipping || 8000;
  const shipping = cartTotal >= freeAt ? 0 : wilaya.fee;
  const total = cartTotal + shipping;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 3) next.name = 'Enter your full name.';
    const phone = form.phone.replace(/[\s.-]/g, '');
    if (!/^0[5-7]\d{8}$/.test(phone)) next.phone = 'Enter a valid Algerian mobile (e.g. 0555 12 34 56).';
    if (form.address.trim().length < 8) next.address = 'Add a full delivery address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const order = placeOrder({
      name: form.name.trim(),
      phone: form.phone.trim(),
      wilaya: `${wilaya.code} — ${wilaya.name}`,
      address: form.address.trim(),
      note: form.note.trim(),
      subtotal: cartTotal,
      shipping,
      total,
    });
    setPlaced(order);
  };

  if (placed) {
    return (
      <section className="checkout">
        <div className="container">
          <div className="panel order-ok" style={{ maxWidth: 560, margin: '0 auto' }}>
            <div className="order-ok__mark">✓</div>
            <h2>Order confirmed</h2>
            <p>Thanks {placed.customer.name.split(' ')[0]} — we will call you to confirm delivery.</p>
            <code>{placed.id}</code>
            <div className="summary__row"><span>Items</span><b>{placed.items.reduce((n, l) => n + l.qty, 0)}</b></div>
            <div className="summary__row"><span>Delivery to</span><b>{placed.customer.wilaya}</b></div>
            <div className="summary__row summary__row--total"><span>Total to pay</span><b>{formatDA(placed.total)}</b></div>
            <button className="btn btn--primary btn--block" style={{ marginTop: 20 }} onClick={() => navigate('/')}>
              Continue shopping
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="checkout">
        <div className="container">
          <div className="panel empty" style={{ maxWidth: 520, margin: '0 auto' }}>
            <b>Your cart is empty</b>
            Add some gear and it will show up here.
            <div style={{ marginTop: 18 }}>
              <button className="btn btn--primary" onClick={() => navigate('/')}>Browse products</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="container">
        <span className="eyebrow">Checkout</span>
        <h1 className="section__title" style={{ marginBottom: 24 }}>Delivery details</h1>

        <div className="checkout__grid">
          <form className="panel" onSubmit={submit} noValidate>
            <h2>Where should we send it?</h2>
            <p className="panel__hint">Cash on delivery — you pay the courier when the parcel arrives.</p>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" value={form.name} onChange={set('name')} placeholder="Amine Bensalem" autoComplete="name" />
                {errors.name && <span className="field__err">{errors.name}</span>}
              </div>

              <div className="field">
                <label htmlFor="phone">Mobile phone</label>
                <input id="phone" value={form.phone} onChange={set('phone')} placeholder="0555 12 34 56" inputMode="tel" autoComplete="tel" />
                {errors.phone && <span className="field__err">{errors.phone}</span>}
              </div>

              <div className="field field--full">
                <label htmlFor="wilaya">Wilaya</label>
                <select id="wilaya" value={form.wilaya} onChange={set('wilaya')}>
                  {WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} — {w.name} ({formatDA(w.fee)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field field--full">
                <label htmlFor="address">Delivery address</label>
                <input id="address" value={form.address} onChange={set('address')} placeholder="Street, building, landmark" autoComplete="street-address" />
                {errors.address && <span className="field__err">{errors.address}</span>}
              </div>

              <div className="field field--full">
                <label htmlFor="note">Note (optional)</label>
                <textarea id="note" value={form.note} onChange={set('note')} placeholder="Colour preference, delivery time…" />
              </div>
            </div>

            <button className="btn btn--primary btn--block" style={{ marginTop: 22 }} type="submit">
              Confirm order · {formatDA(total)}
            </button>
          </form>

          <aside className="panel summary">
            <h2>Order summary</h2>
            <p className="panel__hint">{cart.reduce((n, l) => n + l.qty, 0)} items</p>

            <div className="summary__items">
              {cart.map((line) => (
                <div className="summary__row" key={line.id} style={{ alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span className="qty" style={{ flexShrink: 0 }}>
                      <button type="button" onClick={() => setQty(line.id, line.qty - 1)} aria-label="Decrease">−</button>
                      <span>{line.qty}</span>
                      <button type="button" onClick={() => setQty(line.id, line.qty + 1)} aria-label="Increase">+</button>
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{line.name}</span>
                  </span>
                  <b style={{ flexShrink: 0 }}>{formatDA(line.price * line.qty)}</b>
                  <button type="button" className="line__remove" onClick={() => removeFromCart(line.id)} aria-label={`Remove ${line.name}`}>✕</button>
                </div>
              ))}
            </div>

            <div className="summary__row"><span>Subtotal</span><b>{formatDA(cartTotal)}</b></div>
            <div className="summary__row">
              <span>Delivery · {wilaya.name}</span>
              <b>{shipping === 0 ? 'Free' : formatDA(shipping)}</b>
            </div>
            <div className="summary__row summary__row--total"><span>Total</span><b>{formatDA(total)}</b></div>

            <p style={{ color: 'var(--dim)', fontSize: '0.78rem', margin: '14px 0 0' }}>
              Free delivery over {formatDA(freeAt)}. Orders are confirmed by phone before dispatch.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
