import Link from 'next/link';

export default function LandingPage() {
  const features = [
    { title: 'Wan 2.1 Video', desc: 'Transformă orice imagine în video cinematic 4K.', icon: '🎬' },
    { title: 'Upscale Pro', desc: 'Mărește rezoluția și repară detaliile faciale.', icon: '💎' },
    { title: 'Face Swap', desc: 'Schimbă fețele în fotografii cu realism extrem.', icon: '🎭' },
    { title: 'Colorizare AI', desc: 'Redă viață și culoare amintirilor alb-negru.', icon: '🎨' },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Navbar Simplu */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-zinc-900">
        <div className="text-2xl font-black italic tracking-tighter">
          NEURA<span className="text-blue-600">.AI</span>
        </div>
        <div className="space-x-6 text-sm font-medium">
          <Link href="/signin" className="hover:text-blue-500 transition">Autentificare</Link>
          <Link href="/signin" className="bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-500 transition">Începe Gratuit</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto pt-24 pb-20 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
          VIITORUL <br /> <span className="text-blue-600 italic">CREATIVITĂȚII</span>
        </h1>
        <p className="text-zinc-500 text-xl max-w-2xl mx-auto mb-12 font-light">
          Platforma multimedia bazată pe cele mai avansate modele AI: Wan 2.1, Real-ESRGAN și CodeFormer. Simplu, rapid, profesional.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link href="/dashboard" className="bg-white text-black text-lg font-bold px-10 py-5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-900/20">
            DESCHIDE DASHBOARD
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] hover:border-blue-600 transition-colors group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 text-center text-zinc-600 text-xs tracking-widest uppercase">
        &copy; {new Date().getFullYear()} NEURA CLOUD COMPUTING. TOATE DREPTURILE REZERVATE.
      </footer>
    </div>
  );
}
