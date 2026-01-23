'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, Zap, PlayCircle, ImageIcon, Film, Download, History, ChevronRight, User } from 'lucide-react';

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
      alert("Credite insuficiente! Te rugăm să reîncarci contul.");
      return;
    }
    setLoading(true);
    setStatus(isFree ? 'Generăm Demo (5s)...' : 'Procesare Calitate Pro...');

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
          // Refresh galerie
          const { data: updatedGallery } = await supabase.from('gallery').select('*').eq('user_id', userId).order('created_at', { ascending: false });
          if (updatedGallery) setGallery(updatedGallery);
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
    { id: 'wan-video', name: 'Wan 2.5 Video', desc: 'Generează Video 4K', icon: <Film size={14}/>, img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop' },
    { id: 'upscale', name: 'Upscale 4K', desc: 'Claritate Maximă', icon: <Sparkles size={14}/>, img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop' },
    { id: 'face-swap', name: 'Face Swap', desc: 'Realism Extrem', icon: <Zap size={14}/>, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' },
    { id: 'colorize', name: 'Colorizare', desc: 'Poze Alb-Negru', icon: <ImageIcon size={14}/>, img: 'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-600/30">
      
      {/* --- DASHBOARD NAVBAR --- */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-black italic tracking-tighter">NEURA<span className="text-blue-600">.AI</span></div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-right">Balanță Actuală</span>
              <span className="text-blue-400 font-mono font-bold text-sm">🪙 {userCredits} CREDITE</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-[10px] font-black px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">+ CUMPĂRĂ</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        
        {/* --- SELECTIE AI CU IMAGINI (SUS) --- */}
        <section className="mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => {setSelectedTool(tool.id); setResult(null);}} 
                className={`group relative h-32 md:h-40 rounded-[2rem] overflow-hidden cursor-pointer border-2 transition-all duration-500 ${selectedTool === tool.id ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-white/5 grayscale hover:grayscale-0 opacity-60 hover:opacity-100'}`}
              >
                <img src={tool.img} alt={tool.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <h3 className="font-black text-xs md:text-sm italic uppercase tracking-tighter flex items-center gap-2">
                    <span className="p-1 bg-blue-600 rounded-md">{tool.icon}</span> {tool.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- WORKSPACE --- */}
        <div className="max-w-3xl mx-auto mb-24">
          <div className="bg-zinc-900/30 border border-white/5 p-8 md:p-12 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden shadow-2xl">
            
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.4em] animate-pulse">{status}</p>
              </div>
            ) : result ? (
              <div className="animate-in zoom-in duration-500">
                <div className="rounded-3xl overflow-hidden border border-white/10 mb-8 bg-black">
                   {selectedTool === 'wan-video' ? <video src={result} controls autoPlay loop className="w-full" /> : <img src={result} className="w-full" />}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={result} target="_blank" className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-center text-xs hover:bg-blue-600 hover:text-white transition-all">DESCĂRCARE REZULTAT 4K</a>
                  <button onClick={() => setResult(null)} className="px-10 bg-zinc-800 rounded-2xl font-bold text-xs hover:bg-zinc-700 transition-all">ALTUL</button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {selectedTool === 'wan-video' && (
                  <textarea 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    placeholder="Descrie mișcarea video (ex: camera zooms in, high cinematic detail)..." 
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-6 text-sm h-28 outline-none focus:border-blue-600 transition-all resize-none" 
                  />
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  <input type="file" onChange={(e) => handleUpload(e, false)} className="hidden" id="file-pro" />
                  <label htmlFor="file-pro" className="w-full bg-blue-600 py-6 rounded-2xl cursor-pointer flex flex-col items-center justify-center border-b-4 border-blue-800 hover:bg-blue-500 transition-all shadow-xl">
                    <span className="font-black text-sm uppercase tracking-widest">Procesează Pro (1 Credit)</span>
                    <span className="text-[9px] opacity-70 uppercase mt-1">Fără Watermark • Calitate Maximă</span>
                  </label>
                  
                  <input type="file" onChange={(e) => handleUpload(e, true)} className="hidden" id="file-free" />
                  <label htmlFor="file-free" className="w-full py-4 rounded-2xl cursor-pointer flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all text-zinc-500">
                    <span className="font-bold text-xs uppercase tracking-widest italic">Test Gratuit (5 secunde)</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- GALERIE --- */}
        <section>
          <div className="flex items-center gap-3 mb-10">
            <History className="text-zinc-600" size={18} />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">Istoric Creații</h2>
          </div>
          
          {gallery.length === 0 ? (
            <div className="bg-zinc-900/10 border border-dashed border-zinc-800 rounded-[3rem] py-24 text-center text-zinc-700 italic text-sm">
              Încă nu ai generat nimic.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-600 transition-all aspect-square">
                   <img src={item.output_url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all" />
                   <a href={item.output_url} target="_blank" className="absolute bottom-2 right-2 p-1.5 bg-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Download size={14} /></a>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center text-zinc-800 text-[10px] font-bold tracking-[0.5em] uppercase">
        Neura Engine v1.5 • All Rights Reserved
      </footer>
    </div>
  );
}
