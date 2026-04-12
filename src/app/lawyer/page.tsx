'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Scale, LogOut, Search, FileDown, Power,
  CheckSquare, Activity, ChevronRight, Gavel,
  AlertCircle, RefreshCw, Layers, MapPin,
  TrendingUp, ShieldCheck, PieChart, Filter, Check, MoreHorizontal
} from 'lucide-react'; // DÜZELTİLDİ: lucide-center -> lucide-react
import { createClient } from '@/database/client';
import { useRouter } from 'next/navigation';

/* ================= TYPES ================= */
type CheckData = {
  id: string;
  drawer_name: string | null;
  check_number: string | null;
  bank_name: string | null;
  due_date: string | null;
  amount: number | null;
  status: string | null;
  is_bad_check: boolean;
  created_at: string;
};

type ViewState = 'hukuk' | 'analiz' | 'saha' | 'arsiv';

/* ================= UTILS ================= */
const formatCurrency = (amount: number | null) => {
  if (!amount) return '0 ₺';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function VenariTerminal() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // -- States --
  const [activeView, setActiveView] = useState<ViewState>('hukuk');
  const [checks, setChecks] = useState<CheckData[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  /* ================= CORE ACTIONS ================= */
  const fetchChecks = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checks')
        .select('*')
        .eq('is_bad_check', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChecks(data || []);
      setSelected(new Set()); 
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchChecks();
  }, [fetchChecks]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  /* ================= INTERACTIONS ================= */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return checks.filter(c =>
      c.drawer_name?.toLowerCase().includes(q) ||
      c.check_number?.toLowerCase().includes(q) ||
      c.bank_name?.toLowerCase().includes(q)
    );
  }, [checks, search]);

  const handleSelectAll = () => {
    if (selected.size === filtered.length && filtered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(c => c.id)));
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const handleUyapExport = async () => {
    setExporting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const selectedData = checks.filter(c => selected.has(c.id));
    const xml = `<?xml version="1.0" encoding="UTF-8"?><UyapExport>${selectedData.map(c => `<Dosya><ID>${c.id}</ID><Borclu>${c.drawer_name}</Borclu><Tutar>${c.amount}</Tutar></Dosya>`).join('')}</UyapExport>`;
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VENARI_BATCH_${Date.now()}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSelected(new Set());
    setExporting(false);
  };

  /* ================= CALCULATIONS ================= */
  const stats = useMemo(() => ({
    total: checks.length,
    totalAmount: checks.reduce((a, b) => a + (b.amount || 0), 0),
    selectedCount: selected.size,
    critical: checks.filter(c => (c.amount || 0) > 250000).length
  }), [checks, selected]);

  /* ================= RENDER VIEWS ================= */
  const HukukView = () => {
    const allSelected = filtered.length > 0 && selected.size === filtered.length;
    const indeterminate = selected.size > 0 && selected.size < filtered.length;

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-[#09090b] border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/50">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <h2 className="text-xs font-semibold text-zinc-300">Açık İcra Dosyaları</h2>
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-medium">{filtered.length}</span>
            </div>
            
            <div className="flex items-center gap-3 h-8">
              {selected.size > 0 && (
                <div className="flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <span className="text-xs text-zinc-400">{selected.size} dosya seçildi</span>
                  <button 
                    onClick={handleUyapExport} 
                    disabled={exporting}
                    className="flex items-center gap-2 px-4 py-1.5 bg-zinc-100 text-zinc-900 text-xs font-semibold rounded-md hover:bg-white transition-all disabled:opacity-50 shadow-sm"
                  >
                    {exporting ? <RefreshCw size={14} className="animate-spin" /> : <FileDown size={14} />}
                    {exporting ? 'Oluşturuluyor...' : 'UYAP (.xml) İndir'}
                  </button>
                  <div className="w-px h-4 bg-zinc-800"></div>
                </div>
              )}
              <button className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors rounded-md hover:bg-zinc-800"><Filter size={16} /></button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[calc(100vh-380px)] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-950/80 text-[11px] text-zinc-500 font-medium sticky top-0 z-10 backdrop-blur-sm shadow-[0_1px_0_rgba(39,39,42,1)]">
                <tr>
                  <th className="px-6 py-3 w-12 text-center">
                    <button onClick={handleSelectAll} className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${allSelected ? 'bg-zinc-100 border-zinc-100' : indeterminate ? 'bg-zinc-800 border-zinc-600' : 'border-zinc-700 bg-transparent hover:border-zinc-500'}`}>
                      {allSelected && <Check size={12} className="text-zinc-900" />}
                      {indeterminate && <div className="w-2 h-[2px] bg-zinc-300 rounded-full" />}
                    </button>
                  </th>
                  <th className="px-6 py-3 font-medium">Borçlu Ünvanı</th>
                  <th className="px-6 py-3 font-medium">Banka & Şube</th>
                  <th className="px-6 py-3 font-medium text-right">Keşide / Vade</th>
                  <th className="px-6 py-3 font-medium text-right">Risk Tutarı</th>
                  <th className="px-6 py-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-sm">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="w-4 h-4 bg-zinc-800 rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-48 mb-2"></div><div className="h-3 bg-zinc-900 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-32 mb-2"></div><div className="h-3 bg-zinc-900 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-24 ml-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-5 bg-zinc-800 rounded w-28 ml-auto"></div></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))
                ) : filtered.map((c) => {
                  const isSelected = selected.has(c.id);
                  return (
                    <tr key={c.id} onClick={() => toggleSelection(c.id)} className={`group cursor-pointer transition-colors ${isSelected ? 'bg-zinc-800/40' : 'hover:bg-zinc-900/40'}`}>
                      <td className="px-6 py-4 text-center">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${isSelected ? 'bg-zinc-100 border-zinc-100' : 'border-zinc-700 bg-transparent group-hover:border-zinc-500'}`}>
                          {isSelected && <Check size={12} className="text-zinc-900" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-zinc-200">{c.drawer_name || 'Bilinmiyor'}</p>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">SN: {c.check_number}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-zinc-300">{c.bank_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-900/50 border border-red-500/30"></span>
                          <p className="text-xs text-zinc-500">Karşılıksız İşlemi</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right"><p className="text-zinc-300 tabular-nums">{c.due_date}</p></td>
                      <td className="px-6 py-4 text-right"><p className="font-mono font-medium text-zinc-100">{formatCurrency(c.amount)}</p></td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"><MoreHorizontal size={16} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-300 selection:bg-zinc-800 selection:text-zinc-100 font-sans">
      
      {/* 🧭 SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-16 flex flex-col items-center py-6 border-r border-zinc-800/60 bg-[#09090b] z-50">
        <div className="mb-8">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Scale size={16} className="text-zinc-950" />
          </div>
        </div>
        <nav className="flex flex-col gap-4 w-full px-3">
          <SidebarIcon icon={<Gavel size={18} />} active={activeView === 'hukuk'} onClick={() => setActiveView('hukuk')} label="Hukuk" />
          <SidebarIcon icon={<PieChart size={18} />} active={activeView === 'analiz'} onClick={() => setActiveView('analiz')} label="Analiz" />
          <SidebarIcon icon={<MapPin size={18} />} active={activeView === 'saha'} onClick={() => setActiveView('saha')} label="Saha Operasyon" />
          <SidebarIcon icon={<Layers size={18} />} active={activeView === 'arsiv'} onClick={() => setActiveView('arsiv')} label="Arşiv" />
        </nav>
      </aside>

      {/* 🖥️ MAIN CONTENT */}
      <main className="pl-16 relative min-h-screen flex flex-col">
        
        {/* TOP BAR */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800/60 sticky top-0 bg-[#000000]/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-100">VENARI // <span className="text-zinc-500 font-normal">Risk Terminal</span></h1>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-900/30 bg-emerald-950/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-bold uppercase text-emerald-500/80 tracking-widest">Live Connect</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-100 transition-colors" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ünvan veya seri no..." className="w-64 bg-zinc-900/50 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all placeholder:text-zinc-700" />
            </div>

            <div className="w-px h-6 bg-zinc-800"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-900/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 transition-all group"
            >
              <Power size={14} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase italic tracking-wider">Sistemi Kapat</span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] w-full mx-auto space-y-8 flex-1">
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Açık Dosyalar" value={stats.total} icon={<Layers size={16} />} />
            <StatCard label="Toplam Risk" value={formatCurrency(stats.totalAmount)} icon={<TrendingUp size={16} />} highlight />
            <StatCard label="Kritik Risk" value={stats.critical} icon={<AlertCircle size={16} />} alert />
            <StatCard label="Seçili Paket" value={stats.selectedCount} icon={<Activity size={16} />} />
          </div>

          {activeView === 'hukuk' ? <HukukView /> : (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/30">
              <ShieldCheck size={28} className="text-zinc-700 mb-3" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Yetki Onayı Bekleniyor</p>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
      `}</style>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarIcon({ icon, active, onClick, label }: any) {
  return (
    <button onClick={onClick} className={`relative p-2.5 w-full flex justify-center rounded-lg transition-all group ${active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}>
      {icon}
      <div className="absolute left-14 bg-zinc-900 text-zinc-200 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-2xl border border-zinc-800 z-50">
        {label}
      </div>
    </button>
  );
}

function StatCard({ label, value, icon, highlight, alert }: any) {
  return (
    <div className={`p-6 rounded-xl border flex flex-col justify-between gap-4 transition-all ${alert ? 'bg-red-950/10 border-red-900/20' : highlight ? 'bg-zinc-900/40 border-zinc-800' : 'bg-[#09090b] border-zinc-800/60'}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500">{label}</p>
        <div className={`p-1.5 rounded-md ${alert ? 'text-red-500 bg-red-500/10' : 'text-zinc-500 bg-zinc-800/50'}`}>
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-black italic tracking-tighter ${alert ? 'text-red-500' : highlight ? 'text-white' : 'text-zinc-300'}`}>
        {value}
      </p>
    </div>
  );
}