'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function DashboardNeura() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [selectedTool, setSelectedTool] = useState('wan-video'); // wan-video, upscale, face-swap
  const [prompt, setPrompt] = useState('');

  const tools = [
    { id: 'wan-video', name: 'Wan 2.1 Video', desc: 'Generare Video Pro (Image-to-Video)', icon: '🎬' },
    { id: 'upscale', name: 'Neura Upscale', desc: 'Claritate 4K & Face Recovery', icon: '💎' },
    { id: 'face-swap', name: 'Face Swap Pro', desc: 'Schimb de fețe ultra-realist', icon: '🎭' },
    { id: 'colorize', name: 'Colorizare AI', desc: 'Redă culoarea pozelor vechi', icon: '🎨' },
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setStatus('Se pregătește fișierul...');

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);

      setStatus('Neura AI procesează... Generarea video poate dura 2-3 minute.');

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
        // Modelele video de obicei returnează un array sau un string direct
        setResult(Array.isArray(data.output) ? data.output[0] : data.output);
      } else {
        throw new Error(data.error || "Eroare AI");
      }
    } catch (error: any) {
      alert("Eroare: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tighter mb-4 italic">NEURA<span className="text-blue-600">.AI</span></h1>
          <p className="text-zinc-500 uppercase tracking-widest text-xs">Studioul tău de creație multimedia</p>
        </header>

        {/* GRILA DE INSTRUMENTE */}
        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {tools.map((tool) => (
              <div 
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedTool === tool.id ? 'border-blue-600 bg-blue-600/5' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'}`}
              >
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3 className="font-bold text-lg">{tool.name}</h3>
                <p className="text-zinc-500 text-sm mt-1">{tool.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* ZONA DE INPUT */}
        <div className="max-w-3xl mx-auto bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-sm">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-blue-400 font-medium animate-pulse">{status}</p>
            </div>
          ) : result ? (
            <div className="text-center">
              <div className="rounded-2xl overflow-hidden border border-zinc-800 mb-6 bg-black">
                {selectedTool.includes('video') || result.endsWith('.mp4') ? (
                  <video src={result} controls autoPlay loop className="w-full" />
                ) : (
                  <img src={result} alt="Result" className="w-full h-auto" />
                )}
              </div>
              <div className="flex justify-center gap-4">
                <a href={result} target="_blank" className="bg-white text-black px-10 py-4 rounded-full font-bold">DESCARCĂ</a>
                <button onClick={() => setResult(null)} className="bg-zinc-800 px-10 py-4 rounded-full font-bold">ALT PROIECT</button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Prompt pentru modelele generative (Video/Wan) */}
              {selectedTool === 'wan-video' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 ml-1">Descrie mișcarea (Prompt)</label>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: cinematic motion, the camera zooms into the eyes, 4k, highly detailed..."
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white focus:border-blue-600 outline-none h-24"
                  />
                </div>
              )}

              <input type="file" onChange={handleUpload} className="hidden" id="file-input" />
              <label htmlFor="file-input" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center border-b-4 border-blue-800 active:border-b-0 active:translate-y-1">
                <span className="text-2xl mb-1">⬆️</span>
                ÎNCARCĂ {selectedTool === 'wan-video' ? 'IMAGINE PENTRU VIDEO' : 'FIȘIERUL'}
              </label>
              <p className="text-center text-zinc-600 text-xs">AI activ: {tools.find(t => t.id === selectedTool)?.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setStatus('AI-ul procesează... Acest lucru poate dura (mai ales la video).');

      // 2. Trimitem la API-ul nostru, specificând tipul (image sau video)
      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl: publicUrl,
          mediaType: mediaType 
        }),
      });

      const data = await response.json();
      if (data.output) {
        setResult(data.output);
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
    <div className="min-h-screen bg-black text-white p-8 text-center font-sans">
      <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        NEURA ENGINE v1.2
      </h1>
      <p className="text-zinc-500 mb-10">Selectează instrumentul AI dorit mai jos</p>
      
      {/* Selector între Foto și Video (Inspirat de Gigapixel) */}
      <div className="bg-zinc-900 p-1 rounded-2xl inline-flex mb-10 border border-zinc-800 shadow-xl">
        <button 
          onClick={() => { setMediaType('image'); setResult(null); }}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${mediaType === 'image' ? 'bg-blue-600 shadow-lg' : 'text-gray-500 hover:text-white'}`}
        >
          FOTO AI
        </button>
        <button 
          onClick={() => { setMediaType('video'); setResult(null); }}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${mediaType === 'video' ? 'bg-blue-600 shadow-lg' : 'text-gray-500 hover:text-white'}`}
        >
          VIDEO AI
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-900 p-12 rounded-[2rem] shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center py-10">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-500 mb-6"></div>
            <p className="text-blue-400 font-medium animate-pulse">{status}</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-zinc-800">
               {mediaType === 'image' ? (
                 <img src={result} alt="Result" className="w-full h-auto shadow-2xl" />
               ) : (
                 <video src={result} controls className="w-full h-auto shadow-2xl" />
               )}
            </div>
            <div className="flex justify-center gap-4">
               <a href={result} target="_blank" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition">
                 DESCARCĂ REZULTAT
               </a>
               <button onClick={() => setResult(null)} className="text-zinc-400 hover:text-white underline font-medium">
                 Încearcă alta
               </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8 opacity-50">
               {mediaType === 'image' ? '📸' : '🎬'}
            </div>
            <input 
              type="file" 
              accept={mediaType === 'image' ? "image/*" : "video/*"} 
              onChange={handleUpload} 
              className="hidden" 
              id="file-input" 
            />
            <label 
              htmlFor="file-input" 
              className="bg-blue-600 hover:bg-blue-500 px-12 py-5 rounded-2xl font-bold cursor-pointer transition-all inline-block shadow-lg shadow-blue-600/20"
            >
              ÎNCARCĂ {mediaType === 'image' ? 'IMAGINE' : 'VIDEO'}
            </label>
            <p className="text-zinc-600 mt-6 text-sm">
              Sistemul va procesa fișierul folosind modelele <br/>
              {mediaType === 'image' ? 'Real-ESRGAN Face Recovery' : 'Video Retoucher AI'}
            </p>
          </div>
        )}
      </div>
      
      <p className="text-zinc-700 mt-10 font-mono text-xs uppercase tracking-widest">
        Powered by Neura Cloud Infrastructure
      </p>
    </div>
  );
}
