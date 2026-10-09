import { useState } from 'react';

/* ---------- Page 1: Ember (restaurant) ---------- */
const MENU = {
  Starters: [['Smoked brinjal bharta', '₹320'], ['Charred corn ribs', '₹290'], ['Coal-roasted paneer', '₹380']],
  Mains: [['Wood-fired lamb chops', '₹890'], ['Tiger prawns, Kerala style', '₹760'], ['Smoked jackfruit biryani', '₹520']],
  Desserts: [['Burnt jaggery custard', '₹260'], ['Cardamom basque cheesecake', '₹310'], ['Filter coffee tiramisu', '₹290']],
};
const SLOTS = ['6:30 pm', '7:30 pm', '8:30 pm', '9:30 pm'];
const flame = 'absolute rounded-[50%_50%_45%_45%/65%_65%_35%_35%] animate-float';

export function EmberPage() {
  const [tab, setTab] = useState('Starters');
  const [n, setN] = useState(2);
  const [slot, setSlot] = useState(SLOTS[1]);
  const [done, setDone] = useState(false);
  return (
    <div className="bg-[#f6efe6] text-[#2b1d14]">
      <nav className="flex items-center justify-between px-8 py-5 text-sm">
        <b className="font-serif text-2xl">Ember</b><span className="opacity-60">Menu, bookings, find us</span>
      </nav>
      <div className="grid md:grid-cols-2 gap-10 px-8 sm:px-12 py-8 items-center">
        <div>
          <h2 className="font-serif text-5xl sm:text-6xl leading-[1.02]">Dinner cooked over open fire.</h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-70">Seasonal produce from nearby farms, roasted over wood and coal, served at one long shared table.</p>
        </div>
        <div className="relative h-64 grid place-items-center">
          <div className={`${flame} w-44 h-56 bg-gradient-to-t from-red-700 via-orange-500 to-amber-300`} />
          <div className={`${flame} w-24 h-32 bg-gradient-to-t from-orange-500 to-yellow-100 [animation-delay:-2s]`} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 px-8 sm:px-12 pb-12">
        <div>
          <div className="flex gap-2 mb-4">
            {Object.keys(MENU).map((k) => (
              <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${tab === k ? 'bg-[#2b1d14] text-[#f6efe6]' : 'bg-white/70 hover:bg-white'}`}>{k}</button>
            ))}
          </div>
          {MENU[tab].map(([a, b]) => (
            <div key={a} className="group flex items-baseline gap-3 py-3 border-b border-[#2b1d14]/10">
              <span className="font-serif text-lg transition group-hover:translate-x-1">{a}</span>
              <span className="flex-1 border-b border-dotted border-[#2b1d14]/25" />
              <span className="text-sm font-semibold">{b}</span>
            </div>
          ))}
        </div>
        <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
          {done ? (
            <div className="py-10 text-center">
              <p className="font-serif text-2xl">Table for {n} at {slot}.</p>
              <p className="text-sm opacity-60 mt-2">Demo booking confirmed.</p>
              <button onClick={() => setDone(false)} className="mt-5 text-xs underline">Change booking</button>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl mb-4">Reserve a table</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">Guests</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setN(Math.max(1, n - 1))} className="w-8 h-8 rounded-full bg-[#f6efe6] hover:bg-orange-200 transition">−</button>
                  <b className="w-5 text-center">{n}</b>
                  <button onClick={() => setN(Math.min(12, n + 1))} className="w-8 h-8 rounded-full bg-[#f6efe6] hover:bg-orange-200 transition">+</button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-5">
                {SLOTS.map((s) => (
                  <button key={s} onClick={() => setSlot(s)} className={`py-2 rounded-xl text-xs font-semibold transition ${slot === s ? 'bg-orange-600 text-white' : 'bg-[#f6efe6] hover:bg-orange-100'}`}>{s}</button>
                ))}
              </div>
              <button onClick={() => setDone(true)} className="w-full py-3 rounded-xl bg-[#2b1d14] hover:bg-orange-700 text-white text-sm font-semibold transition">Confirm reservation</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Page 2: Fieldnote (sales insight SaaS) ---------- */
const RANGE = {
  '7 days': [42, 55, 48, 70, 62, 88, 80],
  '30 days': [30, 44, 38, 52, 49, 61, 58, 72, 66, 80, 77, 92],
  '90 days': [20, 28, 35, 33, 46, 52, 50, 64, 70, 68, 84, 95],
};
const PLANS = [['Starter', 0, 'One shop, daily summary'], ['Shop', 999, 'Live dashboard, stock alerts'], ['Chain', 2999, 'Several shops, team access']];

export function FieldnotePage() {
  const [r, setR] = useState('7 days');
  const [yr, setYr] = useState(false);
  const [hi, setHi] = useState(null);
  const d = RANGE[r];
  const total = d.reduce((a, b) => a + b, 0) * 140;
  return (
    <div className="bg-[#f4f6f1] text-zinc-900">
      <nav className="flex items-center justify-between px-8 py-5">
        <b className="text-xl tracking-tight">Fieldnote</b><span className="text-sm text-zinc-500">Sales insight for small shops</span>
      </nav>
      <h2 className="px-8 sm:px-12 py-6 text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl leading-[1.05]">Know what sold today, before you close the shutter.</h2>
      <div className="mx-8 sm:mx-12 p-6 rounded-3xl bg-white shadow-sm border border-zinc-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <div className="text-xs text-zinc-500">Sales, last {r} (sample data)</div>
            <div className="text-3xl font-bold">₹{(hi !== null ? d[hi] * 140 : total).toLocaleString('en-IN')}</div>
          </div>
          <div className="flex gap-1 bg-zinc-100 p-1 rounded-full">
            {Object.keys(RANGE).map((k) => (
              <button key={k} onClick={() => { setR(k); setHi(null); }} className={`px-3 py-1 rounded-full text-xs font-semibold transition ${r === k ? 'bg-emerald-700 text-white' : 'text-zinc-600'}`}>{k}</button>
            ))}
          </div>
        </div>
        <div className="h-40 flex items-end gap-2">
          {d.map((v, i) => (
            <div key={i} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} style={{ height: `${v}%` }}
              className={`flex-1 rounded-t-lg transition-all duration-500 ${hi === i ? 'bg-amber-500' : 'bg-emerald-600/80'}`} />
          ))}
        </div>
      </div>
      <div className="px-8 sm:px-12 py-10">
        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-2xl font-bold">Pricing</h3>
          <button onClick={() => setYr(!yr)} className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-900 text-white">{yr ? 'Yearly, save 20%' : 'Monthly'}</button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {PLANS.map(([name, p, t]) => (
            <div key={name} className="p-5 rounded-2xl bg-white border border-zinc-200 transition hover:-translate-y-1 hover:border-emerald-500">
              <b>{name}</b>
              <div className="text-3xl font-bold mt-2">₹{yr ? Math.round(p * 0.8) : p}<span className="text-xs font-normal text-zinc-500">/mo</span></div>
              <p className="text-xs text-zinc-500 mt-1">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
