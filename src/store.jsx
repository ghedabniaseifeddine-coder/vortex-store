import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_PRODUCTS } from './data/catalog.js';

const KEY = 'vortex.store.v1';
const DEFAULT_PIN = '2468';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

const saved = typeof window !== 'undefined' ? load() : null;

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => saved?.products?.length ? saved.products : SEED_PRODUCTS);
  const [cart, setCart] = useState(() => (Array.isArray(saved?.cart) ? saved.cart : []));
  const [orders, setOrders] = useState(() => (Array.isArray(saved?.orders) ? saved.orders : []));
  const [settings, setSettings] = useState(() => ({
    pin: DEFAULT_PIN,
    storeName: 'VORTEX STORE',
    phone: '0555 00 00 00',
    freeShipping: 8000,
    ...(saved?.settings || {}),
  }));
  const [admin, setAdmin] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const payload = { products, cart, orders, settings };
    try {
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch {
      /* storage full / blocked — the app still works in-memory */
    }
  }, [products, cart, orders, settings]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = useCallback((message, tone = 'ok') => setToast({ message, tone, id: Date.now() }), []);

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === product.id);
      if (found) return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id: product.id, name: product.name, price: product.price, qty, art: product.art, tone: product.tone }];
    });
    setToast({ message: `${product.name} added to cart`, tone: 'ok', id: Date.now() });
  }, []);

  const setQty = useCallback((id, qty) => {
    setCart((prev) =>
      prev.flatMap((l) => (l.id === id ? (qty <= 0 ? [] : [{ ...l, qty }]) : [l]))
    );
  }, []);

  const removeFromCart = useCallback((id) => setCart((prev) => prev.filter((l) => l.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((n, l) => n + l.qty * l.price, 0), [cart]);

  const placeOrder = useCallback(
    (info) => {
      const order = {
        id: 'VX-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
        items: cart.map((l) => ({ ...l })),
        total: info.total,
        subtotal: info.subtotal,
        shipping: info.shipping,
        customer: { name: info.name, phone: info.phone, wilaya: info.wilaya, address: info.address, note: info.note },
        status: 'new',
        createdAt: Date.now(),
      };
      setOrders((prev) => [order, ...prev]);
      setProducts((prev) =>
        prev.map((p) => {
          const line = cart.find((l) => l.id === p.id);
          return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
        })
      );
      setCart([]);
      return order;
    },
    [cart]
  );

  const saveProduct = useCallback((product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev];
    });
  }, []);

  const deleteProduct = useCallback((id) => setProducts((prev) => prev.filter((p) => p.id !== id)), []);

  const setOrderStatus = useCallback(
    (id, status) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),
    []
  );

  const loginAdmin = useCallback((pin) => {
    if (pin === (saved?.settings?.pin || DEFAULT_PIN)) {
      setAdmin(true);
      return true;
    }
    return false;
  }, []);

  const value = {
    products, saveProduct, deleteProduct,
    cart, addToCart, setQty, removeFromCart, clearCart, cartCount, cartTotal,
    orders, placeOrder, setOrderStatus,
    settings, setSettings,
    admin, loginAdmin, logoutAdmin: () => setAdmin(false),
    cartOpen, setCartOpen, toast, notify,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

/* ---------- minimal history router (matches original /, /checkout, /admin) ---------- */

export function useRoute() {
  const [path, setPath] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : '/'));
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = useCallback((to) => {
    if (to === window.location.pathname) return;
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return { path, navigate };
}
