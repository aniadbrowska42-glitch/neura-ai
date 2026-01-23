'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, Zap, Film, ImageIcon, Download, History, Play, CheckCircle2 } from 'lucide-react';

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
      desc: 'Video din Imagine', 
      icon: <Film size={18} />, 
      img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop' 
    },
    { 
      id: 'upscale', 
      name: 'Neura Upscale', 
      desc: 'Claritate 4K', 
      icon: <Sparkles size={18} />, 
      img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop' 
    },
    { 
      id: 'face-swap', 
      name: 'Face Swap', 
      desc: 'Schimb Realist', 
      icon: <Zap size={18} />, 
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop' 
    },
    { 
      id: 'colorize', 
      name: 'Colorizare', 
      desc: 'Poze Alb-Negru', 
      icon: <ImageIcon size={18} />, 
      img: 'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?q=80&w=600&auto=format&fit=crop' 
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-xs shadow-[0_0_15px_rgba(37,99,235,0.4)]">N</div>
            <div className="text-xl font-black italic tracking-tighter uppercase">Neura<span className="text-blue-600">.ai</span></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full flex items-center gap-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Balanță:</span>
              <span className="text-blue-400 font-mono font-bold text-sm">🪙 {userCredits}</span>
            </div>
            <button className="hidden sm:block bg-blue-600 hover:bg-blue-500 text-[10px] font-black px-4 py-2 rounded-full transition-all">+ CUMPĂRĂ</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* --- INSTRUMENTE AI SUS --- */}
        <section className="mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => {setSelectedTool(tool.id); setResult(null);}} 
                className={`group relative h-40 md:h-52 rounded-[2.5rem] overflow-hidden cursor-pointer border-2 transition-all duration-500 ${selectedTool === tool.id ? 'border-blue-600 ring-4 ring-blue-600/10 scale-[1.02]' : 'border-white/5 grayscale hover:grayscale-0 opacity-60 hover:opacity-100'}`}
              >
                <img src={tool.img} alt={tool.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-colors ${selectedTool === tool.id ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-black/60'}`}>
                    {tool.icon}
                  </div>
                  <h3 className="font-black text-sm md:text-base italic uppercase tracking-tighter">{tool.name}</h3>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">{tool.desc}</p>
                </div>
                {selectedTool === tool.id && (
                  <div className="absolute top-4 right-4 animate-bounce">
                    <CheckCircle2 size={20} className="text-blue-500 shadow-2xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* --- WORKSPACE --- */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="bg-zinc-900/30 border border-white/5 p-6 md:p-12 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden shadow-2xl min-h-[450px] flex flex-col justify-center text-center">
            
            {loading ? (
              <div className="py-20 flex flex-col items-center">
                <div className="w-16 h-16 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
                <p className="text-blue-400 font-black text-xs uppercase tracking-[0.4em] animate-pulse">{status}</p>
              </div>
            ) : result ? (
              <div className="animate-in zoom-in duration-500">
                <div className="rounded-[2.5rem] overflow-hidden border border-white/10 mb-8 bg-black shadow-2xl">
                   {selectedTool.includes('video') ? <video src={result} controls autoPlay loop className="w-full h-auto" /> : <img src={result} className="w-full h-auto" />}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={result} target="_blank" className="bg-white text-black py-4 px-10 rounded-2xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all shadow-xl">DESCĂRCARE REZULTAT 4K</a>
                  <button onClick={() => setResult(null)} className="px-10 bg-zinc-800 rounded-2xl font-bold text-sm hover:bg-zinc-700 transition-all">ALT PROIECT</button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Instrument activ: {tools.find(t => t.id === selectedTool)?.name}</h2>
                  <p className="text-zinc-500 text-sm">Încarcă fișierul de pe calculator pentru procesare imediată.</p>
                </div>

                {selectedTool === 'wan-video' && (
                  <div className="max-w-xl mx-auto">
                    <textarea 
                      value={prompt} 
                      onChange={(e) => setPrompt(e.target.value)} 
                      placeholder="Descrie mișcarea video (ex: cinematic drone shot, camera moving forward)..." 
                      className="w-full bg-black/50 border border-zinc-800 rounded-[2rem] p-6 text-sm h-32 outline-none focus:border-blue-600 transition-all resize-none shadow-inner" 
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <input type="file" onChange={(e) => handleUpload(e, false)} className="hidden" id="file-pro" />
                  <label htmlFor="file-pro" className="bg-blue-600 py-6 rounded-[2rem] cursor-pointer flex flex-col items-center justify-center border-b-4 border-blue-800 hover:bg-blue-500 transition-all shadow-xl group">
                    <div className="flex items-center gap-2 font-black text-sm uppercase">PROCESARE PRO</div>
                    <span className="text-[9px] opacity-70 uppercase font-bold mt-1 tracking-widest italic">1 Credit • Calitate Maximă</span>
                  </label>
                  
                  <input type="file" onChange={(e) => handleUpload(e, true)} className="hidden" id="file-free" />
                  <label htmlFor="file-free" className="bg-zinc-800 py-6 rounded-[2rem] cursor-pointer flex flex-col items-center justify-center border border-zinc-700 hover:bg-zinc-700 transition-all text-zinc-400">
                    <div className="flex items-center gap-2 font-bold text-sm uppercase">TEST GRATUIT</div>
                    <span className="text-[9px] opacity-40 uppercase tracking-widest mt-1 italic">5 Secunde • Rezoluție redusă</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- GALERIE JOS --- */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <History className="text-zinc-700" size={16} />
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Istoric recent</h2>
          </div>
          
          {gallery.length === 0 ? (
            <div className="bg-zinc-900/10 border border-dashed border-zinc-800 rounded-[3rem] py-24 text-center text-zinc-800 italic text-sm">
              Încă nu ai creat nimic. Pozele tale vor apărea aici.
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
        Neura Engine Multimedia Studio • v1.6
      </footer>
    </div>
  );
}
