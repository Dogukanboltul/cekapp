'use client';

import React, { useState } from 'react';
import { AlertTriangle, Banknote, Zap, ShieldCheck, BarChart3, Percent, CheckCircle2 } from 'lucide-react';

// BİLEŞENLER
import MarketRadar from '@/components/MarketRadar'; 
import MarketFlow from '@/components/Marketflow';
import ReportForm from '@/components/ReportForm';
import AnalysisEngine from '@/components/AnalysisEngine';
import FooterAI from '@/components/FooterAi';
import IntelligenceFlow from '@/components/IntelligenceFlow';
import AskCekAppAI from '@/components/AskCekAppAI'; // ASİSTAN İMPORTU

// --- ANA SAYFA PAZARLAMA İÇİN STATİK SKOR BİLEŞENİ ---
const FactoringPreview = () => (
  <div className="mt-6 p-6 rounded-[2.5rem] bg-gradient-to-br from-[#1a1a2e] to-black border border-amber-500/20 shadow-2xl relative overflow-hidden group text-left">
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 blur-[50px] group-hover:bg-amber-500/20 transition-all duration-700" />
    
    <div className="relative z-10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Banknote className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-black text-white uppercase italic tracking-widest">ÖRNEK LİKİDİTE ANALİZİ</span>
        </div>
        <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[8px] text-amber-500 font-black italic uppercase text-left">Canlı Skorlama</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 opacity-50">
            <Percent size={10} />
            <span className="text-[8px] font-bold uppercase italic">Ort. İskonto</span>
          </div>
          <p className="text-xl font-black italic text-white tracking-tighter">%2.85</p>
        </div>
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2 justify-end opacity-50">
            <BarChart3 size={10} />
            <span className="text-[8px] font-bold uppercase italic">Likit Skoru</span>
          </div>
          <p className="text-xl font-black italic text-emerald-500 tracking-tighter">92/100</p>
        </div>
      </div>

      <div className="pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <p className="text-[9px] font-bold text-slate-400 uppercase italic text-left">
            Bu evrak factoring piyasasında <span className="text-white">"A-Level"</span> likit kabul edilir.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#060a14] text-slate-100 font-sans uppercase tracking-tighter overflow-x-hidden selection:bg-teal-500/30">
      
      <ReportForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* HEADER */}
      <header className="w-full py-4 md:py-8 px-4 md:px-6 flex justify-between items-center border-b border-white/5 sticky top-0 z-50 bg-[#060a14]/90 backdrop-blur-md">
        <div className="flex flex-col text-left">
          <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter leading-none text-white text-left">
            ÇEK<span className="text-teal-500">APP</span>
          </h1>
          <span className="text-[8px] font-bold text-teal-500/50 tracking-[0.3em] mt-1 uppercase italic text-left">Risk & Liquidity Unit</span>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)]">
          <AlertTriangle size={14} className="animate-pulse text-white" /> 
          <span className="font-black text-[10px] italic text-white uppercase tracking-widest">ŞÜPHELİ BİLDİR</span>
        </button>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-10">
          
          {/* SOL PANEL: SEKTÖREL AKIŞ */}
          <div className="order-3 lg:order-1 lg:col-span-1 space-y-6">
             <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-1 overflow-hidden h-full shadow-2xl relative group">
                <MarketFlow />
             </div>
          </div>

          {/* MERKEZ PANEL: ANA ANALİZ */}
          <div className="order-1 lg:order-2 lg:col-span-2 space-y-8">
            <div className="w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-transparent via-white/5 to-transparent py-2">
                <IntelligenceFlow />
            </div>

            {/* ANA MOTOR */}
            <div className="w-full bg-[#0b1222]/50 rounded-[3rem] border border-white/5 p-2 shadow-2xl">
                <AnalysisEngine />
            </div>

            {/* MEVZUAT ASİSTANI (YENİ EKLEDİĞİMİZ KISIM) */}
            <div className="w-full bg-[#0b1222]/50 rounded-[3rem] border border-white/5 p-2 shadow-2xl">
                <AskCekAppAI />
            </div>

            {/* ARA SLOGAN VE GÜVEN DAMGASI */}
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
               <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
               <div className="flex gap-8 opacity-40">
                  <span className="text-[10px] font-black italic uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14}/> %100 Resmi Veri</span>
                  <span className="text-[10px] font-black italic uppercase tracking-widest flex items-center gap-2"><Banknote size={14}/> Anında Nakit Öngörüsü</span>
               </div>
            </div>
          </div>

          {/* SAĞ PANEL: PİYASA RADARI + FACTORING SCORE PAZARLAMASI */}
          <div className="order-2 lg:order-3 lg:col-span-1 flex flex-col gap-6">
             <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-1 overflow-hidden shadow-2xl">
                <MarketRadar />
             </div>

             <div className="relative">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-600 rounded-full text-[8px] font-black italic tracking-widest z-10 shadow-lg animate-bounce">
                  NEDİR BU?
                </div>
                <FactoringPreview />
                <p className="mt-3 px-6 text-[9px] font-bold text-slate-500 italic uppercase leading-tight text-left">
                  * Sorguladığınız her firma için yukarıdaki gibi <span className="text-amber-500">Factoring Uygunluk Raporu</span> anlık olarak üretilir.
                </p>
             </div>
          </div>

        </div>
      </main>

      <FooterAI />
    </div>
  );
}