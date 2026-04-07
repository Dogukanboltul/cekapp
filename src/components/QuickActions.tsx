'use client';
import React from 'react';
import { Search, AlertTriangle, Plus } from 'lucide-react';

export default function QuickActions({ onReportClick }: { onReportClick: () => void }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input 
          type="text" 
          placeholder="VKN VEYA FİRMA ADI SORGULA..." 
          className="w-full bg-[#0b1222] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-[10px] font-black italic text-white placeholder:text-slate-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all uppercase tracking-widest"
        />
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button 
          onClick={onReportClick}
          className="flex-1 md:flex-none bg-red-600/10 border border-red-600/20 hover:bg-red-600/20 px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all group"
        >
          <AlertTriangle size={16} className="text-red-600 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black italic text-red-500 uppercase tracking-widest">ŞÜPHELİ BİLDİR</span>
        </button>
        
        <button className="flex-1 md:flex-none bg-teal-500 hover:bg-teal-400 px-8 py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] active:scale-95 group">
          <Plus size={18} className="text-[#060a14] group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-[10px] font-black italic text-[#060a14] uppercase tracking-widest leading-none">YENİ SORGU</span>
        </button>
      </div>
    </div>
  );
}   