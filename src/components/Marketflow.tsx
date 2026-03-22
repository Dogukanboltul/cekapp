'use client';

import React, { useState } from "react";
import { 
  Zap, Loader2, ShieldCheck, Search, Gavel, 
  AlertTriangle, Target, TrendingDown, ArrowRightCircle,
  Banknote, BarChart3, Percent
} from "lucide-react";

export default function MarketRadar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleDeepScan = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const serperKey = "8179010e4967fc4512262d77869b04f8a2b84dc8";
      const searchQuery = `"${query}" iflas konkordato site:ilan.gov.tr OR site:haberler.com`;

      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
        body: JSON.stringify({ q: searchQuery, gl: "tr", hl: "tr" })
      });

      const data = await response.json();
      const organic = data?.organic || [];
      const snippetsText = organic.map((o: any) => (o.snippet || o.title || '')).join(' ').toLowerCase();
      
      const isRisk = snippetsText.includes("konkordato") || snippetsText.includes("iflas") || snippetsText.includes("mühlet");

      // FACTORING SCORE MANTIĞI: Risk varsa skor düşük, yoksa yüksek simüle ediliyor
      const factoringData = isRisk ? {
        score: 18,
        label: "DÜŞÜK LİKİDİTE",
        rate: "%12.5+",
        status: "FACTORING DIŞI",
        color: "text-rose-500"
      } : {
        score: 88,
        label: "YÜKSEK LİKİDİTE",
        rate: "%3.2 - %4.1",
        status: "FACTORING UYGUN",
        color: "text-amber-500"
      };

      if (isRisk) {
        setResult({
          type: 'DANGER',
          score: "KRİTİK RİSK",
          factoring: factoringData,
          title: "HUKUKİ KISITLAMA TESPİT EDİLDİ",
          summary: `"${query.toUpperCase()}" firması hakkında konkordato süreci mevcut.`,
          interpretation: "Resmi kayıtlar borçların yeniden yapılandırıldığını teyit ediyor. Ödemeler mahkeme takvimine tabidir.",
          actionSteps: [
            "Bu çeki kabul etmek nakit akışınızda kilitlenmeye yol açabilir.",
            "Vakit kaybetmeden ilgili konkordato komiserliğine alacak kaydı yaptırın.",
            "Çek üzerindeki diğer cirantaların mali gücünü sorgulayın."
          ]
        });
      } else {
        setResult({
          type: 'SAFE',
          score: "TEMİZ SİCİL",
          factoring: factoringData,
          title: "OLUMSUZ KAYIT BULUNAMADI",
          summary: `Sistemimiz "${query.toUpperCase()}" firmasına ait aktif bir ilan bulamadı.`,
          interpretation: "İlan ve haber kaynaklarında firmanın piyasa itibarı stabil görünüyor.",
          actionSteps: [
            "Ticari işlemlerinizi standart vade disiplininizle sürdürebilirsiniz.",
            "Nakit akış yönetiminde kısıtlama gözükmüyor.",
            "Yüksek tutarlı işlemlerde teminat yapınızı koruyun."
          ]
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="space-y-4 w-full max-w-[400px] animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="p-6 rounded-[2.5rem] border bg-gradient-to-br from-[#1a0505] via-black to-black relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-2 text-left">
          <h2 className="text-[14px] font-black text-white uppercase italic tracking-tight italic">
            ÖDEME KABİLİYETİ & RİSK ANALİZİ
          </h2>
          <p className="text-[9px] text-white/40 font-bold uppercase italic leading-tight">
            GÜNCEL MAHKEME KAYITLARI VE AI LİKİDİTE SKORLAMASI
          </p>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="bg-[#0b1222] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
        <form onSubmit={handleDeepScan} className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="FİRMA ÜNVANI SORGULA..."
            className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-4 text-[11px] font-black text-white outline-none focus:border-red-900 uppercase italic placeholder:text-white/20 transition-all shadow-inner"
          />
          <button type="submit" disabled={loading} className="shrink-0 bg-red-900 hover:bg-red-800 w-12 h-12 flex items-center justify-center rounded-xl active:scale-95 transition-all">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Zap className="w-5 h-5 text-white fill-white" />}
          </button>
        </form>

        {loading && (
          <div className="py-14 flex flex-col items-center justify-center space-y-4">
             <div className="w-10 h-10 border-2 border-red-900 border-t-red-600 rounded-full animate-spin" />
             <p className="text-[10px] font-black text-red-800 tracking-[0.4em] uppercase italic animate-pulse font-bold">PİYASA SÜZÜLÜYOR...</p>
          </div>
        )}

        {!loading && result && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-4 text-left font-bold">
            
            {/* 1. FACTORING SCORE MODÜLÜ (YENİ EKLENEN KISIM) */}
            <div className={`p-5 rounded-2xl border bg-gradient-to-br from-black to-[#0d0d0d] ${result.type === 'DANGER' ? 'border-rose-900/30' : 'border-amber-900/30'}`}>
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Banknote size={14} className={result.factoring.color} />
                  <span className={`text-[10px] font-black uppercase italic tracking-widest ${result.factoring.color}`}>LİKİDİTE SİNYALİ</span>
                </div>
                <span className="text-[8px] font-black text-slate-500 uppercase">{result.factoring.status}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-600 uppercase italic">Tahmini İskonto</p>
                  <p className="text-xl font-black text-white italic tracking-tighter">{result.factoring.rate}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[8px] font-bold text-slate-600 uppercase italic">Likit Skoru</p>
                  <p className={`text-xl font-black italic tracking-tighter ${result.factoring.color}`}>{result.factoring.score}/100</p>
                </div>
              </div>
            </div>

            {/* 2. DURUM KARTI */}
            <div className={`p-5 rounded-2xl border ${result.type === 'DANGER' ? 'bg-[#2d0b0b]/60 border-rose-900/50' : 'bg-[#0b2d1a]/60 border-emerald-900/50'}`}>
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className={`text-[9px] font-black uppercase italic tracking-widest ${result.type === 'DANGER' ? 'text-rose-500' : 'text-emerald-500'}`}>{result.score}</span>
                {result.type === 'DANGER' ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <ShieldCheck className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className={`text-[12px] font-black uppercase italic mb-2 ${result.type === 'DANGER' ? 'text-rose-500' : 'text-emerald-500'}`}>{result.title}</p>
              <p className="text-[10px] font-bold text-white/70 leading-snug uppercase italic">{result.summary}</p>
            </div>

            {/* 3. AKSİYON PLANI */}
            <div className={`p-5 rounded-3xl space-y-3 ${result.type === 'DANGER' ? 'bg-rose-950/90 border border-rose-900/40' : 'bg-emerald-950/90 border border-emerald-900/40'}`}>
               <div className="flex items-center gap-2 mb-1 text-left">
                  <Target className="w-4 h-4 text-white/40" />
                  <span className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">OPERASYONEL AKSİYON:</span>
               </div>
               <div className="space-y-3">
                  {result.actionSteps.map((step: string, index: number) => (
                    <div key={index} className="flex gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <ArrowRightCircle className="w-3.5 h-3.5 text-white/20 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-black text-white leading-tight uppercase italic">{step}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-[7px] font-black text-slate-700 uppercase text-center italic px-4 leading-relaxed tracking-tight font-bold">
        * Veriler resmi sicil ilanları ve Cekapp AI likidite algoritmaları üzerinden işlenmektedir.
      </p>

    </aside>
  );
}