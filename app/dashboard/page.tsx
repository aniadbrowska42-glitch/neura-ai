'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, Zap, Film, ImageIcon, Download, History, CheckCircle2, Play } from 'lucide-react';

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
    setStatus(isFree ? 'Generăm Demo 5s...' : 'Procesare Calitate Pro...');

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
          await supabase.from('gallery').insert([{ user_id: userId, input_url: publicUrl, output_url: finalUrl, tool_used: selectedTool }]);
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
      desc: 'Imagine în Video 4K', 
      icon: <Film size={14} />, 
      img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop', // Imagine cu vibe de film
      previewLabel: 'Cinematic'
    },
    { 
      id: 'upscale', 
      name: 'Neura Upscale', 
      desc: 'Claritate & Detalii', 
      icon: <Sparkles size={14} />, 
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop', // Imagine cu multe detalii/peisaj
      previewLabel: '4K Ultra HD'
    },
    { 
      id: 'face-swap', 
      name: 'Face Swap', 
      desc: 'Schimb Realistic', 
      icon: <Zap size={14} />, 
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop', // Portret clar
      previewLabel: 'Pro Portrait'
    },
    { 
      id: 'colorize', 
      name: 'Colorizare', 
      desc: 'Restaurare Culori', 
      icon: <ImageIcon size={14} />, 
      img: 'https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=600&auto=format&fit=crop', // Arta/Vintage vibe
      previewLabel: 'Color Fix'
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600/30">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm italic shadow-[0_0_15px_rgba(37,99,235,0.4)]">N</div>
            <div className="text-xl font-black italic tracking-tighter">NEURA<span className="text-blue-600">.AI</span></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full flex items-center gap-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Credite:</span>
              <span className="text-blue-400 font-mono font-bold text-sm">🪙 {userCredits}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* --- SELECTIE AI CU IMAGINI --- */}
        <section className="mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => {setSelectedTool(tool.id); setResult(null);}} 
                className={`group relative h-48 md:h-64 rounded-[2.5rem] overflow-hidden cursor-pointer border-2 transition-all duration-500 ${selectedTool === tool.id ? 'border-blue-600 ring-4 ring-blue-600/10 scale-[1.02] shadow-[0_0_40px_rgba(37,99,235,0.2)]' : 'border-white/5 grayscale hover:grayscale-0 opacity-50 hover:opacity-100'}`}
              >
                <img src={tool.img} alt={tool.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                {/* Badge sus dreapta */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest text-zinc-300 border border-white/5">
                  {tool.previewLabel}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${selectedTool === tool.id ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-black/60'}`}>
                    {tool.icon}
                  </div>
                  <h3 className="font-black text-sm md:text-lg italic uppercase tracking-tighter">{tool.name}</h3>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">{tool.desc}</p>
                </div>

                {selectedTool === tool.id && (
                  <div className="absolute inset-0 border-2 border-blue-600/50 rounded-[2.5rem] pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* --- WORKSPACE --- */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="bg-zinc-900/30 border border-white/5 p-6 md:p-12 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden shadow-2xl min-h-[450px] flex flex-col justify-center text-center">
            
            {loading ? (
              <div className="py-20 flex flex-col items-center">
                <div className="w-16 h-16 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
                <p className="text-blue-400 font-black text-xs uppercase tracking-[0.4em] animate-pulse">{status}</p>
              </div>
            ) : result ? (
              <div className="animate-in zoom-in duration-500">
                <div className="rounded-[2.5rem] overflow-hidden border border-white/10 mb-8 bg-black shadow-2xl max-h-[500px]">
                   {selectedTool.includes('video') ? <video src={result} controls autoPlay loop className="w-full h-auto" /> : <img src={result} className="w-full h-auto" />}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={result} target="_blank" className="bg-white text-black py-4 px-10 rounded-2xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all shadow-xl">DESCĂRCARE REZULTAT 4K</a>
                  <button onClick={() => setResult(null)} className="px-10 bg-zinc-800 rounded-2xl font-bold text-sm hover:bg-zinc-700 transition-all">ALT PROIECT</button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="animate-in fade-in duration-700">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-2 block">Motor AI Selectat</span>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">{tools.find(t => t.id === selectedTool)?.name}</h2>
                  <p className="text-zinc-500 text-sm">Încarcă un fișier pentru a vedea puterea Neura în acțiune.</p>
                </div>

                {selectedTool === 'wan-video' && (
                  <div className="max-w-xl mx-auto">
                    <textarea 
                      value={prompt} 
                      onChange={(e) => setPrompt(e.target.value)} 
                      placeholder="Descrie mișcarea video dorită..." 
                      className="w-full bg-black/50 border border-zinc-800 rounded-[2rem] p-6 text-sm h-32 outline-none focus:border-blue-600 transition-all resize-none shadow-inner" 
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <input type="file" onChange={(e) => handleUpload(e, false)} className="hidden" id="file-pro" />
                  <label htmlFor="file-pro" className="bg-blue-600 py-6 rounded-[2rem] cursor-pointer flex flex-col items-center justify-center border-b-4 border-blue-800 hover:bg-blue-500 transition-all shadow-xl active:translate-y-1 active:border-b-0">
                    <div className="flex items-center gap-2 font-black text-sm uppercase">PROCESARE COMPLETĂ</div>
                    <span className="text-[9px] opacity-70 uppercase font-bold mt-1 tracking-widest italic">1 Credit • Calitate 4K</span>
                  </label>
                  
                  <input type="file" onChange={(e) => handleUpload(e, true)} className="hidden" id="file-free" />
                  <label htmlFor="file-free" className="bg-zinc-800/50 py-6 rounded-[2rem] cursor-pointer flex flex-col items-center justify-center border border-zinc-700 hover:bg-zinc-800 transition-all text-zinc-400">
                    <div className="flex items-center gap-2 font-bold text-sm uppercase">TEST GRATUIT</div>
                    <span className="text-[9px] opacity-40 uppercase tracking-widest mt-1 italic">5 Secunde • Demo Rapid</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- GALERIE --- */}
        <section>
          <div className="flex items-center gap-3 mb-10 border-l-2 border-blue-600 pl-4">
            <History className="text-blue-600" size={18} />
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400">Arhiva Neura Cloud</h2>
          </div>
          
          {gallery.length === 0 ? (
            <div className="bg-zinc-900/10 border border-dashed border-zinc-800 rounded-[3rem] py-32 text-center text-zinc-700 italic text-sm">
              Nicio creație salvată încă.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-600 transition-all aspect-square shadow-xl">
                   <img src={item.output_url} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <a href={item.output_url} target="_blank" className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"><Download size={14} /></a>
                   </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center text-zinc-800 text-[10px] font-bold tracking-[0.6em] uppercase">
        Neura Multimodal Intelligence Engine
      </footer>
    </div>
  );
}
