import Link from 'next/link';
import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Zap, Film, Target, ImageIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
      
      {/* BACKGROUND IMAGE OPAC */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative z-10">
        {/* NAVBAR */}
        <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/5 backdrop-blur-md sticky top-0">
          <div className="text-2xl font-black italic tracking-tighter">NEURA<span className="text-blue-600">.AI</span></div>
          <div className="flex gap-4">
            <Link href="/signin" className="text-sm font-bold text-zinc-400 py-2 px-4 hover:text-white transition">LOGARE</Link>
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-black transition shadow-lg shadow-blue-900/20">ÎNCEPE ACUM</Link>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto pt-24 pb-32 px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full text-blue-400 text-[10px] font-bold tracking-[0.2em] mb-10 uppercase animate-pulse">
            <Sparkles size={12} /> Next-Gen AI Multimedia Studio
          </div>
          <h1 className="text-6xl md:text-[7rem] font-black tracking-tighter mb-8 leading-[0.85] italic">IMAGINEAZĂ <br /> <span className="text-blue-600 not-italic">VIITORUL.</span></h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Cea mai avansată platformă AI din România. Generare Video <span className="text-white">Wan 2.5</span>, <span className="text-white">Face Swap</span> și <span className="text-white">Upscale 4K</span>.
          </p>
          <Link href="/dashboard" className="bg-white text-black text-lg font-black px-14 py-5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3">
            DESCHIDE DASHBOARD <ArrowRight />
          </Link>
        </section>

        {/* PREVIEW CARDS (Ceea ce doreai tu sa vada clientul) */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 bg-zinc-950/30">
          <h2 className="text-center text-zinc-500 text-[10px] font-bold tracking-[0.5em] uppercase mb-16">Capabilități Neura Engine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolPreviewCard img="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600" title="Wan 2.5 Video" label="VIDEO GEN" />
            <ToolPreviewCard img="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600" title="Upscale 4K" label="CLARITATE" />
            <ToolPreviewCard img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600" title="Face Swap" label="REALISM" />
            <ToolPreviewCard img="https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?w=600" title="Colorizare" label="VINTAGE" />
          </div>
        </section>

        <footer className="py-20 text-center border-t border-white/5 opacity-50">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase">© 2024 NEURA CLOUD • ROMANIA</p>
        </footer>
      </div>
    </div>
  );
}

function ToolPreviewCard({ img, title, label }: { img: string, title: string, label: string }) {
  return (
    <div className="group relative h-80 rounded-[2.5rem] overflow-hidden border border-white/5">
      <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded-full text-[8px] font-black tracking-widest">{label}</div>
      <div className="absolute bottom-6 left-6 font-black text-xl italic uppercase">{title}</div>
    </div>
  );
}
