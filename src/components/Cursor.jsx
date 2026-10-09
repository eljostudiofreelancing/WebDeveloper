import { useEffect, useRef } from 'react';

// Dot = instant. Ring + 8 trail dots = smooth follow. All direct DOM (no React state, no lag).
export default function Cursor() {
  const dot = useRef(null), ring = useRef(null), trail = useRef([]);

  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return;
    let mx = -100, my = -100, rx = -100, ry = -100, raf;
    const T = trail.current.map(() => ({ x: -100, y: -100 }));

    const move = (e) => {
      document.body.classList.remove('over-frame');
      mx = e.clientX; my = e.clientY;
      dot.current.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
      const t = e.target.closest?.('[data-card]') ? 'card' : e.target.closest?.('a,button,input,textarea') ? 'link' : '';
      ring.current.dataset.s = t;
    };
    const loop = () => {
      const fr = document.querySelector('iframe[data-live]');
      if (fr && document.elementFromPoint(mx, my) === fr) document.body.classList.add('over-frame');
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      let px = rx, py = ry;
      trail.current.forEach((el, i) => {
        const t = T[i];
        t.x += (px - t.x) * 0.38; t.y += (py - t.y) * 0.38;
        el.style.transform = `translate3d(${t.x}px,${t.y}px,0) translate(-50%,-50%)`;
        px = t.x; py = t.y;
      });
      raf = requestAnimationFrame(loop);
    };
    const down = (e) => {
      const r = document.createElement('i');
      r.className = 'cur-ripple'; r.style.left = `${e.clientX}px`; r.style.top = `${e.clientY}px`;
      document.body.appendChild(r); setTimeout(() => r.remove(), 600);
    };
    // pointer enters the framed site (or leaves the window): parent stops getting events, so hide the custom cursor
    const out = (e) => { if (!e.relatedTarget || e.relatedTarget.nodeName === 'IFRAME') document.body.classList.add('over-frame'); };
    document.addEventListener('mouseout', out);
    addEventListener('pointerdown', down);
    addEventListener('pointermove', move, { passive: true });
    loop();
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerdown', down); document.removeEventListener('mouseout', out); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="cur-root pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block">
      {[...Array(8)].map((_, i) => (
        <i key={i} ref={(el) => (trail.current[i] = el)} className="fixed left-0 top-0 rounded-full bg-amber-600 will-change-transform"
          style={{ width: 10 - i, height: 10 - i, opacity: 0.45 - i * 0.05 }} />
      ))}
      <div ref={ring} className="cur-ring fixed left-0 top-0 will-change-transform"><span>Open</span></div>
      <div ref={dot} className="fixed left-0 top-0 w-2.5 h-2.5 rounded-full bg-amber-600 will-change-transform" />
    </div>
  );
}
