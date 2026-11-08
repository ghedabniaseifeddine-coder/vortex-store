import React, { useEffect, useRef } from 'react';
import './scene.css';

/**
 * Showroom3D — the cinematic 3D world behind the store.
 *
 * Design notes:
 *  - Pure CSS 3D (perspective + preserve-3d) instead of a WebGL runtime: no extra
 *    payload, works on low-end Android, and can never block the shop UI.
 *  - Every layer is aria-hidden and pointer-events:none, so navigation, buttons,
 *    product cards, cart and admin keep working exactly as before.
 *  - Objects are parked at the screen edges and sit behind the content scrim, so
 *    text, prices and CTAs stay fully readable.
 *  - Scroll + pointer parallax is written to CSS custom properties inside a single
 *    rAF loop (no React re-render per frame).
 *  - `data-perf="low"` (small screens / weak CPUs / reduced motion) trims the
 *    object count, blur radius and animation cost.
 */

const DEVICES = [
  { kind: 'phone', x: '6%', y: '16%', depth: -180, scale: 1, rotate: -16, float: '0s', parallax: 0.10, big: true, tone: '#2ee6ff' },
  { kind: 'case', x: '84%', y: '10%', depth: -260, scale: 0.92, rotate: 14, float: '-3s', parallax: 0.16, big: true, tone: '#b8ff2c' },
  { kind: 'charger', x: '76%', y: '58%', depth: -120, scale: 0.8, rotate: -8, float: '-6s', parallax: 0.22, big: true, tone: '#2ee6ff' },
  { kind: 'audio', x: '12%', y: '66%', depth: -320, scale: 0.85, rotate: 10, float: '-9s', parallax: 0.14, big: true, tone: '#ff3d8b' },
  { kind: 'power', x: '92%', y: '34%', depth: -420, scale: 0.62, rotate: -12, float: '-2s', parallax: 0.26, big: false, tone: '#ffb02e' },
  { kind: 'cable', x: '3%', y: '42%', depth: -480, scale: 0.6, rotate: 18, float: '-7s', parallax: 0.20, big: false, tone: '#7affd9' },
  { kind: 'screen', x: '68%', y: '86%', depth: -520, scale: 0.55, rotate: -20, float: '-4s', parallax: 0.30, big: false, tone: '#6fa8ff' },
];

function DeviceArt({ kind }) {
  switch (kind) {
    case 'phone':
      return (
        <div className="mesh mesh--phone">
          <div className="phone__body">
            <span className="phone__edge phone__edge--l" />
            <span className="phone__edge phone__edge--r" />
            <div className="phone__screen">
              <div className="phone__wallpaper" />
              <div className="phone__island" />
              <div className="phone__ui">
                <span /><span /><span />
              </div>
              <div className="phone__sheen" />
            </div>
          </div>
          <div className="mesh__shadow" />
        </div>
      );
    case 'case':
      return (
        <div className="mesh mesh--case">
          <div className="case__body">
            <div className="case__back" />
            <div className="case__camera">
              <i /><i /><i />
            </div>
            <div className="case__ring" />
            <div className="case__gloss" />
          </div>
          <div className="mesh__shadow" />
        </div>
      );
    case 'charger':
      return (
        <div className="mesh mesh--charger">
          <div className="charger__pad">
            <div className="charger__rings" />
            <div className="charger__led" />
            <div className="charger__gloss" />
          </div>
          <div className="mesh__shadow" />
        </div>
      );
    case 'audio':
      return (
        <div className="mesh mesh--audio">
          <div className="buds__case">
            <div className="buds__lid" />
            <div className="buds__seam" />
            <div className="buds__led" />
          </div>
          <div className="buds__bud buds__bud--a" />
          <div className="buds__bud buds__bud--b" />
          <div className="mesh__shadow" />
        </div>
      );
    case 'power':
      return (
        <div className="mesh mesh--power">
          <div className="power__slab">
            <div className="power__leds"><i /><i /><i /><i /></div>
            <div className="power__port" />
            <div className="power__gloss" />
          </div>
          <div className="mesh__shadow" />
        </div>
      );
    case 'cable':
      return (
        <div className="mesh mesh--cable">
          <div className="cable__loop" />
          <div className="cable__loop cable__loop--inner" />
          <div className="cable__plug cable__plug--a" />
          <div className="cable__plug cable__plug--b" />
          <div className="mesh__shadow" />
        </div>
      );
    case 'screen':
      return (
        <div className="mesh mesh--screen">
          <div className="glass__sheet">
            <div className="glass__shine" />
            <div className="glass__edge" />
          </div>
          <div className="mesh__shadow" />
        </div>
      );
    default:
      return null;
  }
}

export default function Showroom3D() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const low = reduced || window.innerWidth < 760 || cores <= 4;
    el.dataset.perf = low ? 'low' : 'high';

    if (reduced) {
      el.style.setProperty('--sy', '0px');
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
      return;
    }

    let raf = 0;
    let scrollY = window.scrollY || 0;
    let mx = 0;
    let my = 0;
    let targetMx = 0;
    let targetMy = 0;

    const onScroll = () => { scrollY = window.scrollY || 0; };
    const onMove = (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetMx = (e.clientX / w - 0.5) * 2;
      targetMy = (e.clientY / h - 0.5) * 2;
    };

    const tick = () => {
      mx += (targetMx - mx) * 0.06;
      my += (targetMy - my) * 0.06;
      el.style.setProperty('--sy', `${Math.min(scrollY, 4000)}px`);
      el.style.setProperty('--mx', `${(mx * 26).toFixed(2)}px`);
      el.style.setProperty('--my', `${(my * 18).toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className="scene" ref={ref} aria-hidden="true">
      {/* depth 0 — deep space */}
      <div className="scene__sky" />
      <div className="scene__aurora" />

      {/* depth 1 — volumetric lighting */}
      <div className="scene__beams">
        <span className="beam beam--a" />
        <span className="beam beam--b" />
        <span className="beam beam--c" />
      </div>

      {/* depth 2 — showroom room: perspective floor + back wall */}
      <div className="scene__room">
        <div className="room__backwall" />
        <div className="room__floor">
          <div className="room__grid" />
          <div className="room__reflect" />
        </div>
        <div className="room__horizon" />
      </div>

      {/* depth 3 — floating product meshes */}
      <div className="scene__objects">
        {DEVICES.map((d) => (
          <div
            key={d.kind}
            className={`obj obj--${d.kind}${d.big ? '' : ' obj--sm'}`}
            style={{
              '--x': d.x,
              '--y': d.y,
              '--z': `${d.depth}px`,
              '--s': d.scale,
              '--r': `${d.rotate}deg`,
              '--float': d.float,
              '--pf': d.parallax,
              '--tone': d.tone,
            }}
          >
            <DeviceArt kind={d.kind} />
          </div>
        ))}
      </div>

      {/* depth 4 — atmosphere */}
      <div className="scene__dust">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
      <div className="scene__bloom" />
      <div className="scene__vignette" />
      <div className="scene__grain" />
    </div>
  );
}
