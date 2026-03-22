'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

// BİLEŞENLER
import MarketRadar from '@/components/MarketRadar'; 
import MarketFlow from '@/components/Marketflow';
import ReportForm from '@/components/ReportForm';
import AnalysisEngine from '@/components/AnalysisEngine';
import FooterAI from '@/components/FooterAi';
import IntelligenceFlow from '@/components/IntelligenceFlow';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#060a14] text-slate-100 font-sans uppercase tracking-tighter overflow-x-hidden">
      
      <ReportForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* HEADER */}
      <header className="max-w-[1600px] mx-auto w-full py-6 md:py-8 px-4 md:px-6 flex justify-between items-center border-b border-white/5 bg-[#060a14]/80 backdrop-blur-md sticky top-0 z-50 lg:static">
        <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none select-none cursor-default">
          ÇEK<span className="text-teal-500">APP</span>
        </h1>
        
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-xl shadow-xl active:scale-95 transition-all"
        >
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> 
          <span className="font-black text-[9px] md:text-[10px] italic tracking-widest uppercase text-white">
            BİLDİR
          </span>
        </button>
      </header>

      {/* --- ANA GRID YAPISI --- */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 md:px-6 py-6 md:py-12">
        
        {/* grid-cols-2: Mobilde yan yana ikişerli dizilir.
            lg:grid-cols-4: Masaüstünde senin orijinal 4'lü yapına döner.
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          
          {/* 1. ÜST AKIŞ: Mobilde 2 kolonu da kaplasın (Tam genişlik) */}
          <div className="col-span-2 order-1 lg:order-2 space-y-6 md:space-y-8">
            <IntelligenceFlow />
            
            {/* Analiz Motoru: Mobilde de tam genişlik olmalı ki form rahat kullanılsın */}
            <AnalysisEngine />
            
            <div className="hidden md:block p-6 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent rounded-[2.5rem] text-center border-y border-white/5">
               <p className="text-[9px] text-slate-500 font-black tracking-[0.5em] uppercase">
                 TÜM ANALİZLER KVKK KAPSAMINDA ŞİFRELENMEKTEDİR
               </p>
            </div>
          </div>

          {/* 2. PİYASA RADARI: Mobilde Sol Yarıyı Kaplar (1 Kolon) */}
          <div className="col-span-1 order-2 lg:order-3 space-y-4">
            <div className="h-full">
               <MarketRadar />
            </div>
          </div>

          {/* 3. SEKTÖREL AKIŞ: Mobilde Sağ Yarıyı Kaplar (1 Kolon) */}
          <div className="col-span-1 order-3 lg:order-1 space-y-4">
            <div className="h-full">
               <MarketFlow />
            </div>
          </div>

          {/* 4. MOBİL ALT NOT: Mobilde 2 kolonu birden kaplasın */}
          <div className="col-span-2 order-4 lg:hidden p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
            <p className="text-[8px] font-black text-slate-600 italic tracking-wider uppercase">
               SAHADAN GELEN GERÇEK ZAMANLI VERİ AKIŞI
            </p>
          </div>

        </div>
      </main>

      <FooterAI />
      
    </div>
  );
}