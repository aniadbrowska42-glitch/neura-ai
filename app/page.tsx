import Link from 'next/link';
import React from 'react';
import { ArrowRight, Video, Target, Camera, Palette, Zap, ShieldCheck, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-blue-500/30">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/5 backdrop-blur-xl sticky top-0 z-50 bg-black/50">
        <div className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center not-italic text-sm">N</div>
          NEURA<span className="text-blue-600">.AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#features" className="hover:text-white transition">Instrumente</Link>
          <Link href="#pricing" className="hover:text-white transition">Prețuri</Link>
          <Link href="/signin" className="hover:text-white transition border-l border-white/10 pl-8">Logare</Link>
        </div>

        <Link href="/signin" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          Începe Gratuit
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative max-w-6xl mx-auto pt-24 pb-32 px-6 text-center">
        {/* Glow effect de fundal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full text-blue-400 text-[10px] font-bold tracking-[0.2em] mb-10 uppercase animate-fade-in">
          <Sparkles size={12} /> Următoarea generație de AI Multimedia
        </div>

        <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tight mb-8 leading-[0.85] italic text-zinc-100">
          TRANSFORMĂ <br /> 
          <span className="text-blue-600 not-italic">IMAGINAȚIA</span> <br />
          ÎN REALITATE.
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Cea mai avansată platformă AI din România pentru generare video și procesare foto. 
          Puterea <span className="text-white">Wan 2.5</span> și <span className="text-white">Kling</span> acum la un click distanță.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
          <Link href="/dashboard" className="group bg-white text-black text-lg font-black px-12 py-5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2">
            DESCHIDE DASHBOARD 
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-3 text-zinc-500 text-sm font-semibold">
            <ShieldCheck className="text-green-500" size={18} />
            Fără card necesar pentru test
          </div>
        </div>
      </section>

      {/* --- TOOLS GRID --- */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Instrumente Profesionale</h2>
          <p className="text-zinc-500">Modele de ultimă oră antrenate pentru rezultate fotorealiste.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Video className="text-blue-500" />} 
            title="Wan 2.5 Video" 
            desc="Generare video cinematic din imagini sau text la 60 FPS." 
          />
          <FeatureCard 
            icon={<Target className="text-purple-500" />} 
            title="Neura Upscale" 
            desc="Mărește rezoluția până la 4K cu restaurare facială inteligentă." 
          />
          <FeatureCard 
            icon={<Camera className="text-emerald-500" />} 
            title="Face Swap Pro" 
            desc="Schimbă fețele cu precizie chirurgicală în orice context." 
          />
          <FeatureCard 
            icon={<Palette className="text-orange-500" />} 
            title="Colorizare AI" 
            desc="Redă viața fotografiilor alb-negru folosind context vizual profund." 
          />
        </div>
      </section>

      {/* --- PRICING PREVIEW --- */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-24 bg-zinc-950/50 rounded-[3rem] border border-white/5 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Pachete de Credite</h2>
          <p className="text-zinc-500 text-lg">Plătești doar cât consumi. Fără abonamente ascunse.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
          {/* Pachet 1 */}
          <div className="p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 hover:border-blue-600 transition-all">
            <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-widest mb-2">Hobby</h3>
            <div className="text-4xl font-black mb-4">50 RON</div>
            <ul className="space-y-3 mb-8 text-sm text-zinc-300">
              <li className="flex items-center gap-2"><Zap size={14} className="text-blue-500"/> 50 Credite incluse</li>
              <li className="flex items-center gap-2"><Zap size={14} className="text-blue-500"/> Acces Upscale & Foto</li>
              <li className="flex items-center gap-2"><Zap size={14} className="text-blue-500"/> Suport Comunitate</li>
            </ul>
            <Link href="/signin" className="block text-center w-full bg-white text-black py-4 rounded-xl font-black hover:bg-blue-600 hover:text-white transition">CUMPĂRĂ ACUM</Link>
          </div>

          {/* Pachet 2 */}
          <div className="p-8 rounded-[2rem] bg-blue-600 border border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.2)]">
            <h3 className="text-blue-200 font-bold uppercase text-xs tracking-widest mb-2">Pro Creator</h3>
            <div className="text-4xl font-black mb-4 text-white">150 RON</div>
            <ul className="space-y-3 mb-8 text-sm text-white/90">
              <li className="flex items-center gap-2"><Zap size={14} className="text-white"/> 200 Credite incluse</li>
              <li className="flex items-center gap-2"><Zap size={14} className="text-white"/> Prioritate în coada AI</li>
              <li className="flex items-center gap-2"><Zap size={14} className="text-white"/> Generare Video Wan 2.5</li>
            </ul>
            <Link href="/signin" className="block text-center w-full bg-black text-white py-4 rounded-xl font-black hover:bg-zinc-800 transition">CUMPĂRĂ ACUM</Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black italic tracking-tighter">
            NEURA<span className="text-blue-600">.AI</span>
          </div>
          <p className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase font-bold text-center">
            © {new Date().getFullYear()} Neura Cloud Computing. Creat cu pasiune pentru viitorul digital.
          </p>
          <div className="flex gap-6 text-zinc-500 text-xs">
            <Link href="/terms" className="hover:text-white">Termeni</Link>
            <Link href="/privacy" className="hover:text-white">Confidențialitate</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componentă Helper pentru cardurile de Features
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-600/50 hover:bg-zinc-900 transition-all duration-500 group relative overflow-hidden">
      <div className="text-4xl mb-6 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-zinc-100">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
