'use client';

import React, { useState } from 'react';
import { 
  History, 
  ShieldCheck, 
  ShieldAlert, 
  Building2, 
  Ticket, 
  FileText,
  Search,
  ChevronRight
} from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'COMPANY' | 'CHECK' | 'BILL';
  title: string;
  subtitle: string;
  score: number;
  status: 'STABLE' | 'CRITICAL';
  created_at: string;
}

interface HistoryLogsProps {
  data: HistoryItem[];
  onSelect?: (item: HistoryItem) => void; // ✅ Tıklama fonksiyonu eklendi
}

const HistoryLogs = ({ data = [], onSelect }: HistoryLogsProps) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'COMPANY' | 'CHECK' | 'BILL'>('ALL');

  const filteredData = activeTab === 'ALL' 
    ? data 
    : data.filter(item => item.type === activeTab);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'COMPANY': return <Building2 size={12} className="text-blue-400" />;
      case 'CHECK': return <Ticket size={12} className="text-teal-400" />;
      case 'BILL': return <FileText size={12} className="text-purple-400" />;
      default: return <Search size={12} />;
    }
  };

  return (
    <div className="bg-[#0b1222]/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-full">
      
      {/* HEADER & TABS */}
      <div className="p-6 border-b border-white/5 space-y-4 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
            <History size={16} className="text-teal-500" />
          </div>
          <h3 className="text-[11px] font-black italic uppercase tracking-widest text-white">
            GEÇMİŞ SORGULAR
          </h3>
        </div>

        <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
          {['ALL', 'COMPANY', 'CHECK', 'BILL'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 rounded-lg text-[8px] font-black italic transition-all uppercase ${
                activeTab === tab 
                ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/20' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'ALL' ? 'HEPSİ' : tab === 'COMPANY' ? 'FİRMA' : tab === 'CHECK' ? 'ÇEK' : 'SENET'}
            </button>
          ))}
        </div>
      </div>

      {/* LIST CONTENT */}
      <div className="flex-1 max-h-[450px] overflow-y-auto custom-scrollbar p-4 space-y-3">
        {filteredData.length === 0 ? (
          <div className="py-20 text-center opacity-20 space-y-2">
            <Search size={32} className="mx-auto" />
            <p className="text-[9px] font-bold uppercase italic">Kayıt Bulunamadı</p>
          </div>
        ) : (
          filteredData.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelect && onSelect(item)} // ✅ Burası tıklandığında sonucu tetikler
              className="group relative bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.04] hover:border-teal-500/30 transition-all cursor-pointer overflow-hidden active:scale-[0.98]"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${item.status === 'STABLE' ? 'bg-emerald-500' : 'bg-red-500'} opacity-50`} />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black/40 rounded-xl border border-white/5 group-hover:border-teal-500/20 transition-colors">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-white uppercase italic tracking-tight truncate w-32">
                      {item.title}
                    </p>
                    <p className="text-[8px] text-slate-500 font-bold uppercase italic truncate w-32">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-[10px] font-black italic ${item.score >= 75 ? 'text-emerald-500' : 'text-red-500'}`}>
                      %{item.score}
                    </p>
                    <p className="text-[7px] text-slate-600 font-bold uppercase tracking-tighter">SKOR</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:text-teal-500 transition-colors translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.03] flex justify-between items-center">
                 <span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">
                    {new Date(item.created_at).toLocaleDateString('tr-TR')}
                 </span>
                 <span className={`text-[7px] font-black px-2 py-0.5 rounded border ${
                   item.status === 'STABLE' ? 'border-emerald-500/20 text-emerald-500/60' : 'border-red-500/20 text-red-500/60'
                 }`}>
                   {item.status}
                 </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 bg-black/20 border-t border-white/5">
        <p className="text-[7px] font-black text-slate-600 uppercase tracking-[0.3em] text-center">
          TOPLAM {data.length} AKTİF SORGULAMA LOGU
        </p>
      </div>
    </div>
  );
};

export default HistoryLogs;