'use client';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, TrendingUp, TrendingDown, Link as LinkIcon, AlertCircle } from 'lucide-react';

export interface PlatformData {
  name: string;
  kesinlesmis: number;
  valorlu: number;
  trend: 'up' | 'down' | 'neutral';
  is_connected?: boolean; // Veritabanından gelen bağlantı durumu
}

interface RadarCardProps {
  platforms: PlatformData[];
  onPlatformClick: (name: string) => void;
}

export default function RadarCard({ platforms, onPlatformClick }: RadarCardProps) {
  const [hoveredPlatform, setHoveredPlatform] = useState<PlatformData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Sadece bağlı olanların kesinleşmiş bakiyelerini topla
  const totalSafe = platforms.reduce((acc, curr) => acc + curr.kesinlesmis, 0);
  
  const formatTRY = (val: number) => 
    new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY', 
      maximumFractionDigits: 0 
    }).format(val);

  if (!mounted) return null;

  return (
    <div className="bg-[#0b1222]/80 border-b border-white/5 p-2 shadow-2xl backdrop-blur-md w-full relative z-40">
      <div className="flex flex-row items-center justify-center gap-6 max-w-fit mx-auto">
        
        {/* 🛡️ LİKİT GÜCÜ ÜNİTESİ */}
        <div className="flex items-center gap-2 border-r border-white/10 pr-6 shrink-0">
          <div className="flex flex-col text-center">
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck size={10} className="text-teal-500" />
              <span className="text-[6px] font-black text-slate-500 uppercase tracking-widest italic">TOPLAM LİKİT GÜCÜ</span>
            </div>
            <h2 className="text-sm font-black text-white italic leading-none tracking-tighter">
              {totalSafe > 0 ? formatTRY(totalSafe) : (
                <span className="text-red-500/50 flex items-center gap-1">
                  <AlertCircle size={10} /> VERİ AKIŞI YOK
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* 📊 PLATFORM ŞERİDİ */}
        <div className="flex flex-row items-center justify-center gap-3">
          {platforms.map((p) => {
            // BAĞLANTI KONTROLÜ: Bakiye 0'dan büyükse VEYA veritabanından bağlı bayrağı geldiyse
            const isConnected = p.is_connected || p.kesinlesmis > 0 || p.valorlu > 0;
            
            return (
              <button
                key={p.name}
                onMouseEnter={() => setHoveredPlatform(p)}
                onMouseLeave={() => setHoveredPlatform(null)}
                onClick={() => onPlatformClick(p.name)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 shrink-0 group relative
                  ${isConnected 
                    ? 'bg-teal-500/5 border-teal-500/20 hover:bg-teal-500/10 hover:border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.05)]' 
                    : 'bg-red-500/5 border-red-500/10 opacity-60 hover:opacity-100 hover:border-red-500/30'
                  }
                  ${hoveredPlatform?.name === p.name ? 'scale-105 z-10' : ''}
                `}
              >
                {/* Durum İkonu: Bağlıysa yeşil yanar, değilse kırmızı ölü taklidi yapar */}
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-teal-500 shadow-[0_0_8px_#14b8a6] animate-pulse' : 'bg-red-600'}`} />
                
                <span className={`text-[8px] font-black uppercase italic tracking-widest ${isConnected ? 'text-white' : 'text-slate-500'}`}>
                  {p.name}
                </span>
                
                {isConnected ? (
                  <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1">
                    <span className="text-[10px] font-black text-teal-400 italic leading-none">
                      {formatTRY(p.kesinlesmis)}
                    </span>
                    {p.trend === 'up' ? <TrendingUp size={10} className="text-teal-500" /> : <TrendingDown size={10} className="text-red-500" />}
                  </div>
                ) : (
                  <span className="text-[7px] font-bold text-red-500 uppercase tracking-tighter flex items-center gap-1 group-hover:animate-bounce">
                    <LinkIcon size={8} /> BAĞLA
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 🛰️ HOVER ANALİZ PANELİ */}
        {hoveredPlatform && (hoveredPlatform.is_connected || hoveredPlatform.kesinlesmis > 0) && (
          <div className="absolute top-[110%] left-1/2 -translate-x-1/2 min-w-[350px] z-[60] bg-[#0b1222]/95 border border-teal-500/30 rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-200 backdrop-blur-xl">
            <div className="flex justify-between items-center gap-4">
               <div className="flex flex-col">
                  <span className="text-teal-400 text-[9px] font-black uppercase tracking-widest leading-none">
                    {hoveredPlatform.name} OPERASYONEL RİSK
                  </span>
                  <span className="text-slate-500 text-[7px] font-bold mt-1 uppercase italic">Senkronizasyon: Aktif</span>
               </div>
               
               <div className="flex gap-3 items-center">
                 <div className="flex flex-col items-end">
                    <span className="text-slate-400 text-[7px] font-black uppercase italic">BEKLEYEN VALÖR</span>
                    <span className="text-amber-500 text-[10px] font-black">{formatTRY(hoveredPlatform.valorlu)}</span>
                 </div>
                 
                 <button className="bg-teal-500/10 text-teal-500 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-500 hover:text-black transition-all duration-300 border border-teal-500/20 group/btn">
                   <Zap size={10} fill="currentColor" className="group-hover/btn:scale-125 transition-transform" />
                   <span className="text-[8px] font-black uppercase italic">ERKEN ÇEK</span>
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}