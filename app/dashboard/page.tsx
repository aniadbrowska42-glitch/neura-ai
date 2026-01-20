'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configurare Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardNeura() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus('Se pregătește încărcarea...');

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Configurația Supabase lipsește!");
      }

      const fileName = `${Date.now()}-${file.name}`;
      setStatus('Se încarcă imaginea în Neura Cloud...');
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setStatus('AI-ul lucrează la claritate... Te rugăm așteaptă.');

      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });

      const data = await response.json();
      if (data.output) {
        setResult(data.output);
        setStatus('Gata!');
      } else {
        throw new Error(data.error || "AI-ul nu a răspuns.");
      }
    } catch (error: any) {
      console.error(error);
      alert("Eroare Neura: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Neura AI Dashboard
        </h1>
        
        <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl p-12 mb-8 shadow-2xl">
          {loading ? (
            <div className="py-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-blue-400 font-medium">{status}</p>
            </div>
          ) : result ? (
            <div>
              <img src={result} alt="Rezultat" className="max-h-96 mx-auto rounded-xl shadow-2xl mb-6 border border-zinc-700" />
              <div className="flex justify-center gap-4">
                <a href={result} target="_blank" rel="noreferrer" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition">
                  Descarcă Imaginea 4K
                </a>
                <button onClick={() => setResult(null)} className="bg-zinc-800 px-8 py-3 rounded-xl font-bold">
                  Procesează Alta
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-8">Încarcă o poză veche sau pixelată pentru a-i reda claritatea.</p>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="realUpload" />
              <label 
                htmlFor="realUpload"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-12 rounded-2xl transition cursor-pointer inline-block shadow-lg shadow-blue-600/20"
              >
                SELECTEAZĂ POZA DIN CALCULATOR
              </label>
            </div>
          )}
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6 text-left">Galeria Mea</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-gray-700">
               Nicio imagine procesată încă.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
