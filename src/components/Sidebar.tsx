'use client';

import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { 
  LayoutDashboard, Search, Settings, 
  ChevronLeft, ChevronRight, Clock, Building2, 
  Ticket, FileCheck, Briefcase, ChevronDown, Trash2,
  Banknote
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import UserBadge from './UserBadge';
import { createClient } from '@/database/client'; // Supabase istemcisini buraya ekledik

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  historyData: any[];
  onHistorySelect: (item: any) => void;
  onDeleteHistory?: (id: string) => Promise<void>; 
  onAuthClick: () => void;
}

export default function Sidebar({ 
  isOpen, setIsOpen, activeTab, onTabChange, historyData = [], onHistorySelect, onDeleteHistory, onAuthClick 
}: SidebarProps) {
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [rejectedCount, setRejectedCount] = useState(0); // Bildirim sayısı state'i
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // 1. ADIM: Bildirim Sayısını Çekme
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('factoring_requests')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'rejected'); // Sadece revize bekleyenleri say

      if (data) setRejectedCount(data.length);
    };

    fetchNotifications();

    // Canlı takip (Realtime) - Veri değişirse sayı anında güncellenir
    const channel = supabase.channel('sidebar_notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'factoring_requests' }, () => {
        fetchNotifications();
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  const handleNavClick = (href: string, tabName: string) => {
    if (!href) return;
    const isSameRoute = pathname === href;
    if (isSameRoute) {
      onTabChange(tabName);
      return;
    }
    router.push(href);
  };

  const firms = historyData.filter(item => !item.type || item.type === 'COMPANY');
  const checks = historyData.filter(item => item.type === 'CHECK');
  const bills = historyData.filter(item => item.type === 'BILL');

  return (
    <aside className={`h-screen sticky top-0 bg-[#060a14] border-r border-white/5 flex flex-col transition-all duration-500 z-[60] ${isOpen ? 'w-80 p-6' : 'w-24 p-4'}`}>
      
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="absolute -right-3 top-10 bg-teal-500 text-black rounded-full p-1 border-2 border-[#060a14] hover:scale-110 transition-all z-[70]"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div 
        onClick={() => handleNavClick('/dashboard', 'DASHBOARD')} 
        className={`mb-10 flex items-center gap-3 px-2 cursor-pointer ${!isOpen && 'justify-center'}`}
      >
        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
          <span className="text-black font-black text-xl italic">Ç</span>
        </div>
        {isOpen && (
          <h1 className="text-xl font-black italic text-white uppercase tracking-tighter animate-in fade-in duration-500">
            ÇEK<span className="text-teal-500">APP</span>
          </h1>
        )}
      </div>

      <nav className="space-y-2 mb-6">
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Panel" 
          active={pathname === '/dashboard'} 
          isOpen={isOpen} 
          onClick={() => handleNavClick('/dashboard', 'DASHBOARD')} 
        />
        <NavItem 
          icon={<Search size={20} />} 
          label="Risk Sorgula" 
          active={pathname === '/dashboard/risk-sorgula'} 
          isOpen={isOpen} 
          onClick={() => handleNavClick('/dashboard/risk-sorgula', 'RISK_SORGULA')} 
        />
        
        {/* FİNANSMAN (LIQUIDITY) - BADGE BURAYA EKLENDİ */}
        <NavItem 
          icon={<Banknote size={20} />} 
          label="Finansman" 
          active={pathname === '/dashboard/liquidity'} 
          isOpen={isOpen} 
          onClick={() => handleNavClick('/dashboard/liquidity', 'LIQUIDITY')} 
          badge={rejectedCount > 0 ? rejectedCount : undefined} // Eğer sayı varsa göster
        />

        <NavItem 
          icon={<FileCheck size={20} />} 
          label="Findeks" 
          active={activeTab === 'FINDEKS'} 
          isOpen={isOpen} 
          onClick={() => onTabChange('FINDEKS')} 
        />

        <NavItem 
          icon={<Briefcase size={20} />} 
          label="Referanslarım" 
          active={pathname?.startsWith('/dashboard/references')} 
          isOpen={isOpen} 
          onClick={() => handleNavClick('/dashboard/references', 'REFERENCES')} 
        />
      </nav>

      {/* SORGULADIKLARIM... (Değişmedi) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {isOpen ? (
          <>
            <button 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)} 
              className="flex items-center justify-between px-4 mb-4 group shrink-0 outline-none"
            >
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-teal-500/50" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Sorguladıklarım
                </span>
              </div>
              <ChevronDown size={12} className={`text-slate-600 transition-transform ${isHistoryOpen ? '' : '-rotate-90'}`} />
            </button>

            {isHistoryOpen && (
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-sidebar-scroll animate-in fade-in slide-in-from-top-2 duration-300">
                {historyData.length > 0 ? (
                  <>
                    <CategorySection title="Firmalar" items={firms} onSelect={onHistorySelect} onDelete={onDeleteHistory} type="COMPANY" />
                    <CategorySection title="Çekler" items={checks} onSelect={onHistorySelect} onDelete={onDeleteHistory} type="CHECK" />
                    <CategorySection title="Senetler" items={bills} onSelect={onHistorySelect} onDelete={onDeleteHistory} type="BILL" />
                  </>
                ) : (
                  <div className="px-4 py-10 text-center border border-dashed border-white/5 rounded-3xl opacity-20 mx-2">
                    <p className="text-[10px] font-bold uppercase italic tracking-widest text-slate-400">
                      Henüz Sorgu Yok
                    </p>
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

      <div className="pt-4 border-t border-white/5 space-y-1">
        <NavItem 
          icon={<Settings size={20} />} 
          label="Ayarlar" 
          active={activeTab === 'SETTINGS'} 
          isOpen={isOpen} 
          onClick={() => onTabChange('SETTINGS')} 
        />

        <div className={`mt-2 ${!isOpen && 'flex justify-center'}`}>
          <UserBadge isOpen={isOpen} onAuthClick={onAuthClick} />
        </div>
      </div>
    </aside>
  );
}

// 2. ADIM: NavItem Bileşenine Badge Mantığı Ekleme
function NavItem({ icon, label, active, isOpen, onClick, badge }: any) {
  return (
    <div 
      onClick={(e) => { e.preventDefault(); onClick(); }} 
      className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 
        ${active ? 'bg-teal-500 text-[#060a14] shadow-[0_0_20px_rgba(20,184,166,0.3)]' : 'text-slate-500 hover:bg-white/5 hover:text-white'} 
        ${!isOpen && 'justify-center'}`}
    >
      <div className="shrink-0 relative">
        {icon}
        {/* Sidebar Kapalıyken Badge İkon Üzerinde Dursun */}
        {!isOpen && badge && (
          <div className="absolute -top-2 -right-2 h-4 min-w-[16px] px-1 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-[#060a14] animate-bounce">
            {badge}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="flex flex-1 items-center justify-between min-w-0">
          <span className="text-[11px] font-black uppercase italic tracking-widest truncate">
            {label}
          </span>
          {/* Sidebar Açıkken Badge Metnin Yanında Dursun */}
          {badge && (
            <div className="h-5 min-w-[20px] px-1.5 bg-red-500 text-white text-[10px] font-black rounded-lg flex items-center justify-center animate-pulse">
              {badge}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ... Diğer alt bileşenler (HistoryItem, vb.) aynı kalıyor.
// --- EKSİK OLAN ALT BİLEŞENLER ---

function CategorySection({ title, items, onSelect, onDelete, type }: any) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-1 mb-4">
      <h4 className="px-4 text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">
        {title}
      </h4>
      {items.map((item: any) => (
        <HistoryItem 
          key={item.id} 
          item={item} 
          onSelect={onSelect} 
          onDelete={onDelete} 
          type={type} 
        />
      ))}
    </div>
  );
}

function HistoryItem({ item, onSelect, onDelete, type }: any) {
  return (
    <div className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5">
      <div onClick={() => onSelect(item)} className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 
          ${type === 'COMPANY' ? 'bg-blue-500/10 text-blue-500' : type === 'CHECK' ? 'bg-teal-500/10 text-teal-500' : 'bg-amber-500/10 text-amber-500'}`}>
          {type === 'COMPANY' ? <Building2 size={14} /> : type === 'CHECK' ? <Ticket size={14} /> : <FileCheck size={14} />}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-black text-slate-300 uppercase italic truncate leading-tight">
            {item.company_name || item.tax_no || 'İsimsiz Kayıt'}
          </span>
          <span className="text-[7px] font-bold text-slate-600 uppercase tracking-tighter">
            {new Date(item.created_at).toLocaleDateString('tr-TR')}
          </span>
        </div>
      </div>

      {onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-500 text-slate-600 rounded-lg transition-all"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}