'use client';

import React from "react";
import { 
  Percent, 
  Banknote, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";

interface FactoringProps {
  firmName: string;
  isSafe: boolean;
}

export default function FactoringScore({ firmName, isSafe }: FactoringProps) {
  // Buradaki rakamlar piyasa simülasyonudur, normalde API'den beslenebilir.
  const mockData = {
    discountRate: isSafe ? "%2.4 - %3.1" : "N/A",
    liquidityScore: isSafe ? 85 : 0,
    bankAcceptance: isSafe ? "YÜKSEK" : "KABUL EDİLEMEZ",
    estTime: isSafe ? "2-4 Saat" : "İşlem Yapılamaz"
  };

  return (
    <div className="mt-4 animate-in slide-in-from-right duration-700">
      <div className="bg-[#0b1222] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
        {/* Background Accent */}
        <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 ${isSafe ? 'bg-emerald-500' : 'bg-red-500'}`} />

        <div className="relative z-10 space-y-6">
          {/* Başlık */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black text-white uppercase italic tracking-widest">FACTORING ÖN ANALİZ</span>
            </div>
            <div className="bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[8px] text-amber-500 font-bold uppercase italic">
              Piyasa Tahmini
            </div>
          </div>

          {/* Skor Kartları */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Percent className="w-3 h-3 text-slate-500" />
                <span className="text-[8px] font-bold text-slate-500 uppercase italic">İskonto Oranı</span>
              </div>
              <p className={`text-[12px] font-black uppercase italic ${isSafe ? 'text-white' : 'text-red-500'}`}>
                {mockData.discountRate}
              </p>
            </div>

            <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-3 h-3 text-slate-500" />
                <span className="text-[8px] font-bold text-slate-500 uppercase italic">Likit Skoru</span>
              </div>
              <p className={`text-[12px] font-black uppercase italic ${isSafe ? 'text-emerald-500' : 'text-red-500'}`}>
                {isSafe ? `%${mockData.liquidityScore}` : "KRİTİK"}
              </p>
            </div>
          </div>

          {/* Operasyonel Bilgi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-bold uppercase italic">Banka Teminat Uygunluğu:</span>
              <span className={`font-black italic ${isSafe ? 'text-emerald-400' : 'text-red-600'}`}>
                {mockData.bankAcceptance}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-bold uppercase italic">İşlem Sonuçlanma Süresi:</span>
              <span className="text-white font-black italic">{mockData.estTime}</span>
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className={`p-3 rounded-xl flex items-start gap-2 ${isSafe ? 'bg-emerald-500/5' : 'bg-red-500/5'}`}>
            {isSafe ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <p className="text-[9px] text-slate-400 font-bold leading-tight uppercase italic">
              {isSafe 
                ? `"${firmName}" çekleri factoring piyasasında likit kabul edilir. Mevcut piyasa faizleriyle işlem yapılabilir.`
                : `Mevcut risk durumu nedeniyle factoring ve banka kanalları bu evrakı işleme almayacaktır.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}