import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { PROJECTS } from '../data/projects';

// true = clicking a live site opens it in a new browser tab (no in-page viewer, so no arrow cursor issue)
const NEW_TAB = false;
const SB = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';

// Renders the real landing page (or our own page) at 1280px and scales it down to fit the card
function Preview({ p }) {
  const box = useRef(null);
  const [s, setS] = useState(0.3);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setS(e.contentRect.width / 1280));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${p.grad}`}>
      <div className="absolute left-0 top-0 w-[1280px] h-[800px] origin-top-left overflow-hidden bg-white pointer-events-none" style={{ transform: `scale(${s})` }}>
        <iframe src={p.url} title={p.title} loading="lazy" tabIndex={-1} sandbox={SB} className="w-full h-full border-0" />
      </div>
      <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-900 shadow-sm">
        Live website
      </span>
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'radial-gradient(circle at var(--gx,50%) var(--gy,0%), rgba(255,255,255,.4), transparent 45%)' }} />
    </div>
  );
}

function Card({ p, onOpen }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    // stronger pop: lift 16px + scale 1.05 + 3D tilt
    el.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-16px) scale(1.05)`;
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };
  return (
    <button ref={ref} data-card onPointerMove={move} onPointerLeave={() => (ref.current.style.transform = '')} onClick={() => onOpen(p)}
      className="w-full h-full group relative text-left bg-white border border-amber-900/10 hover:border-amber-500/70 overflow-hidden flex flex-col shadow-sm hover:shadow-[0_30px_70px_-20px_rgba(180,83,9,0.35)] transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform">
      <Preview p={p} />
      <div className="p-6 flex-1 flex flex-col justify-between gap-4 bg-white/80">
        <div>
          <div className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-widest">{p.tag}</div>
          <h3 className="text-xl font-extrabold text-zinc-950 mt-1 group-hover:text-amber-700 transition-colors flex items-center gap-1.5">
            {p.title}<ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
          </h3>
          <p className="text-xs text-zinc-600 mt-2 line-clamp-3 leading-relaxed">{p.desc}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-100">
          {p.points.map((s) => <span key={s} className="text-[10px] font-mono px-2 py-0.5 bg-zinc-100 text-zinc-700 font-semibold">{s}</span>)}
        </div>
      </div>
    </button>
  );
}

function Viewer({ p, pos, onClose, onNav }) {
  const fr = useRef(null);
  useEffect(() => {
    const el = fr.current, on = () => document.body.classList.add('over-frame'), off = () => document.body.classList.remove('over-frame');
    if (!el) return;
    el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', off);
    return () => { el.removeEventListener('mouseenter', on); el.removeEventListener('mouseleave', off); off(); };
  }, [p]);
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onNav(1); if (e.key === 'ArrowLeft') onNav(-1); };
    addEventListener('keydown', k);
    // lock BOTH html and body so the page behind can never scroll (also stops scroll-chaining from the iframe)
    const h = document.documentElement, b = document.body, gap = innerWidth - h.clientWidth;
    h.style.overflow = b.style.overflow = 'hidden';
    b.style.paddingRight = `${gap}px`;
    return () => { removeEventListener('keydown', k); h.style.overflow = b.style.overflow = ''; b.style.paddingRight = ''; };
  }, [onClose, onNav]);
  return (
    <div onClick={onClose} className="fixed inset-0 z-[60] overscroll-contain flex items-center justify-center p-3 sm:p-6 bg-zinc-900/60 backdrop-blur-md">
      <div onClick={(e) => e.stopPropagation()} className="pop-in w-full max-w-6xl h-[92vh] bg-[#FBFBFA] border border-zinc-300 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-4 py-3 bg-zinc-100 border-b border-zinc-200 flex items-center gap-3">
          <button onClick={onClose} aria-label="Close" className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600" />
          <div className="flex bg-white border border-zinc-200 p-0.5">
            {[[-1, ChevronLeft, 'Previous project'], [1, ChevronRight, 'Next project']].map(([d, I, l]) => (
              <button key={d} onClick={() => onNav(d)} aria-label={l} className="p-1.5 text-zinc-600 hover:bg-zinc-900 hover:text-amber-400 transition"><I className="w-4 h-4" /></button>
            ))}
          </div>
          <div className="flex-1 truncate px-4 py-1 bg-white border border-zinc-200 text-xs font-mono text-zinc-600">{p.url}</div>
          {p.url && (
            <a href={p.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-zinc-950 hover:bg-amber-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors">
              Open in new tab <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-zinc-200 text-zinc-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-auto overscroll-contain bg-zinc-200/60">
          <div className={`mx-auto bg-white transition-all duration-500 ${p.url ? 'h-full' : 'min-h-full'}`}>
            <iframe data-live ref={fr} src={p.url} title={p.title} sandbox={SB} className="w-full h-full border-0" />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-zinc-200 text-xs text-zinc-600 flex flex-wrap items-center justify-between gap-2">
          <span><span className="font-mono text-zinc-400 mr-2">{pos}</span><b className="text-zinc-900">{p.title}</b>: {p.desc}</span>
          {p.url && <span className="text-zinc-500">If the page stays blank, the site blocks embedding. Use Open in new tab.</span>}
        </div>
      </div>
    </div>
  );
}

const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const CATS = ['All', 'Trust & NGO', 'Education', 'Travel'];

export default function ProjectShowcase() {
  // pinned project (Tour in India) always first; the rest get a new random order on every page load
  const [list] = useState(() => [...PROJECTS.filter((p) => p.pin), ...shuffle(PROJECTS.filter((p) => !p.pin))]);
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(null);
  const shown = list.filter((p) => cat === 'All' || p.cat === cat);
  const nav = useCallback((d) => setOpen((o) => (o === null ? o : (o + d + shown.length) % shown.length)), [shown.length]);
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-1.5 text-xs font-mono font-bold transition-all ${cat === c ? 'bg-zinc-950 text-amber-400 shadow-md' : 'bg-white/80 border border-amber-900/10 text-zinc-700 hover:border-amber-400 hover:-translate-y-0.5'}`}>{c}</button>
        ))}
      </div>
      <div key={cat} className="flex flex-wrap justify-center gap-8">
        {shown.map((p, i) => (
          <div key={p.id} className="pop-in w-full md:w-[calc(50%_-_1rem)] lg:w-[calc(33.333%_-_1.334rem)]" style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'backwards' }}>
            <Card p={p} onOpen={() => (NEW_TAB && p.url ? window.open(p.url, '_blank', 'noopener') : setOpen(i))} />
          </div>
        ))}
      </div>
      {open !== null && shown[open] && <Viewer p={shown[open]} pos={`${open + 1} / ${shown.length}`} onClose={() => setOpen(null)} onNav={nav} />}
    </>
  );
}
