'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, Zap, PlayCircle, ShieldCheck, CreditCard, ImageIcon, Film, Download, Trash2, History } from 'lucide-react';

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

  // 1. Încărcăm datele utilizatorului și Galeria
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Luăm creditele
        const { data: userData } = await supabase.from('users').select('credits').eq('id', user.id).single();
        if (userData) setUserCredits(userData.credits);

        // Luăm istoricul din galerie
        const { data: galleryData } = await supabase
          .from('gallery')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (galleryData) setGallery(galleryData);
      }
    };
    fetchData();
  }, []);

  // 2. Funcția de Upload și Procesare
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFree: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isFree && typeof userCredits === 'number' && userCredits < 1) {
      alert("Nu mai ai credite!");
      return;
    }

    setLoading(true);
    setStatus(isFree ? 'Generăm test gratuit...' : 'Procesăm Pro...');

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

        // SALVARE ÎN GALERIE (Baza de date)
        if (userId) {
          const { data: newEntry } = await supabase.from('gallery').insert([{
            user_id: userId,
            input_url: publicUrl,
            output_url: finalUrl,
            tool_used: selectedTool
          }]).select().single();
          
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
    { id: 'wan-video', name: 'Wan 2.5 Video', desc: 'Video cinematic', icon: <Film className="text-blue-500" /> },
    { id: 'upscale', name: 'Neura Upscale', desc: 'Claritate 4K', icon: <Sparkles className="text-purple-500" /> },
    { id: 'face-swap', name: 'Face Swap Pro', desc: 'Schimb realist', icon: <Zap className="text-emerald-500" /> },
    { id: 'colorize', name: 'Colorizare AI', desc: 'Redă culorile', icon: <ImageIcon className="text-orange-500" /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden">
      
      {/* FUNDAL IMAGINE OPACĂ (ca pe Landing Page) */}
      <div className="fixed inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 p-4 md:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex flex-col items-center">
            <h1 className="text-4xl font-black italic tracking-tighter mb-4">NEURA<span className="text-blue-600">.AI</span></h1>
            <div className="flex items-center gap-3 bg-zinc-900/80 border border-white/10 px-6 py-2 rounded-full backdrop-blur-xl">
              <span className="text-blue-400 font-bold">🪙 {userCredits} Credite</span>
              <button className="ml-4 text-[10px] bg-blue-600 px-3 py-1 rounded-lg font-black uppercase tracking-widest">+ CUMPĂRĂ</button>
            </div>
          </header>

          {/* ZONA DE INSTRUMENTE ȘI UPLOAD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
            
            {/* Coloana Stângă: Selecție Tool */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] mb-6">Instrumente AI</h2>
              {tools.map((tool) => (
                <div key={tool.id} onClick={() => {setSelectedTool(tool.id); setResult(null);}} className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${selectedTool === tool.id ? 'border-blue-600 bg-blue-600/10' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}`}>
                  <div className="flex items-center gap-4">
                    {tool.icon}
                    <div>
                      <h3 className="font-bold text-sm">{tool.name}</h3>
                      <p className="text-zinc-500 text-[10px]">{tool.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coloana Centrală: Upload / Rezultat */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900/60 border border-white/10 p-8 md:p-10 rounded-[3rem] backdrop-blur-2xl shadow-3xl min-h-[400px] flex flex-col justify-center">
                {loading ? (
                  <div className="text-center py-20">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-blue-400 font-bold text-xs uppercase tracking-widest">{status}</p>
                  </div>
                ) : result ? (
                  <div className="animate-in fade-in zoom-in duration-500">
                    <div className="rounded-2xl overflow-hidden border border-white/10 mb-6 bg-black">
                      {selectedTool.includes('video') ? <video src={result} controls autoPlay loop className="w-full" /> : <img src={result} className="w-full" />}
                    </div>
                    <div className="flex gap-4">
                      <a href={result} target="_blank" className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-center text-sm">DESCARCĂ REZULTAT</a>
                      <button onClick={() => setResult(null)} className="px-8 bg-zinc-800 rounded-2xl font-bold">ALTUL</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedTool === 'wan-video' && (
                      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Descrie mișcarea video..." className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm h-24 outline-none focus:border-blue-600 transition-all" />
                    )}
                    <input type="file" onChange={(e) => handleUpload(e, false)} className="hidden" id="file-pro" />
                    <label htmlFor="file-pro" className="w-full bg-blue-600 py-6 rounded-2xl cursor-pointer flex flex-col items-center justify-center border-b-4 border-blue-800 hover:bg-blue-500 transition-all">
                      <span className="font-black">PROCESEAZĂ PRO (1 CREDIT)</span>
                      <span className="text-[10px] opacity-60">Calitate 4K • Fără Watermark</span>
                    </label>
                    
                    <input type="file" onChange={(e) => handleUpload(e, true)} className="hidden" id="file-free" />
                    <label htmlFor="file-free" className="w-full py-4 rounded-2xl cursor-pointer flex flex-col items-center justify-center border border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800 transition-all text-zinc-400">
                      <span className="font-bold text-sm">TEST GRATUIT (5 SECUNDE)</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- SECȚIUNEA GALERIE --- */}
          <div className="mt-20">
            <div className="flex items-center gap-2 mb-8">
              <History className="text-blue-500" size={20} />
              <h2 className="text-xl font-black italic tracking-tight uppercase">Galeria Mea Permanentă</h2>
            </div>
            
            {gallery.length === 0 ? (
              <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-[2rem] py-20 text-center text-zinc-600 italic">
                Niciun fișier procesat încă. Începe să creezi!
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-600 transition-all">
                    <div className="aspect-square bg-black flex items-center justify-center">
                      {item.tool_used.includes('video') ? (
                        <video src={item.output_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                      ) : (
                        <img src={item.output_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a href={item.output_url} target="_blank" className="p-2 bg-blue-600 rounded-full"><Download size={18} /></a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="relative z-10 py-12 text-center text-zinc-700 text-[10px] font-bold tracking-[0.5em] border-t border-white/5">
        NEURA CLOUD COMPUTING • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
