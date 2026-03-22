'use client';

import React, { useState } from "react";
import { Activity, ChevronRight, Flame, Globe, AlertCircle, TrendingDown, Zap, Timer } from "lucide-react";

export default function MarketRadar() {
  const [feeds] = useState([
    { id: 1, text: "TEKSTİL: DENİZLİ MERKEZLİ 3 FİRMADAN KONKORDATO TALEBİ", time: "2dk önce", type: "CRITICAL", icon: <Flame size={14} className="text-orange-500 animate-pulse" /> },
    { id: 2, text: "LOJİSTİK: AKARYAKIT ZAMMI SONRASI VADE SÜRELERİ 90 GÜNE ÇIKTI", time: "12dk önce", type: "WARNING", icon: <TrendingDown size={14} className="text-red-500" /> },
    { id: 3, text: "GIDA: FMCG ÖDEME ENDEKSİNDE %2.4 DARALMA SİNYALİ", time: "28dk önce", type: "INFO", icon: <Activity size={14} className="text-teal-500" /> },
    { id: 4, text: "İNŞAAT: DEMİR-ÇELİK TEDARİKÇİLERİNDE 'NAKİT SIKIŞIKLIĞI' RAPORLANDI", time: "45dk önce", type: "CRITICAL", icon: <AlertCircle size={14} className="text-red-600 animate-bounce" /> },
    { id: 5, text: "PİYASA: İSTANBUL TİCARET ODASI KARŞILIKSIZ ÇEK VERİSİ YAYINLANDI", time: "1sa önce", type: "INFO", icon: <Globe size={14} className="text-slate-400" /> }
  ]);

  return (
    <aside className="space-y-4 max-w-full lg:max-w-[400px] animate-in fade-in slide-in-from-right-10 duration-1000">
      <div className="bg-[#0b1222] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={80} className="text-teal-500" /></div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-red-500/20 p-2 rounded-xl"><Activity size={18} className="text-red-500 animate-pulse" /></div>
              <div>
                <h3 className="text-[11px] font-black text-white tracking-[0.2em] uppercase italic">PİYASA STRES AKIŞI</h3>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">REAL-TIME INTELLIGENCE</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-black px-3 py-1.5 rounded-full border border-white/5">
              <Timer size={10} className="text-teal-500" />
              <span className="text-[9px] font-black text-teal-500 tracking-tighter">LIVE FEED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0b1222]/50 border border-white/5 rounded-[2.5rem] p-4 space-y-3 backdrop-blur-sm">
        <div className="space-y-2">
          {feeds.map((feed) => (
            <div key={feed.id} className="group flex items-start gap-4 p-4 bg-black/40 border border-white/[0.03] rounded-[1.8rem] hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer">
              <div className="mt-0.5 bg-black/60 p-2 rounded-lg border border-white/5 group-hover:border-teal-500/30 transition-colors">{feed.icon}</div>
              <div className="flex-1 space-y-1">
                <p className={`text-[11px] font-black leading-snug uppercase italic transition-colors ${feed.type === 'CRITICAL' ? 'text-slate-100' : 'text-slate-400'} group-hover:text-white`}>{feed.text}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">{feed.time}</span>
                  {feed.type === 'CRITICAL' && <span className="text-[7px] font-black text-red-500 animate-pulse">● KRİTİK ANALİZ</span>}
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-800 group-hover:text-teal-500 self-center transition-all" />
            </div>
          ))}
        </div>
        <button className="w-full py-4 mt-2 bg-gradient-to-r from-transparent via-white/5 to-transparent hover:via-teal-500/10 transition-all text-[9px] font-black text-slate-500 hover:text-teal-500 uppercase tracking-[0.3em] rounded-xl border-t border-white/5">TÜM VERİ GEÇMİŞİNİ İNCELE</button>
      </div>
    </aside>
  );
}