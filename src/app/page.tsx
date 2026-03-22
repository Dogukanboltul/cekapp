'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

// TÜM BLOKLAR BURAYA
import MarketRadar from '../components/MarketRadar'; 
import ReportForm from '../components/ReportForm';
import AnalysisEngine from '../components/AnalysisEngine';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 font-sans uppercase tracking-tighter overflow-x-hidden">
      
      <ReportForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <header className="max-w-7xl mx-auto py-10 px-6 flex justify-between items-center border-b border-white/5">
          <h1 className="text-5xl font-black italic tracking-tighter leading-none">
            ÇEK<span className="text-teal-500">APP</span>
          </h1>
          <button onClick={() => setIsModalOpen(true)} className="...">
            <AlertTriangle className="w-5 h-5 animate-bounce" /> KARŞILIKSIZ EVRAK BİLDİR
          </button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 px-6 py-16">
        {/* SOL TARAF: ARTIK MODÜLER */}
        <div className="lg:col-span-2">
           <AnalysisEngine />
        </div>

        {/* SAĞ TARAF: RADAR MODÜLÜ */}
        <MarketRadar />
      </main>
    </div>
  );
}