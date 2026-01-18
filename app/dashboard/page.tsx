'use client';

import React, { useState } from 'react';

export default function DashboardNeura() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = async (e: any) => {
    // Pentru test, folosim un link de imagine fix (vom adăuga upload-ul real ulterior)
    const testImage = "https://replicate.delivery/pbxt/IJ2m5pL2d9L2A4I4J4J4J4J4J4J4J4J4/seed1024.png";
    
    setLoading(true);
    try {
      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: testImage }),
      });

      const data = await response.json();
      if (data.output) {
        setResult(data.output);
      }
    } catch (error) {
      alert("Eroare la procesare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Neura AI Engine
        </h1>
        
        <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl p-12 mb-8">
          {loading ? (
            <div className="py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>AI-ul lucrează la imaginea ta... Te rog așteaptă.</p>
            </div>
          ) : result ? (
            <div>
              <img src={result} alt="Rezultat" className="max-h-96 mx-auto rounded-lg shadow-2xl mb-6" />
              <a href={result} download className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-bold">
                Descarcă Imaginea Clară
              </a>
              <button onClick={() => setResult(null)} className="ml-4 text-gray-400 underline">Încarcă alta</button>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-6 text-lg">Test de procesare Neura v1.0</p>
              <button 
                onClick={handleUpload}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl transition shadow-lg shadow-blue-600/20"
              >
                TESTEAZĂ AI (4x Upscale)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}