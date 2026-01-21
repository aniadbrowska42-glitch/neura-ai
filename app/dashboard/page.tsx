'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configurare Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        const { data } = await supabase
          .from('users')
          .select('credits')
          .eq('id', user.id)
          .single();
        if (data) setUserCredits(data.credits);
      }
    };
    fetchUser();
  }, []);

  const handleBuyCredits = async () => {
    if (!userId) {
      alert("Te rugăm să te loghezi pentru a cumpăra credite.");
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: 'price_1Srw793aP8nP4xIKRXd1v2Eq', // Codul tău Stripe
          userId: userId 
        }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Eroare la deschiderea Stripe.");
    }
  };

  const tools = [
    { id: 'wan-video', name: 'Wan 2.1 Video', desc: 'Generare Video Pro (I2V)', icon: '🎬' },
    { id: 'upscale', name: 'Neura Upscale', desc: 'Claritate 4K & Face Recovery', icon: '💎' },
    { id: 'face-swap', name: 'Face Swap Pro', desc: 'Schimb de fețe realist', icon: '🎭' },
    { id: 'colorize', name: 'Colorizare AI', desc: 'Redă culoarea pozelor vechi', icon: '🎨' },
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus('Se pregătește fișierul...');

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setStatus('AI-ul procesează... Generarea video poate dura câteva minute.');

      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl: publicUrl, 
          tool: selectedTool,
          prompt: prompt 
        }),
      });

      const data = await response.json();
      
      if (data.output) {
        setResult(Array.isArray(data.output) ? data.output[0] : data.output);
        setStatus('Procesare finalizată!');
      } else {
        throw new Error(data.error || "Eroare AI");
      }
    } catch (error: any) {
      console.error(error);
      alert("Eroare Neura: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center relative">
          <h1 className="text-5xl font-black italic tracking-tighter mb-2">
            NEURA<span className="text-blue-600">.AI</span>
          </h1>
          
          {/* Indicator de credite și buton de cumpărare */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <span className="bg-zinc-900 border border-zinc-800 px-4 py-1 rounded-full text-xs font-mono text-zinc-400 uppercase tracking-widest">
               🪙 {userCredits} CREDITE DISPONIBILE
            </span>
            <button 
              onClick={handleBuyCredits}
              className="text-[10px] text-blue-500 hover:text-blue-400 font-bold underline uppercase tracking-tighter"
            >
              + Cumpără 50 Credite (50 RON)
            </button>
          </div>
        </header>

        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-in fade-in zoom-in duration-500">
            {tools.map((tool) => (
              <div 
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedTool === tool.id ? 'border-blue-600 bg-blue-600/5' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'}`}
              >
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3 className="font-bold text-lg leading-tight">{tool.name}</h3>
                <p className="text-zinc-500 text-xs mt-2">{tool.desc}</p>
              </div>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-md shadow-2xl">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-blue-400 font-medium animate-pulse">{status}</p>
            </div>
          ) : result ? (
            <div className="text-center">
              <div className="rounded-2xl overflow-hidden border border-zinc-800 mb-8 bg-black">
                {selectedTool === 'wan-video' || result.includes('.mp4') ? (
                  <video src={result} controls autoPlay loop className="w-full h-auto" />
                ) : (
                  <img src={result} alt="AI Result" className="w-full h-auto" />
                )}
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <a href={result} target="_blank" rel="noreferrer" className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-zinc-200 transition">
                  DESCARCĂ REZULTAT
                </a>
                <button onClick={() => setResult(null)} className="bg-zinc-800 text-white px-10 py-4 rounded-full font-bold hover:bg-zinc-700 transition">
                  PROIECT NOU
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedTool === 'wan-video' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-3 ml-1 tracking-widest">
                    Descrie mișcarea video (Prompt)
                  </label>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: cinematic slow motion, the camera rotates around the subject..."
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white focus:border-blue-600 outline-none h-28 text-sm resize-none"
                  />
                </div>
              )}

              <input type="file" onChange={handleUpload} className="hidden" id="file-input" />
              <label htmlFor="file-input" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-8 rounded-3xl cursor-pointer transition-all flex flex-col items-center justify-center shadow-xl shadow-blue-900/20 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1">
                <span className="text-3xl mb-2 text-white/80">⬆️</span>
                <span className="text-lg uppercase">Încărcare pentru {tools.find(t => t.id === selectedTool)?.name}</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
