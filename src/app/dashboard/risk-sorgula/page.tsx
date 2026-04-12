'use client';

import React, { useState } from 'react'; // useState eklendi
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Zap, 
  Search, 
  Info, 
  Activity,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import MarketRadar from '@/components/MarketRadar';

export default function RiskSorgulaPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAnalysisComplete = (analysis: any, query: string, canProceed: boolean) => {
    // 1. Önce başarı durumunu set et (Kullanıcıya görsel bildirim vermek için)
    setIsSuccess(true);

    // 2. Kullanıcının sonucu görmesi için 2 saniye bekle, sonra yönlendir
    // Bu sayede MarketRadar içindeki "KRİTİK" veya "STABLE" uyarısı ekranda kalır
    setTimeout(() => {
      // Dashboard'a giderken state'i de temiz gitmesi için push yapıyoruz
      router.push('/dashboard');
    }, 2500); 
  };

  return (
    <div className="min-h-screen bg-[#060a14] p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-5xl mx-auto">
        
        {/* Üst Navigasyon */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-4 text-slate-500 hover:text-white transition-all group w-fit"
          >
            <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-teal-500 group-hover:text-black transition-all shadow-xl group-hover:shadow-teal-500/40 ring-1 ring-white/10 group-hover:ring-teal-400">
              <ChevronLeft size={20} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black uppercase italic tracking-[0.3em] text-teal-500/50 group-hover:text-teal-500">Operasyon Merkezi</span>
              <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors uppercase italic">Panele Geri Dön</span>
            </div>
          </button>

          {/* Durum Göstergesi */}
          <div className="flex items-center gap-6 bg-white/[0.03] p-1.5 pl-6 rounded-3xl border border-white/5 backdrop-blur-md">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] font-black italic uppercase tracking-widest text-slate-500">Sistem Durumu</span>
              <span className={`text-[9px] font-bold uppercase italic ${isSuccess ? 'text-teal-400' : 'text-emerald-500'}`}>
                {isSuccess ? 'Analiz Tamamlandı' : 'Aktif & Güvenli'}
              </span>
            </div>
            <div className={`p-3.5 rounded-2xl border transition-all duration-500 ${isSuccess ? 'bg-teal-500/20 border-teal-500/50' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
              {isSuccess ? <CheckCircle2 size={20} className="text-teal-400" /> : <ShieldCheck size={20} className="text-emerald-500" />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#0b1222] to-transparent border border-white/5 relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/20">
                    <Info size={16} className="text-teal-500" />
                  </div>
                  <h3 className="text-xs font-black uppercase italic tracking-widest text-white">Nasıl Sorgulanır?</h3>
                </div>
                
                <ul className="space-y-4">
                  {[
                    { title: "Veri Girişi", desc: "Firma unvanı veya VKN bilgisini girin." },
                    { title: "AI Analizi", desc: "Sistem saha verilerini ve çek geçmişini tarar." },
                    { title: "Risk Skoru", desc: "Saniyeler içinde güven endeksini görüntüleyin." }
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 group/item">
                      <span className="text-teal-500/30 font-black italic text-lg group-hover/item:text-teal-500 transition-colors">0{i+1}</span>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">{step.title}</span>
                        <span className="text-[10px] text-slate-500 leading-relaxed italic">{step.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 relative">
            <div className="absolute -inset-4 bg-teal-500/5 rounded-[4rem] blur-3xl opacity-50 transition duration-1000" />
            
            <div className="relative bg-[#0b1222]/80 border border-white/10 rounded-[3.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl">
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-8 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all ${isSuccess ? 'bg-emerald-500 shadow-emerald-500' : 'bg-teal-500 shadow-teal-500'}`} />
                  <div>
                    <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
                      Market <span className="text-teal-500">Radar</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">Risk Analiz Protokolü v2.0</p>
                  </div>
                </div>
                <Zap size={24} className={`transition-colors ${isSuccess ? 'text-emerald-500' : 'text-teal-500/20'}`} />
              </div>

              {/* BİLEŞEN: MarketRadar */}
              <div className="relative z-10 min-h-[300px]">
                {/* Yönlendirme bittiyse loading göster veya MarketRadar'ı tut */}
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-6" />
                    <p className="text-xs font-black text-white uppercase italic tracking-widest">Sonuçlar Panele Aktarılıyor...</p>
                  </div>
                ) : (
                  <MarketRadar onResult={handleAnalysisComplete} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}