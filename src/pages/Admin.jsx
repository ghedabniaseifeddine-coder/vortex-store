import React, { useMemo, useState } from 'react';
import { CATEGORIES, formatDA, categoryOf } from '../data/catalog.js';
import { useStore } from '../store.jsx';

const STATUSES = [
  { id: 'new', label: 'New' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'done', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

const emptyDraft = () => ({
  id: '',
  name: '',
  categoryId: 'cases',
  price: '',
  oldPrice: '',
  cost: '',
  stock: '',
  description: '',
  specs: '',
  art: 'case',
  tone: '#2ee6ff',
  featured: false,
});

function Gate() {
  const { loginAdmin, notify } = useStore();
  const [pin, setPin] = useState('');

  return (
    <section className="admin">
      <div className="container">
        <form
          className="panel admin__gate"
          onSubmit={(e) => {
            e.preventDefault();
            if (loginAdmin(pin.trim())) {
              notify('Welcome back, admin');
            } else {
              notify('Wrong PIN');
            }
          }}
        >
          <span className="brand__mark">V</span>
          <h2 style={{ marginBottom: 6 }}>Admin panel</h2>
          <p className="panel__hint">Enter your store PIN to manage products and orders.</p>
          <div className="field">
            <label htmlFor="pin">Admin PIN</label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              inputMode="numeric"
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn--primary btn--block" style={{ marginTop: 18 }} type="submit">
            Unlock dashboard
          </button>
          <p style={{ color: 'var(--dim)', fontSize: '0.76rem', marginTop: 14 }}>
            Default PIN is 2468 — change it in Settings.
          </p>
        </form>
      </div>
    </section>
  );
}

export default function Admin({ navigate }) {
  const {
    admin, logoutAdmin, products, saveProduct, deleteProduct,
    orders, setOrderStatus, settings, setSettings, notify,
  } = useStore();

  const [tab, setTab] = useState('overview');
  const [draft, setDraft] = useState(null);

  const revenue = useMemo(
    () => orders.filter((o) => o.status !== 'cancelled').reduce((n, o) => n + o.total, 0),
    [orders]
  );
  const lowStock = useMemo(() => products.filter((p) => p.stock <= 5), [products]);

  if (!admin) return <Gate />;

  const startNew = () => setDraft(emptyDraft());
  const startEdit = (p) =>
    setDraft({ ...p, price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : '', cost: String(p.cost), stock: String(p.stock), specs: p.specs.join(' | ') });

  const submitDraft = (e) => {
    e.preventDefault();
    const price = Number(draft.price) || 0;
    if (!draft.name.trim() || price <= 0) {
      notify('Name and a price above 0 are required');
      return;
    }
    const cat = categoryOf(draft.categoryId);
    const product = {
      id: draft.id || 'p' + Date.now().toString(36),
      name: draft.name.trim(),
      categoryId: draft.categoryId,
      price,
      oldPrice: Number(draft.oldPrice) > price ? Number(draft.oldPrice) : null,
      cost: Number(draft.cost) || 0,
      stock: Math.max(0, Number(draft.stock) || 0),
      featured: !!draft.featured,
      createdAt: draft.createdAt || Date.now(),
      art: cat.art,
      tone: draft.tone || cat.color,
      description: draft.description.trim(),
      specs: draft.specs.split('|').map((s) => s.trim()).filter(Boolean),
    };
    saveProduct(product);
    notify(draft.id ? 'Product updated' : 'Product added');
    setDraft(null);
  };

  return (
    <section className="admin">
      <div className="container">
        <div className="admin__head">
          <div>
            <span className="eyebrow">Store admin</span>
            <h1>{settings.storeName}</h1>
          </div>
          <div className="row-actions">
            <button className="btn btn--sm btn--ghost" onClick={() => navigate('/')}>View store</button>
            <button className="btn btn--sm" onClick={logoutAdmin}>Lock</button>
          </div>
        </div>

        <div className="tabs">
          {[
            ['overview', 'Overview'],
            ['products', 'Products'],
            ['orders', `Orders (${orders.length})`],
            ['settings', 'Settings'],
          ].map(([id, label]) => (
            <button key={id} className={`tab ${tab === id ? 'is-active' : ''}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            <div className="stat-cards">
              <div className="stat-card"><span>Revenue</span><b>{formatDA(revenue)}</b></div>
              <div className="stat-card"><span>Orders</span><b>{orders.length}</b></div>
              <div className="stat-card"><span>Products</span><b>{products.length}</b></div>
              <div className="stat-card"><span>Low stock</span><b>{lowStock.length}</b></div>
            </div>

            <div className="panel">
              <h2>Recent orders</h2>
              <p className="panel__hint">Latest activity across the store.</p>
              {orders.length === 0 ? (
                <div className="empty"><b>No orders yet</b>Orders will appear here as customers check out.</div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Order</th><th>Customer</th><th>Wilaya</th><th>Total</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 6).map((o) => (
                        <tr key={o.id}>
                          <td><code style={{ color: 'var(--cyan)' }}>{o.id}</code></td>
                          <td>{o.customer.name}</td>
                          <td>{o.customer.wilaya}</td>
                          <td>{formatDA(o.total)}</td>
                          <td><span className={`pill pill--${o.status}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'products' && (
          <div className="panel">
            <div className="admin__head" style={{ marginBottom: 16 }}>
              <div>
                <h2 style={{ margin: 0 }}>Products</h2>
                <p className="panel__hint" style={{ margin: 0 }}>{products.length} items in the catalog</p>
              </div>
              <button className="btn btn--sm btn--primary" onClick={startNew}>+ Add product</button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th></th></tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <b style={{ fontWeight: 600 }}>{p.name}</b>
                        <div style={{ color: 'var(--dim)', fontSize: '0.76rem' }}>{p.id}</div>
                      </td>
                      <td>{categoryOf(p.categoryId).name}</td>
                      <td>{formatDA(p.price)}</td>
                      <td>
                        {p.stock <= 5
                          ? <span className="pill pill--low">{p.stock}</span>
                          : p.stock}
                      </td>
                      <td>{p.featured ? '★' : '—'}</td>
                      <td>
                        <div className="row-actions">
                          <button className="mini-btn" onClick={() => startEdit(p)}>Edit</button>
                          <button
                            className="mini-btn mini-btn--danger"
                            onClick={() => {
                              if (confirm(`Delete ${p.name}?`)) {
                                deleteProduct(p.id);
                                notify('Product deleted');
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="panel">
            <h2>Orders</h2>
            <p className="panel__hint">Update the fulfilment status as parcels move.</p>
            {orders.length === 0 ? (
              <div className="empty"><b>No orders yet</b>Place a test order from the storefront to see it here.</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Order</th><th>Customer</th><th>Phone</th><th>Items</th><th>Total</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td><code style={{ color: 'var(--cyan)' }}>{o.id}</code></td>
                        <td>
                          {o.customer.name}
                          <div style={{ color: 'var(--dim)', fontSize: '0.76rem' }}>{o.customer.wilaya}</div>
                        </td>
                        <td>{o.customer.phone}</td>
                        <td>{o.items.reduce((n, l) => n + l.qty, 0)}</td>
                        <td>{formatDA(o.total)}</td>
                        <td>
                          <select
                            value={o.status}
                            onChange={(e) => { setOrderStatus(o.id, e.target.value); notify('Order updated'); }}
                            style={{ background: 'rgba(4,8,16,0.9)', border: '1px solid var(--line)', borderRadius: 8, padding: '6px 9px', color: 'var(--ink)', fontSize: '0.8rem' }}
                          >
                            {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <form
            className="panel"
            style={{ maxWidth: 620 }}
            onSubmit={(e) => {
              e.preventDefault();
              notify('Settings saved');
            }}
          >
            <h2>Store settings</h2>
            <p className="panel__hint">These values apply instantly across the storefront.</p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="storeName">Store name</label>
                <input id="storeName" value={settings.storeName} onChange={(e) => setSettings((s) => ({ ...s, storeName: e.target.value }))} />
              </div>
              <div className="field">
                <label htmlFor="phone">Support phone</label>
                <input id="phone" value={settings.phone} onChange={(e) => setSettings((s) => ({ ...s, phone: e.target.value }))} />
              </div>
              <div className="field">
                <label htmlFor="freeShip">Free shipping over (DA)</label>
                <input id="freeShip" type="number" value={settings.freeShipping} onChange={(e) => setSettings((s) => ({ ...s, freeShipping: Number(e.target.value) || 0 }))} />
              </div>
              <div className="field">
                <label htmlFor="pinNew">Admin PIN</label>
                <input id="pinNew" value={settings.pin} onChange={(e) => setSettings((s) => ({ ...s, pin: e.target.value }))} />
              </div>
            </div>
            <button className="btn btn--primary" style={{ marginTop: 20 }} type="submit">Save settings</button>
          </form>
        )}

        {draft && (
          <div className="modal" onClick={() => setDraft(null)}>
            <form className="modal__panel" style={{ gridTemplateColumns: '1fr' }} onClick={(e) => e.stopPropagation()} onSubmit={submitDraft}>
              <div className="modal__body">
                <h2 style={{ marginTop: 0 }}>{draft.id ? 'Edit product' : 'New product'}</h2>

                <div className="form-grid">
                  <div className="field field--full">
                    <label htmlFor="pname">Name</label>
                    <input id="pname" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="pcat">Category</label>
                    <select id="pcat" value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>
                      {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="pstock">Stock</label>
                    <input id="pstock" type="number" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="pprice">Price (DA)</label>
                    <input id="pprice" type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="pold">Old price (optional)</label>
                    <input id="pold" type="number" value={draft.oldPrice} onChange={(e) => setDraft({ ...draft, oldPrice: e.target.value })} />
                  </div>
                  <div className="field field--full">
                    <label htmlFor="pdesc">Description</label>
                    <textarea id="pdesc" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
                  </div>
                  <div className="field field--full">
                    <label htmlFor="pspecs">Specs (separate with |)</label>
                    <input id="pspecs" value={draft.specs} onChange={(e) => setDraft({ ...draft, specs: e.target.value })} placeholder="Material: TPU | Drop protection: 2 m" />
                  </div>
                  <div className="field">
                    <label htmlFor="pfeatured">Featured</label>
                    <select id="pfeatured" value={draft.featured ? 'yes' : 'no'} onChange={(e) => setDraft({ ...draft, featured: e.target.value === 'yes' })}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>

                <div className="row-actions" style={{ marginTop: 20 }}>
                  <button className="btn btn--primary" type="submit">{draft.id ? 'Save changes' : 'Add product'}</button>
                  <button className="btn btn--ghost" type="button" onClick={() => setDraft(null)}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
