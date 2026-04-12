'use client';

import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/database/client';
import { useRouter } from 'next/navigation';
import { 
  FileText, CheckCircle2, ScanSearch, History, PlusCircle, 
  Wallet, XCircle, Check, Download, UploadCloud, 
  ArrowRight, Loader2, ShieldCheck, BadgePercent, Clock, AlertCircle, LogOut 
} from 'lucide-react';

const supabase = createClient();

interface FactoringRequest {
  id: string;
  amount: number;
  due_date: string;
  status: string;
  commission_rate?: number;
  final_offer_amount?: number;
  created_at: string;
  signed_contract_url?: string;
}

export default function LiquidityPage() {
  const router = useRouter();
  const [mod, setMod] = useState<'yeni_talep' | 'taleplerim'>('yeni_talep');
  const [asama, setAsama] = useState<'yukleme' | 'analiz' | 'iletildi'>('yukleme');
  const [user, setUser] = useState<any>(null);
  const [myRequests, setMyRequests] = useState<FactoringRequest[]>([]);
  const [selectedReq, setSelectedReq] = useState<FactoringRequest | null>(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [signedFile, setSignedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ amount: '', due_date: '' });
  const [cekDosya, setCekDosya] = useState<File | null>(null);
  const [faturaDosya, setFaturaDosya] = useState<File | null>(null);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);

  const fetchMyRequests = useCallback(async (userId: string) => {
    if (!userId) return;
    const { data } = await supabase
      .from('factoring_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) setMyRequests(data as FactoringRequest[]);
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data: { user: activeUser } } = await supabase.auth.getUser();
      if (!activeUser) {
        router.push('/login');
        return;
      }
      if (mounted) {
        setUser(activeUser);
        fetchMyRequests(activeUser.id);
      }
    };

    init();

    const channel = supabase.channel('realtime_factoring_client')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'factoring_requests' }, () => {
        supabase.auth.getUser().then(({ data }) => {
          if (data.user && mounted) fetchMyRequests(data.user.id);
        });
      }).subscribe();

    return () => { 
      mounted = false;
      supabase.removeChannel(channel); 
    };
  }, [fetchMyRequests, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/logout-success');
  };

  const handleUploadAndFinalize = async () => {
    if (!signedFile || !selectedReq) return;
    setIsUploading(true);
    try {
      const fileName = `signed_${Date.now()}_${selectedReq.id}.pdf`;
      await supabase.storage.from('Evraklar').upload(`contracts/${fileName}`, signedFile);
      const { data: { publicUrl } } = supabase.storage.from('Evraklar').getPublicUrl(`contracts/${fileName}`);

      await supabase.from('factoring_requests').update({ 
        status: 'contract_review', 
        signed_contract_url: publicUrl 
      }).eq('id', selectedReq.id);

      setSelectedReq(null);
      setSignedFile(null);
      setMod('taleplerim');
      if (user) fetchMyRequests(user.id);
    } catch (err: any) { 
      alert("Hata: " + err.message); 
    } finally { 
      setIsUploading(false); 
    }
  };

  const islemiBaslat = async () => {
    if (!cekDosya || !faturaDosya || !formData.amount || !user) return;
    setAsama('analiz');
    try {
      const ts = Date.now();
      const cekYolu = `ceks/${ts}_${cekDosya.name}`;
      const faturaYolu = `faturas/${ts}_${faturaDosya.name}`;
      
      await Promise.all([
        supabase.storage.from('Evraklar').upload(cekYolu, cekDosya),
        supabase.storage.from('Evraklar').upload(faturaYolu, faturaDosya)
      ]);

      await supabase.from('factoring_requests').insert([{
        applicant_name: user.user_metadata?.full_name || user.email, 
        amount: parseFloat(formData.amount), 
        due_date: formData.due_date,
        cek_url: supabase.storage.from('Evraklar').getPublicUrl(cekYolu).data.publicUrl,
        fatura_url: supabase.storage.from('Evraklar').getPublicUrl(faturaYolu).data.publicUrl,
        status: 'pending',
        user_id: user.id 
      }]);

      setAsama('iletildi');
      fetchMyRequests(user.id);
    } catch (err) { 
      setAsama('yukleme'); 
    }
  };

  return (
    <div className="min-h-screen text-zinc-100 bg-[#020617] font-sans pb-20">
      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-10">
        
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div className="flex flex-col gap-4">
             <h1 className="text-4xl font-black italic uppercase tracking-tighter">VENARI <span className="text-zinc-700">FINANCE</span></h1>
          </div>
          <div className="flex gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
            <NavButton aktif={mod === 'yeni_talep'} onClick={() => setMod('yeni_talep')} ikon={<PlusCircle size={16}/>} etiket="Yeni Talep" />
            <NavButton aktif={mod === 'taleplerim'} onClick={() => setMod('taleplerim')} ikon={<History size={16}/>} etiket={`İşlemlerim (${myRequests.length})`} />
            <button onClick={handleSignOut} className="p-3 text-zinc-500 hover:text-red-500 transition-colors bg-zinc-900/40 rounded-xl border border-white/5">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main>
          {mod === 'yeni_talep' ? (
            asama !== 'iletildi' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Talep Tutarı (₺)" type="number" value={formData.amount} onChange={(val) => setFormData({...formData, amount: val})} placeholder="0.00" />
                    <InputGroup label="Çek Vade Tarihi" type="date" value={formData.due_date} onChange={(val) => setFormData({...formData, due_date: val})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUploadBox baslik="Çek Görselini Yükle" dosya={cekDosya} onChange={setCekDosya} ikon={<ScanSearch size={24}/>} />
                    <FileUploadBox baslik="E-Fatura (PDF/Görsel)" dosya={faturaDosya} onChange={setFaturaDosya} ikon={<FileText size={24}/>} />
                  </div>
                  <button disabled={asama === 'analiz' || !cekDosya || !faturaDosya} onClick={islemiBaslat} className="w-full py-6 bg-teal-500 text-black rounded-[2rem] font-black uppercase text-xs hover:bg-teal-400 disabled:opacity-30 transition-all flex items-center justify-center gap-3">
                    {asama === 'analiz' ? <Loader2 className="animate-spin" /> : 'Süreci Başlat'}
                  </button>
                </div>
                <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-8 h-fit space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center"><ShieldCheck className="text-teal-500" size={24} /></div>
                  <h3 className="text-sm font-black uppercase italic tracking-widest">Risk Analizi</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed uppercase italic font-bold">Ticari evraklarınızı veri havuzumuzda analiz ederek operasyonel maliyetlerinizi minimize edin.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/10 border border-teal-500/10 rounded-[4rem] space-y-8 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-teal-500 text-black rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/20"><Check size={40} strokeWidth={4} /></div>
                <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">İşlem İletildi</h2>
                <button onClick={() => setMod('taleplerim')} className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px]">İşlemlerimi Gör</button>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div key={req.id} className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-teal-500/30 transition-all group backdrop-blur-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center">
                      <Wallet size={20} className={req.status === 'approved' || req.status === 'rejected' ? 'text-teal-500 animate-pulse' : 'text-zinc-600'} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-600 uppercase italic">Ref: #{req.id.slice(0,8).toUpperCase()}</p>
                      <h3 className="text-lg font-black text-white italic">{formatCurrency(req.amount)}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {req.status === 'approved' ? (
                       <button onClick={() => {setSelectedReq(req); setHasDownloaded(false);}} className="bg-white text-black px-8 py-3.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-teal-500 transition-all shadow-lg">
                        <FileText size={14} /> Teklifi Görüntüle
                      </button>
                    ) : req.status === 'rejected' ? (
                      <button onClick={() => {setSelectedReq(req); setHasDownloaded(false);}} className="bg-amber-600 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-amber-500 transition-all shadow-lg animate-pulse">
                        <AlertCircle size={14} /> Sözleşmeyi Yeniden Yükle
                      </button>
                    ) : (
                      <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        req.status === 'contract_review' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                        req.status === 'signed' ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20' : 
                        'bg-zinc-900/50 text-zinc-600 border border-white/5'
                      }`}>
                        {req.status === 'contract_review' ? (
                          <><Clock size={12} className="animate-pulse" /> SÖZLEŞME ONAYDA</>
                        ) : req.status === 'signed' ? (
                          <><CheckCircle2 size={12}/> ÖDEME SIRASINDA</>
                        ) : (
                          'İncelemede'
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/95 backdrop-blur-xl p-6 overflow-y-auto">
          <div className="bg-[#09090b] border border-white/10 w-full max-w-2xl rounded-[3.5rem] p-8 md:p-12 relative shadow-2xl text-center my-auto">
             <button onClick={() => {setSelectedReq(null); setSignedFile(null);}} className="absolute top-8 right-8 text-zinc-500 hover:text-white"><XCircle size={28} /></button>
             
             {selectedReq.status === 'rejected' ? (
               <AlertCircle className="mx-auto text-amber-500 mb-4" size={40} />
             ) : (
               <BadgePercent className="mx-auto text-teal-500 mb-4" size={40} />
             )}

             <h2 className="text-2xl font-black italic uppercase text-white">
               {selectedReq.status === 'rejected' ? 'REVİZE TALEBİ' : 'FİNANSMAN TEKLİFİ'}
             </h2>
             
             <div className="bg-zinc-900/50 p-6 rounded-2xl my-8 border border-white/5 flex justify-between items-center italic">
                <div className="text-left">
                    <p className="text-[9px] text-zinc-600 font-black uppercase">Net Rakam</p>
                    <p className="text-3xl font-black text-white">{formatCurrency(selectedReq.final_offer_amount || 0)}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] text-zinc-600 font-black uppercase">Komisyon (%)</p>
                    <p className="text-2xl font-black text-teal-500">%{selectedReq.commission_rate}</p>
                </div>
             </div>

             {selectedReq.status === 'rejected' && (
               <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                 <p className="text-[10px] text-red-500 font-black uppercase italic">
                   Sözleşmeniz reddedildi. Lütfen imzalı taslağı kontrol ederek tekrar yükleyiniz.
                 </p>
               </div>
             )}
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
               <div className={`p-6 rounded-[2rem] border ${!hasDownloaded ? 'bg-white/5 border-white/10' : 'bg-teal-500/5 border-teal-500/20'}`}>
                 <h3 className="font-black text-[9px] uppercase mb-4 text-zinc-500 italic tracking-widest">1. Taslağı Al</h3>
                 <button onClick={() => setHasDownloaded(true)} className="w-full py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                   <Download size={14} /> PDF İNDİR
                 </button>
               </div>

               <div className={`p-6 rounded-[2rem] border ${signedFile ? 'bg-teal-500/5 border-teal-500/20' : 'bg-white/5 border-white/10'}`}>
                 <h3 className="font-black text-[9px] uppercase mb-4 text-zinc-500 italic tracking-widest">2. İmzalıyı Yükle</h3>
                 <label className="block cursor-pointer">
                   <div className={`w-full py-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all ${signedFile ? 'border-teal-500 text-teal-500 bg-teal-500/5' : 'border-zinc-800 text-zinc-600'}`}>
                     <UploadCloud size={14} />
                     <span className="text-[9px] font-black uppercase">{signedFile ? 'SEÇİLDİ' : 'DOSYA SEÇ'}</span>
                   </div>
                   <input type="file" className="hidden" accept=".pdf" onChange={(e) => setSignedFile(e.target.files ? e.target.files[0] : null)} />
                 </label>
               </div>
             </div>

             <button 
               disabled={!signedFile || isUploading}
               onClick={handleUploadAndFinalize}
               className="w-full mt-8 py-5 bg-teal-500 disabled:opacity-20 text-black font-black uppercase text-xs rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-teal-500/20"
             >
               {isUploading ? <Loader2 className="animate-spin" /> : <>Yüklemeyi Tamamla <ArrowRight size={16} /></>}
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

// YARDIMCI BİLEŞENLER
function NavButton({ aktif, ikon, etiket, onClick }: { aktif: boolean, ikon: ReactNode, etiket: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${aktif ? 'bg-teal-500 text-black shadow-lg shadow-teal-500/10' : 'text-zinc-500 hover:text-white'}`}>
      {ikon} {etiket}
    </button>
  );
}

function InputGroup({ label, type, value, onChange, placeholder }: { label: string, type: string, value: string | number, onChange: (val: string) => void, placeholder?: string }) {
  return (
    <div className="space-y-2 text-left w-full">
      <label className="text-[9px] font-black text-zinc-600 uppercase ml-2 italic tracking-widest">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-teal-500/50 text-white transition-all" />
    </div>
  );
}

function FileUploadBox({ baslik, dosya, onChange, ikon }: { baslik: string, dosya: File | null, onChange: (f: File | null) => void, ikon: ReactNode }) {
  return (
    <div className={`relative h-48 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all ${dosya ? 'border-teal-500 bg-teal-500/5' : 'border-white/5 bg-zinc-900/20 hover:border-white/10'}`}>
      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} />
      <div className={`mb-3 p-3 rounded-xl ${dosya ? 'bg-teal-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
        {dosya ? <Check size={20} strokeWidth={4} /> : ikon}
      </div>
      <span className="text-[10px] font-black uppercase italic tracking-widest px-4 text-center">{dosya ? 'BELGE YÜKLENDİ' : baslik}</span>
    </div>
  );
}