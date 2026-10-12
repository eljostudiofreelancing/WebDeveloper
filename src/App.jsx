import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Boxes, Compass, Globe2, Monitor, Phone, Send, Smartphone, Sparkles, TrendingUp } from 'lucide-react';
import Cursor from './components/Cursor';
import ProjectShowcase from './components/ProjectShowcase';

const BRAND = 'Studio';            // rename here
const PHONE = '918610876188';      // WhatsApp number with country code
const CALL = '917550319417';       // number used by the call buttons
const WA = (t) => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;

/* Same cream base, now alive: drifting glows + moving grid + glow that follows the mouse */
function LivingBackground() {
  const glow = useRef(null);
  useEffect(() => {
    const m = (e) => { glow.current.style.transform = `translate3d(${e.clientX - 250}px,${e.clientY - 250}px,0)`; };
    addEventListener('pointermove', m, { passive: true });
    return () => removeEventListener('pointermove', m);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#F5F4F0]">
      <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-300/50 via-orange-300/30 to-transparent blur-[110px] animate-aurora-slow" />
      <div className="absolute top-[35%] -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-rose-200/50 via-amber-200/40 to-transparent blur-[130px] animate-aurora-reverse" />
      <div className="absolute -bottom-40 left-[20%] w-[800px] h-[600px] rounded-full bg-gradient-to-tr from-amber-400/30 via-yellow-200/35 to-transparent blur-[120px] animate-aurora-drift" />
      <div className="absolute inset-0 opacity-[0.25] mix-blend-multiply animate-grid"
        style={{ backgroundImage: 'linear-gradient(to right,rgba(180,83,9,.15) 1px,transparent 1px),linear-gradient(to bottom,rgba(180,83,9,.15) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      <div ref={glow} className="absolute left-0 top-0 w-[500px] h-[500px] rounded-full bg-amber-300/25 blur-3xl transition-transform duration-300 ease-out" />
    </div>
  );
}

function ScrollBar() {
  const ref = useRef(null);
  useEffect(() => {
    const f = () => { ref.current.style.transform = `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`; };
    addEventListener('scroll', f, { passive: true }); f();
    return () => removeEventListener('scroll', f);
  }, []);
  return <div ref={ref} className="fixed top-0 left-0 right-0 h-[3px] z-[80] origin-left scale-x-0 bg-gradient-to-r from-amber-500 to-orange-600" />;
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`transition-all duration-700 ease-out ${on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>{children}</div>;
}

function HeroStack() {
  const ref = useRef(null);
  const cards = [
    ['Landing pages', 'Clear first impression', 'top-2 left-4 w-64', 70],
    ['Enquiry forms', 'Opens WhatsApp, pre-filled', 'top-36 right-0 w-64', 130],
    ['Phone-first layouts', 'Built for small screens', 'bottom-4 left-14 w-64', 30],
  ];
  return (
    <div className="hidden lg:block [perspective:1100px]"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; ref.current.style.transform = `rotateY(${x * 24}deg) rotateX(${-y * 24}deg)`; }}
      onPointerLeave={() => (ref.current.style.transform = '')}>
      <div ref={ref} className="relative h-[420px] [transform-style:preserve-3d] transition-transform duration-200 ease-out">
        {cards.map(([t, s, pos, z], i) => (
          <div key={t} className={`absolute ${pos}`} style={{ transform: `translateZ(${z}px)` }}>
            <div className="animate-float bg-white/90 backdrop-blur border border-amber-900/10 shadow-xl p-5" style={{ animationDelay: `${-i * 1.6}s` }}>
              <b className="text-sm text-zinc-950">{t}</b>
              <p className="text-xs text-zinc-500 mt-1">{s}</p>
              <div className="mt-4 h-2 w-2/3 bg-amber-200" /><div className="mt-2 h-2 w-1/2 bg-zinc-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CallFab() {
  return (
    <a href={`tel:+${CALL}`} aria-label="Call us" className="group fixed bottom-24 right-6 z-[70] flex items-center gap-3">
      <span className="hidden sm:block px-4 py-2 bg-zinc-950 text-white text-xs font-mono font-bold opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition">Call us</span>
      <span className="grid place-items-center w-14 h-14 rounded-full bg-zinc-950 text-amber-400 shadow-xl transition-all group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-zinc-950"><Phone className="w-6 h-6" /></span>
    </a>
  );
}

function WhatsAppFab() {
  return (
    <a href={WA('Hi, I saw your portfolio and would like to discuss a website.')} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-[70] flex items-center gap-3">
      <span className="hidden sm:block px-4 py-2 bg-zinc-950 text-white text-xs font-mono font-bold opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition">Chat with us</span>
      <span className="relative grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl transition-transform group-hover:scale-110">
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
        <svg viewBox="0 0 24 24" className="relative w-7 h-7 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
      </span>
    </a>
  );
}

const SERVICES = [
  [Monitor, 'Websites for organisations', 'Clear multi-page sites for trusts, institutes and small businesses that explain what you do and how to reach you.'],
  [Sparkles, 'Landing pages', 'Single focused pages for a course, a package or a campaign, written to turn visitors into enquiries.'],
  [Smartphone, 'Phone-first design', 'Layouts planned for small screens first, because that is where most of your visitors will open them.'],
  [TrendingUp, 'SEO basics', 'Page titles, descriptions and headings set up so search engines can tell what each page is about.'],
];
const TYPES = ['Business website', 'Trust or NGO website', 'Landing page', 'Something else'];

export default function App() {
  const [f, setF] = useState({ name: '', type: TYPES[0], msg: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = (e) => { e.preventDefault(); window.open(WA(`Hi, I'm ${f.name}. I need a ${f.type.toLowerCase()}. ${f.msg}`), '_blank'); };
  const field = 'w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-400';

  return (
    <div className="min-h-screen text-zinc-900 font-sans selection:bg-amber-600 selection:text-white antialiased relative">
      <Cursor />
      <ScrollBar />
      <LivingBackground />
      <WhatsAppFab />
      <CallFab />

      <header className="sticky top-0 z-40 bg-[#F5F4F0]/80 backdrop-blur-xl border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <span className="w-10 h-10 bg-zinc-950 grid place-items-center shadow-md"><Boxes className="w-5 h-5 text-amber-400" /></span>
            <span className="font-black tracking-tight text-lg text-zinc-950">{BRAND}</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600">
            {['Work', 'Services', 'Contact'].map((n) => <a key={n} href={`#${n.toLowerCase()}`} className="hover:text-amber-700 transition-colors">{n}</a>)}
          </nav>
          <a href={WA('Hi, I would like to discuss a website.')} target="_blank" rel="noreferrer"
            className="px-5 py-2.5 bg-zinc-950 hover:bg-amber-600 text-white text-sm font-semibold transition-all shadow-md flex items-center gap-2">
            WhatsApp us <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      <section id="top" className="relative z-10 max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-20 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 leading-[1.05]">Websites that explain what you do and bring in enquiries.</h1>
          <p className="text-base sm:text-lg text-zinc-700 leading-relaxed max-w-xl">We design and build websites for trusts, institutes, travel companies and small businesses. Open any project below to see its real landing page.</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a href="#work" className="px-7 py-3.5 bg-zinc-950 hover:bg-amber-600 text-white text-sm font-semibold transition-all shadow-xl flex items-center gap-2">See our work <ArrowRight className="w-4 h-4" /></a>
            <a href={WA('Hi, I saw your portfolio and would like to discuss a website.')} target="_blank" rel="noreferrer" className="px-7 py-3.5 bg-white/90 hover:bg-white border border-amber-900/15 text-zinc-800 text-sm font-semibold transition-all">Chat on WhatsApp</a>
          </div>
        </div>
        <HeroStack />
      </section>

      <section id="work" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-amber-900/10">
        <Reveal className="mb-14">
          <div className="text-amber-800 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Compass className="w-4 h-4" />Selected work</div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 mt-2">Five projects. Open any of them.</h2>
          <p className="text-zinc-600 text-sm mt-2 max-w-xl">Each card shows the project's real landing page. Click to browse it in full, switch to the phone view, or open it in a new tab.</p>
        </Reveal>
        <ProjectShowcase />
      </section>

      <section id="services" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-amber-900/10">
        <Reveal className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950">What we build</h2>
          <p className="text-zinc-600 text-sm mt-2 max-w-xl">Simple, fast-loading sites with a clear way for visitors to get in touch.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map(([Icon, t, d], i) => (
            <Reveal key={t}>
              <div className="h-full p-7 bg-white/90 border border-amber-900/10 shadow-sm hover:border-amber-400 hover:-translate-y-2 hover:shadow-xl transition-all duration-300" style={{ transitionDelay: `${i * 40}ms` }}>
                <span className="w-11 h-11 bg-amber-500/15 text-amber-800 grid place-items-center mb-5"><Icon className="w-5 h-5" /></span>
                <h3 className="font-bold text-zinc-950 mb-2">{t}</h3>
                <p className="text-zinc-600 text-xs leading-relaxed">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <Reveal>
          <div className="p-8 sm:p-12 bg-zinc-950 text-white shadow-2xl grid md:grid-cols-2 gap-10">
            <div>
              <Globe2 className="w-6 h-6 text-amber-400" />
              <h2 className="text-3xl font-extrabold tracking-tight mt-3">Tell us what you need</h2>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">Fill in the form and it opens WhatsApp with your message ready to send. You can also call us directly.</p>
              <a href={`tel:+${CALL}`} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-amber-500 hover:text-zinc-950 text-amber-400 text-sm font-bold transition-colors"><Phone className="w-4 h-4" />Call us</a>
            </div>
            <form onSubmit={send} className="space-y-3">
              <input required value={f.name} onChange={set('name')} placeholder="Your name" className={field} />
              <select value={f.type} onChange={set('type')} className={field}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
              <textarea rows="3" required value={f.msg} onChange={set('msg')} placeholder="What should the website do for you?" className={`${field} resize-none`} />
              <button type="submit" className="w-full px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold transition-colors shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"><Send className="w-4 h-4" />Send on WhatsApp</button>
            </form>
          </div>
        </Reveal>
      </section>

      <footer className="relative z-10 border-t border-amber-900/10 py-8 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
        <span>© {new Date().getFullYear()} {BRAND}. All rights reserved.</span>
        <a href={`tel:+${CALL}`} className="font-semibold text-zinc-900 hover:text-amber-700 transition-colors">Call us</a>
      </footer>
    </div>
  );
}
