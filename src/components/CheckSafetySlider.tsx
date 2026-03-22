'use client';

import React, { useRef } from 'react';
import { ShieldCheck, ChevronLeft, ChevronRight, Eye, FileText, Landmark, Search } from 'lucide-react';

export default function CheckSafetySlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const safetyTips = [
    { 
      title: 'KAREKOD KONTROLÜ', 
      desc: 'Findeks karekodunu mutlaka okutun, geçmiş ödeme performansını teyit edin.', 
      icon: <Search size={14} />,
      color: 'text-teal-500', 
      bg: 'border-teal-500/20 bg-teal-500/5' 
    },
    { 
      title: 'KEFİL İMZASI', 
      desc: 'Çek arkasındaki ciroların tam ve yetkili imzalar olduğunu kontrol edin.', 
      icon: <FileText size={14} />,
      color: 'text-orange-500', 
      bg: 'border-orange-500/20 bg-orange-500/5' 
    },
    { 
      title: 'BANKA TEYİDİ', 
      desc: 'Şüpheli durumlarda muhatap banka şubesini arayıp çekin geçerliliğini sorun.', 
      icon: <Landmark size={14} />,
      color: 'text-blue-500', 
      bg: 'border-blue-500/20 bg-blue-500/5' 
    },
    { 
      title: 'VADE UYUMU', 
      desc: 'Çek vadesinin piyasa ortalamasıyla (90-120 gün) uyumlu olduğunu kontrol edin.', 
      icon: <Eye size={14} />,
      color: 'text-purple-500', 
      bg: 'border-purple-500/20 bg-purple-500/5' 
    },
    { 
      title: 'SAHTE EVRAK', 
      desc: 'Kağıt dokusu, ışığa tutulduğunda görünen filigran ve hologramı inceleyin.', 
      icon: <ShieldCheck size={14} />,
      color: 'text-red-500', 
      bg: 'border-red-500/20 bg-red-500/5' 
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 280 : scrollLeft + 280;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full bg-[#0b1222] border border-white/5 rounded-[2rem] p-3 shadow-2xl relative group overflow-hidden">
        
        {/* SABİT ETİKET */}
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#0b1222] via-[#0b1222]/95 to-transparent z-10 flex items-center pl-6 pointer-events-none">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-500 tracking-[0.3em] uppercase italic leading-none">KABUL</span>
            <span className="text-[10px] font-black text-white italic tracking-tighter uppercase leading-none mt-1">PROTOKOLÜ</span>
          </div>
        </div>

        {/* NAVİGASYON */}
        <button onClick={() => scroll('left')} className="absolute left-28 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeft size={12} className="text-white" />
        </button>
        <button onClick={() => scroll('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={12} className="text-white" />
        </button>

        {/* İPUCU KARTLARI */}
        <div 
          ref={scrollRef}
          className="flex items-center gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory ml-24 pr-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {safetyTips.map((tip, i) => (
            <div 
              key={i} 
              className={`flex-none w-[240px] snap-center p-3 rounded-2xl border ${tip.bg} backdrop-blur-sm transition-all hover:scale-[0.98] group/card cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl bg-black/40 border ${tip.bg} transition-transform group-hover/card:rotate-6`}>
                  <span className={tip.color}>{tip.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black italic leading-none ${tip.color}`}>{tip.title}</span>
                  <p className="text-[8px] font-medium text-slate-400 mt-1.5 leading-relaxed uppercase tracking-tighter italic">
                    {tip.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALT BİLGİ ŞERİDİ */}
      <div className="px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={10} className="text-teal-500/50" />
          <p className="text-[9px] font-black text-slate-600 tracking-[0.2em] uppercase italic leading-none">
            GÜVENLİ TİCARET REHBERİ <span className="text-slate-800">//</span> ÇEK ALIRKEN DİKKAT EDİLECEKLER
          </p>
        </div>
        <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest italic">CEKAPP AI GÜVENLİK</p>
      </div>
    </div>
  );
}