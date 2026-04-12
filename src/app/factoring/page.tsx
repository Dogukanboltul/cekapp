'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/database/client';
import { useRouter } from 'next/navigation';
import {
  Briefcase, Inbox, CheckCircle2, XCircle, 
  Clock, Loader2, ExternalLink, ShieldCheck, 
  Send, Download, LogOut, FileCheck, FileSearch, AlertCircle, RefreshCw
} from 'lucide-react';

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);

export default function VenariFactoringPanel() {
  const router = useRouter();
  const supabase = createClient();
  
  // Tab yapısına 'rejected' eklendi
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [offerPercent, setOfferPercent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    const { data } = await supabase
      .from('factoring_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setRequests(data);
      const initialMatch = data.find(r => r.status === activeTab);
      if (initialMatch && !selectedReq) setSelectedReq(initialMatch);
    }
    setLoading(false);
  }, [supabase, selectedReq, activeTab]);

  useEffect(() => {
    fetchRequests();
    const channel = supabase.channel('factoring_live_changes_admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'factoring_requests' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setRequests((current) => [payload.new, ...current]);
        } else if (payload.eventType === 'UPDATE') {
          setRequests((current) => current.map(req => req.id === payload.new.id ? payload.new : req));
          setSelectedReq((current: any) => current?.id === payload.new.id ? payload.new : current);
        }
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetchRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => req.status === activeTab);
  }, [requests, activeTab]);

  const handleSendOffer = async () => {
    if (!selectedReq || actionLoading) return;
    if (!offerPercent || parseFloat(offerPercent) <= 0) {
      alert("Geçerli bir oran giriniz.");
      return;
    }
    setActionLoading(true);
    const commission = parseFloat(offerPercent);
    const finalAmount = selectedReq.amount * (1 - commission / 100);

    const { error } = await supabase
      .from('factoring_requests')
      .update({ 
        status: 'approved',
        final_offer_amount: finalAmount,
        commission_rate: commission,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', selectedReq.id);

    if (error) alert(error.message);
    else { setOfferPercent(''); setSelectedReq(null); }
    setActionLoading(false);
  };

  const handleFinalApprove = async () => {
    if (!selectedReq || actionLoading) return;
    setActionLoading(true);
    const { error } = await supabase
      .from('factoring_requests')
      .update({ status: 'signed' })
      .eq('id', selectedReq.id);

    if (error) alert(error.message);
    else setSelectedReq(null);
    setActionLoading(false);
  };

  const handleRejectContract = async () => {
    if (!selectedReq || actionLoading) return;
    if (!confirm("Sözleşmeyi reddetmek ve kullanıcıdan tekrar yükleme istemek üzeresiniz?")) return;
    
    setActionLoading(true);
    const { error } = await supabase
      .from('factoring_requests')
      .update({ 
        status: 'rejected', // Artık direkt 'rejected' durumuna çekiyoruz
        signed_contract_url: null 
      })
      .eq('id', selectedReq.id);

    if (error) alert(error.message);
    else setSelectedReq(null);
    setActionLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-300 font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-16 flex flex-col items-center py-6 border-r border-zinc-800/40 bg-[#09090b] shrink-0 z-50">
        <div className="mb-10">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Briefcase size={20} className="text-black" />
          </div>
        </div>
        <nav className="flex flex-col gap-8 w-full px-3">
          <SidebarIcon icon={<Inbox size={20} />} active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} badge={requests.filter(r => r.status === 'pending').length} label="Yeni Talepler" />
          <SidebarIcon icon={<FileSearch size={20} />} active={activeTab === 'contract_review'} onClick={() => setActiveTab('contract_review')} badge={requests.filter(r => r.status === 'contract_review').length} label="Onay Süreci" />
          <SidebarIcon icon={<RefreshCw size={20} />} active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')} badge={requests.filter(r => r.status === 'rejected').length} label="Revize Bekleyenler" />
          <SidebarIcon icon={<Clock size={20} />} active={activeTab === 'approved'} onClick={() => setActiveTab('approved')} label="İmza Bekleyenler" />
          <SidebarIcon icon={<FileCheck size={20} />} active={activeTab === 'signed'} onClick={() => setActiveTab('signed')} label="Tamamlananlar" />
        </nav>
        <div className="mt-auto pb-4">
          <button onClick={handleLogout} className="p-3 rounded-xl text-zinc-600 hover:text-red-500 transition-all group relative">
             <LogOut size={20} />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen">
        <header className="h-14 flex items-center justify-between px-8 border-b border-zinc-800/40 bg-[#000000]/80 backdrop-blur-md shrink-0">
          <h1 className="text-xs font-black text-white uppercase tracking-[0.3em]">VENARI <span className="text-zinc-600 font-medium">TERMINAL</span></h1>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* LİSTE SÜTUNU */}
          <div className="w-[380px] border-r border-zinc-800/40 bg-[#09090b]/50 flex flex-col overflow-y-auto p-3 space-y-2 shrink-0">
            {filteredRequests.map((req) => (
              <button key={req.id} onClick={() => setSelectedReq(req)} className={`w-full text-left p-5 rounded-2xl transition-all border ${selectedReq?.id === req.id ? 'bg-zinc-800/40 border-zinc-700' : 'border-transparent hover:bg-zinc-900/40'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-zinc-400 truncate max-w-[150px]">{req.applicant_name}</span>
                  <div className="text-[9px] font-mono text-zinc-600">#{req.id.slice(0,6).toUpperCase()}</div>
                </div>
                <p className="text-xl font-black text-white tracking-tighter">{formatCurrency(req.amount)}</p>
              </button>
            ))}
            {filteredRequests.length === 0 && (
              <div className="h-40 flex flex-col items-center justify-center opacity-20 italic space-y-2">
                <Inbox size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Kayıt Yok</span>
              </div>
            )}
          </div>

          {/* DETAY PANELİ */}
          <div className="flex-1 bg-[#000000] overflow-y-auto p-12">
            {selectedReq ? (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-12 border-b border-zinc-800/40 pb-10">
                  <div className="space-y-2">
                    <StatusBadge status={selectedReq.status} large />
                    <h2 className="text-5xl font-black italic text-white tracking-tighter">{formatCurrency(selectedReq.amount)}</h2>
                  </div>

                  <div className="flex gap-4">
                    {selectedReq.status === 'contract_review' && (
                      <>
                        <button onClick={handleRejectContract} disabled={actionLoading} className="px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase text-[11px] flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                          {actionLoading ? <Loader2 className="animate-spin" size={16}/> : <><RefreshCw size={16}/> Revize İste</>}
                        </button>
                        <button onClick={handleFinalApprove} disabled={actionLoading} className="px-8 py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase text-[11px] flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
                          {actionLoading ? <Loader2 className="animate-spin" size={16}/> : <><CheckCircle2 size={16}/> Onayla</>}
                        </button>
                      </>
                    )}

                    {selectedReq.status === 'pending' && (
                      <div className="flex items-center gap-3">
                        <input type="number" placeholder="Komisyon %" className="w-32 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:border-white transition-all" value={offerPercent} onChange={(e) => setOfferPercent(e.target.value)} />
                        <button onClick={handleSendOffer} disabled={actionLoading} className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-[11px] flex items-center gap-2 hover:bg-zinc-200 transition-all">
                          {actionLoading ? <Loader2 className="animate-spin" size={16}/> : <><Send size={16}/> Teklif Gönder</>}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-[#09090b] border border-zinc-800/50 rounded-[2rem] p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 italic">
                       <ShieldCheck size={14} className="text-emerald-500" /> Belgeler
                    </h3>
                    <DocumentPreview label="Müşteri Çeki" url={selectedReq.cek_url} />
                    <DocumentPreview label="E-Fatura" url={selectedReq.fatura_url} />
                    {selectedReq.signed_contract_url && (
                      <div className="pt-4 border-t border-zinc-900">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Islak İmzalı Sözleşme</span>
                        <a href={selectedReq.signed_contract_url} target="_blank" rel="noreferrer" className="w-full py-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-black transition-all">
                           <Download size={14}/> PDF Görüntüle
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="bg-[#09090b] border border-zinc-800/50 rounded-[2rem] p-8">
                      <h3 className="text-[10px] font-black text-zinc-600 mb-6 uppercase tracking-widest italic">Özet Bilgi</h3>
                      <div className="space-y-4">
                        <StatItem label="Brüt Tutar" value={formatCurrency(selectedReq.amount)} />
                        <StatItem label="Komisyon" value={selectedReq.commission_rate ? `%${selectedReq.commission_rate}` : '-'} highlighted />
                        <StatItem label="Net Ödeme" value={formatCurrency(selectedReq.final_offer_amount || 0)} white />
                        <div className="pt-4 mt-4 border-t border-zinc-900">
                          <p className="text-[9px] text-zinc-600 uppercase font-bold mb-1">Vade</p>
                          <p className="text-sm font-black text-white">{new Date(selectedReq.due_date).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                    </div>

                    {selectedReq.status === 'rejected' && (
                      <div className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-6 flex items-start gap-4">
                         <RefreshCw size={20} className="text-red-500 shrink-0 animate-spin-slow" />
                         <p className="text-[10px] leading-relaxed text-red-500 uppercase font-bold italic">
                           Bu işlem için revize istendi. Kullanıcının sözleşmeyi yeniden yüklemesi bekleniyor.
                         </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.4em] opacity-20 italic">Seçim Bekleniyor</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// BİLEŞENLER
function StatusBadge({ status, large }: any) {
  const styles: any = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    approved: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    contract_review: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    signed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20'
  };
  const labels: any = { 
    pending: 'YENİ', approved: 'İMZA BEKLİYOR', contract_review: 'ONAYDA', signed: 'BİTTİ', rejected: 'REVİZE BEKLİYOR' 
  };
  return (
    <span className={`border font-black uppercase italic tracking-widest rounded-lg ${large ? 'px-4 py-2 text-[10px]' : 'px-2 py-1 text-[8px]'} ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function DocumentPreview({ label, url }: any) {
  if (!url) return null;
  return (
    <div className="space-y-2">
      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
      <div className="aspect-video bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden relative group">
        <iframe src={`${url}#toolbar=0`} className="w-full h-full opacity-30 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all">
           <a href={url} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"><ExternalLink size={18} /></a>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, highlighted, white }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black text-zinc-600 uppercase">{label}</span>
      <span className={`text-sm font-black italic ${highlighted ? 'text-emerald-500' : white ? 'text-white' : 'text-zinc-400'}`}>{value}</span>
    </div>
  );
}

function SidebarIcon({ icon, active, badge, onClick, label }: any) {
  return (
    <button onClick={onClick} className="group relative w-full flex justify-center py-2 outline-none">
      <div className={`p-3 rounded-2xl transition-all relative ${active ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-zinc-600 hover:text-white'}`}>
        {icon}
        {badge > 0 && <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#09090b]">{badge}</div>}
      </div>
      <span className="absolute left-16 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 uppercase transition-all z-[100] whitespace-nowrap pointer-events-none">{label}</span>
    </button>
  );
}