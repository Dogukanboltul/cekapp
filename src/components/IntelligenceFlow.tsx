'use client';

import React, { useRef, useEffect } from 'react';
import { MapPin, ShieldCheck, AlertCircle, TrendingUp, TrendingDown, Info, Landmark } from 'lucide-react';

interface CityData {
  type: 'city';
  name: string;
  risk: string;
  paid: string;    // İbrazında Ödenen
  unpaid: string;  // Karşılıksız Çıkan
  color: string;
  bg: string;
}

interface InfoData {
  type: 'info';
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

type FlowItem = CityData | InfoData;

export default function IntelligenceFlow() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Renkleri daha okunaklı ve kontrastı yüksek seçtim
  const rawCities: Omit<CityData, 'type'>[] = [
    { name: 'İSTANBUL', risk: 'KRİTİK', paid: '%92.1', unpaid: '%7.9', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
    { name: 'ANKARA', risk: 'YÜKSEK', paid: '%94.2', unpaid: '%5.8', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
    { name: 'İZMİR', risk: 'ORTA', paid: '%96.5', unpaid: '%3.5', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
    { name: 'BURSA', risk: 'STABİL', paid: '%98.1', unpaid: '%1.9', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { name: 'ANTALYA', risk: 'YÜKSEK', paid: '%93.8', unpaid: '%6.2', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
    { name: 'GAZİANTEP', risk: 'ORTA', paid: '%95.7', unpaid: '%4.3', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  ];

  const protocols: Omit<InfoData, 'type'>[] = [
    { title: 'KAREKOD', desc: 'FİNDEKS ÜZERİNDEN SORGULAYIN.', icon: <Info size={12} />, color: 'text-teal-400' },
    { title: 'İMZA TEYİT', desc: 'SİRKÜLER VE YETKİ KONTROLÜ.', icon: <ShieldCheck size={12} />, color: 'text-blue-400' },
    { title: 'VADE', desc: 'SIRA DIŞI VADELERE DİKKAT EDİN.', icon: <AlertCircle size={12} />, color: 'text-pink-400' },
  ];

  const mixedFlow: FlowItem[] = [];
  rawCities.forEach((city, i) => {
    mixedFlow.push({ type: 'city', ...city });
    if (i % 2 === 0) {
      const proto = protocols[i % protocols.length];
      mixedFlow.push({ type: 'info', ...proto });
    }
  });

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let animationFrameId: number;
    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 0.8;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full bg-[#0b1222] border border-white/10 rounded-[2rem] p-3 shadow-2xl relative overflow-hidden group">
        
        {/* SABİT ETİKET */}
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#0b1222] via-[#0b1222]/95 to-transparent z-20 flex items-center pl-6 pointer-events-none border-r border-white/5">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-500 tracking-[0.2em] uppercase italic">PİYASA</span>
            <span className="text-[10px] font-black text-white italic tracking-tighter uppercase leading-none mt-1">İSTİHBARAT</span>
          </div>
        </div>

        {/* AKIŞ */}
        <div ref={scrollRef} className="flex items-center gap-4 overflow-x-hidden whitespace-nowrap ml-24">
          {[...mixedFlow, ...mixedFlow].map((item, i) => (
            <div key={i} className={`flex-none min-w-[220px] p-3 rounded-2xl border transition-all ${item.type === 'city' ? item.bg : 'border-white/5 bg-white/[0.03]'}`}>
              {item.type === 'city' ? (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className={item.color} />
                      <span className="text-[11px] font-black text-white italic">{item.name}</span>
                    </div>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded bg-black/40 ${item.color}`}>{item.risk}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
                    <div className="flex flex-col leading-none">
                      <span className="text-[7px] font-bold text-slate-500 uppercase">ÖDENEN</span>
                      <span className="text-[9px] font-black text-emerald-400 mt-0.5">{item.paid}</span>
                    </div>
                    <div className="flex flex-col items-end leading-none">
                      <span className="text-[7px] font-bold text-slate-500 uppercase">KARŞILIKSIZ</span>
                      <span className="text-[9px] font-black text-red-400 mt-0.5">{item.unpaid}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 h-[44px]">
                  <div className={`p-2 rounded-xl bg-black/50 ${item.color} border border-white/10`}>{item.icon}</div>
                  <div className="flex flex-col leading-tight">
                    <span className={`text-[9px] font-black italic tracking-wider ${item.color}`}>{item.title}</span>
                    <span className="text-[8px] font-bold text-slate-200 uppercase tracking-tighter">{item.desc}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 flex items-center justify-between">
        <p className="text-[9px] font-black text-slate-600 tracking-[0.1em] uppercase italic">
          GÜNCEL İBRAZ VE ÖDEME VERİLERİ <span className="text-slate-800">//</span> 81 İL ANALİZİ
        </p>
        <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest italic">VERİ: TBB RİSK MERKEZİ 2026</p>
      </div>
    </div>
  );
}