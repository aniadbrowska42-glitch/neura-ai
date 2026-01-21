'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configurare Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DashboardNeura() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus(mediaType === 'image' ? 'Se încarcă imaginea...' : 'Se încarcă video...');

    try {
      const fileName = `${Date.now()}-${file.name}`;
      
      // 1. Upload în Supabase Storage (folosim același bucket 'images')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

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
