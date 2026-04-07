'use client';

import React from 'react';
import { Banknote, Zap, ShieldCheck, Fingerprint } from 'lucide-react';

export default function StatGrid() {
  return (
    /* py-0 ve mb-8 kullanarak ana içerik bloğuyla olan dikey mesafeyi mühürledik */
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6">
      <StatItem 
        icon={<ShieldCheck size={14}/>} 
        label="RESMİ VERİ" 
        sub="GÜNCEL SİCİL KAYDI" 
        color="text-teal-500"
      />
      <StatItem 
        icon={<Banknote size={14}/>} 
        label="LİKİDİTE" 
        sub="FACTORING SKORU" 
        color="text-emerald-500"
      />
      <StatItem 
        icon={<Zap size={14}/>} 
        label="AI ANALİZ" 
        sub="RİSK KARAR MOTORU" 
        color="text-amber-500"
      />
    </div>
  );
}

const StatItem = ({ icon, label, sub, color }: any) => (
  /* Arka planı biraz daha koyulaştırıp (bg-[#0b1222]/30) border-white/5 ile çerçeveledik */
  <div className="flex items-center gap-4 p-4 rounded-[1.8rem] bg-[#0b1222]/30 border border-white/5 text-left transition-all hover:border-white/10 group cursor-default shadow-sm">
    
    {/* İkon kutusu: AnalysisEngine ikonlarıyla tam uyumlu boyuta çekildi (w-10 h-10) */}
    <div className={`w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center ${color} shrink-0 group-hover:bg-white/[0.05] transition-all duration-500`}>
      {icon}
    </div>

    <div className="flex flex-col justify-center min-w-0">
      {/* Etiketler: Daha okunaklı ama yine de ultra-kompakt */}
      <h4 className="text-[10px] font-black italic text-white uppercase tracking-[0.15em] leading-none mb-1">
        {label}
      </h4>
      <p className="text-[7px] font-bold text-slate-600 uppercase italic tracking-widest truncate">
        {sub}
      </p>
    </div>

    {/* Sağ uca çok ince bir süsleme: Terminal havası verir */}
    <div className="ml-auto opacity-0 group-hover:opacity-20 transition-opacity">
       <Fingerprint size={12} className="text-white" />
    </div>
  </div>
);