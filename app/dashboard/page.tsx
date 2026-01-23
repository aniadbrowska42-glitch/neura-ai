'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, Zap, PlayCircle, ShieldCheck, CreditCard, ImageIcon, Film, Download, History, ChevronRight } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function DashboardNeura() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [selectedTool, setSelectedTool] = useState('wan-video');
  const [prompt, setPrompt] = useState('');
  const [userCredits, setUserCredits] = useState<number | string>('...');
  const [userId, setUserId] = useState<string | null>(null);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: userData } = await supabase.from('users').select('credits').eq('id', user.id).single();
        if (userData) setUserCredits(userData.credits);
        const { data: galleryData } = await supabase.from('gallery').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (galleryData) setGallery(galleryData);
      }
    };
    fetchData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFree: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isFree && typeof userCredits === 'number' && userCredits < 1) {
      alert("Credite insuficiente!");
      return;
    }
    setLoading(true);
    setStatus(isFree ? 'Generăm Demo 5s...' : 'Procesare Pro...');

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);

      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl, tool: selectedTool, prompt: prompt, isFreeTrial: isFree }),
      });

      const data = await response.json();
      if (data.output) {
        const finalUrl = Array.isArray(data.output) ? data.output[0] : data.output;
        setResult(finalUrl);
        if (userId) {
          const { data: newEntry } = await supabase.from('gallery').insert([{ user_id: userId, input_url: publicUrl, output_url: finalUrl, tool_used: selectedTool }]).select().single();
          if (newEntry) setGallery([newEntry, ...gallery]);
        }
        if (!isFree && typeof userCredits === 'number') setUserCredits(userCredits - 1);
      }
    } catch (error: any) {
      alert("Eroare: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tools = [
    { 
      id: 'wan-video', 
      name: 'Wan 2.5 Video', 
      desc: 'Generare Video', 
      icon: <Film size={16}/>,
      img: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=400&auto=format&fit=crop' 
    },
    { 
      id: 'upscale', 
      name: 'Upscale 4K', 
      desc: 'Claritate Foto', 
      icon: <Sparkles size={16}/>,
      img: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=400&auto=format&fit=crop' 
    },
    { 
      id: 'face-swap', 
      name: 'Face Swap', 
      desc: 'Schimb Realistic', 
      icon: <Zap size={16}/>,
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' 
    },
    { 
      id: 'colorize', 
      name: 'Colorizare', 
      desc: 'Poze Vechi', 
      icon: <ImageIcon size={16}/>,
      img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      
      {/* --- HEADER --- */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-black italic tracking-tighter">NEURA<span className="text-blue-600">.AI</span></div>
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">🪙 {userCredits} Credite</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-xs font-black px-4 py-1.5 rounded-full transition-all">+ CUMPĂRĂ</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        
        {/* --- SELECTIE AI (SUS CU POZE) --- */}
        <section className="mb-16">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mb-8 text-center">Alege Motorul AI</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => {setSelectedTool(tool.id); setResult(null);}} 
                className={`group relative h-40 md:h-48 rounded-[2rem] overflow-hidden cursor-pointer border-2 transition-all duration-500 ${selectedTool === tool.id ? 'border-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.2)] scale-[1.02]' : 'border-white/5 grayscale hover:grayscale-0'}`}
              >
                <img src={tool.img} alt={tool.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`p-1.5 rounded-lg ${selectedTool === tool.id ? 'bg-blue-600' : 'bg-zinc-900'}`}>{tool.icon}</span>
                    <h3 className="font-black text-sm md:text-base italic uppercase">{tool.name}</h3>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- ZONA DE LUCRU (CENTRU) --- */}
        <div className="max-w-3xl mx-auto mb-32">
          <div className="bg-zinc-900/40 border border-white/5 p-8 md:p-12 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            
            {/* Design element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />

            {loading ? (
              <div className="py-20 text-center">
                <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">{status}</p>
              </div>
            ) : result ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="rounded-[2rem] overflow-hidden border border-white/10 mb-8 bg-black">
                  {selectedTool === 'wan-video' ? <video src={result} controls autoPlay loop className="w-full" /> : <img src={result} className="w-full" />}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={result} target="_blank" className="flex-1 bg-white text-black py-5 rounded-2xl font-black text-center text-sm hover:bg-blue-600 hover:text-white transition-all">DESCARCĂ REZULTAT 4K</a>
                  <button onClick={() => setResult(null)} className="px-10 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-bold transition-all">ALTUL</button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 relative z-10 text-center">
                {selectedTool === 'wan-video' && (
                  <div className="text-left animate-in slide-in-from-top-2 duration-500">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-2 mb-2 block">Instrucțiuni Video (Prompt)</label>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ex: cinematic lighting, slow zoom into details, 4k..." className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-6 text-sm h-32 outline-none focus:border-blue-600 transition-all resize-none" />
                  </div>
                )}
                
                <div className="py-6">
                  <div className="text-4xl mb-4">{tools.find(t => t.id === selectedTool)?.icon}</div>
                  <h3 className="text-xl font-bold mb-2">Încarcă fișierul pentru {tools.find(t => t.id === selectedTool)?.name}</h3>
                  <p className="text-zinc-500 text-sm">Formate suportate: JPG, PNG, MP4</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <input type="file" onChange={(e) => handleUpload(e, false)} className="hidden" id="file-pro" />
                  <label htmlFor="file-pro" className="w-full bg-blue-600 py-6 rounded-2xl cursor-pointer flex flex-col items-center justify-center border-b-4 border-blue-800 hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20">
                    <span className="font-black text-lg">PROCESEAZĂ COMPLET (1 CREDIT)</span>
                    <span className="text-[9px] opacity-70 uppercase tracking-widest mt-1">Calitate Maximă • Fără Watermark</span>
                  </label>
                  
                  <input type="file" onChange={(e) => handleUpload(e, true)} className="hidden" id="file-free" />
                  <label htmlFor="file-free" className="w-full py-4 rounded-2xl cursor-pointer flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all text-zinc-400">
                    <span className="font-bold text-xs uppercase tracking-widest text-blue-400/80">Încearcă Gratis (5 secunde)</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- GALERIE (JOS) --- */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <History className="text-blue-600" size={20} />
              <h2 className="text-xl font-black italic tracking-tight uppercase">Istoric Creații</h2>
            </div>
          </div>
          
          {gallery.length === 0 ? (
            <div className="bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[3rem] py-32 text-center text-zinc-600 italic">
              Galeria ta este goală. Începe să generezi!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="group relative bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-600 transition-all aspect-square shadow-lg">
                  {item.tool_used === 'wan-video' ? (
                    <video src={item.output_url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                  ) : (
                    <img src={item.output_url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-4">
                    <a href={item.output_url} target="_blank" className="bg-blue-600 p-2 rounded-xl"><Download size={16} /></a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center bg-black/50 backdrop-blur-md">
        <div className="text-zinc-700 text-[10px] font-bold tracking-[0.6em] uppercase">
          Neura Cloud Multimodal Intelligence • v1.5
        </div>
      </footer>
    </div>
  );
}
