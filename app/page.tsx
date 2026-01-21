'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, Zap, PlayCircle, ShieldCheck, CreditCard, ImageIcon, Film } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function DashboardNeura() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [selectedTool, setSelectedTool] = useState('wan-video');
  const [prompt, setPrompt] = useState('');
  const [userCredits, setUserCredits] = useState<number | string>('...');
  const [userId, setUserId] = useState<string | null>(null);

  // Încărcăm datele utilizatorului la pornire
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase.from('users').select('credits').eq('id', user.id).single();
        if (data) setUserCredits(data.credits);
      }
    };
    fetchUser();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFree: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isFree && typeof userCredits === 'number' && userCredits < 1) {
      alert("Nu mai ai credite! Cumpără un pachet sau folosește testul gratuit.");
      return;
    }

    setLoading(true);
    setStatus(isFree ? 'Generăm test gratuit (5 secunde)...' : 'Procesăm la calitate maximă...');

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);

      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl: publicUrl, 
          tool: selectedTool,
          prompt: prompt,
          isFreeTrial: isFree 
        }),
      });

      const data = await response.json();
      if (data.output) {
        setResult(Array.isArray(data.output) ? data.output[0] : data.output);
        // Dacă nu a fost trial, scădem un credit vizual (baza de date se ocupă prin webhook sau funcție)
        if (!isFree && typeof userCredits === 'number') setUserCredits(userCredits - 1);
      } else {
        throw new Error(data.error || "AI-ul nu a răspuns.");
      }
    } catch (error: any) {
      alert("Eroare Neura: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tools = [
    { id: 'wan-video', name: 'Wan 2.5 Video', desc: 'Generare Video cinematic', icon: <Film className="text-blue-500" /> },
    { id: 'upscale', name: 'Neura Upscale', desc: 'Claritate 4K & Face Fix', icon: <Sparkles className="text-purple-500" /> },
    { id: 'face-swap', name: 'Face Swap Pro', desc: 'Schimb de fețe realist', icon: <Zap className="text-emerald-500" /> },
    { id: 'colorize', name: 'Colorizare AI', desc: 'Poze vechi în culori', icon: <ImageIcon className="text-orange-500" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-sans relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col items-center">
          <h1 className="text-4xl font-black italic tracking-tighter mb-4">NEURA<span className="text-blue-600">.AI</span></h1>
          <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/5 px-6 py-2 rounded-full backdrop-blur-md">
            <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Balanță:</span>
            <span className="text-blue-400 font-mono font-bold">🪙 {userCredits} Credite</span>
            <button className="ml-4 text-[10px] bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg font-black transition-all">+ CUMPĂRĂ</button>
          </div>
        </header>

        {!result && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {tools.map((tool) => (
              <div 
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${selectedTool === tool.id ? 'border-blue-600 bg-blue-600/5 scale-[1.02]' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'}`}
              >
                <div className="mb-4">{tool.icon}</div>
                <h3 className="font-bold text-lg leading-tight">{tool.name}</h3>
                <p className="text-zinc-500 text-xs mt-2 leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl shadow-3xl">
          {loading ? (
            <div className="py-20 text-center animate-pulse">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-[0_0_20px_rgba(37,99,235,0.3)]"></div>
              <p className="text-blue-400 font-bold tracking-widest uppercase text-xs">{status}</p>
            </div>
          ) : result ? (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="rounded-[2rem] overflow-hidden border border-zinc-800 mb-8 bg-black shadow-2xl">
                {selectedTool === 'wan-video' || result.includes('.mp4') ? (
                  <video src={result} controls autoPlay loop className="w-full h-auto" />
                ) : (
                  <img src={result} alt="AI Result" className="w-full h-auto" />
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href={result} target="_blank" rel="noreferrer" className="bg-white text-black px-12 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all text-center">
                  DESCARCĂ FIȘIERUL
                </a>
                <button onClick={() => setResult(null)} className="bg-zinc-800 text-white px-12 py-4 rounded-2xl font-bold hover:bg-zinc-700 transition">
                  PROIECT NOU
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {selectedTool === 'wan-video' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-2">Descrie mișcarea dorită</label>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: camera rotates around the subject, slow motion, cinematic lighting, 4k detail..."
                    className="w-full bg-black/50 border border-zinc-800 rounded-[1.5rem] p-6 text-white focus:border-blue-600 outline-none h-32 text-sm resize-none transition-all focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {/* Buton PRO */}
                <div className="relative group">
                  <input type="file" onChange={(e) => handleUpload(e, false)} className="hidden" id="file-pro" />
                  <label htmlFor="file-pro" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center shadow-2xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1">
                    <div className="flex items-center gap-2">
                      <Zap size={20} />
                      <span className="text-lg">PROCESEAZĂ COMPLET (1 CREDIT)</span>
                    </div>
                    <span className="text-[10px] opacity-70 font-bold mt-1 tracking-widest uppercase italic">Fără limitări • Calitate Maximă 4K</span>
                  </label>
                </div>

                {/* Buton GRATUIT */}
                <div className="relative group">
                  <input type="file" onChange={(e) => handleUpload(e, true)} className="hidden" id="file-free" />
                  <label htmlFor="file-free" className="w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 font-bold py-5 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center border border-zinc-700">
                    <div className="flex items-center gap-2">
                      <PlayCircle size={18} className="text-blue-500" />
                      <span className="text-sm">TEST GRATUIT (5 SECUNDE)</span>
                    </div>
                    <span className="text-[9px] opacity-40 uppercase tracking-tighter mt-1 italic">Rezoluție redusă • Demo rapid</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 opacity-30">
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest"><ShieldCheck size={12}/> Securizat</div>
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest"><CreditCard size={12}/> Plată Stripe</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
