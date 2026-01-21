import Link from 'next/link';
import React from 'react';
import { ArrowRight, Video, Target, Camera, Palette, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const tools = [
    { 
      title: 'Wan 2.5 Video', 
      desc: 'Generare video cinematic la 60 FPS din orice imagine.', 
      icon: <Video className="text-blue-500" />, 
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      label: 'Video Gen'
    },
    { 
      title: 'Neura Upscale', 
      desc: 'Mărește rezoluția la 4K și repară detaliile faciale.', 
      icon: <Target className="text-purple-500" />, 
      img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
      label: '4K Enhance'
    },
    { 
      title: 'Face Swap Pro', 
      desc: 'Schimbă fețele cu un realism extrem folosind AI.', 
      icon: <Camera className="text-emerald-500" />, 
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
      label: 'Deepfake Tech'
    },
    { 
      title: 'Colorizare AI', 
      desc: 'Redă viața și culoarea fotografiilor vechi alb-negru.', 
      icon: <Palette className="text-orange-500" />, 
      img: 'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?q=80&w=800&auto=format&fit=crop',
      label: 'Colorize'
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- FUNDAL IMAGINE OPACĂ --- */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1920&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20"
        />
        {/* Gradient pentru a face fundalul să se piardă în negru */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative z-10">
        {/* --- NAVBAR --- */}
        <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/5 backdrop-blur-md sticky top-0 bg-black/20">
          <div className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center not-italic text-sm shadow-[0_0_15px_rgba(37,99,235,0.5)]">N</div>
            NEURA<span className="text-blue-600">.AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-400">
            <Link href="#tools" className="hover:text-white transition">Instrumente</Link>
            <Link href="#pricing" className="hover:text-white transition">Prețuri</Link>
          </div>
          <Link href="/signin" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-full text-sm font-black transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)]">
            DASHBOARD
          </Link>
        </nav>

        {/* --- HERO --- */}
        <section className="max-w-6xl mx-auto pt-24 pb-20 px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full text-blue-400 text-[10px] font-bold tracking-[0.2em] mb-10 uppercase">
            <Sparkles size={12} /> Neura Engine v1.5 este Live
          </div>
          <h1 className="text-6xl md:text-[6rem] font-black tracking-tight mb-8 leading-[0.85] italic">
            VIITORUL <br /> 
            <span className="text-blue-600 not-italic">VIZUALULUI.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
            Singura platformă din România care reunește <span className="text-white">Wan 2.5</span> și <span className="text-white">Face Swap Pro</span> într-o singură interfață.
          </p>
          <Link href="/signin" className="bg-white text-black text-lg font-black px-14 py-5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3">
            ÎNCEPE ACUM <ArrowRight />
          </Link>
        </section>

        {/* --- GRID INSTRUMENTE CU IMAGINI --- */}
        <section id="tools" className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool, i) => (
              <div key={i} className="group bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-600/50 transition-all duration-500 backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row">
                  {/* Poza de Prezentare */}
                  <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                    <img src={tool.img} alt={tool.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100" />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-blue-400 border border-white/10">
                      {tool.label}
                    </div>
                  </div>
                  {/* Textul Cardului */}
                  <div className="lg:w-1/2 p-10 flex flex-col justify-center">
                    <div className="mb-4">{tool.icon}</div>
                    <h3 className="text-2xl font-black mb-3 italic tracking-tight">{tool.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">{tool.desc}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                      <CheckCircle2 size={14} className="text-blue-500" /> Procesare în Cloud
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- PRICING --- */}
        <section id="pricing" className="max-w-4xl mx-auto px-6 py-20 mb-32">
          <div className="bg-blue-600 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.3)]">
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-4">Ești gata să creezi?</h2>
              <p className="text-blue-100 mb-10 font-medium text-lg">Pachete de la 50 RON pentru 50 de credite.</p>
              <Link href="/signin" className="bg-white text-blue-600 text-lg font-black px-12 py-4 rounded-xl hover:bg-zinc-100 transition-all shadow-xl">
                CUMPĂRĂ CREDITE
              </Link>
            </div>
            {/* Element decorativ fundal pricing */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 py-12 text-center bg-black/40 backdrop-blur-md">
          <div className="text-xl font-black italic tracking-tighter mb-4">
            NEURA<span className="text-blue-600">.AI</span>
          </div>
          <p className="text-zinc-600 text-[10px] tracking-[0.4em] uppercase font-bold">
            © {new Date().getFullYear()} NEURA CLOUD COMPUTING • ROMÂNIA
          </p>
        </footer>
      </div>
    </div>
  );
}
