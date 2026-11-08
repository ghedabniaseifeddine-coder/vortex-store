import React, { useMemo, useRef, useState } from 'react';
import { CATEGORIES, formatDA, FREE_SHIPPING_THRESHOLD } from '../data/catalog.js';
import { useStore } from '../store.jsx';

/**
 * VORTEX Assistant — the store's shopping assistant.
 * Runs fully in the browser against the live catalog (no key required), and it
 * understands English, French and Arabic product keywords from the original data.
 */

const SUGGESTIONS = ['Best seller?', 'Charger under 4000 DA', 'Livraison?', 'سماعات'];

function scoreProduct(product, q) {
  const hay = `${product.name} ${product.description} ${product.specs.join(' ')} ${product.categoryId}`.toLowerCase();
  const cat = CATEGORIES.find((c) => c.id === product.categoryId);
  const kw = cat ? cat.keywords.toLowerCase() : '';
  let score = 0;
  q.split(/\s+/).filter(Boolean).forEach((word) => {
    if (word.length < 3) return;
    if (product.name.toLowerCase().includes(word)) score += 6;
    if (hay.includes(word)) score += 2;
    if (kw.includes(word)) score += 3;
  });
  return score;
}

function reply(input, products, settings) {
  const q = input.toLowerCase().trim();
  const findCat = CATEGORIES.find(
    (c) => q.includes(c.name.toLowerCase()) || q.includes(c.id) || c.keywords.toLowerCase().split(', ').some((k) => q.includes(k))
  );

  // budget queries: "under 4000", "moins de 3000 da", "أقل من 2000"
  const budgetMatch = q.match(/(\d[\d\s.]{2,})/);
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/[\s.]/g, '')) : null;

  if (/(shipping|livraison|delivery|توصيل|توصيل|السعر للتوصيل)/.test(q)) {
    return {
      text: `Delivery is cash on delivery across all 58 wilayas.\n• Alger & Blida: 400–500 DA\n• Most northern wilayas: 600–700 DA\n• South: 900–1300 DA\n\nFree shipping on orders over ${formatDA(settings.freeShipping || FREE_SHIPPING_THRESHOLD)}.`,
    };
  }

  if (/(warranty|garantie|ضمان)/.test(q)) {
    return { text: 'Every item carries a 6-month replacement warranty. If anything fails, we swap it — no repair queues.' };
  }

  if (/(pay|paiement|payment|cod|الدفع)/.test(q)) {
    return { text: 'Payment is cash on delivery. You pay the courier only when the parcel is in your hands.' };
  }

  if (/(best|top|popular|meilleur|أفضل|mieux)/.test(q)) {
    const top = products.filter((p) => p.featured).slice(0, 3);
    return {
      text: 'Our best sellers right now:',
      items: top,
    };
  }

  if (findCat || budget) {
    let pool = findCat ? products.filter((p) => p.categoryId === findCat.id) : products;
    if (budget) pool = pool.filter((p) => p.price <= budget);
    pool = pool.sort((a, b) => a.price - b.price);
    if (!pool.length) {
      return { text: `Nothing matches that yet. Our ${findCat ? findCat.name.toLowerCase() : 'catalog'} start a bit higher — tell me your budget and I will find the closest option.` };
    }
    const label = findCat ? findCat.name : 'products';
    return {
      text: budget
        ? `${pool.length} ${label.toLowerCase()} within ${formatDA(budget)}:`
        : `Here ${pool.length === 1 ? 'is' : 'are'} our ${label.toLowerCase()}:`,
      items: pool.slice(0, 3),
    };
  }

  const scored = products
    .map((p) => ({ p, s: scoreProduct(p, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.p);

  if (scored.length) {
    return { text: `I found ${scored.length} match${scored.length > 1 ? 'es' : ''}:`, items: scored };
  }

  return {
    text: `I can help you pick from cases, chargers, audio, cables, power banks and screen protectors.\nTry: "wireless charger", "budget earbuds", or "delivery to Oran".`,
  };
}

export default function AIAssistant() {
  const { products, settings, addToCart } = useStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [log, setLog] = useState(() => [
    { from: 'bot', text: 'Hi 👋 I am the VORTEX Assistant. Tell me what you need — a case, a fast charger, earbuds — or ask about delivery.' },
  ]);
  const logRef = useRef(null);

  const send = (raw) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    const answer = reply(text, products, settings);
    setLog((prev) => [...prev, { from: 'user', text }, { from: 'bot', ...answer }]);
    setInput('');
    requestAnimationFrame(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    });
  };

  const quick = useMemo(() => SUGGESTIONS, []);

  return (
    <div className="ai">
      {open && (
        <div className="ai__panel" role="dialog" aria-label="VORTEX Assistant">
          <div className="ai__head">
            <span className="brand__mark" style={{ width: 30, height: 30, borderRadius: 9, fontSize: '0.8rem' }}>V</span>
            <div>
              <b>VORTEX Assistant</b>
              <small>Product help · delivery · sizing</small>
            </div>
            <button
              className="icon-btn"
              style={{ marginLeft: 'auto', padding: '5px 10px' }}
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
            >
              ✕
            </button>
          </div>

          <div className="ai__log" ref={logRef}>
            {log.map((m, i) => (
              <div key={i} className={`msg msg--${m.from}`}>
                {m.text}
                {m.items?.length ? (
                  <div className="ai__mini">
                    {m.items.map((p) => (
                      <button key={p.id} onClick={() => addToCart(p)}>
                        + {p.name} · {formatDA(p.price)}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="ai__suggests">
            {quick.map((s) => (
              <button key={s} onClick={() => send(s)}>{s}</button>
            ))}
          </div>

          <form
            className="ai__form"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a product…"
              aria-label="Message the assistant"
            />
            <button type="submit" aria-label="Send">↑</button>
          </form>
        </div>
      )}

      <button className="ai__launcher" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="ai__dot" />
        <span>Ask the assistant</span>
      </button>
    </div>
  );
}
