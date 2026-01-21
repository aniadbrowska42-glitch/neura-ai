import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-zinc-900 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black italic tracking-tighter">
          NEURA<span className="text-blue-600">.AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/signin" className="text-sm font-bold text-zinc-400 hover:text-white transition">
            LOGARE
          </Link>
          <Link href="/signin" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-blue-900/20">
            ÎNCEPE GRATUIT
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto pt-24 pb-20 px-6 text-center">
        <div className="inline-block bg-blue-600/10 border border-blue-600/20 px-4 py-1 rounded-full text-blue-500 text-[10px] font-bold tracking-[0.2em] mb-8 uppercase">
          Următoarea generație de AI Multimedia
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] italic text-zinc-100">
          CREEAZĂ <br /> <span className="text-blue-600 not-italic">FĂRĂ LIMITE.</span>
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Transformă-ți ideile în realitate cu cele mai avansate modele de Inteligență Artificială: 
          <span className="text-zinc-300"> Wan 2.5, Kling, Upscale 4K și Face Swap Pro.</span>
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signin" className="bg-white text-black text-lg font-black px-12 py-5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl">
            DESCHIDE DASHBOARD
          </Link>
          <Link href="#features" className="bg-zinc-900 text-white text-lg font-bold px-12 py-5 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all">
            VEZI MODELELE
          </Link>
        </div>
      </section>

      {/* FEATURES GRID (Cele 4 Modele) */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24 border-t border-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon="🎬" title="Wan 2.5 Video" desc="Transformă pozele în clipuri video cinematice de înaltă rezoluție." />
          <FeatureCard icon="💎" title="Neura Upscale" desc="Redă claritatea 4K fotografiilor tale vechi sau pixelate." />
          <FeatureCard icon="🎭" title="Face Swap Pro" desc="Schimbă fețele cu un realism incredibil folosind AI." />
          <FeatureCard icon="🎨" title="Colorizare" desc="Dă viață amintirilor alb-negru prin colorizare automată." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-12 text-center">
        <p className="text-zinc-700 text-[10px] tracking-[0.3em] uppercase font-bold">
          © {new Date().getFullYear()} Neura Cloud Computing. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] hover:border-blue-600 transition-all duration-500 group">
      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500 inline-block">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-zinc-100">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
