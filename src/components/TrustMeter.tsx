'use client';

import React, { useRef } from 'react';
import { MapPin, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

export default function CityRiskSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const cityData = [
    { city: 'İSTANBUL', risk: 'KRİTİK', ratio: '%34.2', trend: 'up', color: 'text-red-500', bg: 'border-red-500/20 bg-red-500/5' },
    { city: 'ANKARA', risk: 'YÜKSEK', ratio: '%12.8', trend: 'up', color: 'text-orange-500', bg: 'border-orange-500/20 bg-orange-500/5' },
    { city: 'İZMİR', risk: 'ORTA', ratio: '%8.4', trend: 'down', color: 'text-yellow-500', bg: 'border-yellow-500/20 bg-yellow-500/5' },
    { city: 'ANTALYA', risk: 'YÜKSEK', ratio: '%7.1', trend: 'up', color: 'text-orange-500', bg: 'border-orange-500/20 bg-orange-500/5' },
    { city: 'BURSA', risk: 'STABİL', ratio: '%6.5', trend: 'down', color: 'text-teal-500', bg: 'border-teal-500/20 bg-teal-500/5' },
    { city: 'GAZİANTEP', risk: 'ORTA', ratio: '%4.2', trend: 'up', color: 'text-yellow-500', bg: 'border-yellow-500/20 bg-yellow-500/5' },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 250 : scrollLeft + 250;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* ANA SLIDER KONTEYNER */}
      <div className="w-full bg-[#0b1222] border border-white/5 rounded-[2rem] p-3 shadow-2xl relative group overflow-hidden">
        
        {/* SOLDAKİ SABİT ETİKET */}
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#0b1222] via-[#0b1222]/95 to-transparent z-10 flex items-center pl-6 pointer-events-none">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-500 tracking-[0.3em] uppercase italic leading-none">BÖLGESEL</span>
            <span className="text-[10px] font-black text-white italic tracking-tighter uppercase leading-none mt-1">RİSK HATTI</span>
          </div>
        </div>

        {/* NAVİGASYON */}
        <button onClick={() => scroll('left')} className="absolute left-28 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeft size={12} className="text-white" />
        </button>
        <button onClick={() => scroll('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={12} className="text-white" />
        </button>

        {/* ŞEHİR KARTLARI */}
        <div 
          ref={scrollRef}
          className="flex items-center gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory ml-24 pr-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cityData.map((data, i) => (
            <div 
              key={i} 
              className={`flex-none w-[190px] snap-center p-3 rounded-2xl border ${data.bg} backdrop-blur-sm transition-all hover:scale-[0.98] group/card cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-black/40 border ${data.bg}`}>
                    <MapPin size={12} className={data.color} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white italic leading-none">{data.city}</span>
                    <span className="text-[7px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">YOĞUNLUK: {data.ratio}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  {data.trend === 'up' ? (
                    <TrendingUp size={10} className="text-red-500 animate-pulse" />
                  ) : (
                    <TrendingDown size={10} className="text-teal-500" />
                  )}
                  <span className={`text-[8px] font-black uppercase mt-1 ${data.color}`}>{data.risk}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⚠️ ALTTAKİ KRİTİK İBARE */}
      <div className="px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle size={10} className="text-red-500/50" />
          <p className="text-[9px] font-black text-slate-600 tracking-[0.2em] uppercase italic leading-none">
            KARŞILIKSIZ ÇEK & SENET RİSKİ <span className="text-slate-800">//</span> GÜNCEL PROJEKSİYON
          </p>
        </div>
        <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">VERİ: TBB RİSK MERKEZİ</p>
      </div>
    </div>
  );
}