'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  ShieldAlert, 
  Settings, 
  LogOut 
} from 'lucide-react';

// 1. PROPS TANIMI (Hatanın çözümü burada)
interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// 2. YARDIMCI BİLEŞEN: SidebarItem
function SidebarItem({ icon, label, active = false, isOpen }: any) {
  return (
    <div className={`
      flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 group
      ${active 
        ? 'bg-teal-500 text-[#060a14] shadow-[0_0_25px_rgba(20,184,166,0.4)] scale-[1.02]' 
        : 'text-slate-500 hover:bg-white/5 hover:text-white'}
    `}>
      <div className={`shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      {isOpen && (
        <span className="text-[11px] font-black italic tracking-widest uppercase truncate animate-in fade-in slide-in-from-left-2 duration-500">
          {label}
        </span>
      )}
    </div>
  );
}

// 3. ANA BİLEŞEN: Sidebar
export default function Sidebar({ isOpen, activeTab, onTabChange }: SidebarProps) {
  
  const menuItems = [
    { id: 'DASHBOARD', icon: <LayoutDashboard size={20} />, label: 'Panel' },
    { id: 'RISK_SORGULA', icon: <Search size={20} />, label: 'Risk Sorgula' },
    { id: 'RAPORLAR', icon: <FileText size={20} />, label: 'Raporlarım' },
    { id: 'SUPHELI', icon: <ShieldAlert size={20} />, label: 'Şüpheli Bildir' },
  ];

  const bottomItems = [
    { id: 'SETTINGS', icon: <Settings size={20} />, label: 'Ayarlar' },
    { id: 'LOGOUT', icon: <LogOut size={20} />, label: 'Çıkış Yap' },
  ];

  return (
    <aside className={`
      h-screen sticky top-0 bg-[#060a14] border-r border-white/5 flex flex-col transition-all duration-500 z-[60]
      ${isOpen ? 'w-72 p-6' : 'w-24 p-4'}
    `}>
      
      {/* LOGO */}
      <div 
        className="mb-12 flex items-center gap-3 px-2 cursor-pointer group"
        onClick={() => onTabChange('DASHBOARD')}
      >
        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(20,184,166,0.4)]">
          <span className="text-black font-black text-xl italic">Ç</span>
        </div>
        {isOpen && (
          <h1 className="text-xl font-black italic tracking-tighter text-white">
            ÇEK<span className="text-teal-500">APP</span>
          </h1>
        )}
      </div>

      {/* MENÜ AKIŞI */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <div key={item.id} onClick={() => onTabChange(item.id)}>
            <SidebarItem 
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              isOpen={isOpen}
            />
          </div>
        ))}
      </nav>

      {/* ALT KISIM */}
      <div className="pt-6 border-t border-white/5 space-y-2">
        {bottomItems.map((item) => (
          <div key={item.id} onClick={() => item.id !== 'LOGOUT' && onTabChange(item.id)}>
            <SidebarItem 
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              isOpen={isOpen}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}