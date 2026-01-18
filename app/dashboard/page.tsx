'use client';

import React from 'react';

export default function DashboardNeura() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Neura AI Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Îmbunătățește claritatea imaginilor tale în câteva secunde.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm">
            🪙 3 Credite disponibile
          </div>
        </div>

        <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl p-12 text-center hover:border-blue-500 transition-all cursor-pointer">
          <div className="text-5xl mb-4">🖼️</div>
          <h2 className="text-xl font-semibold mb-2">Încarcă o imagine sau un video</h2>
          <p className="text-gray-500 mb-6">Trage fișierul aici sau apasă pentru a selecta de pe calculator</p>
          <input type="file" className="hidden" id="fileUpload" />
          <label 
            htmlFor="fileUpload" 
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition cursor-pointer inline-block"
          >
            Alege fișierul
          </label>
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6">Galeria Mea</h3>
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