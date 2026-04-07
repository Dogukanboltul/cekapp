'use client';

import React, { useState, Dispatch, SetStateAction } from 'react';
import { 
  LayoutDashboard, Search, Settings, 
  ChevronLeft, ChevronRight, Clock, Building2, 
  Ticket, FileCheck, Briefcase, ChevronDown
} from 'lucide-react';
import UserBadge from './UserBadge';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  historyData: any[];
  onHistorySelect: (item: any) => void;
  onAuthClick: () => void;
}

export default function Sidebar({ 
  isOpen, setIsOpen, activeTab, onTabChange, historyData = [], onHistorySelect, onAuthClick 
}: SidebarProps) {
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  // Veri kategorizasyonu ve null-check
  const firms = historyData.filter(item => item.type === 'COMPANY' || !item.type);
  const checks = historyData.filter(item => item.type === 'CHECK');
  const bills = historyData.filter(item => item.type === 'BILL');

  return (
    <aside className={`h-screen sticky top-0 bg-[#060a14] border-r border-white/5 flex flex-col transition-all duration-500 z-[60] ${isOpen ? 'w-80 p-6' : 'w-24 p-4'}`}>
      
      {/* Genişletme/Daraltma Butonu */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="absolute -right-3 top-10 bg-teal-500 text-black rounded-full p-1 border-2 border-[#060a14] hover:scale-110 transition-all z-[70]"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* LOGO */}
      <div className={`mb-10 flex items-center gap-3 px-2 cursor-pointer ${!isOpen && 'justify-center'}`} onClick={() => onTabChange('DASHBOARD')}>
        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
          <span className="text-black font-black text-xl italic">Ç</span>
        </div>
        {isOpen && <h1 className="text-xl font-black italic text-white uppercase tracking-tighter animate-in fade-in duration-500">ÇEK<span className="text-teal-500">APP</span></h1>}
      </div>

      {/* ANA NAVİGASYON */}
      <nav className="space-y-2 mb-6">
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Panel" 
          active={activeTab === 'DASHBOARD'} 
          isOpen={isOpen} 
          onClick={() => onTabChange('DASHBOARD')} 
        />
        <NavItem 
          icon={<Search size={20} />} 
          label="Risk Sorgula" 
          active={activeTab === 'RISK_SORGULA'} 
          isOpen={isOpen} 
          onClick={() => onTabChange('RISK_SORGULA')} 
        />
        <NavItem 
          icon={<FileCheck size={20} />} 
          label="Findeks" 
          active={activeTab === 'FINDEKS'} 
          isOpen={isOpen} 
          onClick={() => onTabChange('FINDEKS')} 
        />
      </nav>

      {/* 📂 SORGULADIKLARIM ALANI */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {isOpen ? (
          <>
            <button 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="flex items-center justify-between px-4 mb-4 group shrink-0"
            >
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-teal-500/50" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Sorguladıklarım</span>
              </div>
              <ChevronDown size={12} className={`text-slate-600 transition-transform ${isHistoryOpen ? '' : '-rotate-90'}`} />
            </button>
            
            {isHistoryOpen && (
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-sidebar-scroll animate-in fade-in slide-in-from-top-2 duration-300">
                <CategorySection title="Firmalar" items={firms} onSelect={onHistorySelect} type="COMPANY" />
                <CategorySection title="Çekler" items={checks} onSelect={onHistorySelect} type="CHECK" />
                <CategorySection title="Senetler" items={bills} onSelect={onHistorySelect} type="BILL" />
                {historyData.length === 0 && (
                  <div className="px-4 py-10 text-center border border-dashed border-white/5 rounded-3xl opacity-20">
                    <p className="text-[10px] font-bold uppercase italic">Geçmiş Bulunmuyor</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 opacity-40">
            <Clock size={18} />
            <div className="w-8 h-[1px] bg-white/10" />
          </div>
        )}
      </div>

      {/* ALT MENÜ */}
      <div className="pt-4 border-t border-white/5 space-y-1">
        <div 
          onClick={() => onTabChange('SETTINGS')} 
          className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer text-slate-500 hover:text-white transition-all group ${!isOpen && 'justify-center'}`}
        >
          <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
          {isOpen && <span className="text-[11px] font-black uppercase italic">Ayarlar</span>}
        </div>

        <div className={`mt-2 ${!isOpen && 'flex justify-center'}`}>
          <UserBadge isOpen={isOpen} onAuthClick={onAuthClick} />
        </div>
      </div>
    </aside>
  );
}

// --- ALT BİLEŞENLER ---

function NavItem({ icon, label, active, isOpen, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 
        ${active 
          ? 'bg-teal-500 text-[#060a14] shadow-[0_0_20px_rgba(20,184,166,0.3)]' 
          : 'text-slate-500 hover:bg-white/5 hover:text-white'
        } ${!isOpen && 'justify-center'}`}
    >
      <div className="shrink-0">{icon}</div>
      {isOpen && <span className="text-[11px] font-black uppercase italic tracking-widest">{label}</span>}
    </div>
  );
}

function CategorySection({ title, items, onSelect, type }: any) {
  if (items.length === 0) return null;

  const configs: any = {
    COMPANY: { bg: 'bg-teal-500/10', text: 'text-teal-500', icon: <Building2 size={14} /> },
    CHECK: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: <Ticket size={14} /> },
    BILL: { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: <FileCheck size={14} /> }
  };

  const config = configs[type] || configs.COMPANY;

  return (
    <div className="space-y-2">
      <div className="px-4 flex items-center gap-2 opacity-40">
        <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-400">{title}</span>
      </div>
      {items.map((item: any) => (
        <div 
          key={item.id}
          onClick={() => onSelect(item)}
          className="group p-3 rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-all active:scale-95"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bg} ${config.text} group-hover:bg-teal-500 group-hover:text-[#060a14] transition-all`}>
              {config.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-200 uppercase truncate italic mb-0.5">
                {/* Dashboard eşleşmesi için title önceliği */}
                {item.title || item.company_name || item.tax_no || "Bilinmeyen Kayıt"}
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter italic">
                {item.risk_score ? `SKOR: %${item.risk_score}` : 'ANALİZ EDİLDİ'} • {item.created_at ? new Date(item.created_at).toLocaleDateString('tr-TR') : 'YENİ'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}