'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Verificăm dacă variabilele există, dacă nu, punem un text gol ca să nu crape build-ul
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DashboardNeura() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus('Se încarcă imaginea...');

    try {
      const fileName = `${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setStatus('AI-ul procesează...');

      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });

      const data = await response.json();
      if (data.output) {
        setResult(data.output);
      } else {
        throw new Error(data.error || "Eroare AI");
      }
    } catch (error: any) {
      console.error(error);
      alert("Eroare: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 text-center">
      <h1 className="text-3xl font-bold mb-8 text-blue-500 font-mono">NEURA ENGINE v1.1</h1>
      
      <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 p-10 rounded-3xl">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-blue-400">{status}</p>
          </div>
        ) : result ? (
          <div>
            <img src={result} alt="Result" className="rounded-lg mb-6 mx-auto shadow-2xl" />
            <button onClick={() => setResult(null)} className="bg-white text-black px-6 py-2 rounded-full font-bold">Procesează Alta</button>
          </div>
        ) : (
          <div>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="file-input" />
            <label htmlFor="file-input" className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-bold cursor-pointer transition-all inline-block">
              SELECTEAZĂ POZA ACUM
            </label>
            <p className="text-zinc-500 mt-4 text-sm font-mono italic">3 CREDITE DISPONIBILE</p>
          </div>
        )}
      </div>
    </div>
  );
}
