import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ExternalLink, Monitor, Smartphone, X } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import { EmberPage, FieldnotePage } from './OwnPages';

const PAGES = { ember: EmberPage, fieldnote: FieldnotePage };
const SB = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';

// Renders the real landing page (or our own page) at 1280px and scales it down to fit the card
function Preview({ p }) {
  const box = useRef(null);
  const [s, setS] = useState(0.3);
  const Page = PAGES[p.page];
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setS(e.contentRect.width / 1280));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${p.grad}`}>
      <div className="absolute left-0 top-0 w-[1280px] h-[800px] origin-top-left overflow-hidden bg-white pointer-events-none" style={{ transform: `scale(${s})` }}>
        {p.url ? <iframe src={p.url} title={p.title} loading="lazy" tabIndex={-1} sandbox={SB} className="w-full h-full border-0" /> : <Page />}
      </div>
      <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-white/95 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-900 shadow-sm">
        {p.url ? 'Live website' : 'Our concept design'}
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
      className="group relative text-left rounded-3xl bg-white border border-amber-900/10 hover:border-amber-500/70 overflow-hidden flex flex-col shadow-sm hover:shadow-[0_30px_70px_-20px_rgba(180,83,9,0.35)] transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform">
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
          {p.points.map((s) => <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-semibold">{s}</span>)}
        </div>
      </div>
    </button>
  );
}

function Viewer({ p, onClose }) {
  const [mob, setMob] = useState(false);
  const Page = PAGES[p.page];
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div onClick={onClose} className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-zinc-900/60 backdrop-blur-md">
      <div onClick={(e) => e.stopPropagation()} className="pop-in w-full max-w-6xl h-[92vh] bg-[#FBFBFA] rounded-3xl border border-zinc-300 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-4 py-3 bg-zinc-100 border-b border-zinc-200 flex items-center gap-3">
          <button onClick={onClose} aria-label="Close" className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600" />
          <div className="flex-1 truncate px-4 py-1 rounded-full bg-white border border-zinc-200 text-xs font-mono text-zinc-600">{p.url || `concept/${p.page}`}</div>
          <div className="hidden sm:flex rounded-lg bg-white border border-zinc-200 p-0.5">
            {[[false, Monitor], [true, Smartphone]].map(([m, I]) => (
              <button key={String(m)} onClick={() => setMob(m)} aria-label={m ? 'Mobile view' : 'Desktop view'}
                className={`p-1.5 rounded-md transition ${mob === m ? 'bg-zinc-900 text-amber-400' : 'text-zinc-500'}`}><I className="w-4 h-4" /></button>
            ))}
          </div>
          {p.url && (
            <a href={p.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-amber-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors">
              Open in new tab <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-auto bg-zinc-200/60">
          <div className={`mx-auto bg-white transition-all duration-500 ${p.url ? 'h-full' : 'min-h-full'} ${mob ? 'max-w-[390px] shadow-xl' : 'max-w-full'}`}>
            {p.url ? <iframe src={p.url} title={p.title} sandbox={SB} className="w-full h-full border-0" /> : <Page />}
          </div>
        </div>
        <div className="px-5 py-3 border-t border-zinc-200 text-xs text-zinc-600 flex flex-wrap items-center justify-between gap-2">
          <span><b className="text-zinc-900">{p.title}</b>: {p.desc}</span>
          {p.url && <span className="text-zinc-500">If the page stays blank, the site blocks embedding. Use Open in new tab.</span>}
        </div>
      </div>
    </div>
  );
}

export default function ProjectShowcase() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((p) => <Card key={p.id} p={p} onOpen={setOpen} />)}
      </div>
      {open && <Viewer p={open} onClose={() => setOpen(null)} />}
    </>
  );
}
